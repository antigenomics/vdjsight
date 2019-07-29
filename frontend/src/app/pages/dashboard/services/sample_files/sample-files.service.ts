import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SampleFilesAPI } from 'pages/dashboard/services/sample_files/sample-files-api';
import { Observable } from 'rxjs';
import { BackendMessageResponse, BackendSuccessResponse } from 'services/backend/backend-response';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class SampleFilesService {
  public static AvailableSoftwareTypes: string[] = [
    'VDJtools',
    'MiXCR'
  ];

  constructor(private readonly backend: BackendService, private readonly http: HttpClient) {}

  public list(projectLinkUUID: string): Observable<SampleFilesAPI.ListResponse> {
    return this.backend.get(SampleFilesService.SamplesListEndpoint(projectLinkUUID));
  }

  public create(projectLinkUUID: string, request: SampleFilesAPI.CreateRequest, file: File):
    Observable<HttpEvent<BackendSuccessResponse<SampleFilesAPI.CreateResponse>>> {
    const data = new FormData();

    data.append('file', file);
    data.append('name', request.name);
    data.append('extension', request.extension);
    data.append('software', request.software);
    data.append('size', `${request.size}`);
    data.append('hash', request.hash);

    const req = new HttpRequest<FormData>(
      'POST', BackendService.endpointToURL(SampleFilesService.SamplesCreateEndpoint(projectLinkUUID)), data,
      { reportProgress: true, withCredentials: true }
    );

    return this.http.request<BackendSuccessResponse<SampleFilesAPI.CreateResponse>>(req).pipe(
      this.backend.retryOnFail(),
      this.backend.catchErrors()
    );
  }

  public delete(projectLinkUUID: string, request: SampleFilesAPI.DeleteRequest): Observable<BackendMessageResponse> {
    return this.backend.post(SampleFilesService.SamplesDeleteEndpoint(projectLinkUUID), request);
  }

  private static readonly SamplesListEndpoint   = (uuid: string) => `/samples/${uuid}/list/`;
  private static readonly SamplesCreateEndpoint = (uuid: string) => `/samples/${uuid}/create/`;
  private static readonly SamplesDeleteEndpoint = (uuid: string) => `/samples/${uuid}/delete/`;

}
