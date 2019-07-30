import { SampleEntity } from 'pages/dashboard/models/samples/samples';

export interface __DashboardCurrentSampleState { // tslint:disable-line:class-name
  readonly uuid: string;
  readonly entity?: SampleEntity;
}

export namespace __fromDashboardCurrentSampleState {

  export const initial: __DashboardCurrentSampleState = {
    uuid: ''
  };

  export const isSomeSampleSelected   = (state: __DashboardCurrentSampleState) => state.uuid !== '' && state.entity !== undefined;
  export const getCurrentSampleUUID   = (state: __DashboardCurrentSampleState) => state.uuid;
  export const getCurrentSampleEntity = (state: __DashboardCurrentSampleState) => state.entity;

}
