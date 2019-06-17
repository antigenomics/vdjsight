import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromLoginPageReducers } from 'pages/auth/models/login_page/login-page.reducers';
import { __fromLoginPageState, __LoginPageState } from 'pages/auth/models/login_page/login-page.state';

export interface __AuthPagesState { // tslint:disable-line:class-name
  login: __LoginPageState;
}

export const AuthPagesModuleReducers = {
  login: __fromLoginPageReducers.reducer
};

export interface AuthPagesModuleState extends RootModuleState {
  auth: __AuthPagesState;
}

/** Main auth module selectors */
export const selectAuthModuleState      = createFeatureSelector<__AuthPagesState>('auth');
export const selectAuthModuleLoginState = createSelector(selectAuthModuleState, (state) => state.login);

/** Login selectors */
export const isLoginPending = createSelector(selectAuthModuleLoginState, __fromLoginPageState.isPending);
export const getLoginError  = createSelector(selectAuthModuleLoginState, __fromLoginPageState.getError);
export const getLoginExtra  = createSelector(selectAuthModuleLoginState, __fromLoginPageState.getExtra);
