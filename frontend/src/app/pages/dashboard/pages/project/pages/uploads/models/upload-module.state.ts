import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
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
  export const getUploadsIDs       = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectIds);
  export const getUploadEntities   = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectEntities);
  export const getAllUploads       = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectAll);
  export const getUploadsCount     = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectTotal);
  export const getUploadByID       = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectByID);
  export const getUploadBySampleID = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectBySampleID);
  export const getGlobalErrors     = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.getGlobalErrors);
  export const getGlobalWarnings   = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.getGlobalWarnings);

  export const isGlobalErrorsEmpty   = createSelector(getGlobalErrors, (errors) => errors.length === 0);
  export const isGlobalWarningsEmpty = createSelector(getGlobalWarnings, (warnings) => warnings.length === 0);

  export const isGlobalErrorsNotEmpty   = createSelector(getGlobalErrors, (errors) => errors.length !== 0);
  export const isGlobalWarningsNotEmpty = createSelector(getGlobalWarnings, (warnings) => warnings.length !== 0);

  /** Uploads for project */
  export const getUploadsForProject = createSelector(selectDashboardProjectUploadsModuleListState, __fromDashboardProjectUploadsState.selectForProject);

  export const getUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID)
  );

  /** Uploading Uploads for project */
  export const getUploadingUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => UploadEntity.isEntityUploading(u));
  });

  export const getUploadingUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && UploadEntity.isEntityUploading(u))
  );

  /** Not Uploading Uploads for project */
  export const getNotUploadingUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => !UploadEntity.isEntityUploading(u));
  });

  export const getNotUploadingUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && !UploadEntity.isEntityUploading(u))
  );

  /** Uploaded Uploads for project */
  export const getUploadedUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => UploadEntity.isEntityUploaded(u));
  });

  export const getUploadedUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && UploadEntity.isEntityUploaded(u))
  );

  /** Not Uploaded Uploads for project */
  export const getNotUploadedUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => !UploadEntity.isEntityUploaded(u));
  });

  export const getNotUploadedUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && !UploadEntity.isEntityUploaded(u))
  );

  /** Pending Uploads for project */
  export const getPendingUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => UploadEntity.isEntityPending(u));
  });

  export const getPendingUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && UploadEntity.isEntityPending(u))
  );

  /** Pending and Valid Uploads for project */
  export const getPendingAndValidUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => UploadEntity.isEntityPendingAndValid(u));
  });

  export const getPendingAndValidUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && UploadEntity.isEntityPendingAndValid(u))
  );

  /** Failed Uploads for project */
  export const getFailedUploadsForProject = createSelector(getUploadsForProject, (uploads) => {
    return uploads.filter((u) => UploadEntity.isEntityWithError(u));
  });

  export const getFailedUploadsForCurrentProject = createSelector(fromDashboardProject.getCurrentProjectUUID, getAllUploads,
    (currentProjectUUID, uploads) =>
      uploads.filter((u) => u.projectLinkUUID === currentProjectUUID && UploadEntity.isEntityWithError(u))
  );

}
