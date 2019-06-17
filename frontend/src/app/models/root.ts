import { getSelectors, MinimalRouterStateSnapshot, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';
import { fromApplicationReducers } from 'models/application/application.reducers';
import { __ApplicationState, __fromApplicationState } from 'models/application/application.state';
import { RootModuleState } from 'models/root';
import { fromRouterReducers } from 'models/router/router.reducers';
import { __RouterState } from 'models/router/router.state';
import { fromUserReducers } from 'models/user/user.reducers';
import { __fromUserState, __UserState } from 'models/user/user.state';

export interface RootModuleState {
  application: __ApplicationState;
  user: __UserState;
  router: __RouterState;
}

export const RootReducers = {
  application: fromApplicationReducers.reducer,
  user:        fromUserReducers.reducer,
  router:      fromRouterReducers.reducer
};

export function LoggerDebugReducer(reducer: ActionReducer<any>): ActionReducer<any> { // tslint:disable-line:no-any
  return (state, action) => {
    console.log('[Debug] Action', action); // tslint:disable-line:no-console
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer[] = environment.production ? [] : [ LoggerDebugReducer ];

export namespace fromRoot {

  /** Root state branches selectors */
  export const getApplicationState = (state: RootModuleState) => state.application;
  export const getUserState        = (state: RootModuleState) => state.user;
  export const getRouterState      = createFeatureSelector<RootModuleState, RouterReducerState<MinimalRouterStateSnapshot>>('router');

  /** Application state selectors */
  export const isApplicationBackendDead   = createSelector(getApplicationState, __fromApplicationState.isBackendDead);
  export const getApplicationSavedURLs    = createSelector(getApplicationState, __fromApplicationState.getSavedURLs);
  export const getApplicationLastSavedURL = createSelector(getApplicationState, __fromApplicationState.getLastSavedURL);

  /** User state selectors */
  export const isUserStateInitialized      = createSelector(getUserState, __fromUserState.isInitialized);
  export const isUserStateInitializeFailed = createSelector(getUserState, __fromUserState.isInitializeFailed);
  export const isUserLoggedIn              = createSelector(getUserState, __fromUserState.isLoggedIn);
  export const getUserInfo                 = createSelector(getUserState, __fromUserState.getInfo);

  /** Router state selectors */
  const routerStateSelectors = getSelectors(getRouterState);

  export const getRouterStateQueryParams  = routerStateSelectors.selectQueryParams;
  export const getRouterStateCurrentRoute = routerStateSelectors.selectCurrentRoute;
  export const getRouterStateRouteData    = routerStateSelectors.selectRouteData;
  export const getRouterStateRouteParams  = routerStateSelectors.selectRouteParams;
  export const getRouterStateURL          = routerStateSelectors.selectUrl;
}
