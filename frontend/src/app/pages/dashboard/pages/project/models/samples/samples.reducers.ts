import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CreateSampleFileEntityFromLink } from 'pages/dashboard/pages/project/models/samples/samples';
import { SampleFilesActions } from 'pages/dashboard/pages/project/models/samples/samples.actions';
import { __fromDashboardSampleFilesState, __SampleFilesState, SampleFilesStateAdapter } from 'pages/dashboard/pages/project/models/samples/samples.state';

const sampleFilesReducer = createReducer(
  __fromDashboardSampleFilesState.initial,

  /** Load actions */
  on(SampleFilesActions.loadStart, (state) => produce(state, (draft) => {
    draft.loading    = true;
    draft.loaded     = false;
    draft.loadFailed = false;
  })),
  on(SampleFilesActions.loadSuccess, (state, { samples }) => {
    return SampleFilesStateAdapter.addAll(samples.map(CreateSampleFileEntityFromLink), produce(state, (draft) => {
      draft.loading    = false;
      draft.loaded     = true;
      draft.loadFailed = false;
    }));
  }),
  on(SampleFilesActions.loadFailed, (state) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = false;
    draft.loadFailed = true;
  })),

  /** Create actions */
  on(SampleFilesActions.create, (state, { entity }) => {
    return SampleFilesStateAdapter.addOne(entity, state);
  }),
  on(SampleFilesActions.createSuccess, (state, { entityId, link }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        creating: { active: false }
      }
    }, state);
  }),
  on(SampleFilesActions.createFailed, (state, { entityId, error }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entityId, changes: {
        creating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Update actions */
  on(SampleFilesActions.update, (state, { entity }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entity.id, changes: {
        updating: { active: true }
      }
    }, state);
  }),
  on(SampleFilesActions.updateSuccess, (state, { entityId, link }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entityId, changes: {
        link:     link,
        updating: { active: false }
      }
    }, state);
  }),
  on(SampleFilesActions.updateFailed, (state, { entityId, error }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entityId, changes: {
        updating: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Force delete actions */
  on(SampleFilesActions.forceDelete, (state, { entity }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entity.id, changes: {
        deleting: { active: true }
      }
    }, state);
  }),
  on(SampleFilesActions.forceDeleteSuccess, (state, { entityId }) => {
    return SampleFilesStateAdapter.removeOne(entityId, state);
  }),
  on(SampleFilesActions.forceDeleteFailed, (state, { entityId, error }) => {
    return SampleFilesStateAdapter.updateOne({
      id: entityId, changes: {
        deleting: { active: false, error: error.error }
      }
    }, state);
  }),

  /** Select actions */
  on(SampleFilesActions.selectSample, (state, { entityId }) => produce(state, (draft) => {
    draft.selectedID = entityId;
  })),
  on(SampleFilesActions.clearSampleSelection, (state) => produce(state, (draft) => {
    draft.selectedID = undefined;
  })),

  /** Clear actions */
  on(SampleFilesActions.clear, (state) => {
    return SampleFilesStateAdapter.removeAll(produce(state, (draft) => {
      draft.selectedID = undefined;
      draft.loading    = false;
      draft.loaded     = false;
      draft.loadFailed = false;
    }));
  })
);

export namespace __fromSampleFilesReducers {

  export function reducer(state: __SampleFilesState | undefined, action: Action) {
    return sampleFilesReducer(state, action);
  }

}
