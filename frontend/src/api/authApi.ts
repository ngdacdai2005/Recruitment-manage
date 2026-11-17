import { request, setToken, removeToken } from './client';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export const authApi = {
  login: async (req: LoginRequest): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    if (res.accessToken) {
      setToken(res.accessToken);
    }
    return res;
  },

  register: async (req: RegisterRequest): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    if (res.accessToken) {
      setToken(res.accessToken);
    }
    return res;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    if (res.accessToken) {
      setToken(res.accessToken);
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await request<void>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      removeToken();
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    return request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return request<User>('/auth/me');
  },
};
