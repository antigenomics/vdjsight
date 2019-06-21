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
  readonly isRejected: boolean;
  readonly isUpdating: boolean;
  readonly isSelected: boolean;
  readonly link?: ProjectLink;
}

export function CreateProjectEntity(link?: ProjectLink): ProjectEntity {
  return {
    id:         IncrementalGlobalUUID.next(),
    isRejected: false,
    isUpdating: false,
    isSelected: false,
    link:       link
  };
}


