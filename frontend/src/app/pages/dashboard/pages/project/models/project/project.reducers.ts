import { Action, createReducer, on } from '@ngrx/store';
import produce from 'immer';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { __DashboardCurrentProjectState, __fromDashboardCurrentProjectState } from 'pages/dashboard/pages/project/models/project/project.state';

const currentProjectReducers = createReducer(
  __fromDashboardCurrentProjectState.initial,
  on(CurrentProjectActions.select, (state, { projectLinkUUID }) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = false;
    draft.loadFailed = false;
    draft.uuid       = projectLinkUUID;
    draft.link       = undefined;
  })),
  on(CurrentProjectActions.deselect, (state) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = false;
    draft.loadFailed = false;
    draft.uuid       = '';
    draft.link       = undefined;
  })),
  on(CurrentProjectActions.loadStart, (state) => produce(state, (draft) => {
    draft.loading    = true;
    draft.loaded     = false;
    draft.loadFailed = false;
    draft.link       = undefined;
  })),
  on(CurrentProjectActions.loadSuccess, (state, { link }) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = true;
    draft.loadFailed = false;
    draft.link       = link;
  })),
  on(CurrentProjectActions.loadFailed, (state) => produce(state, (draft) => {
    draft.loading    = false;
    draft.loaded     = false;
    draft.loadFailed = true;
    draft.link       = undefined;
  }))
);

export namespace __fromCurrentProjectReducers {

  export function reducer(state: __DashboardCurrentProjectState | undefined, action: Action) {
    return currentProjectReducers(state, action);
  }

}
