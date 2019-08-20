import { createAction, props } from '@ngrx/store';
import { AnalysisEntity } from 'pages/dashboard/models/analysis/analysis';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { ClonotypeTableAnalysisOptions, ClonotypeTablePage, ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { BackendErrorResponse } from 'services/backend/backend-response';

export namespace AnalysisActions {

  export const createIfNotExist = createAction('[Analysis] Create If Not Exist', props<{ sample: SampleEntity, analysis: AnalysisEntity }>());
  export const create           = createAction('[Analysis] Create', props<{ sample: SampleEntity, analysis: AnalysisEntity }>());

  export const clonotypesSelectPage     = createAction('[Analysis] Clonotypes Select Page', props<{
    analysisId: number;
    page: number;
    pageSize: number;
    pagesRegion: number;
    forceUpdate?: boolean;
  }>());
  export const clonotypesLocalPageFound = createAction('[Analysis] Clonotypes Local Page Found', props<{
    analysisId: number,
    page: ClonotypeTablePage
  }>());
  export const clonotypesUpdate         = createAction('[Analysis] Clonotypes', props<{
    analysisId: number;
    page: number;
    pageSize: number;
    pagesRegion: number;
  }>());
  export const clonotypesUpdateSuccess  = createAction('[Analysis] Clonotypes Success', props<{ analysisId: number, view: ClonotypeTableView, marker: string }>());
  export const clonotypesUpdateFailed   = createAction('[Analysis] Clonotypes Failed', props<{ analysisId: number, error: BackendErrorResponse }>());

  export const clonotypesChangeOptions = createAction('[Analysis] Clonotypes Change Options', props<{
    analysisId: number,
    options: Partial<ClonotypeTableAnalysisOptions>,
    forceUpdate?: boolean;
  }>());

  export const clear = createAction('[Analysis] Clear');

}
