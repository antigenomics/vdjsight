import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

interface __SamplesStateInner { // tslint:disable-line:class-name
  loadingInfo: {
    [ projectLinkUUID: string ]: {
      loading: boolean;
      loaded: boolean;
      loadFailed: boolean;
    }
  };
}

export type __SamplesState = EntityState<SampleEntity> & __SamplesStateInner;

export const SamplesStateAdapter = createEntityAdapter<SampleEntity>({
  selectId: (sample) => sample.id
});

export namespace __fromDashboardSamplesState {

  export const initial = SamplesStateAdapter.getInitialState<__SamplesStateInner>({
    loadingInfo: {}
  });

  export const getLoadingInfoForAll = (state: __SamplesState) => state.loadingInfo;

  export const getLoadingInfoForProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    state.loadingInfo[ props.projectLinkUUID ];

  export const isLoadingForProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    state.loadingInfo[ props.projectLinkUUID ] !== undefined ?
    state.loadingInfo[ props.projectLinkUUID ].loading : false;

  export const isLoadedForProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    state.loadingInfo[ props.projectLinkUUID ] !== undefined ?
    state.loadingInfo[ props.projectLinkUUID ].loaded : false;

  export const isLoadFailedProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    state.loadingInfo[ props.projectLinkUUID ] !== undefined ?
    state.loadingInfo[ props.projectLinkUUID ].loadFailed : false;

  export const selectByID = (state: __SamplesState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = SamplesStateAdapter.getSelectors();

  export const selectByLinkUUID = (state: __SamplesState, props: { linkUUID: string }) =>
    selectAll(state).find((s) => s.link !== undefined && s.link.uuid === props.linkUUID);

  export const selectForProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((s) => s.projectLinkUUID === props.projectLinkUUID);

}
