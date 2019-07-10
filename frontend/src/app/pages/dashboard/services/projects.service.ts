import { Injectable } from '@angular/core';
import { ProjectLink } from 'pages/dashboard/models/projects/projects';
import { ProjectsAPI } from 'pages/dashboard/services/projects-api';
import { Observable } from 'rxjs';
import { BackendMessageResponse } from 'services/backend/backend-response';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class ProjectsService {

  private static readonly ProjectsInfoEndpoint       = '/projects/';
  private static readonly ProjectsListEndpoint       = '/projects/list';
  private static readonly ProjectsListCreateEndpoint = '/projects/list/create';
  private static readonly ProjectsListUpdateEndpoint = '/projects/list/update';
  private static readonly ProjectsListDeleteEndpoint = '/projects/list/delete';

  constructor(private backend: BackendService) {}

  public info(uuid: string): Observable<ProjectLink> {
    return this.backend.get(ProjectsService.ProjectsInfoEndpoint + uuid);
  }

  public list(): Observable<ProjectsAPI.ListResponse> {
    return this.backend.get(ProjectsService.ProjectsListEndpoint);
  }

  public create(request: ProjectsAPI.CreateRequest): Observable<ProjectsAPI.CreateResponse> {
    return this.backend.post<ProjectsAPI.CreateRequest, ProjectsAPI.CreateResponse>(ProjectsService.ProjectsListCreateEndpoint, request);
  }

  public update(request: ProjectsAPI.UpdateRequest): Observable<ProjectsAPI.UpdateResponse> {
    return this.backend.post<ProjectsAPI.UpdateRequest, ProjectsAPI.UpdateResponse>(ProjectsService.ProjectsListUpdateEndpoint, request);
  }

  public delete(request: ProjectsAPI.DeleteRequest): Observable<BackendMessageResponse> {
    return this.backend.post<ProjectsAPI.DeleteRequest, BackendMessageResponse>(ProjectsService.ProjectsListDeleteEndpoint, request);
  }
}
