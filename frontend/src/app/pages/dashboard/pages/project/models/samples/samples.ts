import { EntityStatus } from 'utils/enitity/entity';
import { IncrementalGlobalUUID } from 'utils/uuid/incremental-global-uuid';

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

export function CreateEmptySampleFileEntity(): SampleFileEntity {
  return {
    id:       IncrementalGlobalUUID.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: true }
  };
}

export function CreateSampleFileEntityFromLink(link: SampleFileLink) {
  return {
    id:       IncrementalGlobalUUID.next(),
    updating: { active: false },
    deleting: { active: false },
    creating: { active: false },
    link:     link
  };
}
