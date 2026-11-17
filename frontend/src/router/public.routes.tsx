import React, { useState } from 'react';
import { RouteObject, useNavigate, useParams, useSearchParams, useOutletContext } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../features/public-portal/HomePage';
import { JobListingPage } from '../features/public-portal/JobListingPage';
import { JobDetailPage } from '../features/public-portal/JobDetailPage';
import { CulturePage } from '../features/public-portal/CulturePage';
import { AuthPage } from '../features/auth/AuthPage';
import { ApplyModal } from '../components/candidate/ApplyModal';
import { mockJobs, mockApplications } from '../data/mockData';
import { Job, Application } from '../types';

interface PublicOutletContext {
  onApplyClick: (job: Job) => void;
}

const HomeRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { onApplyClick } = useOutletContext<PublicOutletContext>();

  return (
    <HomePage
      onSelectJob={(job) => navigate(`/jobs/${job.id}`)}
      onNavigateJobs={(params) => {
        const query = params?.keyword ? `?keyword=${encodeURIComponent(params.keyword)}` : '';
        navigate(`/jobs${query}`);
      }}
      onApplyClick={onApplyClick}
    />
  );
};

const JobListingRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const { onApplyClick } = useOutletContext<PublicOutletContext>();

  return (
    <JobListingPage
      initialKeyword={keyword}
      onSelectJob={(job) => navigate(`/jobs/${job.id}`)}
      onApplyClick={onApplyClick}
    />
  );
};

const JobDetailRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onApplyClick } = useOutletContext<PublicOutletContext>();
  const job = mockJobs.find((j) => j.id.toString() === id) || mockJobs[0];

  return (
    <JobDetailPage
      job={job}
      onBack={() => navigate('/jobs')}
      onApplyClick={onApplyClick}
      onSelectSimilarJob={(j) => navigate(`/jobs/${j.id}`)}
    />
  );
};

export const PublicLayoutContainer: React.FC = () => {
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  return (
    <>
      <PublicLayout onApplyClick={(job) => setSelectedJobToApply(job)} />
      {selectedJobToApply && (
        <ApplyModal
          job={selectedJobToApply}
          isOpen={Boolean(selectedJobToApply)}
          onClose={() => setSelectedJobToApply(null)}
          onSubmitSuccess={(newApp) => {
            setApplications([newApp, ...applications]);
          }}
          existingApplications={applications}
        />
      )}
    </>
  );
};

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayoutContainer />,
    children: [
      {
        index: true,
        element: <HomeRouteWrapper />,
      },
      {
        path: 'jobs',
        element: <JobListingRouteWrapper />,
      },
      {
        path: 'jobs/:id',
        element: <JobDetailRouteWrapper />,
      },
      {
        path: 'culture',
        element: <CulturePage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
    ],
  },
];

export default publicRoutes;
