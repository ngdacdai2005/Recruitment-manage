export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}
