import { createAction, props } from '@ngrx/store';

export namespace ProjectUploadErrorsActions {

  export const add    = createAction('[ProjectUploadErrors] Add', props<{ uploadId: number }>());
  export const update = createAction('[ProjectUploadErrors] Update', props<{ errorId: number, error: string }>());
  export const remove = createAction('[ProjectUploadErrors] Remove', props<{ errorId: number }>());

  export const checkGlobal = createAction('[ProjectUploadErrors] Check Global');
  export const global      = createAction('[ProjectUploadErrors] Global', props<{ errors: string[], warnings: string[] }>());

}
