import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { mockDashboardStats, mockApplications } from '@/data/mockData';
import { DashboardStats, Application } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { reportApi, applicationApi } from '@/api';
import { ROUTES } from '@/constants/routes.constants';

export const DashboardPage: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [recentApplications, setRecentApplications] = useState<Application[]>(mockApplications);

  useEffect(() => {
    if (isBackendOnline) {
      reportApi.getDashboardOverview()
        .then((res: DashboardStats) => {
          if (res) setStats(res);
        })
        .catch((err: any) => console.warn('Could not load dashboard stats:', err));

      applicationApi.getAdminApplications({ size: 10 })
        .then(res => {
          if (res && res.content) setRecentApplications(res.content);
        })
        .catch(err => console.warn('Could not load recent applications:', err));
    }
  }, [isBackendOnline]);

  const handleNavigateTab = (tab: string) => {
    if (tab === 'admin-pipeline') navigate(ROUTES.ADMIN.PIPELINE);
    else if (tab === 'admin-jobs') navigate(ROUTES.ADMIN.JOBS);
    else if (tab === 'admin-candidates') navigate(ROUTES.ADMIN.CANDIDATES);
    else if (tab === 'admin-interviews') navigate(ROUTES.ADMIN.INTERVIEWS);
    else if (tab === 'admin-employees') navigate(ROUTES.ADMIN.EMPLOYEES);
  };

  return (
    <div className="dashboard-page-container">
      <AdminDashboardPage
        stats={stats}
        recentApplications={recentApplications}
        onNavigateTab={handleNavigateTab}
      />
    </div>
  );
};

export default DashboardPage;
