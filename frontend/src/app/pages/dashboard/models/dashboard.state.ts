import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromProjectsReducers } from 'pages/dashboard/models/projects/projects.reducers';
import { __fromProjectsState, __ProjectsState } from 'pages/dashboard/models/projects/projects.state';

interface __DashboardState { // tslint:disable-line:class-name
  projects: __ProjectsState;
}

export const DashboardModuleReducers = {
  projects: __fromProjectsReducers.reducer
};

export interface DashboardModuleState extends RootModuleState {
  dashboard: __DashboardState;
}

export namespace fromDashboard {

  /** Main dashboard module selectors */
  const selectDashboardModuleState         = createFeatureSelector<__DashboardState>('dashboard');
  const selectDashboardModuleProjectsState = createSelector(selectDashboardModuleState, (state) => state.projects);

  /** Projects selectors */
  export const isProjectsLoading        = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoading);
  export const isProjectsLoaded         = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoaded);
  export const isProjectsLoadFailed     = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isLoadFailed);
  export const getProjectByID           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectByID);
  export const getProjectsIDs           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectIds);
  export const getProjectEntities       = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectEntities);
  export const getAllProjects           = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectAll);
  export const getProjectsCount         = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.selectTotal);
  export const isSomeProjectSelected    = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.isSomeProjectSelected);
  export const getSelectedProject       = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.getSelectedProject);
  export const getSelectedProjectOption = createSelector(selectDashboardModuleProjectsState, __fromProjectsState.getSelectedProjectOption);

}

