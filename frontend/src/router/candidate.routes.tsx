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
import { Interview } from '../types';
import { interviewApi } from '../api';

const CandidateInterviewsWrapper: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    let isMounted = true;
    interviewApi.getCandidateInterviews()
      .then((res: Interview[]) => {
        if (isMounted) setInterviews(res || []);
      })
      .catch((err: any) => {
        console.warn('Could not load candidate interviews:', err);
        if (isMounted) setInterviews([]);
      });

    return () => { isMounted = false; };
  }, []);

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
