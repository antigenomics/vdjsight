import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { SampleFilesAPI } from 'pages/dashboard/services/sample_files/sample-files-api';
import { Observable } from 'rxjs';
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

  public create(projectLinkUUID: string, upload: UploadEntity, file: File): [ Observable<SampleFilesAPI.CreateResponse>, Observable<number> ] {
    const data = new FormData();

    data.append('file', file);
    data.append('name', upload.name);
    data.append('extension', upload.extension);
    data.append('software', upload.software);
    data.append('size', `${upload.size}`);
    data.append('hash', upload.hash);

    const request = new HttpRequest<FormData>(
      'POST',
      BackendService.endpointToURL(SampleFilesService.SamplesCreateEndpoint(projectLinkUUID)),
      data,
      { reportProgress: true, withCredentials: true }
    );

    const events = this.http.request<SampleFilesAPI.CreateResponse>(request);

    events.subscribe((r) => console.log(r));

    return [ undefined, undefined ];
  }

  private static readonly SamplesListEndpoint   = (uuid: string) => `/samples/${uuid}/list/`;
  private static readonly SamplesCreateEndpoint = (uuid: string) => `/samples/${uuid}/create/`;

}
