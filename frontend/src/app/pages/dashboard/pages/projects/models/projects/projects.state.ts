import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ProjectEntity } from 'pages/dashboard/pages/projects/models/projects/projects';

interface __ProjectListStateInner { // tslint:disable-line:class-name
  loading: boolean;
  loaded: boolean;
  loadFailed: boolean;
  selectedID?: number;
}

export type __ProjectsListState = EntityState<ProjectEntity> & __ProjectListStateInner;

export const ProjectsListStateAdapter = createEntityAdapter<ProjectEntity>({
  selectId: (project) => project.id
});

export namespace __fromProjectsListState {

  export const initial = ProjectsListStateAdapter.getInitialState<__ProjectListStateInner>({
    loading:    false,
    loaded:     false,
    loadFailed: false
  });

  export const isLoading    = (state: __ProjectsListState) => state.loading;
  export const isLoaded     = (state: __ProjectsListState) => state.loaded;
  export const isLoadFailed = (state: __ProjectsListState) => state.loadFailed;
  export const selectByID   = (state: __ProjectsListState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = ProjectsListStateAdapter.getSelectors();

  export const selectByLinkUUID = (state: __ProjectsListState, props: { linkUUID: string }) =>
    selectAll(state).find((p) => p.link !== undefined && p.link.uuid === props.linkUUID);

  export const isSomeProjectSelected    = (state: __ProjectsListState) => state.selectedID !== undefined && state.entities[ state.selectedID ] !== undefined;
  export const getSelectedProject       = (state: __ProjectsListState) => state.selectedID !== undefined ? state.entities[ state.selectedID ] : undefined;
  export const getSelectedProjectOption = (state: __ProjectsListState) => {
    return { isDefined: isSomeProjectSelected(state), get: getSelectedProject(state) };
  };

}
