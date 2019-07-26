import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromCurrentProjectReducers } from 'pages/dashboard/pages/project/models/project/project.reducers';
import { __DashboardCurrentProjectState, __fromDashboardCurrentProjectState } from 'pages/dashboard/pages/project/models/project/project.state';
import { __fromSampleFilesReducers } from 'pages/dashboard/pages/project/models/samples/samples.reducers';
import { __fromDashboardSampleFilesState, __SampleFilesState } from 'pages/dashboard/pages/project/models/samples/samples.state';

interface __DashboardProjectState { // tslint:disable-line:class-name
  current: __DashboardCurrentProjectState;
  samples: __SampleFilesState;
}

export const DashboardProjectModuleReducers = {
  current: __fromCurrentProjectReducers.reducer,
  samples: __fromSampleFilesReducers.reducer
};

export interface DashboardProjectModuleState extends RootModuleState {
  project: __DashboardProjectState;
}

export namespace fromDashboardProject {

  /** Main dashboard project module selectors */
  const selectDashboardProjectModuleState               = createFeatureSelector<__DashboardProjectState>('project');
  const selectDashboardProjectModuleCurrentProjectState = createSelector(selectDashboardProjectModuleState, (state) => state.current);
  const selectDashboardProjectModuleSampleFilesState    = createSelector(selectDashboardProjectModuleState, (state) => state.samples);

  /** Current project selectors */
  export const getCurrentProjectUUID      = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.getCurrentProjectUUID);
  export const isCurrentProjectLoading    = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoading);
  export const isCurrentProjectLoaded     = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoaded);
  export const isCurrentProjectLoadFailed = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoadFailed);
  export const getCurrentProjectInfo      = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.getCurrentProjectInfo);


  /** Samples selectors */
  export const isSamplesLoading        = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.isLoading);
  export const isSamplesLoaded         = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.isLoaded);
  export const isSamplesLoadFailed     = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.isLoadFailed);
  export const getSampleByID           = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectByID);
  export const getSampleByLinkUUID     = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectByLinkUUID);
  export const getSamplesIDs           = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectIds);
  export const getSampleEntities       = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectEntities);
  export const getSamplesForProject    = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectForProject);
  export const getAllSamples           = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectAll);
  export const getSamplesCount         = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.selectTotal);
  export const isSomeSampleSelected    = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.isSomeSampleSelected);
  export const getSelectedSample       = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.getSelectedSample);
  export const getSelectedSampleOption = createSelector(selectDashboardProjectModuleSampleFilesState, __fromDashboardSampleFilesState.getSelectedSampleOption);

}
