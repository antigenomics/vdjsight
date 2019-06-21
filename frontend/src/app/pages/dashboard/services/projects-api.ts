import { ProjectLink } from 'pages/dashboard/models/projects/projects';

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

}
