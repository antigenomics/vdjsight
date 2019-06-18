import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromLoginPageReducers } from 'pages/auth/models/login_page/login-page.reducers';
import { __fromLoginPageState, __LoginPageState } from 'pages/auth/models/login_page/login-page.state';
import { __fromSignupPageReducers } from 'pages/auth/models/signup_page/signup-page.reducers';
import { __fromSignupPageState, __SignupPageState } from 'pages/auth/models/signup_page/signup-page.state';

export interface __AuthPagesState { // tslint:disable-line:class-name
  login: __LoginPageState;
  signup: __SignupPageState;
}

export const AuthPagesModuleReducers = {
  login:  __fromLoginPageReducers.reducer,
  signup: __fromSignupPageReducers.reducer
};

export interface AuthPagesModuleState extends RootModuleState {
  auth: __AuthPagesState;
}

export namespace fromAuth {

  /** Main auth module selectors */
  export const selectAuthModuleState           = createFeatureSelector<__AuthPagesState>('auth');
  export const selectAuthModuleLoginPageState  = createSelector(selectAuthModuleState, (state) => state.login);
  export const selectAuthModuleSignupPageState = createSelector(selectAuthModuleState, (state) => state.signup);

  /** Login selectors */
  export const isLoginPagePending  = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.isPending);
  export const getLoginPageMessage = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getMessage);
  export const getLoginPageError   = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getError);
  export const getLoginPageExtra   = createSelector(selectAuthModuleLoginPageState, __fromLoginPageState.getExtra);

  /** Signup selectors */
  export const isSignupPagePending = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.isPending);
  export const getSignupPageError  = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.getError);
  export const getSignupPageExtra  = createSelector(selectAuthModuleSignupPageState, __fromSignupPageState.getExtra);

}
