import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { DashboardStats, Application } from '@/types';
import { reportApi, applicationApi } from '@/api';
import { ROUTES } from '@/constants/routes.constants';

const initialStats: DashboardStats = {
  totalPublishedJobs: 0,
  totalCandidates: 0,
  totalApplications: 0,
  totalInterviews: 0,
  totalHired: 0,
  statusBreakdown: {
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    ASSESSMENT: 0,
    OFFER: 0,
    HIRED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  },
  conversionRate: 0,
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      reportApi.getDashboardOverview().catch(err => {
        console.warn('Could not load dashboard stats:', err);
        return null;
      }),
      applicationApi.getAdminApplications({ size: 10 }).catch(err => {
        console.warn('Could not load recent applications:', err);
        return null;
      })
    ]).then(([statsRes, appRes]) => {
      if (!isMounted) return;
      if (statsRes) setStats(statsRes);
      if (appRes && appRes.content) setRecentApplications(appRes.content);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleNavigateTab = (tab: string) => {
    if (tab === 'admin-pipeline') navigate(ROUTES.ADMIN.PIPELINE);
    else if (tab === 'admin-jobs') navigate(ROUTES.ADMIN.JOBS);
    else if (tab === 'admin-candidates') navigate(ROUTES.ADMIN.CANDIDATES);
    else if (tab === 'admin-interviews') navigate(ROUTES.ADMIN.INTERVIEWS);
    else if (tab === 'admin-employees') navigate(ROUTES.ADMIN.EMPLOYEES);
  };

  return (
    <div className="dashboard-page-container">
      {loading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải số liệu báo cáo Dashboard...</p>
        </div>
      ) : (
        <AdminDashboardPage
          stats={stats}
          recentApplications={recentApplications}
          onNavigateTab={handleNavigateTab}
        />
      )}
    </div>
  );
};

export default DashboardPage;
