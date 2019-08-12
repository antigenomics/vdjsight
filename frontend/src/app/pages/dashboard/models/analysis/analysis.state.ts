import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { AnalysisEntity, AnalysisType } from 'pages/dashboard/models/analysis/analysis';

interface __AnalysisStateInner { // tslint:disable-line:class-name no-empty-interface

}

export type __AnalysisState = EntityState<AnalysisEntity> & __AnalysisStateInner;

export const AnalysisStateAdapter = createEntityAdapter<AnalysisEntity>({
  selectId: (analysis) => analysis.id
});

export namespace __fromDashboardAnalysisState {

  export const initial = AnalysisStateAdapter.getInitialState<__AnalysisStateInner>({});

  export const selectByID = (state: __AnalysisState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = AnalysisStateAdapter.getSelectors();

  export const selectForProject = (state: __AnalysisState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((a) => a.projectLinkUUID === props.projectLinkUUID);

  export const selectForProjectAndSample = (state: __AnalysisState, props: { projectLinkUUID: string, sampleLinkUUID: string }) =>
    selectAll(state).filter((a) => a.projectLinkUUID === props.projectLinkUUID && a.sampleLinkUUID === props.sampleLinkUUID);

  export const selectForProjectAndSampleWithType = (state: __AnalysisState, props: { projectLinkUUID: string, sampleLinkUUID: string, type: AnalysisType }) =>
    selectAll(state).find((a) => a.projectLinkUUID === props.projectLinkUUID && a.sampleLinkUUID === props.sampleLinkUUID && a.analysisType === props.type);
}
