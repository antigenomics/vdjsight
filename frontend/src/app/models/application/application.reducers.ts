import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { ApplicationActions } from 'models/application/application.actions';
import { __ApplicationState, __fromApplicationState } from './application.state';

const applicationReducer = createReducer(
  __fromApplicationState.initial,
  on(ApplicationActions.pingBackendSuccess, (state) => produce(state, (draft) => { draft.backendDead = false; })),
  on(ApplicationActions.pingBackendFailed, (state) => produce(state, (draft) => { draft.backendDead = true; })),
  on(ApplicationActions.saveURL, (state, payload) => produce(state, (draft) => { draft.savedURLs.push(payload.url); })),
  on(ApplicationActions.clearLastSavedURL, (state) => produce(state, (draft) => { draft.savedURLs.pop(); }))
);

export namespace fromApplicationReducers {

  export function reducer(state: __ApplicationState | undefined, action: Action) {
    return applicationReducer(state, action);
  }

}

