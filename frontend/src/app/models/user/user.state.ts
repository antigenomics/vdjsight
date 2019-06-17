import { UserInfo } from 'models/user/user';

export interface __UserState { // tslint:disable-line:class-name
  readonly initialized: boolean;
  readonly initializeFailed: boolean;
  readonly loggedIn: boolean;
  readonly info?: UserInfo;
}

export namespace __fromUserState {

  function rehydrateInitialState(): __UserState {
    const check = window.localStorage.getItem('isLoggedIn');
    if (check === null || check === 'false') {
      return { initialized: true, initializeFailed: false, loggedIn: false };
    } else {
      return { initialized: false, initializeFailed: false, loggedIn: false };
    }
  }

  export const initial: __UserState = rehydrateInitialState();

  export const isInitialized      = (state: __UserState) => state.initialized;
  export const isInitializeFailed = (state: __UserState) => state.initializeFailed;
  export const isLoggedIn         = (state: __UserState) => state.loggedIn;
  export const getInfo            = (state: __UserState) => state.info;

}
