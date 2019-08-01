interface NetworkBackendState {
  readonly dead: boolean;
  readonly pingTimeoutId?: number;
}

interface NetworkGuardState {
  readonly active: boolean;
  readonly title?: string;
  readonly message?: string;
}

export interface __NetworkState { // tslint:disable-line:class-name
  readonly offline: boolean;
  readonly backend: NetworkBackendState;
  readonly guard: NetworkGuardState;
}

export namespace __fromNetworkState {

  export const initial: __NetworkState = {
    offline: false,
    backend: { dead: false },
    guard:   { active: false }
  };

  export const isOffline               = (state: __NetworkState) => state.offline;
  export const isOnline                = (state: __NetworkState) => !state.offline;
  export const isBackendDead           = (state: __NetworkState) => state.backend.dead;
  export const isBackendPingScheduled  = (state: __NetworkState) => state.backend.pingTimeoutId !== undefined;
  export const getBackendPingTimeoutId = (state: __NetworkState) => state.backend.pingTimeoutId;
  export const getGuardInfo            = (state: __NetworkState) => state.guard;

}
