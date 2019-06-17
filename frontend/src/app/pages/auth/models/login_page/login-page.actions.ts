import { createAction, props } from '@ngrx/store';
import { AuthForms } from 'pages/auth/auth.forms';

export namespace LoginPageActions {

  export const init         = createAction('[Login Page] Init');
  export const loginAttempt = createAction('[Login Page] Login Attempt', props<{ form: AuthForms.LoginForm }>());
  export const loginSuccess = createAction('[Login Page] Login Success');
  export const loginFailed  = createAction('[Login Page] Login Failed', props<{ error: string, extra?: string[] }>());

}
