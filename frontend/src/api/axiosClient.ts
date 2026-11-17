import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { setupInterceptors } from './interceptors';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cho phép truyền HttpOnly Cookie (refresh_token)
});

// Kích hoạt toàn bộ interceptors
setupInterceptors(axiosClient);

export default axiosClient;
