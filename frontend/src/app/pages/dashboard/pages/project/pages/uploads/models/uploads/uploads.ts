export interface UploadEntity {
  readonly id: number;
  readonly projectLinkUUID: string;
  readonly name: string;
  readonly software: string;
  readonly size: number;
  readonly ready: boolean;
  readonly uploading: boolean;
  readonly uploaded: boolean;
  readonly hash?: string;
}
