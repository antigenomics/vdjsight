export interface UploadEntity {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly name: string;
  readonly extension: string;
  readonly software: string;
  readonly size: number;
  readonly hash?: string;

  readonly uploading: boolean;
  readonly uploaded: boolean;

  readonly warning?: string;
  readonly error?: string;
}

export namespace UploadEntity {

  export function isEntityReadyForUpload(entity: UploadEntity): boolean {
    return !entity.uploading && !entity.uploaded && entity.hash !== undefined && entity.warning === undefined;
  }

  export const enum Errors {
    EMPTY_NAME                   = 'Empty name is not allowed',
    INVALID_EXTENSION            = 'Invalid file extension',
    MAX_FILE_SIZE_LIMIT_EXCEEDED = 'Max file size limit has been exceeded'
  }

}
