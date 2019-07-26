import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CreateEmptyUploadErrorEntity } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors';
import { ProjectUploadErrorsActions } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.actions';
import {
  __fromDashboardProjectUploadErrorsState,
  __UploadErrorsState,
  UploadErrorsStateAdapter
} from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.state';

const uploadErrorsReducer = createReducer(
  __fromDashboardProjectUploadErrorsState.initial,
  on(ProjectUploadErrorsActions.add, (state, { uploadId }) => {
    return UploadErrorsStateAdapter.addOne(CreateEmptyUploadErrorEntity(uploadId), state);
  }),
  on(ProjectUploadErrorsActions.update, (state, { errorId, error }) => {
    return UploadErrorsStateAdapter.updateOne({ id: errorId, changes: { error } }, state);
  }),
  on(ProjectUploadErrorsActions.remove, (state, { errorId }) => {
    return UploadErrorsStateAdapter.removeOne(errorId, state);
  }),
  on(ProjectUploadErrorsActions.global, (state, { errors, warnings }) => produce(state, (draft) => {
    draft.errors   = errors;
    draft.warnings = warnings;
  }))
);

export namespace __fromDashboardProjectUploadErrorsReducers {

  export function reducer(state: __UploadErrorsState | undefined, action: Action) {
    return uploadErrorsReducer(state, action);
  }

}
