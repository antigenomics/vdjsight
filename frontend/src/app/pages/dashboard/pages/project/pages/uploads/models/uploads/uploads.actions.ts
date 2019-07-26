import { createAction, props } from '@ngrx/store';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

export namespace ProjectUploadsActions {

  export const add    = createAction('[ProjectUploads] Add', props<{ entityId: number, projectLinkUUID: string, name: string, extension: string, size: number }>());
  export const update = createAction('[ProjectUploads] Update', props<{ entityId: number, changes: Partial<UploadEntity> }>());
  export const check  = createAction('[ProjectUploads] Check', props<{ entityId: number }>());
  export const remove = createAction('[ProjectUploads] Remove', props<{ entityId: number }>());

}
