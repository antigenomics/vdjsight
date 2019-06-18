export interface __LoginPageState { // tslint:disable-line:class-name
  pending: boolean;
  message?: string;
  error?: string;
  extra?: string[];
}

export namespace __fromLoginPageState {

  export const initial: __LoginPageState = {
    pending: false
  };

  export const isPending  = (state: __LoginPageState) => state.pending;
  export const getMessage = (state: __LoginPageState) => state.message;
  export const getError   = (state: __LoginPageState) => state.error;
  export const getExtra   = (state: __LoginPageState) => state.extra;

}
