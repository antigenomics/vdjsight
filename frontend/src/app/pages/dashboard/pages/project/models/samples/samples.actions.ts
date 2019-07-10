import { createAction, props } from '@ngrx/store';
import { SampleFileEntity, SampleFileLink } from 'pages/dashboard/pages/project/models/samples/samples';
import { SampleFilesAPI } from 'pages/dashboard/pages/project/services/sample-files-api';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace SampleFilesActions {

  export const load        = createAction('[SampleFiles] Load');
  export const loadStart   = createAction('[SampleFiles] Load Start', props<{ projectLinkUUID: string }>());
  export const loadSuccess = createAction('[SampleFiles] Load Success', props<{ samples: SampleFileLink[] }>());
  export const loadFailed  = createAction('[SampleFiles] Load Failed', props<{ error: BackendErrorResponse }>());

  export const create        = createAction('[SampleFiles] Create', props<{ entity: SampleFileEntity, request: SampleFilesAPI.CreateRequest }>());
  export const createSuccess = createAction('[SampleFiles] Create Success', props<{ entityId: number, link: SampleFileLink }>());
  export const createFailed  = createAction('[SampleFiles] Create Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const update        = createAction('[SampleFiles] Update', props<{ entity: SampleFileEntity, name: string, software: string }>());
  export const updateSuccess = createAction('[SampleFiles] Update Success', props<{ entityId: number, link: SampleFileLink }>());
  export const updateFailed  = createAction('[SampleFiles] Update Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const forceDelete        = createAction('[SampleFiles] Force Delete', props<{ entity: SampleFileEntity }>());
  export const forceDeleteSuccess = createAction('[SampleFiles] Force Delete Success', props<{ entityId: number }>());
  export const forceDeleteFailed  = createAction('[SampleFiles] Force Delete Failed', props<{ entityId: number, error: BackendErrorResponse }>());

  export const selectSample         = createAction('[SampleFiles] Select Sample', props<{ entityId: number }>());
  export const clearSampleSelection = createAction('[SampleFiles] Clear Sample Selection');

  export const clear = createAction('[SampleFiles] Clear');
}
