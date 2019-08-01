import { Action, createReducer, on } from '@ngrx/store';
import { CurrentSampleActions } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.actions';
import { __DashboardCurrentSampleState, __fromDashboardCurrentSampleState } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.state';

const currentSampleReducers = createReducer(
  __fromDashboardCurrentSampleState.initial,
  on(CurrentSampleActions.select, (_, { entity }) => ({ entity })),
  on(CurrentSampleActions.deselect, () => ({}))
);

export namespace __fromCurrentSampleReducers {

  export function reducer(state: __DashboardCurrentSampleState | undefined, action: Action) {
    return currentSampleReducers(state, action);
  }

}
