import { ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { EntityStatus } from 'utils/state/entity';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export const enum AnalysisType {
  CLONOTYPES = 'clonotypes',
  NOTHING    = 'nothing'
}

export interface AnalysisEntityBase<T> {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly sampleLinkUUID: string;

  readonly updating: EntityStatus;

  readonly analysisType: AnalysisType;
  readonly data?: T;
}

export interface AnalysisClonotypesEntity extends AnalysisEntityBase<ClonotypeTableView> {
  readonly analysisType: AnalysisType.CLONOTYPES;
}

export interface AnalysisNothingEntity extends AnalysisEntityBase<never> {
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

export function CreateEmptyAnalysisEntity(projectLinkUUID: string, sampleLinkUUID: string, type: AnalysisType): AnalysisEntity {
  return {
    id:              AnalysisEntitiesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID,
    sampleLinkUUID:  sampleLinkUUID,
    updating:        { active: true },
    analysisType:    type
  };
}


