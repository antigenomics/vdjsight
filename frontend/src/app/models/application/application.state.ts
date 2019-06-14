export interface ApplicationState {
  readonly initialized: boolean;
}

export namespace fromApplicationState {

  export const initial: ApplicationState = {
    initialized: false
  };

  export const isInitialized = (state: ApplicationState) => state.initialized;

}
