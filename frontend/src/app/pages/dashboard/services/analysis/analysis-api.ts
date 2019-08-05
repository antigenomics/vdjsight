export namespace AnalysisAPI {

  export interface ClonotypesRequest {
    page: number;
    pageSize: number;
  }

  export interface ClonotypesResponse {
    entries: string[];
  }

}
