interface NetworkGuardState {
  active: boolean;
  title?: string;
  message?: string;
}

export interface __NetworkState { // tslint:disable-line:class-name
  offline: boolean;
  guard: NetworkGuardState;
}

export namespace __fromNetworkState {

  export const initial: __NetworkState = {
    offline: false,
    guard:   { active: false }
  };

  export const isOffline = (state: __NetworkState) => state.offline;
  export const isOnline  = (state: __NetworkState) => !state.offline;

  export const getGuardInfo = (state: __NetworkState) => state.guard;

}
