import { Injectable } from '@angular/core';
import { SampleFilesAPI } from 'pages/dashboard/pages/project/services/sample-files-api';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class SampleFilesService {

  constructor(private readonly backend: BackendService) {}

  public list(projectLinkUUID: string): Observable<SampleFilesAPI.ListResponse> {
    return this.backend.get(SampleFilesService.SamplesListEndpoint(projectLinkUUID));
  }

  private static readonly SamplesListEndpoint = (uuid: string) => `/samples/${uuid}/list/`;

}
