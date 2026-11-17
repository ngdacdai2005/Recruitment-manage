import React, { useState, useEffect } from 'react';
import './InterviewsPage.css';
import { AdminInterviewsPage } from './components/AdminInterviewsPage';
import { mockInterviews, mockApplications } from '@/data/mockData';
import { Interview, Application, InterviewEvaluation } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { interviewApi, applicationApi } from '@/api';

export const InterviewsPage: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  useEffect(() => {
    if (isBackendOnline) {
      interviewApi.getAdminInterviews()
        .then(res => {
          if (res && res.length > 0) setInterviews(res);
        })
        .catch(err => console.warn('Could not load interviews:', err));

      applicationApi.getAdminApplications({ size: 100 })
        .then(res => {
          if (res && res.content && res.content.length > 0) setApplications(res.content);
        })
        .catch(err => console.warn('Could not load applications for interview scheduling:', err));
    }
  }, [isBackendOnline]);

  const handleAddInterview = async (newInv: Interview) => {
    if (isBackendOnline) {
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
        return;
      } catch (err) {
        console.warn('Real API create interview failed, fallback to local:', err);
      }
    }
    setInterviews(prev => [newInv, ...prev]);
  };

  const handleSaveEvaluation = async (interviewId: number, evaluation: InterviewEvaluation) => {
    if (isBackendOnline) {
      try {
        await interviewApi.evaluateInterview(interviewId, evaluation);
      } catch (err) {
        console.warn('Real API submit evaluation failed, fallback to local:', err);
      }
    }
    setInterviews(prev =>
      prev.map(inv => (inv.id === interviewId ? { ...inv, status: 'COMPLETED', evaluation } : inv))
    );
  };

  return (
    <div className="interviews-page-container">
      <AdminInterviewsPage
        interviews={interviews}
        applications={applications}
        onAddInterview={handleAddInterview}
        onSaveEvaluation={handleSaveEvaluation}
      />
    </div>
  );
};

export default InterviewsPage;
