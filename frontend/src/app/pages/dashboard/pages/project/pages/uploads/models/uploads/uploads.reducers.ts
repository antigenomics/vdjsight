import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { __fromDashboardProjectUploadsState, __UploadsState, UploadsStateAdapter } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';

const uploadsReducer = createReducer(
  __fromDashboardProjectUploadsState.initial,
  on(ProjectUploadsActions.add, (state, { entityId, projectLinkUUID, name, extension, software, size }) => {
    return UploadsStateAdapter.addOne({
      id:              entityId,
      projectLinkUUID: projectLinkUUID,
      name:            name,
      extension:       extension,
      size:            size,
      software:        software,
      uploading:       false,
      progress:        0,
      uploaded:        false
    }, state);
  }),
  on(ProjectUploadsActions.update, (state, { entityId, changes }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: changes
    }, state);
  }),
  on(ProjectUploadsActions.checked, (state, { entityId, warning }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: { warning }
    }, state);
  }),
  on(ProjectUploadsActions.globalChecked, (state, { warnings, errors }) => produce(state, (draft) => {
    draft.globalWarnings = warnings;
    draft.globalErrors   = errors;
  })),
  on(ProjectUploadsActions.uploadStart, (state, { entityId }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: { uploading: true, uploaded: false, progress: 0 }
    }, state);
  }),
  on(ProjectUploadsActions.uploadProgress, (state, { entityId, progress }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: { uploading: true, uploaded: false, progress: progress }
    }, state);
  }),
  on(ProjectUploadsActions.uploadSuccess, (state, { entityId }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: { uploading: false, uploaded: true, progress: 100 }
    }, state);
  }),
  on(ProjectUploadsActions.uploadFailed, (state, { entityId, error }) => {
    return UploadsStateAdapter.updateOne({
      id:      entityId,
      changes: { uploading: false, uploaded: false, progress: 0, error: error.error }
    }, state);
  }),
  on(ProjectUploadsActions.remove, (state, { entityId }) => {
    return UploadsStateAdapter.removeOne(entityId, state);
  })
);


export namespace __fromDashboardProjectUploadsReducers {

  export function reducer(state: __UploadsState | undefined, action: Action) {
    return uploadsReducer(state, action);
  }

}
