import { ApiErrorResponse } from '../types';

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>, timestamp?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = timestamp;
  }
}

export const parseApiError = (error: any): ApiError => {
  if (error instanceof ApiError) return error;

  if (error.response?.data) {
    const data: ApiErrorResponse = error.response.data;
    return new ApiError(
      error.response.status || data.statusCode || 500,
      data.message || 'Có lỗi xảy ra từ hệ thống.',
      data.errors,
      data.timestamp
    );
  }

  return new ApiError(
    error.status || 500,
    error.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
  );
};
