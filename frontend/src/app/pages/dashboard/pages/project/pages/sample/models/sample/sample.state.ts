import { SampleEntity } from 'pages/dashboard/models/samples/samples';

export interface __DashboardCurrentSampleState { // tslint:disable-line:class-name
  readonly entity?: SampleEntity;
}

export namespace __fromDashboardCurrentSampleState {

  export const initial: __DashboardCurrentSampleState = {};

  export const isSomeSampleSelected = (state: __DashboardCurrentSampleState) =>
    state.entity !== undefined;

  export const getCurrentSampleUUID = (state: __DashboardCurrentSampleState) =>
    state.entity !== undefined && state.entity.link !== undefined ? state.entity.link.uuid : undefined;

  export const getCurrentSampleEntity = (state: __DashboardCurrentSampleState) =>
    state.entity;

}
