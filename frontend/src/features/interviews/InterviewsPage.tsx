import React, { useState, useEffect } from 'react';
import './InterviewsPage.css';
import { AdminInterviewsPage } from './components/AdminInterviewsPage';
import { Interview, Application, InterviewEvaluation, User } from '@/types';
import { interviewApi, applicationApi, userApi } from '@/api';

export const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviewers, setInterviewers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      interviewApi.getAdminInterviews().catch(err => {
        console.warn('Could not load interviews:', err);
        return [];
      }),
      applicationApi.getAdminApplications({ size: 100 }).catch(err => {
        console.warn('Could not load applications for interview scheduling:', err);
        return null;
      }),
      userApi.getAllUsers().catch(err => {
        console.warn('Could not load users for interviewers:', err);
        return [];
      })
    ]).then(([invRes, appRes, userRes]) => {
      if (!isMounted) return;
      if (invRes && Array.isArray(invRes)) setInterviews(invRes);
      if (appRes && appRes.content) setApplications(appRes.content);
      if (userRes && Array.isArray(userRes)) {
        setInterviewers(userRes.filter(u => {
          const r = typeof (u as any).role === 'object' ? (u as any).role?.name : u.role;
          return r !== 'ROLE_CANDIDATE';
        }));
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleAddInterview = async (newInv: Interview) => {
    try {
      const created = await interviewApi.scheduleInterview({
        applicationId: newInv.applicationId,
        interviewerId: 4,
        scheduledAt: newInv.scheduledAt,
        durationMinutes: newInv.durationMinutes,
        interviewType: newInv.interviewType,
        locationOrLink: newInv.locationOrLink,
        notes: newInv.notes,
      });
      setInterviews(prev => [created, ...prev]);
    } catch (err) {
      console.warn('Real API create interview failed, fallback to local:', err);
      setInterviews(prev => [newInv, ...prev]);
    }
  };

  const handleSaveEvaluation = async (interviewId: number, evaluation: InterviewEvaluation) => {
    try {
      await interviewApi.evaluateInterview(interviewId, evaluation);
    } catch (err) {
      console.warn('Real API submit evaluation failed:', err);
    }
    setInterviews(prev =>
      prev.map(inv => (inv.id === interviewId ? { ...inv, status: 'COMPLETED', evaluation } : inv))
    );
  };

  return (
    <div className="interviews-page-container">
      {loading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải lịch phỏng vấn...</p>
        </div>
      ) : (
        <AdminInterviewsPage
          interviews={interviews}
          applications={applications}
          interviewers={interviewers}
          onAddInterview={handleAddInterview}
          onSaveEvaluation={handleSaveEvaluation}
        />
      )}
    </div>
  );
};

export default InterviewsPage;
