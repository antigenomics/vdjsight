import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { StateLoadingStatus } from 'utils/state/state';

interface __SamplesStateInner { // tslint:disable-line:class-name
  status: StateLoadingStatus;
  selectedUUID?: string;
}

export type __SamplesState = EntityState<SampleEntity> & __SamplesStateInner;

export const SamplesStateAdapter = createEntityAdapter<SampleEntity>({
  selectId: (sample) => sample.id
});

export namespace __fromDashboardSamplesState {

  export const initial = SamplesStateAdapter.getInitialState<__SamplesStateInner>({
    status: StateLoadingStatus.Initial()
  });

  export const getLoadingState = (state: __SamplesState) => state.status;

  export const selectByID = (state: __SamplesState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = SamplesStateAdapter.getSelectors();

  export const selectByLinkUUID = (state: __SamplesState, props: { linkUUID: string }) =>
    selectAll(state).find((s) => s.link !== undefined && s.link.uuid === props.linkUUID);

  export const selectForProject = (state: __SamplesState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((s) => s.projectLinkUUID === props.projectLinkUUID);

  export const isSomeSelected  = (state: __SamplesState) => state.selectedUUID !== undefined;
  export const getSelectedUUID = (state: __SamplesState) => state.selectedUUID;
  export const getSelected     = (state: __SamplesState) => selectAll(state).find((s) => s.link !== undefined && s.link.uuid === state.selectedUUID);
}
