import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateDashboard } from './components/CandidateDashboardView';
import { ApplicationTrackingPage } from './components/ApplicationTrackingView';
import { Application, Interview } from '@/types';
import { applicationApi, interviewApi } from '@/api';
import { ROUTES } from '@/constants/routes.constants';

export const CandidateDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [trackingApp, setTrackingApp] = useState<Application | null>(null);

  useEffect(() => {
    let isMounted = true;
    applicationApi.getMyApplications()
      .then(res => {
        if (isMounted) setApplications(res || []);
      })
      .catch(err => {
        console.warn('Could not load my applications:', err);
        if (isMounted) setApplications([]);
      });

    interviewApi.getCandidateInterviews()
      .then((res: Interview[]) => {
        if (isMounted) setInterviews(res || []);
      })
      .catch((err: any) => {
        console.warn('Could not load my interviews:', err);
        if (isMounted) setInterviews([]);
      });

    return () => { isMounted = false; };
  }, []);

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
