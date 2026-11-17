import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  Kanban 
} from 'lucide-react';
import { DashboardStats, Application } from '@/types';

interface AdminDashboardPageProps {
  stats: DashboardStats;
  recentApplications: Application[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stats,
  recentApplications,
  onNavigateTab
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Quản Trị Tuyển Dụng (ATS)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan hiệu quả tuyển dụng, chỉ số chuyển đổi phễu ứng viên và tiến độ các chiến dịch.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('admin-pipeline')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
        >
          <Kanban className="w-4 h-4" />
          <span>Mở Kanban Pipeline</span>
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Vị trí đang mở</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalPublishedJobs}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+2 tin mới tháng này</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tổng hồ sơ nộp</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalApplications}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Lịch phỏng vấn</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalInterviews}</div>
          <div className="text-[11px] text-slate-500 font-medium">8 buổi tuần này</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tuyển thành công</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.totalHired}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Đạt 83% KPI quý</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tỷ lệ chuyển đổi</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{stats.conversionRate}%</div>
          <div className="text-[11px] text-slate-500 font-medium">Chuẩn SHRM ngành ATS</div>
        </div>
      </div>

      {/* Recruitment Funnel Visual */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Phễu Chuyển Đổi Tuyển Dụng (Recruitment Funnel)</h2>
            <p className="text-xs text-slate-500">Phân bố ứng viên theo từng vòng trong quy trình</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Thời gian tuyển trung bình (Time-to-fill): 18.5 ngày
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">1. Nộp hồ sơ</div>
            <div className="text-xl font-black text-slate-900">{stats.statusBreakdown.APPLIED}</div>
            <div className="text-[10px] text-slate-400">100% phễu vào</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">2. Sàng lọc CV</div>
            <div className="text-xl font-black text-indigo-600">{stats.statusBreakdown.SCREENING}</div>
            <div className="text-[10px] text-indigo-500 font-semibold">75% qua vòng</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">3. Phỏng vấn</div>
            <div className="text-xl font-black text-amber-600">{stats.statusBreakdown.INTERVIEW}</div>
            <div className="text-[10px] text-amber-500 font-semibold">50% tiếp tục</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">4. Bài test / Test</div>
            <div className="text-xl font-black text-sky-600">{stats.statusBreakdown.ASSESSMENT}</div>
            <div className="text-[10px] text-sky-500 font-semibold">30% đạt tiêu chuẩn</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">5. Gửi Offer</div>
            <div className="text-xl font-black text-purple-600">{stats.statusBreakdown.OFFER}</div>
            <div className="text-[10px] text-purple-500 font-semibold">15% đề nghị</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
            <div className="text-xs text-emerald-800 font-bold">6. Trúng tuyển</div>
            <div className="text-xl font-black text-emerald-600">{stats.statusBreakdown.HIRED}</div>
            <div className="text-[10px] text-emerald-700 font-bold">{stats.conversionRate}% chuyển đổi</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Hồ sơ ứng viên mới nộp gần đây</h2>
          <button
            onClick={() => onNavigateTab('admin-candidates')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Xem tất cả hồ sơ
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentApplications.map(app => (
            <div key={app.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-slate-900">{app.candidate.fullName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Ứng tuyển vị trí: <span className="font-semibold text-slate-700">{app.job.title}</span> • {app.createdAt}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  app.currentStatus === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
                  app.currentStatus === 'OFFER' ? 'bg-purple-100 text-purple-800' :
                  app.currentStatus === 'INTERVIEW' ? 'bg-indigo-100 text-indigo-800' :
                  app.currentStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {app.currentStatus}
                </span>

                <button
                  onClick={() => onNavigateTab('admin-pipeline')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Xử lý
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

