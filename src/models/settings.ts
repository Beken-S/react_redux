import { BASE_URL, OPTIONS } from 'api';
import { BaseError, InvalidResponseError, InvalidDataLength } from 'common/errors';
import { fetchJson } from 'common/fetch-json';
import { PayloadAction } from 'global-types';
import { Action, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store';

type UserId = number;
type UserLogin = string;
type User = {
  id: UserId;
  login: UserLogin;
  avatar_url: string;
};
type ExtraUser = User & {
  [key: string]: unknown;
};
type RepositoryName = string;
type Contributors = User[];
type UserError = BaseError | null;
type RepositoryError = BaseError | null;
type Blacklist = UserId[];
type SettingsState = {
  isLoading: boolean;
  user: User | null;
  repositoryName: RepositoryName | null;
  contributors: Contributors;
  blacklist: Blacklist;
  userError: UserError;
  repositoryError: RepositoryError;
};
type FetchSuccessPayload = [User, RepositoryName, Contributors];
type FetchFailurePayload = [UserError, RepositoryError];

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value != null &&
    typeof Reflect.get(value, 'id') === 'number' &&
    typeof Reflect.get(value, 'login') === 'string' &&
    typeof Reflect.get(value, 'avatar_url') === 'string'
  );
}
function isArrayUsers(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}
function reduceToUser({ id, login, avatar_url }: ExtraUser): User {
  return { id, login, avatar_url };
}

const FETCH_START_ACTION = 'SETTINGS::FETCH_START';
const FETCH_SUCCESS_ACTION = 'SETTINGS::FETCH_SUCCESS';
const FETCH_FAILURE_ACTION = 'SETTINGS::FETCH_FAILURE';
const SET_USER_ERROR_ACTION = 'SETTINGS::SET_USER_ERROR';
const SET_REPOSITORY_ERROR_ACTION = 'SETTINGS::SET_REPOSITORY_ERROR';
const RESET_ERRORS_ACTION = 'SETTINGS::RESET_ERRORS';
const CLEAR_BLACKLIST_ACTION = 'SETTINGS::BLACKLIST_CLEAR';
const ADD_TO_BLACKLIST_ACTION = 'SETTINGS::ADD_TO_BLACKLIST';
const DELETE_FROM_BLACKLIST_ACTION = 'SETTINGS::DELETE_FROM_BLACKLIST';

type FetchStartAction = Action<typeof FETCH_START_ACTION>;
type FetchSuccessAction = PayloadAction<typeof FETCH_SUCCESS_ACTION, FetchSuccessPayload>;
type FetchFailureAction = PayloadAction<typeof FETCH_FAILURE_ACTION, FetchFailurePayload>;
type SetUserErrorAction = PayloadAction<typeof SET_USER_ERROR_ACTION, BaseError>;
type SetRepositoryErrorAction = PayloadAction<typeof SET_REPOSITORY_ERROR_ACTION, BaseError>;
type ResetErrorsAction = Action<typeof RESET_ERRORS_ACTION>;
type ClearBlacklistAction = Action<typeof CLEAR_BLACKLIST_ACTION>;
type AddToBlacklistAction = PayloadAction<typeof ADD_TO_BLACKLIST_ACTION, UserId[]>;
type DeleteFromBlacklistAction = PayloadAction<typeof DELETE_FROM_BLACKLIST_ACTION, UserId>;
type SettingsAction =
  | FetchStartAction
  | FetchSuccessAction
  | FetchFailureAction
  | SetUserErrorAction
  | SetRepositoryErrorAction
  | ResetErrorsAction
  | ClearBlacklistAction
  | AddToBlacklistAction
  | DeleteFromBlacklistAction;
type SettingsThunkAction = ThunkAction<Promise<void>, RootState, unknown, SettingsAction>;

type FetchStartGenerator = () => FetchStartAction;
type FetchSuccessGenerator = (payload: FetchSuccessPayload) => FetchSuccessAction;
type FetchFailureGenerator = (payload: FetchFailurePayload) => FetchFailureAction;
type SetUserErrorGenerator = (payload: BaseError) => SetUserErrorAction;
type SetRepositoryErrorGenerator = (payload: BaseError) => SetRepositoryErrorAction;
type ResetErrorsGenerator = () => ResetErrorsAction;
type ClearBlacklistGenerator = () => ClearBlacklistAction;
type AddToBlacklistGenerator = (payload: UserId[]) => AddToBlacklistAction;
type DeleteFromBlacklistGenerator = (payload: UserId) => DeleteFromBlacklistAction;
type FetchSettingsGenerator = (userLogin: string, repositoryName: RepositoryName) => SettingsThunkAction;

const startFetch: FetchStartGenerator = () => ({
  type: FETCH_START_ACTION,
});
const successFetch: FetchSuccessGenerator = (payload) => ({
  type: FETCH_SUCCESS_ACTION,
  payload,
});
const failureFetch: FetchFailureGenerator = (payload) => ({
  type: FETCH_FAILURE_ACTION,
  payload,
});
const setUserError: SetUserErrorGenerator = (payload) => ({
  type: SET_USER_ERROR_ACTION,
  payload,
});

const setRepositoryError: SetRepositoryErrorGenerator = (payload) => ({
  type: SET_REPOSITORY_ERROR_ACTION,
  payload,
});

const resetErrors: ResetErrorsGenerator = () => ({
  type: RESET_ERRORS_ACTION,
});
const clearBlacklist: ClearBlacklistGenerator = () => ({
  type: CLEAR_BLACKLIST_ACTION,
});
const addToBlacklist: AddToBlacklistGenerator = (payload) => ({
  type: ADD_TO_BLACKLIST_ACTION,
  payload,
});
const deleteFromBlacklist: DeleteFromBlacklistGenerator = (payload) => ({
  type: DELETE_FROM_BLACKLIST_ACTION,
  payload,
});

const fetchSettings: FetchSettingsGenerator = (userLogin, repositoryName) => async (dispatch) => {
  dispatch(startFetch());

  const userUrl: string = new URL(`users/${userLogin}`, BASE_URL).toString();
  const contributorsUrl: string = new URL(`repos/${userLogin}/${repositoryName}/contributors`, BASE_URL).toString();

  const [[user, userError], [contributors, contributorsError]] = await Promise.all([
    fetchJson(userUrl, OPTIONS, `Пользователь "${userLogin}" не найден.`),
    fetchJson(contributorsUrl, OPTIONS, `Репозиторий "${repositoryName}" не найден.`),
  ]);

  if (userError != null || contributorsError != null) {
    dispatch(failureFetch([userError, contributorsError]));
    return;
  }
  if (isUser(user) && isArrayUsers(contributors)) {
    if (contributors.length > 1) {
      dispatch(successFetch([reduceToUser(user), repositoryName, contributors.map((item) => reduceToUser(item))]));
    } else {
      dispatch(
        failureFetch([
          userError,
          new InvalidDataLength(`В репозитории "${repositoryName}" нет потенциальных ревьюеров.`),
        ])
      );
    }
    return;
  }
  if (!isUser(user)) {
    dispatch(failureFetch([userError, new InvalidResponseError('Неверный ответ от сервера.')]));
  }
  if (!isArrayUsers(contributors)) {
    dispatch(failureFetch([userError, new InvalidResponseError('Неверный ответ от сервера.')]));
  }
};

type SettingsLocalStorageKey = 'settings';

const initialSettingsState: SettingsState = {
  isLoading: false,
  user: null,
  repositoryName: null,
  contributors: [],
  blacklist: [],
  userError: null,
  repositoryError: null,
};
const settingsReducer: Reducer<SettingsState, SettingsAction> = (
  state = initialSettingsState,
  action
): SettingsState => {
  switch (action.type) {
    case FETCH_START_ACTION:
      return {
        ...state,
        isLoading: true,
        userError: null,
        repositoryError: null,
      };
    case FETCH_SUCCESS_ACTION:
      const [user, repositoryName, contributors] = action.payload;
      return {
        ...state,
        isLoading: false,
        user,
        repositoryName,
        contributors,
        blacklist: [user.id],
      };
    case FETCH_FAILURE_ACTION:
      const [userError, repositoryError] = action.payload;
      return {
        ...state,
        isLoading: false,
        userError,
        repositoryError,
      };
    case SET_USER_ERROR_ACTION:
      return {
        ...state,
        userError: action.payload,
      };
    case SET_REPOSITORY_ERROR_ACTION:
      return {
        ...state,
        repositoryError: action.payload,
      };
    case RESET_ERRORS_ACTION:
      return {
        ...state,
        userError: null,
        repositoryError: null,
      };
    case CLEAR_BLACKLIST_ACTION:
      return {
        ...state,
        blacklist: [],
      };
    case ADD_TO_BLACKLIST_ACTION:
      return {
        ...state,
        blacklist: [...state.blacklist, ...action.payload],
      };
    case DELETE_FROM_BLACKLIST_ACTION:
      const id = action.payload;
      const { blacklist } = state;
      const index = blacklist.findIndex((item) => item === id);
      return index >= 0
        ? {
            ...state,
            blacklist: blacklist.slice(0, index).concat(blacklist.slice(index + 1)),
          }
        : state;
    default:
      return state;
  }
};

const selectFetchStatus = ({ settings }: RootState): boolean => settings.isLoading;
const selectUser = ({ settings }: RootState): User | null => settings.user;
const selectUserError = ({ settings }: RootState): UserError => settings.userError;
const selectUserLogin = ({ settings }: RootState): string => {
  const user = settings.user;
  return user != null ? user.login : '';
};
const selectRepositoryName = ({ settings }: RootState): string => {
  const repositoryName = settings.repositoryName;
  return repositoryName != null ? repositoryName : '';
};
const selectRepositoryError = ({ settings }: RootState): RepositoryError => settings.repositoryError;
const selectContributors = ({ settings }: RootState): Contributors => settings.contributors;
const selectBlacklist = ({ settings }: RootState): Contributors => {
  const { contributors, blacklist, user } = settings;
  return contributors.filter(({ id }) => user != null && id !== user.id && blacklist.includes(id));
};
const selectReviewers = ({ settings }: RootState): Contributors => {
  const { contributors, blacklist, user } = settings;
  return contributors.filter(({ id }) => user != null && id !== user.id && !blacklist.includes(id));
};

export default settingsReducer;
export {
  initialSettingsState,
  fetchSettings,
  startFetch,
  successFetch,
  failureFetch,
  setUserError,
  setRepositoryError,
  resetErrors,
  clearBlacklist,
  addToBlacklist,
  deleteFromBlacklist,
  selectFetchStatus,
  selectUser,
  selectUserError,
  selectUserLogin,
  selectRepositoryName,
  selectRepositoryError,
  selectBlacklist,
  selectContributors,
  selectReviewers,
};
export type {
  User,
  UserId,
  UserLogin,
  UserError,
  RepositoryName,
  RepositoryError,
  Contributors,
  SettingsState,
  SettingsLocalStorageKey,
};
