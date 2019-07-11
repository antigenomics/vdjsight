import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardProjectModuleState } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { __fromDashboardProjectUploadsReducers } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.reducers';
import { __fromDashboardProjectUploadsState, __UploadsState } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';

interface __DashboardProjectUploadState { // tslint:disable-line:class-name
  list: __UploadsState;
}

export const DashboardProjectUploadModuleReducers = {
  list: __fromDashboardProjectUploadsReducers.reducer
};

export interface DashboardProjectUploadModuleState extends DashboardProjectModuleState {
  uploads: __DashboardProjectUploadState;
}

export namespace fromDashboardProjectUploads {

  /** Main dashboard project uploads module selectors */
  const selectDashboardProjectUploadsModuleState     = createFeatureSelector<__DashboardProjectUploadState>('uploads');
  const selectDashboardProjectUploadsModuleListState = createSelector(selectDashboardProjectUploadsModuleState, (state) => state.list);

  /** Uploads list selectors */
  export const getUploadsIDs        = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectIds);
  export const getUploadEntities    = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectEntities);
  export const getAllUploads        = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectAll);
  export const getUploadsCount      = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectTotal);
  export const getUploadsForProject = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectForProject);

}
