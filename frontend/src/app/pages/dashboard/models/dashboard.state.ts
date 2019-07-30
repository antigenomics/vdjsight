import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromProjectsReducers } from 'pages/dashboard/models/projects/projects.reducers';
import { __fromProjectsState, __ProjectsState } from 'pages/dashboard/models/projects/projects.state';
import { __fromSampleFilesReducers } from 'pages/dashboard/models/samples/samples.reducers';
import { __fromDashboardSamplesState, __SamplesState } from 'pages/dashboard/models/samples/samples.state';

interface __DashboardState { // tslint:disable-line:class-name
  projects: __ProjectsState;
  samples: __SamplesState;
}

export const DashboardModuleReducers = {
  projects: __fromProjectsReducers.reducer,
  samples:  __fromSampleFilesReducers.reducer
};

export interface DashboardModuleState extends RootModuleState {
  dashboard: __DashboardState;
}

export namespace fromDashboard {

  /** Main dashboard module selectors */
  const selectDashboardModuleState         = createFeatureSelector<__DashboardState>('dashboard');
  const selectDashboardModuleProjectsState = createSelector(selectDashboardModuleState, (state) => state.projects);
  const selectDashboardSamplesState        = createSelector(selectDashboardModuleState, (state) => state.samples);

  /** Projects selectors */
  export const isProjectsLoading        = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoading);
  export const isProjectsLoaded         = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoaded);
  export const isProjectsLoadFailed     = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoadFailed);
  export const getProjectByID           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectByID);
  export const getProjectByLinkUUID     = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectByLinkUUID);
  export const getProjectsIDs           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectIds);
  export const getProjectEntities       = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectEntities);
  export const getAllProjects           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectAll);
  export const getProjectsCount         = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectTotal);
  export const isSomeProjectSelected    = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isSomeProjectSelected);
  export const getSelectedProject       = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.getSelectedProject);
  export const getSelectedProjectOption = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.getSelectedProjectOption);

  /** Samples selectors */
  export const getSampleByID       = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectByID);
  export const getSampleByLinkUUID = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectByLinkUUID);
  export const getSamplesIDs       = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectIds);
  export const getSampleEntities   = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectEntities);
  export const getSamplesCount     = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectTotal);
  export const getSamples          = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectAll);

  /** Samples loading info selectors */
  export const getSamplesLoadingInfoForAll     = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.getLoadingInfoForAll);
  export const getSamplesLoadingInfoForProject = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.getLoadingInfoForProject);
  export const isSamplesLoadingForProject      = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.isLoadingForProject);
  export const isSamplesLoadedForProject       = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.isLoadedForProject);
  export const isSamplesLoadFailedForProject   = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.isLoadFailedProject);

  /** Samples for project selectors */
  export const getSamplesForProject = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectForProject);

}
