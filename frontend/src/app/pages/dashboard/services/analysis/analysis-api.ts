import { ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';

export namespace AnalysisAPI {

  export interface ClonotypesRequest {
    page: number;
    pageSize: number;
    pagesRegion: number;
  }

  export interface ClonotypesResponse {
    view: ClonotypeTableView;
  }

}
