import { createAction, props } from '@ngrx/store';
import { ProjectEntity, ProjectLink } from 'pages/dashboard/models/projects/projects';
import { ProjectsAPI } from 'pages/dashboard/services/projects/projects-api';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace ProjectsActions {

  export const load        = createAction('[Projects] Load');
  export const loadStart   = createAction('[Projects] Load Start');
  export const loadSuccess = createAction('[Projects] Load Success', props<{ projects: ProjectLink[] }>());
  export const loadFailed  = createAction('[Projects] Load Failed', props<{ error: BackendErrorResponse }>());

  export const reload = createAction('[Projects] Reload');

  export const create        = createAction('[Projects] Create', props<{ entity: ProjectEntity, request: ProjectsAPI.CreateRequest }>());
  export const createSuccess = createAction('[Projects] Create Success', props<{ entityId: number, link: ProjectLink }>());
  export const createFailed  = createAction('[Projects] Create Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const update        = createAction('[Projects] Update', props<{ entity: ProjectEntity, name: string, description: string }>());
  export const updateSuccess = createAction('[Projects] Update Success', props<{ entityId: number, link: ProjectLink }>());
  export const updateFailed  = createAction('[Projects] Update Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const forceDelete        = createAction('[Projects] Force Delete', props<{ entity: ProjectEntity }>());
  export const forceDeleteSuccess = createAction('[Projects] Force Delete Success', props<{ entityId: number }>());
  export const forceDeleteFailed  = createAction('[Projects] Force Delete Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const failedDiscard   = createAction('[Projects] Failed Discard', props<{ entity: ProjectEntity }>());
  export const failedDiscarded = createAction('[Projects] Failed Discarded', props<{ entity: ProjectEntity }>());

  export const preview      = createAction('[Projects] Preview', props<{ entityId: number }>());
  export const clearPreview = createAction('[Projects] Clear Preview');

  export const select   = createAction('[Projects] Select', props<{ uuid: string }>());
  export const unselect = createAction('[Projects] Unselect');

  export const clear = createAction('[Projects] Clear');
}
