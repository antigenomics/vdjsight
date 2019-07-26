export interface UploadEntity {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly name: string;
  readonly extension: string;
  readonly software: string;
  readonly size: number;
  readonly hash?: string;
  readonly ready: boolean;
  readonly uploading: boolean;
  readonly uploaded: boolean;
}
