import { Action, createReducer, on } from '@ngrx/store';
import { ResetPageActions } from 'pages/auth/models/reset_page/reset-page.actions';
import { __fromResetPageState, __ResetPageState } from 'pages/auth/models/reset_page/reset-page.state';

const resetReducer = createReducer(
  __fromResetPageState.initial,
  on(ResetPageActions.init, (state) => ({ pending: false, message: state.message })),
  on(ResetPageActions.resetAttempt, () => ({ pending: true })),
  on(ResetPageActions.resetSuccess, (_, payload) => ({ pending: false, message: payload.message })),
  on(ResetPageActions.resetFailed, (_, payload) => ({ pending: false, error: payload.error, extra: payload.extra }))
);

export namespace __fromResetPageReducers {
  export function reducer(state: __ResetPageState | undefined, action: Action) {
    return resetReducer(state, action);
  }
}
