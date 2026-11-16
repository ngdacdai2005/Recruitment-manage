import { request } from './client';
import { Job } from '../types';

export interface SavedJobItem {
  id: number;
  job: Job;
  createdAt: string;
}

export const savedJobApi = {
  getSavedJobs: async (): Promise<SavedJobItem[]> => {
    return request<SavedJobItem[]>('/candidate/saved-jobs');
  },

  toggleSavedJob: async (jobId: number): Promise<{ jobId: number; saved: boolean }> => {
    return request<{ jobId: number; saved: boolean }>(`/candidate/saved-jobs/${jobId}/toggle`, {
      method: 'POST',
    });
  },
};

