import { createAction, props } from '@ngrx/store';
import { AuthForms } from 'pages/auth/auth.forms';

export namespace ChangePageActions {

  export const init          = createAction('[Change Page] Init');
  export const changeAttempt = createAction('[Change Page] Change Attempt', props<{ token: string, form: AuthForms.ChangeForm }>());
  export const changeSuccess = createAction('[Change Page] Change Success', props<{ message: string }>());
  export const changeFailed  = createAction('[Change Page] Change Failed', props<{ error: string, extra?: string[] }>());

}
