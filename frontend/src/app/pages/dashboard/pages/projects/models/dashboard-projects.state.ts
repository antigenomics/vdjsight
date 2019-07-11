import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { __fromProjectsReducers } from 'pages/dashboard/pages/projects/models/projects/projects.reducers';
import { __fromProjectsListState, __ProjectsListState } from 'pages/dashboard/pages/projects/models/projects/projects.state';

interface __DashboardProjectsState { // tslint:disable-line:class-name
  list: __ProjectsListState;
}

export const DashboardProjectsModuleReducers = {
  list: __fromProjectsReducers.reducer
};

export interface DashboardProjectsModuleState extends RootModuleState {
  projects: __DashboardProjectsState;
}

export namespace fromDashboardProjects {

  /** Main dashboard module selectors */
  const selectDashboardModuleState             = createFeatureSelector<__DashboardProjectsState>('projects');
  const selectDashboardModuleProjectsListState = createSelector(selectDashboardModuleState, (state) => state.list);

  /** Projects selectors */
  export const isProjectsLoading        = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.isLoading);
  export const isProjectsLoaded         = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.isLoaded);
  export const isProjectsLoadFailed     = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.isLoadFailed);
  export const getProjectByID           = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectByID);
  export const getProjectByLinkUUID     = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectByLinkUUID);
  export const getProjectsIDs           = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectIds);
  export const getProjectEntities       = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectEntities);
  export const getAllProjects           = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectAll);
  export const getProjectsCount         = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.selectTotal);
  export const isSomeProjectSelected    = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.isSomeProjectSelected);
  export const getSelectedProject       = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.getSelectedProject);
  export const getSelectedProjectOption = createSelector(selectDashboardModuleProjectsListState, __fromProjectsListState.getSelectedProjectOption);

}

