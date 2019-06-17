export interface BackendSuccessResponse<T> {
  data: T;
}

export interface BackendErrorResponse {
  message: string[];
  extra?: string[];
}


