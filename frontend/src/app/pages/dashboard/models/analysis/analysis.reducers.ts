import { Action, createReducer, on } from '@ngrx/store';
import { AnalysisClonotypesEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { __AnalysisState, __fromDashboardAnalysisState, AnalysisStateAdapter } from 'pages/dashboard/models/analysis/analysis.state';

const analysisReducer = createReducer(
  __fromDashboardAnalysisState.initial,
  /** Create actions */
  on(AnalysisActions.create, (state, { analysis }) => {
    return AnalysisStateAdapter.addOne(analysis, state);
  }),

  /** Clonotypes actions */
  on(AnalysisActions.clonotypesLocalPageFound, (state, { analysisId, page }) => {
    const current = __fromDashboardAnalysisState.selectByID(state, { id: analysisId }) as AnalysisClonotypesEntity;
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { data: { view: current.data.view, selectedPage: page, marker: current.data.marker } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdate, (state, { analysisId }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { updating: { active: true } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdateSuccess, (state, { analysisId, view, marker }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { updating: { active: false }, data: { view, selectedPage: view.pages.find((p) => p.page === view.defaultPage), marker } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdateFailed, (state, { analysisId, error }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { updating: { active: false, error: error.error } }
    }, state);
  }),

  /** Options actions */
  on(AnalysisActions.clonotypesChangeOptions, (state, { analysisId, options }) => {
    const current = __fromDashboardAnalysisState.selectByID(state, { id: analysisId }) as AnalysisClonotypesEntity;
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { options: { ...current.options, ...options } }
    }, state);
  }),

  /** Clear actions */
  on(AnalysisActions.clear, (state) => {
    return AnalysisStateAdapter.removeAll(state);
  })
);

export namespace __fromAnalysisReducers {

  export function reducer(state: __AnalysisState | undefined, action: Action) {
    return analysisReducer(state, action);
  }

}
