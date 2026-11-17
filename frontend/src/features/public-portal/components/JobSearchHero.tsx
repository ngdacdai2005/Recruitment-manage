import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Department } from '@/types';

interface JobSearchHeroProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  departments: Department[];
  selectedDeptId?: number;
  onDeptChange: (val?: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({
  keyword,
  onKeywordChange,
  departments,
  selectedDeptId,
  onDeptChange,
  onSubmit,
}) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative max-w-3xl space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-indigo-200">
          🚀 Tuyển Dụng Nhân Tài 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Khám Phá Cơ Hội Nghề Nghiệp Đột Phá Tại RecruitPro
        </h1>
        <p className="text-sm sm:text-base text-indigo-100 font-light max-w-2xl">
          Gia nhập đội ngũ kiến tạo công nghệ thế hệ mới, cùng phát triển các giải pháp phần mềm hàng đầu khu vực.
        </p>

        <form onSubmit={onSubmit} className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 gap-2 text-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tên công việc, kỹ năng, vị trí..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-slate-900"
            />
          </div>
          <div className="hidden sm:block w-[1px] bg-slate-200" />
          <div className="flex items-center px-4 gap-2 text-slate-800">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <select
              value={selectedDeptId || ''}
              onChange={(e) => onDeptChange(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none"
            >
              <option value="">Tất cả phòng ban</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white shadow-lg transition-colors whitespace-nowrap"
          >
            Tìm việc ngay
          </button>
        </form>
      </div>
    </div>
  );
};
