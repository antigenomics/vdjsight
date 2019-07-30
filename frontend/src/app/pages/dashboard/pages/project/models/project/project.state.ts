import { ProjectLink } from 'pages/dashboard/models/projects/projects';

export interface __DashboardCurrentProjectState { // tslint:disable-line:class-name
  readonly uuid: string;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly loadFailed: boolean;
  readonly link?: ProjectLink;
}

export namespace __fromDashboardCurrentProjectState {

  export const initial: __DashboardCurrentProjectState = {
    uuid:       '',
    loading:    false,
    loaded:     false,
    loadFailed: false
  };

  export const getCurrentProjectUUID      = (state: __DashboardCurrentProjectState) => state.uuid;
  export const isCurrentProjectLoading    = (state: __DashboardCurrentProjectState) => state.loading;
  export const isCurrentProjectLoaded     = (state: __DashboardCurrentProjectState) => state.loaded;
  export const isCurrentProjectLoadFailed = (state: __DashboardCurrentProjectState) => state.loadFailed;
  export const getCurrentProjectInfo      = (state: __DashboardCurrentProjectState) => state.link;

}
