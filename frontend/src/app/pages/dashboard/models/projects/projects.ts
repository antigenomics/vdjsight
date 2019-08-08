import { EntityStatus } from 'utils/enitity/entity';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export interface ProjectLink {
  readonly uuid: string;
  readonly name: string;
  readonly description: string;
  readonly isShared: boolean;
  readonly isUploadAllowed: boolean;
  readonly isDeleteAllowed: boolean;
  readonly isModificationAllowed: boolean;
}

export interface ProjectEntity {
  readonly id: number;
  readonly updating: EntityStatus;
  readonly deleting: EntityStatus;
  readonly creating: EntityStatus;
  readonly link?: ProjectLink;
}

export namespace ProjectEntity {

  export function isEntityLinked(entity: ProjectEntity): boolean {
    return entity.link !== undefined;
  }

  export function isEntityCreating(entity: ProjectEntity): boolean {
    return entity.creating.active === true && entity.link === undefined;
  }

  export function isEntityCreateFailed(entity: ProjectEntity): boolean {
    return entity.creating.error !== undefined;
  }

}

const ProjectListEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptyProjectEntity(): ProjectEntity {
  return {
    id:       ProjectListEntitiesLocalUUIDGenerator.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: true }
  };
}

export function CreateProjectEntityFromLink(link: ProjectLink): ProjectEntity {
  return {
    id:       ProjectListEntitiesLocalUUIDGenerator.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: false },
    link:     link
  };
}


