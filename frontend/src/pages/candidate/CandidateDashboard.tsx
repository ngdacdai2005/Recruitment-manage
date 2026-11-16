import React from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  Bookmark, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Building2 
} from 'lucide-react';
import { Application, Interview } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface CandidateDashboardProps {
  applications: Application[];
  interviews: Interview[];
  onViewTracking: (app: Application) => void;
  onNavigateTab: (tab: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  applications,
  interviews,
  onViewTracking,
  onNavigateTab
}) => {
  const { currentUser, savedJobIds } = useAuth();

  const myApplications = applications.filter(
    app => app.candidate.email.toLowerCase() === (currentUser?.email || 'candidate@example.com').toLowerCase()
  );

  const pendingInterviews = interviews.filter(i => i.status === 'SCHEDULED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Candidate Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Xin chào, {currentUser?.fullName || 'Ứng viên'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light">
            Theo dõi trạng thái tiến độ hồ sơ ứng tuyển, cập nhật lịch phỏng vấn và quản lý CV cá nhân thuận tiện, minh bạch.
          </p>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{myApplications.length}</div>
            <div className="text-xs text-slate-500 font-medium">Hồ sơ đã ứng tuyển</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {myApplications.filter(a => ['APPLIED', 'SCREENING'].includes(a.currentStatus)).length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Đang trong vòng xét duyệt</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{pendingInterviews.length}</div>
            <div className="text-xs text-slate-500 font-medium">Lịch phỏng vấn sắp tới</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{savedJobIds.length}</div>
            <div className="text-xs text-slate-500 font-medium">Việc làm đã lưu</div>
          </div>
        </div>
      </div>

      {/* Main Sections: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Application Progress */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Tiến trình hồ sơ ứng tuyển</h2>
            <button
              onClick={() => onNavigateTab('candidate-applications')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myApplications.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">Bạn chưa nộp hồ sơ ứng tuyển vị trí nào.</p>
              <button
                onClick={() => onNavigateTab('jobs')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Khám phá việc làm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map(app => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {app.job.department.name}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{app.job.title}</h3>
                    <div className="text-xs text-slate-400">
                      Nộp ngày: {app.createdAt} • File: {app.resumeFilename || 'CV.pdf'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      app.currentStatus === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
                      app.currentStatus === 'OFFER' ? 'bg-purple-100 text-purple-800' :
                      app.currentStatus === 'INTERVIEW' ? 'bg-indigo-100 text-indigo-800' :
                      app.currentStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.currentStatus === 'APPLIED' ? 'Đã tiếp nhận' :
                       app.currentStatus === 'SCREENING' ? 'Đang sàng lọc' :
                       app.currentStatus === 'INTERVIEW' ? 'Vòng phỏng vấn' :
                       app.currentStatus === 'ASSESSMENT' ? 'Đánh giá / Test' :
                       app.currentStatus === 'OFFER' ? 'Đã gửi Offer' :
                       app.currentStatus === 'HIRED' ? 'Trúng tuyển 🎉' : 'Chưa phù hợp'}
                    </span>

                    <button
                      onClick={() => onViewTracking(app)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Theo dõi</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upcoming Interview Card & Quick Action */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Lịch phỏng vấn sắp diễn ra
            </h3>

            {pendingInterviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Hiện chưa có lịch phỏng vấn mới.</p>
            ) : (
              <div className="space-y-3">
                {pendingInterviews.map(inv => (
                  <div key={inv.id} className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800">
                      <span>{inv.interviewType} (60 phút)</span>
                      <span>{inv.scheduledAt.replace('T', ' ')}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{inv.jobTitle}</div>
                    <div className="text-xs text-slate-600">Interviewer: {inv.interviewerName}</div>
                    <a
                      href={inv.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tham gia Google Meet</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

