import React, { useState, useEffect } from 'react';
import './CandidatesPage.css';
import { AdminCandidatesPage } from './components/AdminCandidatesPage';
import { Application } from '@/types';
import { applicationApi } from '@/api';

export const CandidatesPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    applicationApi.getAdminApplications({ size: 100 })
      .then(res => {
        if (!isMounted) return;
        setApplications(res?.content || []);
      })
      .catch(err => {
        console.warn('Could not load candidates:', err);
        if (!isMounted) return;
        setApplications([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="candidates-page-container">
      {loading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách hồ sơ ứng viên...</p>
        </div>
      ) : (
        <AdminCandidatesPage applications={applications} />
      )}
    </div>
  );
};

export default CandidatesPage;
