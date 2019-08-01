import { createAction, props } from '@ngrx/store';
import { ProjectLink } from 'pages/dashboard/models/projects/projects';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace CurrentProjectActions {

  export const toProjectURL = createAction('[CurrentProject] To Project URL');

  export const select   = createAction('[CurrentProject] Select', props<{ projectLinkUUID: string }>());
  export const deselect = createAction('[CurrentProject] Deselect');

  export const load        = createAction('[CurrentProject] Load', props<{ projectLinkUUID: string }>());
  export const loadStart   = createAction('[CurrentProject] Load Start', props<{ projectLinkUUID: string }>());
  export const loadSuccess = createAction('[CurrentProject] Load Success', props<{ link: ProjectLink }>());
  export const loadFailed  = createAction('[CurrentProject] Load Failed', props<{ error: BackendErrorResponse }>());

}
