import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CreateSampleFileEntityFromLink, SampleEntity } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { __fromDashboardSamplesState, __SamplesState, SamplesStateAdapter } from 'pages/dashboard/models/samples/samples.state';
import selectForProject = __fromDashboardSamplesState.selectForProject;

const sampleFilesReducer = createReducer(
  __fromDashboardSamplesState.initial,

  /** Load actions */
  on(SamplesActions.loadStart, (state, { projectLinkUUID }) => {
    return SamplesStateAdapter.removeMany(selectForProject(state, { projectLinkUUID }).map((s) => s.id), produce(state, (draft) => {
      draft.loadingInfo[ projectLinkUUID ] = {
        loading:    true,
        loaded:     false,
        loadFailed: false
      };
    }));
  }),
  on(SamplesActions.loadSuccess, (state, { samples, projectLinkUUID }) => {
    return SamplesStateAdapter.addMany(samples.map((s) => CreateSampleFileEntityFromLink(projectLinkUUID, s)
    ), produce(state, (draft) => {
      draft.loadingInfo[ projectLinkUUID ] = {
        loading:    false,
        loaded:     true,
        loadFailed: false
      };
    }));
  }),
  on(SamplesActions.loadFailed, (state, { projectLinkUUID }) => produce(state, (draft) => {
    draft.loadingInfo[ projectLinkUUID ] = {
      loading:    false,
      loaded:     false,
      loadFailed: true
    };
  })),

  /** Create actions */
  on(SamplesActions.create, (state, { entity }) => {
    return SamplesStateAdapter.addOne(entity, state);
  }),
  on(SamplesActions.createSuccess, (state, { entityId, link }) => {
    return SamplesStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        creating: { active: false }
      }
    }, state);
  }),
  on(SamplesActions.createFailed, (state, { entityId, error }) => {
    return SamplesStateAdapter.updateOne({
      id: entityId, changes: {
        creating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Update actions */
  on(SamplesActions.update, (state, { entity }) => {
    return SamplesStateAdapter.updateOne({
      id: entity.id, changes: {
        updating: { active: true }
      }
    }, state);
  }),
  on(SamplesActions.updateSuccess, (state, { entityId, link }) => {
    return SamplesStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        updating: { active: false }
      }
    }, state);
  }),
  on(SamplesActions.updateFailed, (state, { entityId, error }) => {
    return SamplesStateAdapter.updateOne({
      id: entityId, changes: {
        updating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Force delete actions */
  on(SamplesActions.forceDelete, (state, { entity }) => {
    return SamplesStateAdapter.updateOne({
      id: entity.id, changes: {
        deleting: { active: true }
      }
    }, state);
  }),
  on(SamplesActions.forceDeleteSuccess, (state, { entity }) => {
    return SamplesStateAdapter.removeOne(entity.id, state);
  }),
  on(SamplesActions.forceDeleteFailed, (state, { entityId, error }) => {
    return SamplesStateAdapter.updateOne({
      id: entityId, changes: {
        deleting: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Failed discard actions */
  on(SamplesActions.failedDiscard, (state, { entity }) => {
    return SampleEntity.isEntityCreateFailed(entity) ? SamplesStateAdapter.removeOne(entity.id, state) : state;
  }),

  /** Clear actions */
  on(SamplesActions.clear, (state) => {
    return SamplesStateAdapter.removeAll(produce(state, (draft) => {
      draft.loadingInfo = {};
    }));
  })
);

export namespace __fromSampleFilesReducers {

  export function reducer(state: __SamplesState | undefined, action: Action) {
    return sampleFilesReducer(state, action);
  }

}
