import { request } from './client';
import { Department } from '../types';

export const departmentApi = {
  getDepartments: async (): Promise<Department[]> => {
    return request<Department[]>('/departments');
  },

  createDepartment: async (department: Partial<Department>): Promise<Department> => {
    return request<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(department),
    });
  },
};

