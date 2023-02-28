import { Action } from 'redux';
import { RootState } from 'store';

interface PayloadAction<T, P> extends Action<T> {
  payload: P;
}
type Selector<T> = (state: RootState) => T;

export type { PayloadAction, Selector };
