export interface UserInfo {
  readonly email: string;
  readonly login: string;
}

export interface UserState {
  readonly fetched: boolean;
  readonly fetchFailed: boolean;
  readonly loggedIn: boolean;
  readonly info?: UserInfo;
}

export namespace fromUserState {

  function rehydrateInitialState(): UserState {
    const check = window.localStorage.getItem('isLoggedIn');
    if (check === null || check === 'false') {
      return { fetched: true, fetchFailed: false, loggedIn: false };
    } else {
      return { fetched: false, fetchFailed: false, loggedIn: false };
    }
  }

  export const initial: UserState = rehydrateInitialState();

  export const isFetched     = (state: UserState) => state.fetched;
  export const isFetchFailed = (state: UserState) => state.fetchFailed;
  export const isLoggedIn    = (state: UserState) => state.loggedIn;
  export const getInfo       = (state: UserState) => state.info;

}
