import { Action, createReducer, on } from '@ngrx/store';
import { VerifyPageActions } from 'pages/auth/models/verify_page/verify-page.actions';
import { __fromVerifyPageState, __VerifyPageState } from 'pages/auth/models/verify_page/verify-page.state';

const verifyReducer = createReducer(
  __fromVerifyPageState.initial,
  on(VerifyPageActions.init, () => ({ pending: false })),
  on(VerifyPageActions.verifyAttempt, () => ({ pending: true })),
  on(VerifyPageActions.verifySuccess, () => ({ pending: false })),
  on(VerifyPageActions.verifyFailed, (_, payload) => ({ pending: false, error: payload.error, extra: payload.extra }))
);

export namespace __fromVerifyPageReducers {
  export function reducer(state: __VerifyPageState | undefined, action: Action) {
    return verifyReducer(state, action);
  }
}
