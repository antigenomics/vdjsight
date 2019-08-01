import { getSelectors, MinimalRouterStateSnapshot, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';
import { __fromApplicationReducers } from 'models/application/application.reducers';
import { __ApplicationState, __fromApplicationState } from 'models/application/application.state';
import { __fromNetworkReducers } from 'models/network/network.reducers';
import { __fromNetworkState, __NetworkState } from 'models/network/network.state';
import { __fromNotificationsReducers } from 'models/notifications/notifications.reducers';
import { __fromNotificationsState, __NotificationsState } from 'models/notifications/notifications.state';
import { RootModuleState } from 'models/root';
import { __fromRouterReducers } from 'models/router/router.reducers';
import { __RouterState } from 'models/router/router.state';
import { __fromUserReducers } from 'models/user/user.reducers';
import { __fromUserState, __UserState } from 'models/user/user.state';

export interface RootModuleState {
  application: __ApplicationState;
  notifications: __NotificationsState;
  user: __UserState;
  router: __RouterState;
  network: __NetworkState;
}

export const RootReducers = {
  application:   __fromApplicationReducers.reducer,
  notifications: __fromNotificationsReducers.reducer,
  user:          __fromUserReducers.reducer,
  router:        __fromRouterReducers.reducer,
  network:       __fromNetworkReducers.reducer
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
  const getApplicationState   = (state: RootModuleState) => state.application;
  const getNotificationsState = (state: RootModuleState) => state.notifications;
  const getUserState          = (state: RootModuleState) => state.user;
  const getRouterState        = createFeatureSelector<RootModuleState, RouterReducerState<MinimalRouterStateSnapshot>>('router');
  const getNetworkState       = (state: RootModuleState) => state.network;

  /** Application state selectors */
  export const getApplicationSavedURLs    = createSelector(getApplicationState, __fromApplicationState.getSavedURLs);
  export const getApplicationLastSavedURL = createSelector(getApplicationState, __fromApplicationState.getLastSavedURL);

  /** Notifications state selectors */
  export const isNotificationsEnabled  = createSelector(getNotificationsState, __fromNotificationsState.isEnabled);
  export const isNotificationsDisabled = createSelector(getNotificationsState, __fromNotificationsState.isDisabled);
  export const getNotificationByID     = createSelector(getNotificationsState, __fromNotificationsState.selectByID);
  export const getNotificationsIDs     = createSelector(getNotificationsState, __fromNotificationsState.selectIds);
  export const getNotificationEntities = createSelector(getNotificationsState, __fromNotificationsState.selectEntities);
  export const getAllNotification      = createSelector(getNotificationsState, __fromNotificationsState.selectAll);
  export const getNotificationCount    = createSelector(getNotificationsState, __fromNotificationsState.selectTotal);

  /** User state selectors */
  export const isUserStateInitialized      = createSelector(getUserState, __fromUserState.isInitialized);
  export const isUserStateInitializeFailed = createSelector(getUserState, __fromUserState.isInitializeFailed);
  export const isUserLoggedIn              = createSelector(getUserState, __fromUserState.isLoggedIn);
  export const getUserCredentials          = createSelector(getUserState, __fromUserState.getUserInfo);

  /** Router state selectors */
  const routerStateSelectors = getSelectors(getRouterState);

  export const getRouterStateQueryParams  = routerStateSelectors.selectQueryParams;
  export const getRouterStateCurrentRoute = routerStateSelectors.selectCurrentRoute;
  export const getRouterStateRouteData    = routerStateSelectors.selectRouteData;
  export const getRouterStateRouteParams  = routerStateSelectors.selectRouteParams;
  export const getRouterStateURL          = routerStateSelectors.selectUrl;

  /** Network state selectors */
  export const isNetworkOffline               = createSelector(getNetworkState, __fromNetworkState.isOffline);
  export const isNetworkOnline                = createSelector(getNetworkState, __fromNetworkState.isOnline);
  export const isNetworkBackendDead           = createSelector(getNetworkState, __fromNetworkState.isBackendDead);
  export const isNetworkBackendPingScheduled  = createSelector(getNetworkState, __fromNetworkState.isBackendPingScheduled);
  export const getNetworkBackendPingTimeoutId = createSelector(getNetworkState, __fromNetworkState.getBackendPingTimeoutId);
  export const getNetworkGuardInfo            = createSelector(getNetworkState, __fromNetworkState.getGuardInfo);
}
