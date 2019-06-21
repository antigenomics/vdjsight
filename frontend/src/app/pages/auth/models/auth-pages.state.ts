import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromChangePageReducers } from 'pages/auth/models/change_page/change-page.reducers';
import { __ChangePageState, __fromChangePageState } from 'pages/auth/models/change_page/change-page.state';
import { __fromLoginPageReducers } from 'pages/auth/models/login_page/login-page.reducers';
import { __fromLoginPageState, __LoginPageState } from 'pages/auth/models/login_page/login-page.state';
import { __fromResetPageReducers } from 'pages/auth/models/reset_page/reset-page.reducers';
import { __fromResetPageState, __ResetPageState } from 'pages/auth/models/reset_page/reset-page.state';
import { __fromSignupPageReducers } from 'pages/auth/models/signup_page/signup-page.reducers';
import { __fromSignupPageState, __SignupPageState } from 'pages/auth/models/signup_page/signup-page.state';
import { __fromVerifyPageReducers } from 'pages/auth/models/verify_page/verify-page.reducers';
import { __fromVerifyPageState, __VerifyPageState } from 'pages/auth/models/verify_page/verify-page.state';

export interface __AuthPagesState { // tslint:disable-line:class-name
  login: __LoginPageState;
  signup: __SignupPageState;
  reset: __ResetPageState;
  change: __ChangePageState;
  verify: __VerifyPageState;
}

export const AuthPagesModuleReducers = {
  login:  __fromLoginPageReducers.reducer,
  signup: __fromSignupPageReducers.reducer,
  reset:  __fromResetPageReducers.reducer,
  change: __fromChangePageReducers.reducer,
  verify: __fromVerifyPageReducers.reducer
};

export interface AuthPagesModuleState extends RootModuleState {
  auth: __AuthPagesState;
}

export namespace fromAuth {

  /** Main auth module selectors */
  const selectAuthModuleState           = createFeatureSelector<__AuthPagesState>('auth');
  const selectAuthModuleLoginPageState  = createSelector(selectAuthModuleState, (state) => state.login);
  const selectAuthModuleSignupPageState = createSelector(selectAuthModuleState, (state) => state.signup);
  const selectAuthModuleResetPageState  = createSelector(selectAuthModuleState, (state) => state.reset);
  const selectAuthModuleChangePageState = createSelector(selectAuthModuleState, (state) => state.change);
  const selectAuthModuleVerifyPageState = createSelector(selectAuthModuleState, (state) => state.verify);

  /** Login selectors */
  export const isLoginPagePending  = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.isPending);
  export const getLoginPageMessage = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getMessage);
  export const getLoginPageError   = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getError);
  export const getLoginPageExtra   = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getExtra);

  /** Signup selectors */
  export const isSignupPagePending = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.isPending);
  export const getSignupPageError  = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.getError);
  export const getSignupPageExtra  = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.getExtra);

  /** Reset selectors */
  export const isResetPagePending  = createSelector(selectAuthModuleResetPageState, __fromResetPageState.isPending);
  export const getResetPageMessage = createSelector(selectAuthModuleResetPageState, __fromResetPageState.getMessage);
  export const getResetPageError   = createSelector(selectAuthModuleResetPageState, __fromResetPageState.getError);
  export const getResetPageExtra   = createSelector(selectAuthModuleResetPageState, __fromResetPageState.getExtra);

  /** Change selectors */
  export const isChangePagePending = createSelector(selectAuthModuleChangePageState, __fromChangePageState.isPending);
  export const getChangePageError  = createSelector(selectAuthModuleChangePageState, __fromChangePageState.getError);
  export const getChangePageExtra  = createSelector(selectAuthModuleChangePageState, __fromChangePageState.getExtra);

  /** Verify selectors */
  export const isVerifyPagePending = createSelector(selectAuthModuleVerifyPageState, __fromVerifyPageState.isPending);
  export const getVerifyPageError  = createSelector(selectAuthModuleVerifyPageState, __fromVerifyPageState.getError);
  export const getVerifyPageExtra  = createSelector(selectAuthModuleVerifyPageState, __fromVerifyPageState.getExtra);

}
