import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { SamplesAPI } from 'pages/dashboard/services/samples/samples-api';
import { Observable } from 'rxjs';
import { BackendMessageResponse, BackendSuccessResponse } from 'services/backend/backend-response';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class SamplesService {
  public static DefaultSoftwareType    = SampleSoftwareType.VDJtools;
  public static AvailableSoftwareTypes = [
    SampleSoftwareType.VDJtools,
    SampleSoftwareType.MiXCR
  ];


  public static DefaultSpeciesType    = SampleSpeciesType.Human;
  public static AvailableSpeciesTypes = [
    SampleSpeciesType.Human,
    SampleSpeciesType.Mouse,
    SampleSpeciesType.Monkey
  ];

  public static DefaultGeneType    = SampleGeneType.TRB;
  public static AvailableGeneTypes = [
    SampleGeneType.TRA,
    SampleGeneType.TRB,
    SampleGeneType.TRG,
    SampleGeneType.TRD,
    SampleGeneType.IGK,
    SampleGeneType.IGL,
    SampleGeneType.IGH
  ];

  constructor(private readonly backend: BackendService, private readonly http: HttpClient) {}

  public list(projectLinkUUID: string): Observable<SamplesAPI.ListResponse> {
    return this.backend.get(SamplesService.SamplesListEndpoint(projectLinkUUID));
  }

  public create(projectLinkUUID: string, request: SamplesAPI.CreateRequest, file: File):
    Observable<HttpEvent<BackendSuccessResponse<SamplesAPI.CreateResponse>>> {
    const data = new FormData();

    data.append('file', file);
    data.append('name', request.name);
    data.append('extension', request.extension);
    data.append('software', request.software);
    data.append('species', request.species);
    data.append('gene', request.gene);
    data.append('size', `${request.size}`);
    data.append('hash', request.hash);

    const req = new HttpRequest<FormData>(
      'POST', BackendService.endpointToURL(SamplesService.SamplesCreateEndpoint(projectLinkUUID)), data,
      { reportProgress: true, withCredentials: true }
    );

    return this.http.request<BackendSuccessResponse<SamplesAPI.CreateResponse>>(req).pipe(
      this.backend.retryOnFail(),
      this.backend.catchErrors()
    );
  }

  public delete(projectLinkUUID: string, request: SamplesAPI.DeleteRequest): Observable<BackendMessageResponse> {
    return this.backend.post(SamplesService.SamplesDeleteEndpoint(projectLinkUUID), request);
  }

  private static readonly SamplesListEndpoint   = (uuid: string) => `/samples/${uuid}/list/`;
  private static readonly SamplesCreateEndpoint = (uuid: string) => `/samples/${uuid}/create/`;
  private static readonly SamplesDeleteEndpoint = (uuid: string) => `/samples/${uuid}/delete/`;

}
