export interface __ChangePageState { // tslint:disable-line:class-name
  pending: boolean;
  error?: string;
  extra?: string[];
}

export namespace __fromChangePageState {

  export const initial: __ChangePageState = {
    pending: false
  };

  export const isPending = (state: __ChangePageState) => state.pending;
  export const getError  = (state: __ChangePageState) => state.error;
  export const getExtra  = (state: __ChangePageState) => state.extra;

}
