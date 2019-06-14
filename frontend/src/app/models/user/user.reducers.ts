import { createReducer, on, Action } from '@ngrx/store';
import produce from 'immer';
import { UserActions } from 'models/user/user.action';
import { fromUserState, UserState } from 'models/user/user.state';

const userReducer = createReducer(
  fromUserState.initial,
  on(UserActions.fetchStart, (state) => produce(state, (draft) => {
    draft.fetched     = false;
    draft.fetchFailed = false;
    draft.loggedIn    = false;
  })),
  on(UserActions.fetchSuccess, (state, payload) => produce(state, (draft) => {
    draft.fetched     = true;
    draft.fetchFailed = false;
    draft.loggedIn    = payload.loggedIn;
    draft.info        = payload.info;
  })),
  on(UserActions.fetchFailed, (state) => produce(state, (draft) => {
    draft.fetched     = true;
    draft.fetchFailed = true;
    draft.loggedIn    = false;
  })),
  on(UserActions.login, (state, payload) => produce(state, (draft) => {
    draft.loggedIn = true;
    draft.info     = payload.info;
  })),
  on(UserActions.logout, (state) => produce(state, (draft) => { draft.loggedIn = false; }))
);

export namespace fromUserReducers {
  export function reducer(state: UserState | undefined, action: Action) {
    return userReducer(state, action);
  }
}
