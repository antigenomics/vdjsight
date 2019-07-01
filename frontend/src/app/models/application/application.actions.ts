import { createAction, props } from '@ngrx/store';

export namespace ApplicationActions {

  export const noop = createAction('[Application] Noop action');

  export const pingBackend         = createAction('[Application] Ping Backend');
  export const pingBackendSchedule = createAction('[Application] Ping Backend Schedule', props<{ timeout: number }>());
  export const pingBackendSuccess  = createAction('[Application] Ping Backend Success');
  export const pingBackendFailed   = createAction('[Application] Ping Backend Failed');

  export const saveURL             = createAction('[Application] Save URL', props<{ url: string }>());
  export const restoreLastSavedURL = createAction('[Application] Restore Last Saved URL', props<{ fallbackURL: string }>());
  export const clearLastSavedURL   = createAction('[Application] Clear Last Saved URL');

}
