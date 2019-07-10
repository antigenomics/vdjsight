import { createAction, props } from '@ngrx/store';
import { UserDTO } from 'models/user/user';


export namespace UserActions {
  export const initialize         = createAction('[User] Initialize');
  export const initializeStart    = createAction('[User] Initialize start');
  export const initializeSuccess  = createAction('[User] Initialize success', props<{ loggedIn: boolean, user?: UserDTO }>());
  export const initializeFailed   = createAction('[User] Initialize failed');
  export const login              = createAction('[User] Login', props<{ user: UserDTO }>());
  export const logout             = createAction('[User] Logout');
  export const logoutWithRedirect = createAction('[User] Logout With Redirect', props<{ redirectTo: string }>());
}
