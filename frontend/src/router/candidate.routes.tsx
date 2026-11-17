import React, { useState, useEffect } from 'react';
import { RouteObject } from 'react-router-dom';
import { CandidateLayout } from '../layouts/CandidateLayout';
import { CandidateDashboardPage } from '../features/candidate-portal/CandidateDashboardPage';
import { CandidateProfilePage as ProfilePage } from '../features/candidate-portal/CandidateProfilePage';
import { CandidateProfilePage as MyCVPage } from '../features/candidate-portal/CandidateProfilePage';
import { MyApplicationsPage } from '../features/candidate-portal/MyApplicationsPage';
import { CandidateInterviewsPage } from '../features/candidate-portal/CandidateInterviewsPage';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';
import { mockInterviews } from '../data/mockData';
import { Interview } from '../types';
import { useAuth } from '../context/AuthContext';
import { interviewApi } from '../api';

const CandidateInterviewsWrapper: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);

  useEffect(() => {
    if (isBackendOnline) {
      interviewApi.getCandidateInterviews()
        .then((res: Interview[]) => {
          if (res && res.length > 0) setInterviews(res);
        })
        .catch((err: any) => console.warn('Could not load candidate interviews:', err));
    }
  }, [isBackendOnline]);

  return <CandidateInterviewsPage interviews={interviews} />;
};

export const candidateRoutes: RouteObject[] = [
  {
    path: '/candidate',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ROLE_CANDIDATE', 'ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER']}>
          <CandidateLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CandidateDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <CandidateDashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'applications',
        element: <MyApplicationsPage />,
      },
      {
        path: 'interviews',
        element: <CandidateInterviewsWrapper />,
      },
      {
        path: 'cv',
        element: <MyCVPage />,
      },
    ],
  },
];

export default candidateRoutes;
