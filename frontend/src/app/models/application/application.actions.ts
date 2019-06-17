import { createAction, props } from '@ngrx/store';
import { Params } from '@angular/router';

export namespace ApplicationActions {

  export const pingBackend        = createAction('[Application] Ping Backend');
  export const pingBackendSuccess = createAction('[Application] Ping Backend Success');
  export const pingBackendFailed  = createAction('[Application] Ping Backend Failed');

  export const saveURL             = createAction('[Application] Save URL', props<{ url: string, queryParams?: Params }>());
  export const restoreLastSavedURL = createAction('[Application] Restore Last Saved URL', props<{ fallbackURL: string, fallbackQueryParams?: Params }>());
  export const clearLastSavedURL   = createAction('[Application] Clear Last Saved URL');

}
