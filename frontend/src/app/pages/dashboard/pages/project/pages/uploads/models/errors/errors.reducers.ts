import { Action, createReducer, on } from '@ngrx/store';
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
  on(ProjectUploadErrorsActions.update, (state, { errorId, errors }) => {
    return UploadErrorsStateAdapter.updateOne({ id: errorId, changes: { errors } }, state);
  }),
  on(ProjectUploadErrorsActions.remove, (state, { errorId }) => {
    return UploadErrorsStateAdapter.removeOne(errorId, state);
  })
);

export namespace __fromDashboardProjectUploadErrorsReducers {

  export function reducer(state: __UploadErrorsState | undefined, action: Action) {
    return uploadErrorsReducer(state, action);
  }

}
