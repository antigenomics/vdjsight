import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

interface __UploadsStateInner { // tslint:disable-line:class-name no-empty-interface

}

export type __UploadsState = EntityState<UploadEntity> & __UploadsStateInner;

export const UploadsStateAdapter = createEntityAdapter<UploadEntity>({
  selectId: (upload) => upload.id
});

export namespace __fromDashboardProjectUploadsState {

  export const initial = UploadsStateAdapter.getInitialState<__UploadsStateInner>({});

  export const { selectIds, selectEntities, selectAll, selectTotal } = UploadsStateAdapter.getSelectors();

  export const selectForProject = (state: __UploadsState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((u) => u.projectLinkUUID === props.projectLinkUUID);

}
