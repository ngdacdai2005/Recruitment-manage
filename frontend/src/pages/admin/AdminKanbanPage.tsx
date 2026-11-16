import React, { useState } from 'react';
import { 
  Kanban, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Filter, 
  User, 
  DollarSign, 
  Calendar, 
  FileText, 
  XCircle, 
  Award, 
  HelpCircle 
} from 'lucide-react';
import { Application, ApplicationStatus, Job } from '../../types';
import { mockJobs } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface AdminKanbanPageProps {
  applications: Application[];
  onUpdateStatus: (appId: number, toStatus: ApplicationStatus, reason?: string) => void;
}

export const AdminKanbanPage: React.FC<AdminKanbanPageProps> = ({
  applications,
  onUpdateStatus
}) => {
  const { currentUser } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<number | 'ALL'>('ALL');
  
  // Rejection modal state
  const [rejectingApp, setRejectingApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [businessError, setBusinessError] = useState<string | null>(null);

  // Define Kanban columns
  const columns: { id: ApplicationStatus; title: string; color: string; badgeBg: string }[] = [
    { id: 'APPLIED', title: '1. Đã ứng tuyển', color: 'border-slate-300', badgeBg: 'bg-slate-100 text-slate-700' },
    { id: 'SCREENING', title: '2. Sàng lọc CV', color: 'border-blue-300', badgeBg: 'bg-blue-50 text-blue-700' },
    { id: 'INTERVIEW', title: '3. Phỏng vấn', color: 'border-amber-300', badgeBg: 'bg-amber-50 text-amber-700' },
    { id: 'ASSESSMENT', title: '4. Đánh giá / Test', color: 'border-sky-300', badgeBg: 'bg-sky-50 text-sky-700' },
    { id: 'OFFER', title: '5. Đề nghị (Offer)', color: 'border-purple-300', badgeBg: 'bg-purple-50 text-purple-700' },
    { id: 'HIRED', title: '6. Tuyển thành công', color: 'border-emerald-400', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { id: 'REJECTED', title: '7. Từ chối hồ sơ', color: 'border-rose-300', badgeBg: 'bg-rose-50 text-rose-700' },
  ];

  const filteredApps = applications.filter(app => {
    if (selectedJobId !== 'ALL' && app.job.id !== selectedJobId) return false;
    return true;
  });

  // Business Rules validation
  const handleMoveCandidate = (app: Application, targetStatus: ApplicationStatus) => {
    setBusinessError(null);

    // Rule: Terminal status cannot be moved
    if (app.currentStatus === 'REJECTED' || app.currentStatus === 'WITHDRAWN') {
      setBusinessError(`Không thể chuyển đổi trạng thái hồ sơ đã kết thúc (${app.currentStatus}).`);
      return;
    }

    // Rule: REJECTED requires reason
    if (targetStatus === 'REJECTED') {
      setRejectingApp(app);
      setRejectionReason('');
      return;
    }

    // Rule: Cannot jump to HIRED without OFFER
    if (targetStatus === 'HIRED' && app.currentStatus !== 'OFFER') {
      setBusinessError('Quy tắc nghiệp vụ: Ứng viên bắt buộc phải trải qua giai đoạn gửi Offer trước khi chuyển sang Tuyển thành công (HIRED).');
      return;
    }

    onUpdateStatus(app.id, targetStatus);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingApp) return;

    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối hồ sơ ứng viên theo quy định.');
      return;
    }

    onUpdateStatus(rejectingApp.id, 'REJECTED', rejectionReason);
    setRejectingApp(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 leading-tight">Quy Trình Tuyển Dụng (Kanban Pipeline ATS)</h1>
            <p className="text-xs text-slate-500">Quản lý và điều phối luồng ứng viên qua từng vòng tuyển dụng</p>
          </div>
        </div>

        {/* Filter by Job Post */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Lọc theo vị trí:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
          >
            <option value="ALL">Tất cả vị trí tuyển dụng ({applications.length} hồ sơ)</option>
            {mockJobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Business Error Banner */}
      {businessError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{businessError}</span>
          </div>
          <button onClick={() => setBusinessError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-8 items-start min-h-[650px]">
        {columns.map((col, colIdx) => {
          const appsInCol = filteredApps.filter(a => a.currentStatus === col.id);

          return (
            <div
              key={col.id}
              className={`w-72 shrink-0 bg-slate-100/70 rounded-2xl border ${col.color} p-3 flex flex-col max-h-[800px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <span className="font-bold text-xs text-slate-800">{col.title}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {appsInCol.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {appsInCol.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    Chưa có ứng viên
                  </div>
                ) : (
                  appsInCol.map(app => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{app.candidate.fullName}</h4>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-semibold">
                            {app.job.department.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{app.candidate.headline}</p>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg text-[11px] space-y-1 text-slate-600">
                        <div className="line-clamp-1 font-medium text-slate-800">{app.job.title}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Lương: {(app.expectedSalary || 0)/1000000}tr</span>
                          <span>{app.createdAt.split(' ')[0]}</span>
                        </div>
                      </div>

                      {app.rejectionReason && (
                        <div className="p-2 bg-rose-50 rounded-lg text-[10px] text-rose-700 italic border border-rose-100 line-clamp-2">
                          Lý do: {app.rejectionReason}
                        </div>
                      )}

                      {/* Transition Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {colIdx > 0 && col.id !== 'REJECTED' ? (
                          <button
                            onClick={() => handleMoveCandidate(app, columns[colIdx - 1].id)}
                            className="p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors"
                            title="Lùi lại vòng trước"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        ) : <span />}

                        {col.id !== 'REJECTED' && col.id !== 'HIRED' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveCandidate(app, 'REJECTED')}
                              className="px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Từ chối hồ sơ này"
                            >
                              Từ chối
                            </button>

                            {colIdx < columns.length - 2 && (
                              <button
                                onClick={() => handleMoveCandidate(app, columns[colIdx + 1].id)}
                                className="px-2 py-0.5 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-0.5"
                                title="Chuyển sang vòng tiếp theo"
                              >
                                <span>Tiếp</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Candidate Modal (Requires Reason) */}
      {rejectingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Từ chối hồ sơ ứng viên</span>
              </div>
              <button onClick={() => setRejectingApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Bạn đang chuyển ứng viên <strong className="text-slate-900">{rejectingApp.candidate.fullName}</strong> sang trạng thái <strong>REJECTED</strong>. Theo quy chuẩn tuyển dụng, bắt buộc phải ghi nhận lý do từ chối để phục vụ báo cáo và lưu vào Talent Pool.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Lý do từ chối hồ sơ *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ví dụ: Chưa đáp ứng số năm kinh nghiệm yêu cầu; không đạt bài kiểm tra kỹ thuật..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-200"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

