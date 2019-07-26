import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SampleFileEntity } from 'pages/dashboard/pages/project/models/samples/samples';

interface __SampleFilesStateInner { // tslint:disable-line:class-name
  loading: boolean;
  loaded: boolean;
  loadFailed: boolean;
  selectedID?: number;
}

export type __SampleFilesState = EntityState<SampleFileEntity> & __SampleFilesStateInner;

export const SampleFilesStateAdapter = createEntityAdapter<SampleFileEntity>({
  selectId: (sample) => sample.id
});

export namespace __fromDashboardSampleFilesState {

  export const initial = SampleFilesStateAdapter.getInitialState<__SampleFilesStateInner>({
    loading:    false,
    loaded:     false,
    loadFailed: false
  });

  export const isLoading    = (state: __SampleFilesState) => state.loading;
  export const isLoaded     = (state: __SampleFilesState) => state.loaded;
  export const isLoadFailed = (state: __SampleFilesState) => state.loadFailed;
  export const selectByID   = (state: __SampleFilesState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = SampleFilesStateAdapter.getSelectors();

  export const selectByLinkUUID = (state: __SampleFilesState, props: { linkUUID: string }) =>
    selectAll(state).find((p) => p.link !== undefined && p.link.uuid === props.linkUUID);

  export const selectForProject = (state: __SampleFilesState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((p) => p.link !== undefined && p.link.projectLinkUUID === props.projectLinkUUID);

  export const isSomeSampleSelected    = (state: __SampleFilesState) => state.selectedID !== undefined && state.entities[ state.selectedID ] !== undefined;
  export const getSelectedSample       = (state: __SampleFilesState) => state.selectedID !== undefined ? state.entities[ state.selectedID ] : undefined;
  export const getSelectedSampleOption = (state: __SampleFilesState) => {
    return { isDefined: isSomeSampleSelected(state), get: getSelectedSample(state) };
  };

}
