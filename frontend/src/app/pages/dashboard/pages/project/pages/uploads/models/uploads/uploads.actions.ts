import { createAction, props } from '@ngrx/store';

export namespace ProjectUploadsActions {

  export const add        = createAction('[ProjectUploads] Add', props<{ entityId: number, projectLinkUUID: string, name: string, size: number }>());
  export const setHash    = createAction('[ProjectUploads] Set Hash', props<{ entityId: number, hash: string }>());
  export const changeName = createAction('[ProjectsUploads] Change Name', props<{ entityId: number, name: string }>());
  export const remove     = createAction('[ProjectUploads] Remove', props<{ entityId: number }>());

}
