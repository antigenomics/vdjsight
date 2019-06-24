import { Injectable } from '@angular/core';
import { ProjectsAPI } from 'pages/dashboard/services/projects-api';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';
import { BackendMessageResponse } from 'services/backend/backend-response';

@Injectable()
export class ProjectsService {

  private static readonly ProjectsListEndpoint       = '/projects/list';
  private static readonly ProjectsListCreateEndpoint = '/projects/list/create';
  private static readonly ProjectsListDeleteEndpoint = '/projects/list/delete';

  constructor(private backend: BackendService) {}

  public list(): Observable<ProjectsAPI.ListResponse> {
    return this.backend.get(ProjectsService.ProjectsListEndpoint);
  }

  public create(request: ProjectsAPI.CreateRequest): Observable<ProjectsAPI.CreateResponse> {
    return this.backend.post<ProjectsAPI.CreateRequest, ProjectsAPI.CreateResponse>(ProjectsService.ProjectsListCreateEndpoint, request);
  }

  public delete(request: ProjectsAPI.DeleteRequest): Observable<BackendMessageResponse> {
    return this.backend.post<ProjectsAPI.DeleteRequest, BackendMessageResponse>(ProjectsService.ProjectsListDeleteEndpoint, request);
  }
}
