import { createAction, props } from '@ngrx/store';

export namespace VerifyPageActions {

  export const init          = createAction('[Verify Page] Init');
  export const verifyAttempt = createAction('[Verify Page] Verify Attempt', props<{ token: string }>());
  export const verifySuccess = createAction('[Verify Page] Verify Success', props<{ message: string }>());
  export const verifyFailed  = createAction('[Verify Page] Verify Failed', props<{ error: string, extra?: string[] }>());

}
