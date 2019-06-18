import { createAction, props } from '@ngrx/store';
import { AuthForms } from 'pages/auth/auth.forms';

export namespace ResetPageActions {

  export const init         = createAction('[Reset Page] Init');
  export const resetAttempt = createAction('[Reset Page] Reset Attempt', props<{ form: AuthForms.ResetForm }>());
  export const resetSuccess = createAction('[Reset Page] Reset Success', props<{ message: string }>());
  export const resetFailed  = createAction('[Reset Page] Reset Failed', props<{ error: string, extra?: string[] }>());

}
