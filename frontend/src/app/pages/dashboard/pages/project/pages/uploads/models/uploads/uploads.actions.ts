import { createAction, props } from '@ngrx/store';

export namespace ProjectUploadsActions {

  export const add = createAction('[ProjectUploads] Add', props<{ projectLinkUUID: string }>());

}
