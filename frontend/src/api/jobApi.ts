import { request } from './client';
import { Job, JobStatus } from '../types';

export interface PageResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface JobFilterParams {
  keyword?: string;
  departmentId?: number;
  location?: string;
  jobLevel?: string;
  employmentType?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export const jobApi = {
  getPublicJobs: async (params?: JobFilterParams): Promise<PageResult<Job>> => {
    return request<PageResult<Job>>('/jobs', {
      method: 'GET',
      params: params as Record<string, any>,
    });
  },

  getJobBySlug: async (slug: string): Promise<Job> => {
    return request<Job>(`/jobs/${slug}`);
  },

  getAdminJobs: async (params?: { keyword?: string; status?: JobStatus; departmentId?: number; page?: number; size?: number }): Promise<PageResult<Job>> => {
    return request<PageResult<Job>>('/jobs/admin/list', {
      method: 'GET',
      params: params as Record<string, any>,
    });
  },

  createJob: async (job: Partial<Job>, departmentId: number): Promise<Job> => {
    return request<Job>('/jobs/admin', {
      method: 'POST',
      params: { departmentId },
      body: JSON.stringify(job),
    });
  },

  updateJobStatus: async (jobId: number, status: JobStatus): Promise<Job> => {
    return request<Job>(`/jobs/admin/${jobId}/status`, {
      method: 'PATCH',
      params: { status },
    });
  },
};

