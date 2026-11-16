import { request } from './client';
import { Candidate } from '../types';
import { PageResult } from './jobApi';

export const candidateApi = {
  getMyProfile: async (): Promise<Candidate> => {
    return request<Candidate>('/candidate/profile');
  },

  updateProfile: async (candidate: Partial<Candidate>): Promise<Candidate> => {
    return request<Candidate>('/candidate/profile', {
      method: 'PUT',
      body: JSON.stringify(candidate),
    });
  },

  updateCvUrl: async (cvUrl: string): Promise<Candidate> => {
    return request<Candidate>('/candidate/cv-url', {
      method: 'POST',
      body: JSON.stringify({ cvUrl }),
    });
  },

  getAllCandidates: async (page = 0, size = 15): Promise<PageResult<Candidate>> => {
    return request<PageResult<Candidate>>('/admin/candidates', {
      method: 'GET',
      params: { page, size },
    });
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    return request<Candidate>(`/admin/candidates/${id}`);
  },
};

