export interface ApiResponseSuccess<T> {
  data: T;
  error: null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}

export interface ApiResponseError {
  data: null;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
