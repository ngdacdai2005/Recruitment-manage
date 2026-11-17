import { request } from './client';
import { Employee, Position } from '../types';

export interface EmployeeFilterParams {
  keyword?: string;
  departmentId?: number;
  positionId?: number;
  status?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CreateEmployeeRequest {
  email: string;
  password?: string;
  fullName: string;
  shortName?: string;
  phone: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  dob?: string;
  address?: string;
  avatar?: string;
  profile?: string;
  cccd?: string;
  cccdIssueDate?: string;
  cccdIssuePlace?: string;
  bankAccount?: string;
  bankName?: string;
  employeeCode?: string;
  joinDate: string;
  contractType: 'OFFICIAL' | 'PROBATION' | 'PART_TIME' | 'INTERN';
  contractStartDate?: string;
  contractEndDate?: string;
  departmentId?: number;
  positionId?: number;
  roleName?: string;
}

export interface UpdateEmployeeRequest {
  fullName: string;
  shortName?: string;
  phone: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  dob?: string;
  address?: string;
  avatar?: string;
  profile?: string;
  cccd?: string;
  cccdIssueDate?: string;
  cccdIssuePlace?: string;
  bankAccount?: string;
  bankName?: string;
  joinDate?: string;
  contractType?: 'OFFICIAL' | 'PROBATION' | 'PART_TIME' | 'INTERN';
  contractStartDate?: string;
  contractEndDate?: string;
  departmentId?: number;
  positionId?: number;
  status?: number;
}

export const employeeApi = {
  getEmployees: async (params?: EmployeeFilterParams): Promise<PageResponse<Employee>> => {
    return request<PageResponse<Employee>>('/admin/employees', {
      params: params as Record<string, any>,
    });
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    return request<Employee>(`/admin/employees/${id}`);
  },

  getEmployeeByUserId: async (userId: number): Promise<Employee> => {
    return request<Employee>(`/admin/employees/by-user/${userId}`);
  },

  createEmployee: async (data: CreateEmployeeRequest): Promise<Employee> => {
    return request<Employee>('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEmployee: async (id: number, data: UpdateEmployeeRequest): Promise<Employee> => {
    return request<Employee>(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEmployee: async (id: number): Promise<void> => {
    return request<void>(`/admin/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

export const positionApi = {
  getAllPositions: async (): Promise<Position[]> => {
    return request<Position[]>('/positions');
  },

  getPositionsByDepartment: async (departmentId: number): Promise<Position[]> => {
    return request<Position[]>(`/positions/department/${departmentId}`);
  },

  getPositionById: async (id: number): Promise<Position> => {
    return request<Position>(`/positions/${id}`);
  },
};
