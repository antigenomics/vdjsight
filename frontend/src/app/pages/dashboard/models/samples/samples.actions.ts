import { createAction, props } from '@ngrx/store';
import { SampleEntity, SampleLink } from 'pages/dashboard/models/samples/samples';
import { SamplesAPI } from 'pages/dashboard/services/samples/samples-api';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace SamplesActions {

  export const loadForCurrentProject = createAction('[Samples] Load For Current Project');

  export const load        = createAction('[Samples] Load', props<{ projectLinkUUID: string }>());
  export const loadStart   = createAction('[Samples] Load Start', props<{ projectLinkUUID: string }>());
  export const loadSuccess = createAction('[Samples] Load Success', props<{ projectLinkUUID: string, samples: SampleLink[] }>());
  export const loadFailed  = createAction('[Samples] Load Failed', props<{ projectLinkUUID: string, error: BackendErrorResponse }>());

  export const create        = createAction('[Samples] Create', props<{ entity: SampleEntity, request: SamplesAPI.CreateRequest }>());
  export const createSuccess = createAction('[Samples] Create Success', props<{ entityId: number, link: SampleLink }>());
  export const createFailed  = createAction('[Samples] Create Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const update        = createAction('[Samples] Update', props<{ entity: SampleEntity, name: string, software: string }>());
  export const updateSuccess = createAction('[Samples] Update Success', props<{ entityId: number, link: SampleLink }>());
  export const updateFailed  = createAction('[Samples] Update Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const forceDelete        = createAction('[Samples] Force Delete', props<{ entity: SampleEntity }>());
  export const forceDeleteSuccess = createAction('[Samples] Force Delete Success', props<{ entity: SampleEntity }>());
  export const forceDeleteFailed  = createAction('[Samples] Force Delete Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const failedDiscard   = createAction('[Samples] Failed Discard', props<{ entity: SampleEntity }>());
  export const failedDiscarded = createAction('[Samples] Failed Discarded', props<{ entity: SampleEntity }>());

  export const clear = createAction('[Samples] Clear');
}
