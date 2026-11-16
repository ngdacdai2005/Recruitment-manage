import { request } from './client';
import { User, UserRole } from '../types';

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    return request<User[]>('/admin/users');
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<User> => {
    return request<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  toggleUserActive: async (userId: number): Promise<User> => {
    return request<User>(`/admin/users/${userId}/toggle-active`, {
      method: 'PATCH',
    });
  },
};

