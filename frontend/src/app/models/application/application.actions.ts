import { createAction, props } from '@ngrx/store';

export namespace ApplicationActions {

  export const noop = createAction('[Application] Noop action');

  export const saveURL             = createAction('[Application] Save URL', props<{ url: string }>());
  export const restoreLastSavedURL = createAction('[Application] Restore Last Saved URL', props<{ fallbackURL: string }>());
  export const clearLastSavedURL   = createAction('[Application] Clear Last Saved URL');

  export const reload = createAction('[Application] Reload');

}
