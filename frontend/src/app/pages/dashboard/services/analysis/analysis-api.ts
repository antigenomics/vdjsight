export namespace AnalysisAPI {

  export interface ClonotypesRequest {
    page: number;
    pageSize: number;
    pagesRegion: number;
  }

  export interface ClonotypesResponse {
    entries: string[];
  }

}
