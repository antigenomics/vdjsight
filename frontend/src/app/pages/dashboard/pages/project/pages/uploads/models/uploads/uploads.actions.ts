import { createAction, props } from '@ngrx/store';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

export namespace ProjectUploadsActions {

  export const add    = createAction('[ProjectUploads] Add', props<{ projectLinkUUID: string }>());
  export const remove = createAction('[ProjectUploads] Remove', props<{ entity: UploadEntity }>());

}
