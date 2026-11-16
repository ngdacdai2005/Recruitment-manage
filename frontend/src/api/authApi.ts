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
  tokenType: string;
  expiresIn: number;
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

  getCurrentUser: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  logout: () => {
    removeToken();
  },
};

