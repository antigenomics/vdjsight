import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { __fromCurrentProjectReducers } from 'pages/dashboard/pages/project/models/project/project.reducers';
import { __DashboardCurrentProjectState, __fromDashboardCurrentProjectState } from 'pages/dashboard/pages/project/models/project/project.state';

interface __DashboardProjectState { // tslint:disable-line:class-name
  current: __DashboardCurrentProjectState;
}

export const DashboardProjectModuleReducers = {
  current: __fromCurrentProjectReducers.reducer
};

export interface DashboardProjectModuleState extends DashboardModuleState {
  project: __DashboardProjectState;
}

export namespace fromDashboardProject {

  /** Main dashboard project module selectors */
  const selectDashboardProjectModuleState               = createFeatureSelector<__DashboardProjectState>('project');
  const selectDashboardProjectModuleCurrentProjectState = createSelector(selectDashboardProjectModuleState, (state) => state.current);

  /** Current project selectors */
  export const getCurrentProjectUUID      = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.getCurrentProjectUUID);
  export const isCurrentProjectLoading    = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoading);
  export const isCurrentProjectLoaded     = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoaded);
  export const isCurrentProjectLoadFailed = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.isCurrentProjectLoadFailed);
  export const getCurrentProjectInfo      = createSelector(selectDashboardProjectModuleCurrentProjectState, __fromDashboardCurrentProjectState.getCurrentProjectInfo);


  /** Current project info selectors */
  export const isUploadAllowedForCurrentProject       = createSelector(getCurrentProjectInfo, (info) => info ? info.isUploadAllowed : false);
  export const isDeleteAllowedForCurrentProject       = createSelector(getCurrentProjectInfo, (info) => info ? info.isDeleteAllowed : false);
  export const isModificationAllowedForCurrentProject = createSelector(getCurrentProjectInfo, (info) => info ? info.isModificationAllowed : false);

  export const getSamplesLoadingInfoForCurrentProject = createSelector(getCurrentProjectUUID, fromDashboard.getSamplesLoadingInfoForAll,
    (currentProjectLinkUUID, loadingInfo) => loadingInfo[ currentProjectLinkUUID ]
  );

  export const isSamplesLoadingForCurrentProject    = createSelector(getSamplesLoadingInfoForCurrentProject, (info) => info ? info.loading : false);
  export const isSamplesLoadedForCurrentProject     = createSelector(getSamplesLoadingInfoForCurrentProject, (info) => info ? info.loaded : false);
  export const isSamplesLoadFailedForCurrentProject = createSelector(getSamplesLoadingInfoForCurrentProject, (info) => info ? info.loadFailed : false);

  export const getSamplesForCurrentProject = createSelector(getCurrentProjectUUID, fromDashboard.getSamples,
    (currentProjectLinkUUID, samples) => samples.filter((s) => s.projectLinkUUID === currentProjectLinkUUID)
  );


}
