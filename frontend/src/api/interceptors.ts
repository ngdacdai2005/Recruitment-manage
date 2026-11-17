import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { appConfig } from '../config/app.config';
import { parseApiError } from './apiError';

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Request Interceptor: đính kèm Bearer token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(appConfig.storageKeys.accessToken);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(parseApiError(error))
  );

  // Response Interceptor: unwrap data & tự động Refresh Token khi gặp lỗi 401
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    async (error) => {
      const originalRequest = error.config;

      // Nếu lỗi 401 Unauthorized và chưa thử lại lần nào
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        originalRequest._retry = true;
        try {
          // Gọi API refresh token dựa trên Cookie HttpOnly
          const refreshResponse = await axiosInstance.post('/auth/refresh', {});
          const newAccessToken =
            (refreshResponse as any)?.accessToken ||
            (refreshResponse as any)?.data?.accessToken;

          if (newAccessToken) {
            localStorage.setItem(appConfig.storageKeys.accessToken, newAccessToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axiosInstance(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem(appConfig.storageKeys.accessToken);
          localStorage.removeItem(appConfig.storageKeys.userData);
        }
      }

      return Promise.reject(parseApiError(error));
    }
  );
}
