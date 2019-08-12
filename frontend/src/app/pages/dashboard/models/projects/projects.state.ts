import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { StateLoadingStatus } from 'utils/state/state';

interface __ProjectsStateInner { // tslint:disable-line:class-name
  status: StateLoadingStatus;
  previewID?: number;
  selectedUUID?: string;
}

export type __ProjectsState = EntityState<ProjectEntity> & __ProjectsStateInner;

export const ProjectsStateAdapter = createEntityAdapter<ProjectEntity>({
  selectId: (project) => project.id
});

export namespace __fromDashboardProjectsState {

  export const initial = ProjectsStateAdapter.getInitialState<__ProjectsStateInner>({
    status: StateLoadingStatus.Initial()
  });

  export const getLoadingState = (state: __ProjectsState) => state.status;

  export const selectByID = (state: __ProjectsState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = ProjectsStateAdapter.getSelectors();

  export const selectByLinkUUID = (state: __ProjectsState, props: { linkUUID: string }) =>
    selectAll(state).find((p) => p.link !== undefined && p.link.uuid === props.linkUUID);

  export const isSomeProjectPreviewing = (state: __ProjectsState) => state.previewID !== undefined && state.entities[ state.previewID ] !== undefined;
  export const getPreviewingProject    = (state: __ProjectsState) => state.previewID !== undefined ? state.entities[ state.previewID ] : undefined;

  export const isSomeSelected  = (state: __ProjectsState) => state.selectedUUID !== undefined;
  export const getSelectedUUID = (state: __ProjectsState) => state.selectedUUID;
  export const getSelected     = (state: __ProjectsState) => selectAll(state).find((p) => p.link !== undefined && p.link.uuid === state.selectedUUID);
}
