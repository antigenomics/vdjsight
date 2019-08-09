import { SampleGeneType, SampleLink, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';

export namespace SamplesAPI {

  export interface ListResponse {
    readonly samples: SampleLink[];
  }

  export interface CreateRequest {
    readonly name: string;
    readonly software: SampleSoftwareType;
    readonly species: SampleSpeciesType;
    readonly gene: SampleGeneType;
    readonly extension: string;
    readonly size: number;
    readonly hash: string;
  }

  export interface CreateResponse {
    readonly link: SampleLink;
  }

  export interface UpdateRequest {
    readonly uuid: string;
    readonly name: string;
    readonly software: SampleSoftwareType;
    readonly species: SampleSpeciesType;
    readonly gene: SampleGeneType;
  }

  export interface UpdateResponse {
    readonly link: SampleLink;
  }

  export interface DeleteRequest {
    readonly uuid: string;
    readonly force: boolean;
  }

}
