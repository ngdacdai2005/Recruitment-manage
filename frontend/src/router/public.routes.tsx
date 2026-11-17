import React, { useState, useEffect } from 'react';
import { RouteObject, useNavigate, useParams, useSearchParams, useOutletContext } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../features/public-portal/HomePage';
import { JobListingPage } from '../features/public-portal/JobListingPage';
import { JobDetailPage } from '../features/public-portal/JobDetailPage';
import { CulturePage } from '../features/public-portal/CulturePage';
import { AuthPage } from '../features/auth/AuthPage';
import { ApplyModal } from '../components/candidate/ApplyModal';
import { Job, Application } from '../types';
import { jobApi } from '../api/jobApi';
import { applicationApi } from '../api/applicationApi';
import { useAuth } from '../context/AuthContext';

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
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    jobApi.getJobBySlug(id)
      .then(res => {
        if (isMounted) setJob(res);
      })
      .catch(err => {
        console.warn('Could not load job by slug/id from API:', err);
        if (isMounted) setJob(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-xs text-slate-500 font-medium">Đang tải thông tin việc làm...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy vị trí tuyển dụng này</h2>
        <p className="text-xs text-slate-500">Tin tuyển dụng có thể đã hết hạn hoặc tạm dừng nhận hồ sơ.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          Quay lại danh sách việc làm
        </button>
      </div>
    );
  }

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
  const { isBackendOnline, currentUser } = useAuth();
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (isBackendOnline && currentUser) {
      applicationApi.getMyApplications()
        .then(res => {
          if (res && res.length > 0) setApplications(res);
        })
        .catch(() => {});
    }
  }, [isBackendOnline, currentUser?.id]);

  return (
    <>
      <PublicLayout onApplyClick={(job) => setSelectedJobToApply(job)} />
      {selectedJobToApply && (
        <ApplyModal
          job={selectedJobToApply}
          isOpen={Boolean(selectedJobToApply)}
          onClose={() => setSelectedJobToApply(null)}
          onSubmitSuccess={(newApp) => {
            setApplications(prev => [newApp, ...prev]);
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
