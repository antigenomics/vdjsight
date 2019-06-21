import { ProjectLink } from 'pages/projects/models/projects_list/project-link';

export namespace ProjectsOverview {

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
