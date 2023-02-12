import { PayloadAction, Selector } from 'global-types';
import { Reducer } from 'redux';

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

const SET_USER_ACTION = 'USER::SET';

type SetUserAction = PayloadAction<typeof SET_USER_ACTION, User>;
type UserAction = SetUserAction;

type SetUserGenerator = (payload: ExtraUser) => SetUserAction;

const setUser: SetUserGenerator = (payload) => ({
  type: SET_USER_ACTION,
  payload,
});

type UserState = User | null;

const userReducer: Reducer<UserState, UserAction> = (state = null, action): UserState => {
  switch (action.type) {
    case SET_USER_ACTION:
      return action.payload;
    default:
      return state;
  }
};

const selectUser: Selector<UserState> = ({ user }) => user;
const selectUserLogin: Selector<UserLogin> = ({ user }) => (user ? user.login : '');

export default userReducer;
export { isUser, isArrayUsers, reduceToUser, setUser, selectUser, selectUserLogin };

export type { User, UserId, UserLogin, UserState, UserAction };
