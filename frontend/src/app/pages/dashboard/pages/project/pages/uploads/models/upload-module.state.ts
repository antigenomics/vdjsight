import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardProjectModuleState } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { __fromDashboardProjectUploadErrorsReducers } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.reducers';
import { __fromDashboardProjectUploadErrorsState, __UploadErrorsState } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.state';
import { __fromDashboardProjectUploadsReducers } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.reducers';
import { __fromDashboardProjectUploadsState, __UploadsState } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';

interface __DashboardProjectUploadState { // tslint:disable-line:class-name
  list: __UploadsState;
  errors: __UploadErrorsState;
}

export const DashboardProjectUploadModuleReducers = {
  list:   __fromDashboardProjectUploadsReducers.reducer,
  errors: __fromDashboardProjectUploadErrorsReducers.reducer
};

export interface DashboardProjectUploadModuleState extends DashboardProjectModuleState {
  uploads: __DashboardProjectUploadState;
}

export namespace fromDashboardProjectUploads {

  /** Main dashboard project uploads module selectors */
  const selectDashboardProjectUploadsModuleState       = createFeatureSelector<__DashboardProjectUploadState>('uploads');
  const selectDashboardProjectUploadsModuleListState   = createSelector(selectDashboardProjectUploadsModuleState, (state) => state.list);
  const selectDashboardProjectUploadsModuleErrorsState = createSelector(selectDashboardProjectUploadsModuleState, (state) => state.errors);

  /** Uploads list selectors */
  export const getUploadsIDs        = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectIds);
  export const getUploadEntities    = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectEntities);
  export const getAllUploads        = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectAll);
  export const getUploadsCount      = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectTotal);
  export const getUploadsForProject = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectForProject);

  /** Uploads list errors selectors */
  export const getUploadErrorsIDs       = createSelector(selectDashboardProjectUploadsModuleErrorsState, __fromDashboardProjectUploadErrorsState.selectIds);
  export const getUploadErrorEntities   = createSelector(selectDashboardProjectUploadsModuleErrorsState, __fromDashboardProjectUploadErrorsState.selectEntities);
  export const getAllUploadErrors       = createSelector(selectDashboardProjectUploadsModuleErrorsState, __fromDashboardProjectUploadErrorsState.selectAll);
  export const getUploadErrorsCount     = createSelector(selectDashboardProjectUploadsModuleErrorsState, __fromDashboardProjectUploadErrorsState.selectTotal);
  export const getErrorsForUploadEntity = createSelector(selectDashboardProjectUploadsModuleErrorsState, __fromDashboardProjectUploadErrorsState.selectForUploadEntity);

}
