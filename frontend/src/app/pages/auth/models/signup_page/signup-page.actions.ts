import { createAction, props } from '@ngrx/store';
import { AuthForms } from 'pages/auth/auth.forms';

export namespace SignupPageActions {

  export const init          = createAction('[Signup Page] Init');
  export const signup        = createAction('[Signup Page] Signup', props<{ form: AuthForms.SignupForm }>());
  export const signupSuccess = createAction('[Signup Page] Signup Success', props<{ message: string }>());
  export const signupFailed  = createAction('[Signup Page] Signup Failed', props<{ error: string, extra?: string[] }>());

}
