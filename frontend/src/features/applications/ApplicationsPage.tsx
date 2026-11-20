import React, { useState, useEffect } from 'react';
import './ApplicationsPage.css';
import { AdminKanbanPage } from './components/AdminKanbanPage';
import { Application, ApplicationStatus, Job } from '@/types';
import { applicationApi, jobApi } from '@/api';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      applicationApi.getAdminApplications({ size: 100 }).catch(err => {
        console.warn('Could not load applications:', err);
        return null;
      }),
      jobApi.getAdminJobs({ size: 100 }).catch(err => {
        console.warn('Could not load jobs:', err);
        return null;
      })
    ]).then(([appRes, jobRes]) => {
      if (!isMounted) return;
      if (appRes && appRes.content) {
        setApplications(appRes.content);
      } else {
        setApplications([]);
      }
      if (jobRes && jobRes.content) {
        setJobs(jobRes.content);
      } else {
        setJobs([]);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleUpdateStatus = async (appId: number, toStatus: ApplicationStatus, reason?: string) => {
    try {
      await applicationApi.updateStatus(appId, { toStatus, rejectionReason: reason });
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, currentStatus: toStatus } : app))
      );
    } catch (err) {
      console.warn('Backend update application status failed:', err);
    }
  };

  return (
    <div className="applications-page-container">
      {loading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu Pipeline từ hệ thống...</p>
        </div>
      ) : (
        <AdminKanbanPage
          applications={applications}
          jobs={jobs}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
