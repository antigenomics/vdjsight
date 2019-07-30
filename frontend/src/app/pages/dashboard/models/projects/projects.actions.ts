import { createAction, props } from '@ngrx/store';
import { ProjectEntity, ProjectLink } from 'pages/dashboard/models/projects/projects';
import { ProjectsAPI } from 'pages/dashboard/services/projects/projects-api';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace ProjectsActions {

  export const load        = createAction('[Projects] Load');
  export const loadStart   = createAction('[Projects] Load Start');
  export const loadSuccess = createAction('[Projects] Load Success', props<{ projects: ProjectLink[] }>());
  export const loadFailed  = createAction('[Projects] Load Failed', props<{ error: BackendErrorResponse }>());

  export const create        = createAction('[Projects] Create', props<{ entity: ProjectEntity, request: ProjectsAPI.CreateRequest }>());
  export const createSuccess = createAction('[Projects] Create Success', props<{ entityId: number, link: ProjectLink }>());
  export const createFailed  = createAction('[Projects] Create Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const update        = createAction('[Projects] Update', props<{ entity: ProjectEntity, name: string, description: string }>());
  export const updateSuccess = createAction('[Projects] Update Success', props<{ entityId: number, link: ProjectLink }>());
  export const updateFailed  = createAction('[Projects] Update Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const forceDelete        = createAction('[Projects] Force Delete', props<{ entity: ProjectEntity }>());
  export const forceDeleteSuccess = createAction('[Projects] Force Delete Success', props<{ entityId: number }>());
  export const forceDeleteFailed  = createAction('[Projects] Force Delete Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const selectProject         = createAction('[Projects] Select Project', props<{ entityId: number }>());
  export const clearProjectSelection = createAction('[Projects] Clear Project Selection');

  export const clear = createAction('[Projects] Clear');
}
