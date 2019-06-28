import { EntityStatus } from 'utils/enitity/entity';
import { IncrementalGlobalUUID } from 'utils/uuid/incremental-global-uuid';

export interface ProjectLink {
  readonly uuid: string;
  readonly name: string;
  readonly description: string;
  readonly maxSamplesCount: number;
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

export function CreateEmptyProjectEntity(): ProjectEntity {
  return {
    id:       IncrementalGlobalUUID.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: true }
  };
}

export function CreateProjectEntityFromLink(link: ProjectLink): ProjectEntity {
  return {
    id:       IncrementalGlobalUUID.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: false },
    link:     link
  };
}


