import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

export const enum UploadGlobalErrors {
  UPLOAD_NOT_ALLOWED             = 'You are not allowed to upload samples in this project',
  MAX_FILES_COUNT_LIMIT_EXCEEDED = 'Max files count limit has been exceeded',
  UPLOAD_HASH_DUPLICATE          = 'You probably have a duplicate samples in the upload list',
  UPLOAD_NAME_DUPLICATE          = 'Duplicate names are not allowed'
}

interface __UploadsStateInner { // tslint:disable-line:class-name no-empty-interface
  globalWarnings: string[];
  globalErrors: string[];
}

export type __UploadsState = EntityState<UploadEntity> & __UploadsStateInner;

export const UploadsStateAdapter = createEntityAdapter<UploadEntity>({
  selectId: (upload) => upload.id
});

export namespace __fromDashboardProjectUploadsState {

  export const initial = UploadsStateAdapter.getInitialState<__UploadsStateInner>({
    globalWarnings: [],
    globalErrors:   []
  });

  export const getGlobalWarnings = (state: __UploadsState) => state.globalWarnings;
  export const getGlobalErrors   = (state: __UploadsState) => state.globalErrors;

  export const { selectIds, selectEntities, selectAll, selectTotal } = UploadsStateAdapter.getSelectors();

  export const selectByID = (state: __UploadsState, props: { id: number }) =>
    selectAll(state).find((u) => u.id === props.id);

  export const selectBySampleID = (state: __UploadsState, props: { sampleId: number }) =>
    selectAll(state).find((u) => u.sampleId === props.sampleId);

  export const selectForProject = (state: __UploadsState, props: { projectLinkUUID: string }) =>
    selectAll(state).filter((u) => u.projectLinkUUID === props.projectLinkUUID);

}
