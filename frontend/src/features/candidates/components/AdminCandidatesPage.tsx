import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  FileText, 
  Download, 
  Mail, 
  Phone, 
  ExternalLink, 
  X, 
  Calendar, 
  Briefcase 
} from 'lucide-react';
import { Application } from '@/types';

interface AdminCandidatesPageProps {
  applications: Application[];
}

export const AdminCandidatesPage: React.FC<AdminCandidatesPageProps> = ({ applications }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = applications.filter(app => {
    if (!keyword.trim()) return true;
    const kw = keyword.toLowerCase();
    return (
      (app.candidate?.fullName || '').toLowerCase().includes(kw) ||
      (app.candidate?.email || '').toLowerCase().includes(kw) ||
      (app.job?.title || '').toLowerCase().includes(kw)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kho Hồ Sơ Ứng Viên (Candidate Database & Talent Pool)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị thông tin ứng viên, xem bản CV đính kèm thời điểm nộp và theo dõi lịch sử ứng tuyển.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center bg-slate-50">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên ứng viên, email hoặc vị trí ứng tuyển..."
          className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
        />
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ứng viên</th>
                <th className="py-3.5 px-4">Vị trí ứng tuyển</th>
                <th className="py-3.5 px-4">Liên hệ</th>
                <th className="py-3.5 px-4">CV Đính kèm</th>
                <th className="py-3.5 px-4">Trạng thái hiện tại</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">Chưa có hồ sơ ứng viên nào trong hệ thống</p>
                    <p className="text-[11px] text-slate-400 mt-1">Khi ứng viên nộp hồ sơ, dữ liệu sẽ tự động hiển thị tại đây.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.candidate?.fullName || 'Ứng viên'}</div>
                    <div className="text-[11px] text-slate-400">{app.candidate?.headline || ''}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{app.job?.title || 'Vị trí tuyển dụng'}</span>
                    <div className="text-[10px] text-slate-400">{app.job?.department?.name || ''}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                    <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {app.candidate?.email || ''}</div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {app.candidate?.phone || ''}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{app.resumeFilename || 'CV_UngVien.pdf'}</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      app.currentStatus === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
                      app.currentStatus === 'OFFER' ? 'bg-purple-100 text-purple-800' :
                      app.currentStatus === 'INTERVIEW' ? 'bg-indigo-100 text-indigo-800' :
                      app.currentStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.currentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Xem hồ sơ
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{selectedApp.candidate.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedApp.candidate.headline}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium">Vị trí ứng tuyển:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedApp.job.title}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Ngày nộp đơn:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedApp.createdAt}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Lương mong muốn:</span>
                  <div className="font-bold text-indigo-600 mt-0.5">
                    {selectedApp.expectedSalary ? `${selectedApp.expectedSalary.toLocaleString()} VNĐ` : 'Thỏa thuận'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Ngày có thể nhận việc:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedApp.availableDate || 'Ngay lập tức'}</div>
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-800">Thư giới thiệu (Cover Letter):</span>
                  <p className="p-3 bg-slate-50 rounded-xl leading-relaxed text-slate-600">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-slate-800">CV Snapshot thời điểm ứng tuyển:</span>
                <div className="flex items-center justify-between p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">{selectedApp.resumeFilename || 'CV_UngVien.pdf'}</span>
                  </div>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải CV</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

