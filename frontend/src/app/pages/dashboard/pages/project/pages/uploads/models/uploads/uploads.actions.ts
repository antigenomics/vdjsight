import { createAction, props } from '@ngrx/store';

export namespace ProjectUploadsActions {

  export const add = createAction('[ProjectUploads] Add', props<{
    entityId: number,
    projectLinkUUID: string,
    name: string,
    extension: string,
    software: string;
    size: number
  }>());

  export const update = createAction('[ProjectUploads] Update', props<{
    entityId: number,
    changes: {
      name?: string,
      software?: string,
      hash?: string
    },
    check: boolean
  }>());

  export const check         = createAction('[ProjectUploads] Check', props<{ entityId: number }>());
  export const checked       = createAction('[ProjectUploads] Checked', props<{ entityId: number, warning?: string }>());
  export const globalChecked = createAction('[ProjectUploads] Global Checked', props<{ warnings?: string[], errors?: string[] }>());

  export const startUpload = createAction('[ProjectUploads] Start Upload', props<{ entityId: number }>());

  export const remove = createAction('[ProjectUploads] Remove', props<{ entityId: number }>());

}
