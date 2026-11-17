import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Filter, 
  Bookmark, 
  ArrowUpDown, 
  Calendar 
} from 'lucide-react';
import { mockJobs, mockDepartments } from '@/data/mockData';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface JobListingPageProps {
  onSelectJob: (job: Job) => void;
  onApplyClick: (job: Job) => void;
  initialKeyword?: string;
  initialDepartmentId?: number;
}

export const JobListingPage: React.FC<JobListingPageProps> = ({ 
  onSelectJob, 
  onApplyClick,
  initialKeyword = '',
  initialDepartmentId
}) => {
  const { savedJobIds, toggleSaveJob } = useAuth();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedDept, setSelectedDept] = useState<number | undefined>(initialDepartmentId);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'SALARY_DESC'>('NEWEST');

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      if (job.status !== 'PUBLISHED') return false;

      if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(kw);
        const matchDesc = job.description.toLowerCase().includes(kw);
        const matchReq = job.requirements.toLowerCase().includes(kw);
        if (!matchTitle && !matchDesc && !matchReq) return false;
      }

      if (selectedDept && job.department.id !== selectedDept) return false;
      if (selectedLevel !== 'ALL' && job.jobLevel !== selectedLevel) return false;
      if (selectedType !== 'ALL' && job.employmentType !== selectedType) return false;
      if (selectedLocation !== 'ALL' && !job.location.includes(selectedLocation)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'SALARY_DESC') {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [keyword, selectedDept, selectedLevel, selectedType, selectedLocation, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Danh Sách Việc Làm Đang Tuyển Dụng</h1>
        <p className="text-slate-500 text-sm">
          Khám phá cơ hội nghề nghiệp phù hợp và nâng tầm sự nghiệp cùng đội ngũ chuyên gia hàng đầu.
        </p>
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo chức danh, từ khóa hoặc kỹ năng..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Department Dropdown */}
            <select
              value={selectedDept || ''}
              onChange={(e) => setSelectedDept(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả phòng ban</option>
              {mockDepartments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Level Dropdown */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="ALL">Mọi cấp bậc</option>
              <option value="Junior">Junior</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Manager</option>
            </select>

            {/* Location Dropdown */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="ALL">Mọi địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none"
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="SALARY_DESC">Lương cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick filters badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Phòng ban:</span>
          <button
            onClick={() => setSelectedDept(undefined)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              !selectedDept ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tất cả ({mockJobs.filter(j => j.status === 'PUBLISHED').length})
          </button>
          {mockDepartments.map(dept => {
            const count = mockJobs.filter(j => j.status === 'PUBLISHED' && j.department.id === dept.id).length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedDept === dept.id ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {dept.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Tìm thấy <span className="font-bold text-slate-800">{filteredJobs.length}</span> vị trí phù hợp
        </div>
        {(keyword || selectedDept || selectedLevel !== 'ALL' || selectedLocation !== 'ALL') && (
          <button
            onClick={() => {
              setKeyword('');
              setSelectedDept(undefined);
              setSelectedLevel('ALL');
              setSelectedType('ALL');
              setSelectedLocation('ALL');
            }}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">Không tìm thấy vị trí tuyển dụng phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hãy thử tìm với từ khóa khác hoặc bỏ chọn các tiêu chí lọc để xem thêm các cơ hội việc làm đang mở khác.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                      {job.department.name}
                    </span>
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                      {job.jobLevel}
                    </span>
                    <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                      {job.employmentType}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectJob(job)}
                    className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> 
                      <span className="font-bold text-slate-800">
                        {job.salaryMin ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax! / 1000000).toFixed(0)} triệu` : 'Thỏa thuận'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Hạn nộp: {job.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isSaved 
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-600' 
                        : 'border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-slate-300'
                    }`}
                    title={isSaved ? 'Đã lưu việc làm' : 'Lưu tin'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Chi tiết
                  </button>

                  <button
                    onClick={() => onApplyClick(job)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                  >
                    Ứng tuyển
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

