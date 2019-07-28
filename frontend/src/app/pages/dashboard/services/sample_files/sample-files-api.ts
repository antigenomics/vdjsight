import { SampleFileLink } from 'pages/dashboard/pages/project/models/samples/samples';

export namespace SampleFilesAPI {

  export interface ListResponse {
    readonly samples: SampleFileLink[];
  }

  export interface CreateRequest {
    readonly name: string;
    readonly software: string;
    readonly extension: string;
    readonly size: number;
    readonly hash: string;
  }

  export interface CreateResponse {
    readonly link: SampleFileLink;
  }

  export interface UpdateRequest {
    readonly uuid: string;
    readonly name: string;
    readonly software: string;
  }

  export interface UpdateResponse {
    readonly link: SampleFileLink;
  }

  export interface DeleteRequest {
    readonly uuid: string;
    readonly force: boolean;
  }

}
