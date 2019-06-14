import { getSelectors, MinimalRouterStateSnapshot, routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';
import { fromApplicationReducers } from 'models/application/application.reducers';
import { ApplicationState, fromApplicationState } from 'models/application/application.state';
import { RootState } from 'models/root';
import { fromUserReducers } from 'models/user/user.reducers';
import { fromUserState, UserState } from 'models/user/user.state';

export interface RootState {
  application: ApplicationState;
  user: UserState;
  router: RouterReducerState<MinimalRouterStateSnapshot>;
}

export const RootReducers = {
  application: fromApplicationReducers.reducer,
  user:        fromUserReducers.reducer,
  router:      routerReducer
};

export function LoggerDebugReducer(reducer: ActionReducer<any>): ActionReducer<any> { // tslint:disable-line:no-any
  return (_, action) => {
    console.log('[Debug] Action', action); // tslint:disable-line:no-console
    return reducer;
  };
}

export const metaReducers: MetaReducer[] = environment.production ? [] : [];

export namespace fromRoot {

  /** Root state branches selectors */
  export const getApplicationState = (state: RootState) => state.application;
  export const getUserState        = (state: RootState) => state.user;
  export const getRouterState      = createFeatureSelector<RootState, RouterReducerState<MinimalRouterStateSnapshot>>('router');

  /** Application state selectors */
  export const isApplicationInitialized = createSelector(getApplicationState, fromApplicationState.isInitialized);

  /** User state selectors */
  export const isUserStateFetched     = createSelector(getUserState, fromUserState.isFetched);
  export const isUserStateFetchFailed = createSelector(getUserState, fromUserState.isFetchFailed);
  export const isUserLoggedIn         = createSelector(getUserState, fromUserState.isLoggedIn);
  export const getUserInfo            = createSelector(getUserState, fromUserState.getInfo);

  /** Router state selectors */
  const routerStateSelectors = getSelectors(getRouterState);

  export const getRouterStateQueryParams  = routerStateSelectors.selectQueryParams;
  export const getRouterStateCurrentRoute = routerStateSelectors.selectCurrentRoute;
  export const getRouterStateRouteData    = routerStateSelectors.selectRouteData;
  export const getRouterStateRouteParams  = routerStateSelectors.selectRouteParams;
  export const getRouterStateURL          = routerStateSelectors.selectUrl;
}
