export interface __ApplicationState { // tslint:disable-line:class-name
  readonly backendDead: boolean;
  readonly savedURLs: string[];
}

export namespace __fromApplicationState {

  export const initial: __ApplicationState = {
    backendDead: false,
    savedURLs:   []
  };

  export const isBackendDead   = (state: __ApplicationState) => state.backendDead;
  export const getSavedURLs    = (state: __ApplicationState) => state.savedURLs;
  export const getLastSavedURL = (state: __ApplicationState) => state.savedURLs.length !== 0 ? state.savedURLs[ state.savedURLs.length - 1 ] : undefined;

}
