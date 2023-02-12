import { safelyGetItem, safelySetItem } from 'common/local-storage-helpers';
import blacklistReducer, { Blacklist } from 'models/blacklist';
import errorsReducer, { Errors } from 'models/errors';
import loadingReducer from 'models/loading';
import repositoryReducer, { RepositoryState } from 'models/repository';
import userReducer, { UserState } from 'models/user';
import { combineReducers, createStore, applyMiddleware, compose, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
type Store = {
  isLoading: boolean;
  errors: Errors;
  user: UserState;
  repository: RepositoryState;
  blacklist: Blacklist;
};
type StoreLocalStorageKey = 'settings';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers<Store>({
  isLoading: loadingReducer,
  errors: errorsReducer,
  user: userReducer,
  repository: repositoryReducer,
  blacklist: blacklistReducer,
});

const [previousState, error] = safelyGetItem<Store, StoreLocalStorageKey>('settings');
const initialStor = previousState ? previousState : undefined;

if (error != null) {
  console.error(error);
}

const store = createStore(rootReducer, initialStor, composeEnhancers(applyMiddleware(thunk)));

store.subscribe(() => {
  const error = safelySetItem<Store, StoreLocalStorageKey>('settings', store.getState());

  if (error != null) {
    console.error(error);
  }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, AnyAction>;

export default store;
export type { RootState, AppDispatch };
