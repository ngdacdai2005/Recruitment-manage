import React, { useState, useEffect } from 'react';
import { Application } from '@/types';
import { mockApplications } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { applicationApi } from '@/api';
import { ApplicationTrackingPage } from './components/ApplicationTrackingView';
import { FileText, Clock, ExternalLink, Building2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constants';

export const MyApplicationsPage: React.FC = () => {
  const { currentUser, isBackendOnline } = useAuth();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (isBackendOnline) {
      applicationApi.getMyApplications()
        .then(res => {
          if (res && res.length > 0) setApplications(res);
        })
        .catch(err => console.warn('Could not fetch applications:', err));
    }
  }, [isBackendOnline]);

  const myApps = applications.filter(
    app => app.candidate.email.toLowerCase() === (currentUser?.email || 'candidate@example.com').toLowerCase()
  );

  if (selectedApp) {
    return <ApplicationTrackingPage application={selectedApp} onBack={() => setSelectedApp(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Hồ Sơ Đã Nộp & Tiến Trình Ứng Tuyển</h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi trạng thái thời gian thực và lịch sử xử lý hồ sơ từng vị trí bạn đã ứng tuyển.
        </p>
      </div>

      {myApps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">Bạn chưa nộp hồ sơ ứng tuyển nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khám phá các vị trí tuyển dụng hấp dẫn tại công ty và nộp hồ sơ ngay hôm nay.
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.PUBLIC.JOBS}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Xem danh sách việc làm
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myApps.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{app.job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {app.currentStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {app.job.department.name}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Nộp ngày: {app.createdAt}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end mt-4">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Xem chi tiết tiến trình <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
