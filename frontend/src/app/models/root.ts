import { getSelectors, MinimalRouterStateSnapshot, routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment.prod';
import { fromApplicationReducers } from 'models/application/application.reducers';
import { ApplicationState, fromApplicationState } from 'models/application/application.state';
import { RootState } from 'models/root';

export interface RootState {
  application: ApplicationState;
  router: RouterReducerState<MinimalRouterStateSnapshot>;
}

export const RootReducers = {
  application: fromApplicationReducers.reducer,
  router:      routerReducer
};

export function LoggerDebugReducer(reducer: ActionReducer<any>): ActionReducer<any> { // tslint:disable-line:no-any
  return (state, action) => {
    console.log('[Debug] Action', action, state); // tslint:disable-line:no-console
    return reducer;
  };
}

export const metaReducers: MetaReducer[] = environment.production ? [] : [ LoggerDebugReducer ];

export namespace fromRoot {

  /** Root state branches selectors */
  export const getApplicationState = (state: RootState) => state.application;
  export const getRouterState      = createFeatureSelector<RootState, RouterReducerState<MinimalRouterStateSnapshot>>('router');

  /** Application state selectors */
  export const isApplicationInitialized = createSelector(getApplicationState, fromApplicationState.isInitialized);

  /** Router state selectors */
  const routerStateSelectors = getSelectors(getRouterState);

  export const getRouterStateQueryParams  = routerStateSelectors.selectQueryParams;
  export const getRouterStateCurrentRoute = routerStateSelectors.selectCurrentRoute;
  export const getRouterStateRouteData    = routerStateSelectors.selectRouteData;
  export const getRouterStateRouteParams  = routerStateSelectors.selectRouteParams;
  export const getRouterStateURL          = routerStateSelectors.selectUrl;
}
