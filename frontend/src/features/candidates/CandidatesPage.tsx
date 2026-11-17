import React, { useState, useEffect } from 'react';
import './CandidatesPage.css';
import { AdminCandidatesPage } from './components/AdminCandidatesPage';
import { mockApplications } from '@/data/mockData';
import { Application } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { applicationApi } from '@/api';

export const CandidatesPage: React.FC = () => {
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
        .catch(err => console.warn('Could not load candidates:', err));
    }
  }, [isBackendOnline]);

  return (
    <div className="candidates-page-container">
      <AdminCandidatesPage applications={applications} />
    </div>
  );
};

export default CandidatesPage;
