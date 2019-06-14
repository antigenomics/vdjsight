import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { ApplicationActions } from 'models/application/application.actions';
import { ApplicationState, fromApplicationState } from './application.state';

const applicationReducer = createReducer(
  fromApplicationState.initial,
  on(ApplicationActions.initialize, (s) => produce(s, (draft) => { draft.initialized = true; }))
);

export namespace fromApplicationReducers {

  export function reducer(state: ApplicationState | undefined, action: Action) {
    return applicationReducer(state, action);
  }

}

