import { BASE_URL, OPTIONS } from 'api';
import { hasOneItem } from 'common/array-helpers';
import { InvalidDataLength, InvalidResponseError } from 'common/errors';
import { fetchJson } from 'common/fetch-json';
import { Selector } from 'global-types';
import { addToBlacklist, clearBlacklist, BlacklistAction } from 'models/blacklist';
import { setUserError, setRepositoryError, ErrorsAction } from 'models/errors';
import { setRepository, RepositoryAction, RepositoryName } from 'models/repository';
import { isArrayUsers, isUser, reduceToUser, setUser, UserAction, UserLogin } from 'models/user';
import { Action, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store';

const FETCH_START_ACTION = 'STATUS::FETCH_START';
const FETCH_FINISH_ACTION = 'STATUS::FETCH_FINISH';

type FetchStartAction = Action<typeof FETCH_START_ACTION>;
type FetchFinishAction = Action<typeof FETCH_FINISH_ACTION>;
type LoadingAction = FetchStartAction | FetchFinishAction;
type SettingsAction = UserAction | RepositoryAction | ErrorsAction | BlacklistAction | LoadingAction;
type SettingsThunkAction = ThunkAction<Promise<void>, RootState, unknown, SettingsAction>;

type FetchStartGenerator = () => FetchStartAction;
type FetchFinishGenerator = () => FetchFinishAction;
type FetchSettingsGenerator = (userLogin: UserLogin, repositoryName: RepositoryName) => SettingsThunkAction;

const startFetch: FetchStartGenerator = () => ({
  type: FETCH_START_ACTION,
});
const finishFetch: FetchFinishGenerator = () => ({
  type: FETCH_FINISH_ACTION,
});
const fetchSettings: FetchSettingsGenerator = (userLogin, repositoryName) => async (dispatch) => {
  dispatch(startFetch());

  const userUrl: string = new URL(`users/${userLogin}`, BASE_URL).toString();
  const contributorsUrl: string = new URL(`repos/${userLogin}/${repositoryName}/contributors`, BASE_URL).toString();

  const [[user, userError], [contributors, contributorsError]] = await Promise.all([
    fetchJson(userUrl, OPTIONS, `Пользователь "${userLogin}" не найден.`),
    fetchJson(contributorsUrl, OPTIONS, `Репозиторий "${repositoryName}" не найден.`),
  ]);

  if (userError != null) {
    dispatch(setUserError(userError));
  } else if (!isUser(user)) {
    dispatch(setUserError(new InvalidResponseError('Неверный ответ от сервера.')));
  }
  if (contributorsError != null) {
    dispatch(setRepositoryError(contributorsError));
  } else if (!isArrayUsers(contributors)) {
    dispatch(setRepositoryError(new InvalidResponseError('Неверный ответ от сервера.')));
  } else if (hasOneItem(contributors)) {
    dispatch(
      setRepositoryError(new InvalidDataLength(`В репозитории "${repositoryName}" нет потенциальных ревьюеров.`))
    );
  }
  if (isUser(user) && isArrayUsers(contributors)) {
    dispatch(clearBlacklist());
    dispatch(setUser(reduceToUser(user)));
    dispatch(addToBlacklist(user.id));
    dispatch(
      setRepository({
        name: repositoryName,
        contributors: contributors.map(reduceToUser),
      })
    );
  }

  dispatch(finishFetch());
};

type LoadingState = boolean;

const loadingReducer: Reducer<LoadingState, LoadingAction> = (state = false, action) => {
  switch (action.type) {
    case FETCH_START_ACTION:
      return true;
    case FETCH_FINISH_ACTION:
      return false;
    default:
      return state;
  }
};

const selectLoadingStatus: Selector<boolean> = ({ isLoading }) => isLoading;

export default loadingReducer;
export { startFetch, finishFetch, fetchSettings, selectLoadingStatus };
export type { LoadingAction, LoadingState };
