import { createAction, props } from '@ngrx/store';

export namespace ProjectUploadErrorsActions {

  export const add    = createAction('[ProjectUploadErrors] Add', props<{ uploadId: number }>());
  export const update = createAction('[ProjectUploadErrors] Update', props<{ errorId: number, errors: string[] }>());
  export const remove = createAction('[ProjectUploadErrors] Remove', props<{ errorId: number }>());

}
