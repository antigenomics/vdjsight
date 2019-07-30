import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardProjectModuleState } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { __fromCurrentSampleReducers } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.reducers';
import { __DashboardCurrentSampleState, __fromDashboardCurrentSampleState } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.state';

interface __DashboardSampleState { // tslint:disable-line:class-name
  current: __DashboardCurrentSampleState;
}

export const DashboardSampleModuleReducers = {
  current: __fromCurrentSampleReducers.reducer
};

export interface DashboardSampleModuleState extends DashboardProjectModuleState {
  sample: __DashboardSampleState;
}

export namespace fromDashboardSample {

  /** Main dashboard project module selectors */
  const selectDashboardSampleModuleState               = createFeatureSelector<__DashboardSampleState>('sample');
  const selectDashboardProjectModuleCurrentSampleState = createSelector(selectDashboardSampleModuleState, (state) => state.current);

  /** Current sample selectors */
  export const isSomeSampleSelected   = createSelector(selectDashboardProjectModuleCurrentSampleState, __fromDashboardCurrentSampleState.isSomeSampleSelected);
  export const getCurrentSampleUUID   = createSelector(selectDashboardProjectModuleCurrentSampleState, __fromDashboardCurrentSampleState.getCurrentSampleUUID);
  export const getCurrentSampleEntity = createSelector(selectDashboardProjectModuleCurrentSampleState, __fromDashboardCurrentSampleState.getCurrentSampleEntity);

}
