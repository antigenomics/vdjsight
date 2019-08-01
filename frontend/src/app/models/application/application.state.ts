export interface __ApplicationState { // tslint:disable-line:class-name
  readonly savedURLs: string[];
}

export namespace __fromApplicationState {

  export const initial: __ApplicationState = {
    savedURLs: []
  };

  export const getSavedURLs    = (state: __ApplicationState) => state.savedURLs;
  export const getLastSavedURL = (state: __ApplicationState) => state.savedURLs.length !== 0 ? state.savedURLs[ state.savedURLs.length - 1 ] : undefined;

}
