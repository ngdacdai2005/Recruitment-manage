import React, { useState, useEffect } from 'react';
import './ApplicationsPage.css';
import { AdminKanbanPage } from './components/AdminKanbanPage';
import { mockApplications } from '@/data/mockData';
import { Application, ApplicationStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { applicationApi } from '@/api';

export const ApplicationsPage: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  useEffect(() => {
    if (isBackendOnline) {
      applicationApi.getAdminApplications({ size: 100 })
        .then(res => {
          if (res && res.content && res.content.length > 0) {
            setApplications(res.content);
          }
        })
        .catch(err => console.warn('Could not load applications:', err));
    }
  }, [isBackendOnline]);

  const handleUpdateStatus = async (appId: number, toStatus: ApplicationStatus, reason?: string) => {
    if (isBackendOnline) {
      try {
        await applicationApi.updateStatus(appId, { toStatus, rejectionReason: reason });
      } catch (err) {
        console.warn('Backend update application status failed:', err);
      }
    }
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, currentStatus: toStatus } : app))
    );
  };

  return (
    <div className="applications-page-container">
      <AdminKanbanPage
        applications={applications}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ApplicationsPage;
