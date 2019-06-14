import { HttpHeaders } from '@angular/common/http';

export const enum BackendRequestType {
  GET, POST, PUT, DELETE
}

export type BackendRequestEndpoint = string | string[] | { segments: string[], params: { [ key: string ]: string } };
export type BackendRequestHeaders = HttpHeaders | { [ header: string ]: string | string[]; };

export interface BackendRequest<T> {
  endpoint: BackendRequestEndpoint;
  type: BackendRequestType;
  data?: T;
}

export interface BackendRequestOptions {
  headers?: BackendRequestHeaders;
}
