import { Action, createReducer, on } from '@ngrx/store';
import { ChangePageActions } from 'pages/auth/models/change_page/change-page.actions';
import { __ChangePageState, __fromChangePageState } from 'pages/auth/models/change_page/change-page.state';


const changeReducer = createReducer(
  __fromChangePageState.initial,
  on(ChangePageActions.init, () => ({ pending: false })),
  on(ChangePageActions.changeAttempt, () => ({ pending: true })),
  on(ChangePageActions.changeSuccess, () => ({ pending: false })),
  on(ChangePageActions.changeFailed, (_, payload) => ({ pending: false, error: payload.error, extra: payload.extra }))
);

export namespace __fromChangePageReducers {
  export function reducer(state: __ChangePageState | undefined, action: Action) {
    return changeReducer(state, action);
  }
}
