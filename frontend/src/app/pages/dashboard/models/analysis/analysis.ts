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

  readonly analysis: AnalysisType;
  readonly data?: T;
}

export interface AnalysisClonotypesEntity extends AnalysisEntityBase<string> {
  readonly analysis: AnalysisType.CLONOTYPES;
}

export interface AnalysisNothingEntity extends AnalysisEntityBase<never> {
  readonly analysis: AnalysisType.NOTHING;
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

const AnalysisEntititesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptyAnalysisEntity(projectLinkUUID: string, sampleLinkUUID: string, type: AnalysisType): AnalysisEntity {
  return {
    id:              AnalysisEntititesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID,
    sampleLinkUUID:  sampleLinkUUID,
    updating:        { active: true },
    analysis:        type
  };
}


