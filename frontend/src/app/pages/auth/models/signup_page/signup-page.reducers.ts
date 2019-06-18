import { Action, createReducer, on } from '@ngrx/store';
import { SignupPageActions } from 'pages/auth/models/signup_page/signup-page.action';
import { __fromSignupPageState, __SignupPageState } from 'pages/auth/models/signup_page/signup-page.state';

const signupReducer = createReducer(
  __fromSignupPageState.initial,
  on(SignupPageActions.init, () => ({ pending: false })),
  on(SignupPageActions.signupAttempt, () => ({ pending: true })),
  on(SignupPageActions.signupSuccess, () => ({ pending: false })),
  on(SignupPageActions.signupFailed, (_, payload) => ({ pending: false, error: payload.error, extra: payload.extra }))
);

export namespace __fromSignupPageReducers {
  export function reducer(state: __SignupPageState | undefined, action: Action) {
    return signupReducer(state, action);
  }
}
