import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { UploadErrorEntity } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors';

interface __UploadErrorsStateInner { // tslint:disable-line:class-name no-empty-interface
  errors: string[];
  warnings: string[];
}

export type __UploadErrorsState = EntityState<UploadErrorEntity> & __UploadErrorsStateInner;

export const UploadErrorsStateAdapter = createEntityAdapter<UploadErrorEntity>({
  selectId: (error) => error.id
});

export namespace __fromDashboardProjectUploadErrorsState {

  export const initial = UploadErrorsStateAdapter.getInitialState<__UploadErrorsStateInner>({
    errors:   [],
    warnings: []
  });

  export const { selectIds, selectEntities, selectAll, selectTotal } = UploadErrorsStateAdapter.getSelectors();

  export const getGlobalErrors   = (state: __UploadErrorsState) => state.errors;
  export const getGlobalWarnings = (state: __UploadErrorsState) => state.warnings;

  export const selectForUploadEntity = (state: __UploadErrorsState, props: { uploadId: number }) =>
    selectAll(state).find((u) => u.uploadId === props.uploadId);

}
