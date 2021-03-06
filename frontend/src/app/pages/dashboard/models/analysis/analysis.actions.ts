import { createAction, props } from '@ngrx/store';
import { AnalysisClonotypesEntity, AnalysisEntity, AnalysisType } from 'pages/dashboard/models/analysis/analysis';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { ClonotypeTablePage, ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace AnalysisActions {

  export const createIfNotExist = createAction('[Analysis] Create If Not Exist', props<{ sample: SampleEntity, analysisType: AnalysisType }>());
  export const create           = createAction('[Analysis] Create', props<{ sample: SampleEntity, analysis: AnalysisEntity }>());

  export const clonotypesSelectPage     = createAction('[Analysis] Clonotypes Select Page', props<{
    analysis: AnalysisClonotypesEntity;
    page: number;
    pageSize: number;
    pagesRegion: number;
  }>());
  export const clonotypesLocalPageFound = createAction('[Analysis] Clonotypes Local Page Found', props<{
    analysis: AnalysisClonotypesEntity,
    page: ClonotypeTablePage
  }>());
  export const clonotypesUpdate         = createAction('[Analysis] Clonotypes', props<{
    analysis: AnalysisClonotypesEntity;
    page: number;
    pageSize: number;
    pagesRegion: number;
  }>());
  export const clonotypesUpdateSuccess  = createAction('[Analysis] Clonotypes Success', props<{ analysisId: number, view: ClonotypeTableView }>());
  export const clonotypesUpdateFailed   = createAction('[Analysis] Clonotypes Failed', props<{ analysisId: number, error: BackendErrorResponse }>());

  export const clear = createAction('[Analysis] Clear');

}
