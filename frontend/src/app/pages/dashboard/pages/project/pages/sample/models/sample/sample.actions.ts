import { createAction, props } from '@ngrx/store';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

export namespace CurrentSampleActions {

  export const select   = createAction('[CurrentSample] Select', props<{ entity: SampleEntity }>());
  export const deselect = createAction('[CurrentSample] Deselect', props<{ withRedirect: boolean }>());

}
