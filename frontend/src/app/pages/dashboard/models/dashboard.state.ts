import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootModuleState } from 'models/root';
import { AnalysisClonotypesEntity, AnalysisEntity, AnalysisType } from 'pages/dashboard/models/analysis/analysis';
import { __fromAnalysisReducers } from 'pages/dashboard/models/analysis/analysis.reducers';
import { __AnalysisState, __fromDashboardAnalysisState } from 'pages/dashboard/models/analysis/analysis.state';
import { __fromProjectsReducers } from 'pages/dashboard/models/projects/projects.reducers';
import { __fromDashboardProjectsState, __ProjectsState } from 'pages/dashboard/models/projects/projects.state';
import { __fromSampleFilesReducers } from 'pages/dashboard/models/samples/samples.reducers';
import { __fromDashboardSamplesState, __SamplesState } from 'pages/dashboard/models/samples/samples.state';

interface __DashboardState { // tslint:disable-line:class-name
  projects: __ProjectsState;
  samples: __SamplesState;
  analysis: __AnalysisState;
}

export const DashboardModuleReducers = {
  projects: __fromProjectsReducers.reducer,
  samples:  __fromSampleFilesReducers.reducer,
  analysis: __fromAnalysisReducers.reducer
};

export interface DashboardModuleState extends RootModuleState {
  dashboard: __DashboardState;
}

export namespace fromDashboard {

  /** Main dashboard module selectors */
  const selectDashboardModuleState         = createFeatureSelector<__DashboardState>('dashboard');
  const selectDashboardModuleProjectsState = createSelector(selectDashboardModuleState, (state) => state.projects);
  const selectDashboardSamplesState        = createSelector(selectDashboardModuleState, (state) => state.samples);
  const selectDashboardAnalysisState       = createSelector(selectDashboardModuleState, (state) => state.analysis);

  /** Projects selectors */
  export const getProjectsLoadingStatus = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.getLoadingState);
  export const getProjectByID           = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectByID);
  export const getProjectByLinkUUID     = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectByLinkUUID);
  export const getProjectsIDs           = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectIds);
  export const getProjectEntities       = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectEntities);
  export const getAllProjects           = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectAll);
  export const getProjectsCount         = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.selectTotal);
  export const isSomeProjectPreviewing  = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.isSomeProjectPreviewing);
  export const getPreviewingProject     = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.getPreviewingProject);
  export const isSomeProjectSelected    = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.isSomeSelected);
  export const getSelectedProjectUUID   = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.getSelectedUUID);
  export const getSelectedProject       = createSelector(selectDashboardModuleProjectsState, __fromDashboardProjectsState.getSelected);

  /** Selected project info selectors */
  export const getSelectedProjectInfo                  = createSelector(getSelectedProject, (selected) => selected !== undefined ? selected.link : undefined);
  export const isUploadAllowedForSelectedProject       = createSelector(getSelectedProjectInfo, (info) => info ? info.isUploadAllowed : false);
  export const isDeleteAllowedForSelectedProject       = createSelector(getSelectedProjectInfo, (info) => info ? info.isDeleteAllowed : false);
  export const isModificationAllowedForSelectedProject = createSelector(getSelectedProjectInfo, (info) => info ? info.isModificationAllowed : false);

  /** Samples selectors */
  export const getSamplesLoadingStatus = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.getLoadingState);
  export const getSampleByID           = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectByID);
  export const getSampleByLinkUUID     = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectByLinkUUID);
  export const getSamplesIDs           = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectIds);
  export const getSampleEntities       = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectEntities);
  export const getSamplesCount         = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectTotal);
  export const getSamples              = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectAll);
  export const getSamplesForProject    = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.selectForProject);
  export const isSomeSampleSelected    = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.isSomeSelected);
  export const getSelectedSampleUUID   = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.getSelectedUUID);
  export const getSelectedSample       = createSelector(selectDashboardSamplesState, __fromDashboardSamplesState.getSelected);

  export const getSamplesForSelectedProject = createSelector(getSelectedProjectUUID, getSamples,
    (selectedProjectLinkUUID, samples) => samples.filter((s) => s.projectLinkUUID === selectedProjectLinkUUID)
  );

  /** Analysis selectors */
  export const getAnalysisByID                        = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectByID);
  export const getAnalysisIDs                         = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectIds);
  export const getAnalysisEntities                    = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectEntities);
  export const getAnalysisCount                       = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectTotal);
  export const getAnalysis                            = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectAll);
  export const getAnalysisForProject                  = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectForProject);
  export const getAnalysisForProjectAndSample         = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectForProjectAndSample);
  export const getAnalysisForProjectAndSampleWithType = createSelector(selectDashboardAnalysisState, __fromDashboardAnalysisState.selectForProjectAndSampleWithType);

  export const getAnalysisForSelectedSampleWithType = createSelector(getSelectedProjectUUID, getSelectedSampleUUID, getAnalysis,
    (selectedProjectLinkUUID: string, selectedSampleLinkUUID: string, analysis: AnalysisEntity[], props: { type: AnalysisType }) =>
      analysis.find((a) =>
        a.projectLinkUUID === selectedProjectLinkUUID && a.sampleLinkUUID === selectedSampleLinkUUID && a.analysisType === props.type
      ));

  export const getClonotypesAnalysisForSelectedSample = createSelector(getSelectedProjectUUID, getSelectedSampleUUID, getAnalysis,
    (selectedProjectLinkUUID: string, selectedSampleLinkUUID: string, analysis: AnalysisEntity[]): AnalysisClonotypesEntity =>
      analysis.find((a) =>
        a.projectLinkUUID === selectedProjectLinkUUID && a.sampleLinkUUID === selectedSampleLinkUUID && a.analysisType === AnalysisType.CLONOTYPES
      ) as AnalysisClonotypesEntity | undefined);

}
