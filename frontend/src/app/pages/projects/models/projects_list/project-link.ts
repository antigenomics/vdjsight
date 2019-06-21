export interface ProjectLink {
  uuid: string;
  name: string;
  description: string;
  maxSamplesCount: number;
  isShared: boolean;
  isUploadAllowed: boolean;
  isDeleteAllowed: boolean;
  isModificationAllowed: boolean;
}
