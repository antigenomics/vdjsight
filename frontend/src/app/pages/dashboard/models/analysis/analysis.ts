import {
  ClonotypeTableAnalysisOptions,
  ClonotypeTablePage,
  ClonotypeTableView,
  CreateClonotypeTableAnalysisDefaultOptions
} from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { EntityStatus } from 'utils/state/entity';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export const enum AnalysisType {
  CLONOTYPES = 'clonotypes',
  NOTHING    = 'nothing'
}

export interface AnalysisEntityBase<Data, Options> {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly sampleLinkUUID: string;

  readonly updating: EntityStatus;

  readonly analysisType: AnalysisType;

  readonly options?: Options;
  readonly data?: Data;
}

export interface AnalysisClonotypesEntityData {
  view: ClonotypeTableView;
  marker: string;
  selectedPage: ClonotypeTablePage;
}

export interface AnalysisClonotypesEntity extends AnalysisEntityBase<AnalysisClonotypesEntityData, ClonotypeTableAnalysisOptions> {
  readonly analysisType: AnalysisType.CLONOTYPES;
}

export interface AnalysisNothingEntity extends AnalysisEntityBase<never, never> {
  readonly analysisType: AnalysisType.NOTHING;
}

export type AnalysisEntity = AnalysisClonotypesEntity | AnalysisNothingEntity;

export namespace AnalysisEntity {

  export function isEntityUpdating(entity: AnalysisEntity): boolean {
    return entity.updating.active;
  }

  export function isEntityUpdateFailed(entity: AnalysisEntity): boolean {
    return entity.updating.error !== undefined;
  }

}

const AnalysisEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateClonotypesAnalysisEntity(projectLinkUUID: string, sampleLinkUUID: string, options?: ClonotypeTableAnalysisOptions): AnalysisClonotypesEntity {
  return {
    id:              AnalysisEntitiesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID,
    sampleLinkUUID:  sampleLinkUUID,
    updating:        { active: false },
    analysisType:    AnalysisType.CLONOTYPES,
    options:         options !== undefined ? options : CreateClonotypeTableAnalysisDefaultOptions()
  };
}


