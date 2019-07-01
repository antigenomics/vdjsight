export interface __NetworkState { // tslint:disable-line:class-name
  offline: boolean;
}

export namespace __fromNetworkState {

  export const initial: __NetworkState = {
    offline: false
  };

  export const isOffline = (state: __NetworkState) => state.offline;
  export const isOnline  = (state: __NetworkState) => !state.offline;

}
