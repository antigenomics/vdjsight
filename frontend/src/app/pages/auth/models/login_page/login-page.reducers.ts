import { Action, createReducer, on } from '@ngrx/store';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { __fromLoginPageState, __LoginPageState } from 'pages/auth/models/login_page/login-page.state';

const loginReducer = createReducer(
  __fromLoginPageState.initial,
  on(LoginPageActions.init, () => ({ pending: false })),
  on(LoginPageActions.loginAttempt, () => ({ pending: true })),
  on(LoginPageActions.loginSuccess, () => ({ pending: false })),
  on(LoginPageActions.loginFailed, (_, payload) => ({ pending: false, error: payload.error, extra: payload.extra }))
);

export namespace __fromLoginPageReducers {
  export function reducer(state: __LoginPageState | undefined, action: Action) {
    return loginReducer(state, action);
  }
}
