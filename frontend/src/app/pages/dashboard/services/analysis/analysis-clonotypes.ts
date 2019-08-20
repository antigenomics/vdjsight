export interface ClonotypeTableAnalysisOptions {
  pageSize: number;
  pagesRegion: number;
  sort: string;
}

export function CreateClonotypeTableAnalysisMarker(options: ClonotypeTableAnalysisOptions): string {
  return btoa(JSON.stringify({
    sort: options.sort
  })).replace(/=/g, '');
}

const DEFAULT_CLONOTYPES_TABLE_PAGE_SIZE   = 25;
const DEFAULT_CLONOTYPES_TABLE_PAGES_RANGE = 5;

export function CreateClonotypeTableAnalysisDefaultOptions(): ClonotypeTableAnalysisOptions {
  return {
    pageSize:    DEFAULT_CLONOTYPES_TABLE_PAGE_SIZE,
    pagesRegion: DEFAULT_CLONOTYPES_TABLE_PAGES_RANGE,
    sort:        'none'
  };
}

export interface ClonotypeTableRow {
  readonly index: number;
  readonly count: number;
  readonly freq: number;
  readonly cdr3aa: string;
  readonly cdr3nt: string;
  readonly v: string;
  readonly d: string;
  readonly j: string;
}

export interface ClonotypeTablePage {
  readonly page: number;
  readonly rows: ClonotypeTableRow[];
}

export interface ClonotypeTableView {
  readonly totalPages: number;
  readonly defaultPage: number;
  readonly pageSize: number;
  readonly pagesRegion: number;
  readonly pages: ClonotypeTablePage[];
}
