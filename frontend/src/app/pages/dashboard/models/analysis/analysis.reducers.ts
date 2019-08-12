import { Action, createReducer, on } from '@ngrx/store';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { __AnalysisState, __fromDashboardAnalysisState, AnalysisStateAdapter } from 'pages/dashboard/models/analysis/analysis.state';

const analysisReducer = createReducer(
  __fromDashboardAnalysisState.initial,

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
