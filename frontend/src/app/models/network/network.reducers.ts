import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { NetworkActions } from 'models/network/network.actions';
import { __fromNetworkState, __NetworkState } from 'models/network/network.state';

const networkReducer = createReducer(
  __fromNetworkState.initial,
  on(NetworkActions.GoOffline, (state) => produce(state, (draft) => { draft.offline = true; })),
  on(NetworkActions.GoOnline, (state) => produce(state, (draft) => { draft.offline = false; })),
  on(NetworkActions.GuardActivationStart, (state, { title, message }) => produce(state, (draft) => {
    draft.guard = { active: true, title, message };
  })),
  on(NetworkActions.GuardActivationEnd, (state) => produce(state, (draft) => {
    draft.guard = { active: false };
  }))
);

export namespace __fromNetworkReducers {

  export function reducer(state: __NetworkState | undefined, action: Action) {
    return networkReducer(state, action);
  }

}
