import { safelyGetItem, safelySetItem } from 'common/local-storage-helpers';
import settingsReducer, { SettingsLocalStorageKey, SettingsState, initialSettingsState } from 'models/settings';
import { combineReducers, createStore, applyMiddleware, compose, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const settingsKey: SettingsLocalStorageKey = 'settings';
const rootReducer = combineReducers({
  [settingsKey]: settingsReducer,
});
const [previousState, error] = safelyGetItem<SettingsState, SettingsLocalStorageKey>('settings');

if (error != null) {
  console.error(error);
}

const initialStor = {
  [settingsKey]: previousState != null ? previousState : initialSettingsState,
};

const store = createStore(rootReducer, initialStor, composeEnhancers(applyMiddleware(thunk)));

store.subscribe(() => {
  const error = safelySetItem<SettingsState, SettingsLocalStorageKey>('settings', store.getState().settings);

  if (error != null) {
    console.error(error);
  }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, AnyAction>;

export default store;
export type { RootState, AppDispatch };
