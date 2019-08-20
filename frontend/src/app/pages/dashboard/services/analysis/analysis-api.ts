import { ClonotypeTableAnalysisOptions, ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';

export namespace AnalysisAPI {

  export interface ClonotypesRequest {
    page: number;
    pageSize: number;
    pagesRegion: number;
    marker: string;
    options: ClonotypeTableAnalysisOptions;
  }

  export interface ClonotypesResponse {
    view: ClonotypeTableView;
  }

}
