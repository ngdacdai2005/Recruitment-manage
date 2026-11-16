import { request } from './client';
import { DashboardStats } from '../types';

export const reportApi = {
  getDashboardOverview: async (): Promise<DashboardStats> => {
    return request<DashboardStats>('/admin/reports/dashboard');
  },
};

