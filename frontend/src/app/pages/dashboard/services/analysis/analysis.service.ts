import { Injectable } from '@angular/core';
import { AnalysisAPI } from 'pages/dashboard/services/analysis/analysis-api';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class AnalysisService {

  constructor(private readonly backend: BackendService) {}

  public clonotypes(projectLinkUUID: string, sampleLinkUUID: string, request: AnalysisAPI.ClonotypesRequest): Observable<AnalysisAPI.ClonotypesResponse> {
    return this.backend.post(AnalysisService.AnalysisClonotypesEndpoint(projectLinkUUID, sampleLinkUUID), request);
  }

  private static readonly AnalysisClonotypesEndpoint = (pUUID: string, sUUID: string) => `/analysis/${pUUID}/${sUUID}/clonotypes/`;
}
