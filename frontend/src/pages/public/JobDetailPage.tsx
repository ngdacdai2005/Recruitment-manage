import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Users, 
  Bookmark, 
  Share2, 
  Briefcase, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { mockJobs } from '../../data/mockData';

interface JobDetailPageProps {
  job: Job;
  onBack: () => void;
  onApplyClick: (job: Job) => void;
  onSelectSimilarJob: (job: Job) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ 
  job, 
  onBack, 
  onApplyClick, 
  onSelectSimilarJob 
}) => {
  const { savedJobIds, toggleSaveJob } = useAuth();
  const isSaved = savedJobIds.includes(job.id);

  const similarJobs = mockJobs
    .filter(j => j.id !== job.id && (j.department.id === job.department.id || j.jobLevel === job.jobLevel))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách việc làm</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                {job.department.name}
              </span>
              <span className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                Cấp bậc: {job.jobLevel}
              </span>
              <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                {job.employmentType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Số lượng: {job.quantity} người</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Hạn nộp: {job.deadline}</span>
            </div>
          </div>

          {/* Quick Salary and Apply */}
          <div className="flex flex-col sm:items-end gap-3 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-medium">Mức lương dự kiến</span>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600">
                {job.salaryMin ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax! / 1000000).toFixed(0)} triệu VNĐ` : 'Thỏa thuận'}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved 
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-600' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Đã lưu việc làm' : 'Lưu công việc'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-indigo-600' : ''}`} />
              </button>

              <button
                onClick={() => onApplyClick(job)}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Ứng tuyển ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Description, Requirements, Benefits */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Mô tả công việc (Job Description)
            </h2>
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Yêu cầu ứng viên (Requirements)
            </h2>
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {job.requirements}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Quyền lợi và chế độ đãi ngộ (Benefits)
            </h2>
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {job.benefits}
            </div>
          </div>
        </div>

        {/* Right Column: Company Info & Similar Jobs */}
        <div className="space-y-6">
          {/* Department card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Thông tin phòng ban
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 text-sm">{job.department.name}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{job.department.description}</div>
            </div>
            <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Hình thức:</span>
                <span className="font-semibold text-slate-700">{job.employmentType}</span>
              </div>
              <div className="flex justify-between">
                <span>Kinh nghiệm:</span>
                <span className="font-semibold text-slate-700">{job.experienceYears || '1-3 năm'}</span>
              </div>
              <div className="flex justify-between">
                <span>Hạn ứng tuyển:</span>
                <span className="font-semibold text-rose-600">{job.deadline}</span>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Vị trí tương tự</h3>
            <div className="space-y-3">
              {similarJobs.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectSimilarJob(item)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all space-y-1"
                >
                  <h4 className="font-bold text-xs text-slate-800 hover:text-indigo-600 line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{item.department.name}</span>
                    <span className="font-bold text-indigo-600">
                      {item.salaryMin ? `${(item.salaryMin/1000000).toFixed(0)}-${(item.salaryMax!/1000000).toFixed(0)}tr` : 'Thỏa thuận'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

