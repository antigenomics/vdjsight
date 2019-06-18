export interface __SignupPageState { // tslint:disable-line:class-name
  pending: boolean;
  error?: string;
  extra?: string[];
}

export namespace __fromSignupPageState {

  export const initial: __SignupPageState = {
    pending: false
  };

  export const isPending = (state: __SignupPageState) => state.pending;
  export const getError  = (state: __SignupPageState) => state.error;
  export const getExtra  = (state: __SignupPageState) => state.extra;

}

