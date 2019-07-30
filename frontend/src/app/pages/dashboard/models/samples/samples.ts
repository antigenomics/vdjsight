import { EntityStatus } from 'utils/enitity/entity';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export interface SampleLink {
  readonly uuid: string;
  readonly name: string;
  readonly software: string;
  readonly size: number;
  readonly hash: string;
  readonly uploaded: boolean;
  readonly projectLinkUUID: string;
}

export interface SampleEntity {
  readonly id: number;
  readonly projectLinkUUID: string;

  readonly updating: EntityStatus;
  readonly deleting: EntityStatus;
  readonly creating: EntityStatus;

  readonly link?: SampleLink;
}

export namespace SampleEntity {

  export function isEntityLinked(entity: SampleEntity): boolean {
    return entity.link !== undefined;
  }

  export function isEntityCreating(entity: SampleEntity): boolean {
    return entity.creating.active === true && entity.link === undefined;
  }

  export function isEntityCreateFailed(entity: SampleEntity): boolean {
    return entity.creating.error !== undefined;
  }

}

const SampleEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptySampleFileEntity(projectLinkUUID: string): SampleEntity {
  return {
    id:              SampleEntitiesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID,

    updating: { active: false },
    deleting: { active: false },
    creating: { active: true }
  };
}

export function CreateSampleFileEntityFromLink(projectLinkUUID: string, link: SampleLink) {
  return {
    id:              SampleEntitiesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID,

    updating: { active: false },
    deleting: { active: false },
    creating: { active: false },

    link: link
  };
}
