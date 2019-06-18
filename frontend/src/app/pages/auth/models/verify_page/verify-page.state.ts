export interface __VerifyPageState { // tslint:disable-line:class-name
  pending: boolean;
  error?: string;
  extra?: string[];
}

export namespace __fromVerifyPageState {

  export const initial: __VerifyPageState = {
    pending: false
  };

  export const isPending = (state: __VerifyPageState) => state.pending;
  export const getError  = (state: __VerifyPageState) => state.error;
  export const getExtra  = (state: __VerifyPageState) => state.extra;

}
