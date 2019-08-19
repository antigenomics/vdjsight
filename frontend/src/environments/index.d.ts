export interface BackendRateLimitConfiguration {
  readonly count: number;
  readonly timeout: number;
  readonly retry: number;
}

export interface BackendConfiguration {
  readonly protocol: string;
  readonly host: string;
  readonly prefix: string;
  readonly suffix: string;
  readonly limits: BackendRateLimitConfiguration;
}

export interface ApplicationEnvironment {
  readonly version: string;
  readonly revision: string;
  readonly production: boolean;
  readonly loggerDebug: boolean;
  readonly backend: BackendConfiguration;
}
