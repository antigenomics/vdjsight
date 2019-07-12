import { createAction, props } from '@ngrx/store';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

export namespace ProjectUploadsActions {

  export const add    = createAction('[ProjectUploads] Add', props<{ entityId: number, projectLinkUUID: string, name: string, size: number }>());
  export const update = createAction('[ProjectsUploads] Update', props<{ entityId: number, changes: Partial<UploadEntity> }>());
  export const remove = createAction('[ProjectUploads] Remove', props<{ entityId: number }>());

}
