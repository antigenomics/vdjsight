export interface UploadEntity {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly name: string;
  readonly extension: string;
  readonly software: string;
  readonly size: number;
  readonly hash?: string;

  readonly uploading: boolean;
  readonly progress: number;
  readonly uploaded: boolean;

  readonly warning?: string;
  readonly error?: string;
}

export namespace UploadEntity {

  export function isEntityWithWarning(entity: UploadEntity): boolean {
    return entity.warning !== undefined;
  }

  export function isEntityWithError(entity: UploadEntity): boolean {
    return entity.error !== undefined;
  }

  export function isEntityUploading(entity: UploadEntity): boolean {
    return entity.uploading;
  }

  export function isEntityUploaded(entity: UploadEntity): boolean {
    return entity.uploaded;
  }

  export function isEntityPending(entity: UploadEntity): boolean {
    return !entity.uploading && !entity.uploaded && !isEntityWithError(entity);
  }

  export function isEntityPendingAndValid(entity: UploadEntity): boolean {
    return isEntityPending(entity) && !isEntityWithWarning(entity);
  }

  export function isEntityHashReady(entity: UploadEntity): boolean {
    return entity.hash !== undefined;
  }

  export function isEntityReadyForUpload(entity: UploadEntity): boolean {
    return isEntityPendingAndValid(entity) && isEntityHashReady(entity);
  }

  export const enum Errors {
    EMPTY_NAME                   = 'Empty name is not allowed',
    INVALID_EXTENSION            = 'Invalid file extension',
    MAX_FILE_SIZE_LIMIT_EXCEEDED = 'Max file size limit has been exceeded'
  }

}
