import { ProjectLink } from 'pages/dashboard/pages/projects/models/projects/projects';

export namespace ProjectsAPI {

  export interface ListResponse {
    readonly projects: ProjectLink[];
  }

  export interface CreateRequest {
    readonly name: string;
    readonly description: string;
  }

  export interface CreateResponse {
    readonly link: ProjectLink;
  }

  export interface UpdateRequest {
    readonly uuid: string;
    readonly name: string;
    readonly description: string;
  }

  export interface UpdateResponse {
    readonly link: ProjectLink;
  }

  export interface DeleteRequest {
    readonly uuid: string;
    readonly force: boolean;
  }

}
