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
