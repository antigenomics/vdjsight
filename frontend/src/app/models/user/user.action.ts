import { createAction, props } from '@ngrx/store';
import { UserInfo } from 'models/user/user.state';


export namespace UserActions {
  export const fetch        = createAction('[User] Fetch');
  export const fetchStart   = createAction('[User] Fetch start');
  export const fetchSuccess = createAction('[User] Fetch success', props<{ loggedIn: boolean, info?: UserInfo }>());
  export const fetchFailed  = createAction('[User] Fetch failed');
  export const login        = createAction('[User] Login', props<{ info: UserInfo }>());
  export const logout       = createAction('[User] Logout');
}
