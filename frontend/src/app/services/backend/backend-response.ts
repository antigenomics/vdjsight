export interface BackendSuccessResponse<T> {
  data: T;
}

export interface BackendMessageResponse {
  message: string;
}

export interface BackendErrorResponse {
  error: string;
  extra?: string[];
}


