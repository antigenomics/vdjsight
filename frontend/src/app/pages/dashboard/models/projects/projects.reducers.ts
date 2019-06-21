import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CreateProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { __fromProjectsState, __ProjectsState, ProjectsStateAdapter } from 'pages/dashboard/models/projects/projects.state';

const projectsReducer = createReducer(
  __fromProjectsState.initial,

  /** Load actions */
  on(ProjectsActions.loadStart, (state) => produce(state, (draft) => {
    draft.loading    = true;
    draft.loaded     = false;
    draft.loadFailed = false;
  })),
  on(ProjectsActions.loadSuccess, (state, { projects }) => {
    return ProjectsStateAdapter.addAll(projects.map(CreateProjectEntity), produce(state, (draft) => {
      draft.loading    = false;
      draft.loaded     = true;
      draft.loadFailed = false;
    }));
  }),
  on(ProjectsActions.loadFailed, (state) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = false;
    draft.loadFailed = true;
  })),

  /** Create actions */
  on(ProjectsActions.create, (state, { entity }) => {
    return ProjectsStateAdapter.addOne(entity, state);
  }),
  on(ProjectsActions.createSuccess, (state, { entity, link }) => {
    return ProjectsStateAdapter.updateOne({ id: entity.id, changes: { link } }, state);
  }),
  on(ProjectsActions.createFailed, (state, { entity }) => {
    return ProjectsStateAdapter.updateOne({ id: entity.id, changes: { isRejected: true } }, state);
  })
);

export namespace __fromProjectsReducers {

  export function reducer(state: __ProjectsState | undefined, action: Action) {
    return projectsReducer(state, action);
  }
}
