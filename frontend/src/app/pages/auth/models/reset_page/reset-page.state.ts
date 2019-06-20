export interface __ResetPageState { // tslint:disable-line:class-name
  pending: boolean;
  message?: string;
  error?: string;
  extra?: string[];
}

export namespace __fromResetPageState {

  export const initial: __ResetPageState = {
    pending: false
  };

  export const isPending  = (state: __ResetPageState) => state.pending;
  export const getMessage = (state: __ResetPageState) => state.message;
  export const getError   = (state: __ResetPageState) => state.error;
  export const getExtra   = (state: __ResetPageState) => state.extra;

}
