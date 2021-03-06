import { Action, createReducer, on } from '@ngrx/store';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { __AnalysisState, __fromDashboardAnalysisState, AnalysisStateAdapter } from 'pages/dashboard/models/analysis/analysis.state';

const analysisReducer = createReducer(
  __fromDashboardAnalysisState.initial,
  /** Create actions */
  on(AnalysisActions.create, (state, { analysis }) => {
    return AnalysisStateAdapter.addOne(analysis, state);
  }),

  /** Clonotypes actions */
  on(AnalysisActions.clonotypesLocalPageFound, (state, { analysis, page }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysis.id,
      changes: { data: { view: analysis.data.view, selectedPage: page } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdate, (state, { analysis }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysis.id,
      changes: { updating: { active: true } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdateSuccess, (state, { analysisId, view }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { updating: { active: false }, data: { view, selectedPage: view.pages.find((p) => p.page === view.defaultPage) } }
    }, state);
  }),
  on(AnalysisActions.clonotypesUpdateFailed, (state, { analysisId, error }) => {
    return AnalysisStateAdapter.updateOne({
      id:      analysisId,
      changes: { updating: { active: false, error: error.error } }
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
