import { createAction, props } from '@ngrx/store';
import { BackendErrorResponse } from 'services/backend/backend-response';

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

  export const linkWithSample = createAction('[ProjectUploads] Link With Sample', props<{ entityId: number, sampleId: number }>());

  export const check         = createAction('[ProjectUploads] Check', props<{ entityId: number }>());
  export const checked       = createAction('[ProjectUploads] Checked', props<{ entityId: number, warning?: string }>());
  export const globalChecked = createAction('[ProjectUploads] Global Checked', props<{ warnings?: string[], errors?: string[] }>());

  export const upload         = createAction('[ProjectUploads] Upload', props<{ entityId: number }>());
  export const uploadStart    = createAction('[ProjectUploads] Upload Start', props<{ entityId: number }>());
  export const uploadProgress = createAction('[ProjectUploads] Upload Progress', props<{ entityId: number, progress: number }>());
  export const uploadSuccess  = createAction('[ProjectUploads] Upload Success', props<{ entityId: number }>());
  export const uploadFailed   = createAction('[ProjectUploads] Upload Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const remove = createAction('[ProjectUploads] Remove', props<{ entityId: number }>());

}
