import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  DollarSign, 
  Calendar, 
  X, 
  Eye 
} from 'lucide-react';
import { Job, JobStatus, Department } from '../../types';
import { mockJobs, mockDepartments } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { jobApi, departmentApi } from '../../api';

export const AdminJobsPage: React.FC = () => {
  const { currentRole, isBackendOnline } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  useEffect(() => {
    if (isBackendOnline) {
      jobApi.getAdminJobs()
        .then(res => {
          if (res && res.content && res.content.length > 0) {
            setJobs(res.content);
          }
        })
        .catch(err => console.warn('Could not fetch admin jobs:', err));

      departmentApi.getDepartments()
        .then(res => {
          if (res && res.length > 0) {
            setDepartments(res);
          }
        })
        .catch(err => console.warn('Could not fetch departments:', err));
    }
  }, [isBackendOnline]);
  
  // Create Job Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeptId, setNewDeptId] = useState<number>(1);
  const [newLevel, setNewLevel] = useState('Senior');
  const [newType, setNewType] = useState('Full-time');
  const [newLocation, setNewLocation] = useState('Hà Nội (Hybrid)');
  const [newSalaryMin, setNewSalaryMin] = useState('25000000');
  const [newSalaryMax, setNewSalaryMax] = useState('45000000');
  const [newQuantity, setNewQuantity] = useState(2);
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newDesc, setNewDesc] = useState('Mô tả công việc và trách nhiệm chính...');
  const [newReq, setNewReq] = useState('Yêu cầu về kỹ năng và kinh nghiệm...');
  const [newBen, setNewBen] = useState('Quyền lợi, chế độ thưởng và bảo hiểm VIP...');

  const filteredJobs = jobs.filter(j => {
    if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
    if (deptFilter !== 'ALL' && j.department.id.toString() !== deptFilter) return false;
    if (keyword.trim() && !j.title.toLowerCase().includes(keyword.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = async (jobId: number, nextStatus: JobStatus) => {
    if (isBackendOnline) {
      try {
        await jobApi.updateJobStatus(jobId, nextStatus);
      } catch (e) {
        console.warn('Real API job status update failed:', e);
      }
    }
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === newDeptId) || departments[0];

    const jobData: Partial<Job> = {
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      department: dept,
      jobLevel: newLevel,
      employmentType: newType,
      location: newLocation,
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      quantity: newQuantity,
      deadline: newDeadline,
      description: newDesc,
      requirements: newReq,
      benefits: newBen,
      status: currentRole === 'ROLE_RECRUITER' ? 'PENDING_APPROVAL' : 'PUBLISHED',
    };

    if (isBackendOnline) {
      try {
        const created = await jobApi.createJob(jobData, newDeptId);
        setJobs([created, ...jobs]);
        setIsModalOpen(false);
        setNewTitle('');
        return;
      } catch (err) {
        console.warn('Real API createJob failed, using local fallback:', err);
      }
    }

    const newJob: Job = {
      id: Date.now(),
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      department: dept,
      jobLevel: newLevel,
      employmentType: newType,
      location: newLocation,
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      quantity: newQuantity,
      deadline: newDeadline,
      description: newDesc,
      requirements: newReq,
      benefits: newBen,
      status: currentRole === 'ROLE_RECRUITER' ? 'PENDING_APPROVAL' : 'PUBLISHED',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Tin Tuyển Dụng (Job Management)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình tạo tin, gửi phê duyệt (Approval Workflow) và xuất bản lên cổng thông tin Public Careers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tin tuyển dụng mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full flex items-center bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo chức danh..."
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đang tuyển (PUBLISHED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
            <option value="PENDING_APPROVAL">Chờ duyệt (PENDING)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Tất cả phòng ban</option>
            {mockDepartments.map(d => (
              <option key={d.id} value={d.id.toString()}>{d.code} - {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Chức danh tuyển dụng</th>
                <th className="py-3 px-4">Phòng ban</th>
                <th className="py-3 px-4">Cấp bậc / Địa điểm</th>
                <th className="py-3 px-4">Mức lương</th>
                <th className="py-3 px-4">Hạn nộp</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{job.title}</div>
                    <div className="text-[11px] text-slate-400">SL: {job.quantity} người • Tạo: {job.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {job.department.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{job.jobLevel}</span>
                    <div className="text-[11px] text-slate-400">{job.location}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">
                    {job.salaryMin ? `${(job.salaryMin/1000000).toFixed(0)}-${(job.salaryMax!/1000000).toFixed(0)}tr` : 'Thỏa thuận'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {job.deadline}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'DRAFT' ? 'bg-slate-100 text-slate-600' :
                      job.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    {job.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'PUBLISHED')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        Đăng tin
                      </button>
                    )}
                    {job.status === 'PUBLISHED' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'CLOSED')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        Đóng tin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Tạo tin tuyển dụng mới</h3>
                <p className="text-xs text-slate-500">Thiết lập thông tin vị trí, yêu cầu và chế độ đãi ngộ</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tên vị trí tuyển dụng (Job Title) *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Senior Backend Java Developer..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phòng ban *</label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {mockDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Cấp bậc</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Manager</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hình thức làm việc</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lương tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lương tối đa (VNĐ)</label>
                  <input
                    type="number"
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hạn nộp hồ sơ</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mô tả công việc (Job Description)</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Yêu cầu ứng viên (Requirements)</label>
                <textarea
                  rows={3}
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Quyền lợi và Đãi ngộ (Benefits)</label>
                <textarea
                  rows={2}
                  value={newBen}
                  onChange={(e) => setNewBen(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200"
                >
                  Lưu & Xuất bản tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

