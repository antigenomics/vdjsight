import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export interface UploadEntity {
  readonly id: number;
  readonly projectLinkUUID: string;
}

const UploadEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptyUploadEntity(projectLinkUUID: string): UploadEntity {
  return {
    id:              UploadEntitiesLocalUUIDGenerator.next(),
    projectLinkUUID: projectLinkUUID
  };
}
