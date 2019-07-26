import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';

export interface UploadErrorEntity {
  readonly id: number;
  readonly uploadId: number;
  readonly error?: string;
}

const UploadErrorEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();

export function CreateEmptyUploadErrorEntity(uploadId: number): UploadErrorEntity {
  return {
    id:       UploadErrorEntitiesLocalUUIDGenerator.next(),
    uploadId: uploadId
  };
}
