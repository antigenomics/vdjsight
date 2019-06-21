import { Injectable } from '@angular/core';
import { ProjectsAPI } from 'pages/dashboard/services/projects-api';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class ProjectsService {

  private static readonly ListEndpoint = '/projects/list';

  constructor(private backend: BackendService) {}

  public list(): Observable<ProjectsAPI.ListResponse> {
    return this.backend.get(ProjectsService.ListEndpoint);
  }

  public create(request: ProjectsAPI.CreateRequest): Observable<ProjectsAPI.CreateResponse> {
    return this.backend.post<ProjectsAPI.CreateRequest, ProjectsAPI.CreateResponse>(ProjectsService.ListEndpoint, request);
  }
}
