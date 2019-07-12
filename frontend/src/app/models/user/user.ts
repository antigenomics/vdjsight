export interface UserPermissions {
  readonly maxProjectsCount: number;
  readonly maxSamplesCount: number;
  readonly maxSampleSize: number;
}

export interface UserInfo {
  readonly email: string;
  readonly login: string;
  readonly permissions: UserPermissions;
}
