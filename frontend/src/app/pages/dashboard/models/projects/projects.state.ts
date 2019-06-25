import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

interface __ProjectStateInner { // tslint:disable-line:class-name
  loading: boolean;
  loaded: boolean;
  loadFailed: boolean;
  highlightedProjectID?: number;
}

export type __ProjectsState = EntityState<ProjectEntity> & __ProjectStateInner;

export const ProjectsStateAdapter = createEntityAdapter<ProjectEntity>({
  selectId: (project) => project.id
});

export namespace __fromProjectsState {

  export const initial = ProjectsStateAdapter.getInitialState<__ProjectStateInner>({
    loading:    false,
    loaded:     false,
    loadFailed: false
  });

  export const isLoading    = (state: __ProjectsState) => state.loading;
  export const isLoaded     = (state: __ProjectsState) => state.loaded;
  export const isLoadFailed = (state: __ProjectsState) => state.loadFailed;
  export const selectByID   = (state: __ProjectsState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = ProjectsStateAdapter.getSelectors();

  export const isSomeProjectHighlighted = (state: __ProjectsState) => state.highlightedProjectID !== undefined;
  export const getHighlightedProjectID  = (state: __ProjectsState) => state.highlightedProjectID;
  export const getHighlightedProject    = (state: __ProjectsState) => {
    if (state.highlightedProjectID !== undefined) {
      return selectByID(state, { id: getHighlightedProjectID(state) });
    }
    return undefined;
  };

}
