import { BaseError } from 'common/errors';
import { PayloadAction, Selector } from 'global-types';
import { Action, Reducer } from 'redux';

type Errors = {
  user: BaseError | null;
  repository: BaseError | null;
};

const SET_USER_ERROR_ACTION = 'ERRORS::SET_USER_ERROR';
const SET_REPOSITORY_ERROR_ACTION = 'ERRORS::SET_REPOSITORY_ERROR';
const RESET_ERRORS_ACTION = 'ERRORS::RESET_ERRORS';

type SetUserErrorAction = PayloadAction<typeof SET_USER_ERROR_ACTION, BaseError>;
type SetRepositoryErrorAction = PayloadAction<typeof SET_REPOSITORY_ERROR_ACTION, BaseError>;
type ResetErrorsAction = Action<typeof RESET_ERRORS_ACTION>;
type ErrorsAction = SetUserErrorAction | SetRepositoryErrorAction | ResetErrorsAction;

type SetUserErrorGenerator = (payload: BaseError) => SetUserErrorAction;
type SetRepositoryErrorGenerator = (payload: BaseError) => SetRepositoryErrorAction;
type ResetErrorsGenerator = () => ResetErrorsAction;

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

const errorsInitialState: Errors = {
  user: null,
  repository: null,
};

const errorsReducer: Reducer<Errors, ErrorsAction> = (state = errorsInitialState, action) => {
  switch (action.type) {
    case SET_USER_ERROR_ACTION:
      return { ...state, user: action.payload };
    case SET_REPOSITORY_ERROR_ACTION:
      return { ...state, repository: action.payload };
    case RESET_ERRORS_ACTION:
      return errorsInitialState;
    default:
      return state;
  }
};

const selectErrors: Selector<Errors> = ({ errors }) => errors;
const selectUserError: Selector<BaseError | null> = ({ errors }) => errors.user;
const selectRepositoryError: Selector<BaseError | null> = ({ errors }) => errors.repository;

export default errorsReducer;
export { setUserError, setRepositoryError, resetErrors, selectErrors, selectUserError, selectRepositoryError };
export type { ErrorsAction, Errors };
