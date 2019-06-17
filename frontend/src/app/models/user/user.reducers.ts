import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { UserActions } from 'models/user/user.action';
import { __fromUserState, __UserState } from 'models/user/user.state';

const userReducer = createReducer(
  __fromUserState.initial,
  on(UserActions.initializeStart, () => ({ initialized: false, initializeFailed: false, loggedIn: false })),
  on(UserActions.initializeSuccess, (_, payload) => ({ initialized: true, initializeFailed: false, loggedIn: payload.loggedIn, info: payload.info })),
  on(UserActions.initializeFailed, () => ({ initialized: true, initializeFailed: true, loggedIn: false })),
  on(UserActions.login, (state, payload) => produce(state, (draft) => {
    draft.loggedIn = true;
    draft.info     = payload.info;
  })),
  on(UserActions.logout, (state) => produce(state, (draft) => {
    draft.loggedIn = false;
  }))
);

export namespace fromUserReducers {
  export function reducer(state: __UserState | undefined, action: Action) {
    return userReducer(state, action);
  }
}
