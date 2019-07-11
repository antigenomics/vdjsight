import { Action, createReducer, on } from '@ngrx/store';
import { CreateEmptyUploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { __fromDashboardProjectUploadsState, __UploadsState, UploadsStateAdapter } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';

const uploadsReducer = createReducer(
  __fromDashboardProjectUploadsState.initial,
  on(ProjectUploadsActions.add, (state, { projectLinkUUID }) => {
    return UploadsStateAdapter.addOne(CreateEmptyUploadEntity(projectLinkUUID), state);
  }),
  on(ProjectUploadsActions.remove, (state, { entity }) => {
    return UploadsStateAdapter.removeOne(entity.id, state);
  })
);

export namespace __fromDashboardProjectUploadsReducers {

  export function reducer(state: __UploadsState | undefined, action: Action) {
    return uploadsReducer(state, action);
  }

}
