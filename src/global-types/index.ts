import { Action } from 'redux';

interface PayloadAction<T, P> extends Action<T> {
  payload: P;
}

export type { PayloadAction };
