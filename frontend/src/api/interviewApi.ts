import { request } from './client';
import { Interview, InterviewEvaluation } from '../types';

export interface ScheduleInterviewRequest {
  applicationId: number;
  interviewerId: number;
  scheduledAt: string; // ISO datetime
  durationMinutes: number;
  interviewType: 'ONLINE' | 'OFFLINE';
  locationOrLink: string;
  notes?: string;
}

export interface EvaluationRequest {
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  teamworkScore: number;
  generalNotes?: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
}

export const interviewApi = {
  scheduleInterview: async (data: ScheduleInterviewRequest): Promise<Interview> => {
    return request<Interview>('/admin/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAdminInterviews: async (interviewerId?: number): Promise<Interview[]> => {
    return request<Interview[]>('/admin/interviews', {
      method: 'GET',
      params: interviewerId ? { interviewerId } : undefined,
    });
  },

  getCandidateInterviews: async (): Promise<Interview[]> => {
    return request<Interview[]>('/candidate/interviews');
  },

  evaluateInterview: async (interviewId: number, data: EvaluationRequest): Promise<InterviewEvaluation> => {
    return request<InterviewEvaluation>(`/admin/interviews/${interviewId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

