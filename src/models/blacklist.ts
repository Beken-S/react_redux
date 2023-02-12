import { PayloadAction, Selector } from 'global-types';
import { Contributors } from 'models/repository';
import { UserId } from 'models/user';
import { Action, Reducer } from 'redux';

type Blacklist = UserId[];

const CLEAR_BLACKLIST_ACTION = 'BLACKLIST::CLEAR';
const ADD_TO_BLACKLIST_ACTION = 'BLACKLIST::ADD';
const DELETE_FROM_BLACKLIST_ACTION = 'BLACKLIST::DELETE';

type ClearBlacklistAction = Action<typeof CLEAR_BLACKLIST_ACTION>;
type AddToBlacklistAction = PayloadAction<typeof ADD_TO_BLACKLIST_ACTION, UserId | Blacklist>;
type DeleteFromBlacklistAction = PayloadAction<typeof DELETE_FROM_BLACKLIST_ACTION, UserId>;

type BlacklistAction = ClearBlacklistAction | AddToBlacklistAction | DeleteFromBlacklistAction;

type ClearBlacklistGenerator = () => ClearBlacklistAction;
type AddToBlacklistGenerator = (payload: UserId | Blacklist) => AddToBlacklistAction;
type DeleteFromBlacklistGenerator = (payload: UserId) => DeleteFromBlacklistAction;

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

const blacklistReducer: Reducer<Blacklist, BlacklistAction> = (state = [], action): Blacklist => {
  switch (action.type) {
    case CLEAR_BLACKLIST_ACTION:
      return [];
    case ADD_TO_BLACKLIST_ACTION:
      return state.concat(action.payload);
    case DELETE_FROM_BLACKLIST_ACTION:
      const id = action.payload;
      const index = state.findIndex((item) => item === id);
      return index >= 0 ? state.slice(0, index).concat(state.slice(index + 1)) : state;
    default:
      return state;
  }
};

const selectBlacklist: Selector<Contributors> = ({ repository, blacklist, user }) => {
  if (repository == null || user == null) {
    return [];
  }
  return repository.contributors.filter(({ id }) => id !== user.id && blacklist.includes(id));
};
const selectReviewers: Selector<Contributors> = ({ repository, blacklist, user }) => {
  if (repository == null || user == null) {
    return [];
  }
  return repository.contributors.filter(({ id }) => id !== user.id && !blacklist.includes(id));
};

export default blacklistReducer;
export { clearBlacklist, addToBlacklist, deleteFromBlacklist, selectBlacklist, selectReviewers };
export type { Blacklist, BlacklistAction };
