import { EntityStatus } from 'utils/enitity/entity';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export interface SampleFileLink {
  readonly uuid: string;
  readonly name: string;
  readonly software: string;
  readonly size: number;
  readonly hash: string;
  readonly uploaded: boolean;
  readonly projectLinkUUID: string;
}

export interface SampleFileEntity {
  readonly id: number;
  readonly updating: EntityStatus;
  readonly deleting: EntityStatus;
  readonly creating: EntityStatus;
  readonly link?: SampleFileLink;
}

export namespace SampleFileEntity {

  export function isEntityLinked(entity: SampleFileEntity): boolean {
    return entity.link !== undefined;
  }

}

const SampleFileEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptySampleFileEntity(): SampleFileEntity {
  return {
    id:       SampleFileEntitiesLocalUUIDGenerator.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: true }
  };
}

export function CreateSampleFileEntityFromLink(link: SampleFileLink) {
  return {
    id:       SampleFileEntitiesLocalUUIDGenerator.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: false },
    link:     link
  };
}
