import { createAction, props } from '@ngrx/store';
import { AuthForms } from 'pages/auth/auth.forms';

export namespace LoginPageActions {

  export const init         = createAction('[Login Page] Init');
  export const message      = createAction('[Login Page] Message', props<{ message: string }>());
  export const login        = createAction('[Login Page] Login', props<{ form: AuthForms.LoginForm }>());
  export const loginSuccess = createAction('[Login Page] Login Success');
  export const loginFailed  = createAction('[Login Page] Login Failed', props<{ error: string, extra?: string[] }>());

}
