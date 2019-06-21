import { Injectable } from '@angular/core';
import { ProjectsOverview } from 'pages/projects/services/projects-overview';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class ProjectsOverviewService {

  private static readonly ListEndpoint = '/projects/overview/list';

  constructor(private backend: BackendService) {}

  public list(): Observable<ProjectsOverview.ListResponse> {
    return this.backend.get(ProjectsOverviewService.ListEndpoint);
  }

  public create(request: ProjectsOverview.CreateRequest): Observable<ProjectsOverview.CreateResponse> {
    return this.backend.post<ProjectsOverview.CreateRequest, ProjectsOverview.CreateResponse>(ProjectsOverviewService.ListEndpoint, request);
  }
}
