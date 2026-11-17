import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateDashboard } from './components/CandidateDashboardView';
import { ApplicationTrackingPage } from './components/ApplicationTrackingView';
import { mockApplications, mockInterviews } from '@/data/mockData';
import { Application, Interview } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { applicationApi, interviewApi } from '@/api';
import { ROUTES } from '@/constants/routes.constants';

export const CandidateDashboardPage: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [trackingApp, setTrackingApp] = useState<Application | null>(null);

  useEffect(() => {
    if (isBackendOnline) {
      applicationApi.getMyApplications()
        .then(res => {
          if (res && res.length > 0) setApplications(res);
        })
        .catch(err => console.warn('Could not load my applications:', err));

      interviewApi.getCandidateInterviews()
        .then((res: Interview[]) => {
          if (res && res.length > 0) setInterviews(res);
        })
        .catch((err: any) => console.warn('Could not load my interviews:', err));
    }
  }, [isBackendOnline]);

  if (trackingApp) {
    return (
      <ApplicationTrackingPage
        application={trackingApp}
        onBack={() => setTrackingApp(null)}
      />
    );
  }

  return (
    <CandidateDashboard
      applications={applications}
      interviews={interviews}
      onViewTracking={(app: Application) => setTrackingApp(app)}
      onNavigateTab={(tab: string) => {
        if (tab === 'candidate-applications') navigate(ROUTES.CANDIDATE.APPLICATIONS);
        else if (tab === 'candidate-profile') navigate(ROUTES.CANDIDATE.PROFILE);
        else if (tab === 'candidate-interviews') navigate(ROUTES.CANDIDATE.INTERVIEWS);
        else if (tab === 'jobs') navigate(ROUTES.PUBLIC.JOBS);
      }}
    />
  );
};
