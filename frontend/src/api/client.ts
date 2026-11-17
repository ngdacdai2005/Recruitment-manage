/**
 * API Client Configuration
 * Tích hợp tự động token JWT, chuẩn hóa định dạng request/response và xử lý lỗi
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem('rms_jwt_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('rms_jwt_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('rms_jwt_token');
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    credentials: 'include',
    ...customConfig,
    headers: {
      'Accept': 'application/json',
      ...authHeaders,
      ...headers,
    },
  };

  // Only set Content-Type to application/json if body is not FormData
  if (config.body && !(config.body instanceof FormData)) {
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  let responseData: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMsg = responseData?.message || responseData?.error || `HTTP Error ${response.status}`;
    throw new ApiError(errorMsg, response.status, responseData);
  }

  // If backend returns ApiResponse wrapper { success: true, message: ..., data: ... }
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data as T;
  }

  return responseData as T;
}

/**
 * Kiểm tra kết nối nhanh tới Backend Spring Boot
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs?size=1`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

