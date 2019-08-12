import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CreateProjectEntityFromLink, ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { __fromDashboardProjectsState, __ProjectsState, ProjectsStateAdapter } from 'pages/dashboard/models/projects/projects.state';
import { StateLoadingStatus } from 'utils/state/state';

const projectsReducer = createReducer(
  __fromDashboardProjectsState.initial,

  /** Load actions */
  on(ProjectsActions.loadStart, (state) => produce(state, (draft) => {
    draft.status = StateLoadingStatus.Loading();
  })),
  on(ProjectsActions.loadSuccess, (state, { projects }) => {
    return ProjectsStateAdapter.addAll(projects.map(CreateProjectEntityFromLink), produce(state, (draft) => {
      draft.status = StateLoadingStatus.Loaded();
    }));
  }),
  on(ProjectsActions.loadFailed, (state, { error }) => produce(state, (draft) => {
    draft.status = StateLoadingStatus.LoadFailed(error.error);
  })),

  /** Create actions */
  on(ProjectsActions.create, (state, { entity }) => {
    return ProjectsStateAdapter.addOne(entity, state);
  }),
  on(ProjectsActions.createSuccess, (state, { entityId, link }) => {
    return ProjectsStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        creating: { active: false }
      }
    }, state);
  }),
  on(ProjectsActions.createFailed, (state, { entityId, error }) => {
    return ProjectsStateAdapter.updateOne({
      id: entityId, changes: {
        creating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Update actions */
  on(ProjectsActions.update, (state, { entity }) => {
    return ProjectsStateAdapter.updateOne({
      id: entity.id, changes: {
        updating: { active: true }
      }
    }, state);
  }),
  on(ProjectsActions.updateSuccess, (state, { entityId, link }) => {
    return ProjectsStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        updating: { active: false }
      }
    }, state);
  }),
  on(ProjectsActions.updateFailed, (state, { entityId, error }) => {
    return ProjectsStateAdapter.updateOne({
      id: entityId, changes: {
        updating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Force delete actions */
  on(ProjectsActions.forceDelete, (state, { entity }) => {
    return ProjectsStateAdapter.updateOne({
      id: entity.id, changes: {
        deleting: { active: true }
      }
    }, state);
  }),
  on(ProjectsActions.forceDeleteSuccess, (state, { entityId }) => {
    return ProjectsStateAdapter.removeOne(entityId, state);
  }),
  on(ProjectsActions.forceDeleteFailed, (state, { entityId, error }) => {
    return ProjectsStateAdapter.updateOne({
      id: entityId, changes: {
        deleting: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Failed discard actions */
  on(ProjectsActions.failedDiscard, (state, { entity }) => {
    return ProjectEntity.isEntityCreateFailed(entity) ? ProjectsStateAdapter.removeOne(entity.id, state) : state;
  }),

  /** Preview actions */
  on(ProjectsActions.previewProject, (state, { entityId }) => produce(state, (draft) => {
    draft.previewID = entityId;
  })),
  on(ProjectsActions.clearProjectPreview, (state) => produce(state, (draft) => {
    draft.previewID = undefined;
  })),

  /** Select actions */
  on(ProjectsActions.selectProject, (state, { entityId }) => produce(state, (draft) => {
    draft.selectedID = entityId;
  })),
  on(ProjectsActions.clearProjectSelection, (state) => produce(state, (draft) => {
    draft.selectedID = undefined;
  })),

  /** Clear action */
  on(ProjectsActions.clear, (state) => {
    return ProjectsStateAdapter.removeAll(produce(state, (draft) => {
      draft.status     = StateLoadingStatus.Initial();
      draft.previewID  = undefined;
      draft.selectedID = undefined;
    }));
  })
);

export namespace __fromProjectsReducers {

  export function reducer(state: __ProjectsState | undefined, action: Action) {
    return projectsReducer(state, action);
  }

}
