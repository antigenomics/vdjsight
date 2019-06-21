import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

export interface __ProjectsState extends EntityState<ProjectEntity> { // tslint:disable-line:class-name
  loading: boolean;
  loaded: boolean;
  loadFailed: boolean;
}

export const ProjectsStateAdapter = createEntityAdapter<ProjectEntity>({
  selectId: (project) => project.id
});

export namespace __fromProjectsState {

  export const initial = ProjectsStateAdapter.getInitialState({
    loading:    false,
    loaded:     false,
    loadFailed: false
  });

  export const isLoading    = (state: __ProjectsState) => state.loading;
  export const isLoaded     = (state: __ProjectsState) => state.loaded;
  export const isLoadFailed = (state: __ProjectsState) => state.loadFailed;
  export const selectByID   = (state: __ProjectsState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = ProjectsStateAdapter.getSelectors();

}
