import { createAction, props } from '@ngrx/store';
import { ProjectEntity, ProjectLink } from 'pages/dashboard/models/projects/projects';
import { ProjectsAPI } from 'pages/dashboard/services/projects-api';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace ProjectsActions {

  export const load        = createAction('[Projects] Load');
  export const loadStart   = createAction('[Projects] Load Start');
  export const loadSuccess = createAction('[Projects] Load Success', props<{ projects: ProjectLink[] }>());
  export const loadFailed  = createAction('[Projects] Load Failed', props<{ error: BackendErrorResponse }>());

  export const create        = createAction('[Projects] Create', props<{ entity: ProjectEntity, request: ProjectsAPI.CreateRequest }>());
  export const createSuccess = createAction('[Projects] Create Success', props<{ entity: ProjectEntity, link: ProjectLink }>());
  export const createFailed  = createAction('[Projects] Create Failed', props<{ entity: ProjectEntity, error: BackendErrorResponse }>());

}
