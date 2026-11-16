import { request } from './client';
import { Application, ApplicationHistory, ApplicationStatus } from '../types';
import { PageResult } from './jobApi';

export interface ApplyJobRequest {
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  expectedSalary?: number;
  availableDate?: string;
  resumeUrl: string;
  resumeFilename?: string;
  coverLetter?: string;
}

export interface ChangeStatusRequest {
  toStatus: ApplicationStatus;
  note?: string;
  rejectionReason?: string;
}

export const applicationApi = {
  applyJob: async (data: ApplyJobRequest): Promise<Application> => {
    return request<Application>('/candidate/applications/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyApplications: async (): Promise<Application[]> => {
    return request<Application[]>('/candidate/applications/my-applications');
  },

  getApplicationTracking: async (applicationId: number): Promise<ApplicationHistory[]> => {
    return request<ApplicationHistory[]>(`/candidate/applications/${applicationId}/tracking`);
  },

  getAdminApplications: async (params?: { jobId?: number; status?: ApplicationStatus; keyword?: string; page?: number; size?: number }): Promise<PageResult<Application>> => {
    return request<PageResult<Application>>('/admin/applications', {
      method: 'GET',
      params: params as Record<string, any>,
    });
  },

  updateStatus: async (applicationId: number, data: ChangeStatusRequest): Promise<Application> => {
    return request<Application>(`/admin/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

