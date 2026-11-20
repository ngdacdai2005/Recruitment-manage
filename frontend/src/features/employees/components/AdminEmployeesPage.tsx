import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  User as UserIcon, 
  FileText,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Employee, Position, Department, Gender, ContractType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { employeeApi, positionApi, departmentApi } from '@/api';

export const AdminEmployeesPage: React.FC = () => {
  const { currentRole, isBackendOnline } = useAuth();

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [contractFilter, setContractFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form state
  const initialFormData = {
    email: '',
    password: 'Password123@',
    fullName: '',
    shortName: '',
    phone: '',
    gender: 'MALE' as Gender,
    dob: '1995-01-01',
    address: '',
    avatar: '',
    profile: '',
    cccd: '',
    cccdIssueDate: '',
    cccdIssuePlace: 'Cục CS QLHC về TTXH',
    bankAccount: '',
    bankName: 'Techcombank',
    employeeCode: '',
    joinDate: new Date().toISOString().split('T')[0],
    contractType: 'OFFICIAL' as ContractType,
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: '',
    departmentId: 1,
    positionId: 1,
    roleName: 'ROLE_RECRUITER',
    status: 1
  };
  const [formData, setFormData] = useState(initialFormData);

  // Load backend data if available
  const fetchEmployeesData = async () => {
    if (!isBackendOnline) return;
    setLoading(true);
    try {
      const [empRes, posRes, deptRes] = await Promise.all([
        employeeApi.getEmployees({ size: 100 }).catch(err => {
          console.warn('Could not fetch employees:', err);
          return null;
        }),
        positionApi.getAllPositions().catch(err => {
          console.warn('Could not fetch positions:', err);
          return null;
        }),
        departmentApi.getDepartments().catch(err => {
          console.warn('Could not fetch departments:', err);
          return null;
        })
      ]);

      if (empRes && empRes.content) {
        setEmployees(empRes.content);
      } else {
        setEmployees([]);
      }
      if (posRes && Array.isArray(posRes)) {
        setPositions(posRes);
      } else {
        setPositions([]);
      }
      if (deptRes && Array.isArray(deptRes)) {
        setDepartments(deptRes);
      } else {
        setDepartments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, [isBackendOnline]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    if (emp.isDelete) return false;
    if (statusFilter !== 'ALL' && emp.status.toString() !== statusFilter) return false;
    if (deptFilter !== 'ALL' && emp.departmentId?.toString() !== deptFilter) return false;
    if (positionFilter !== 'ALL' && emp.positionId?.toString() !== positionFilter) return false;
    if (contractFilter !== 'ALL' && emp.contractType !== contractFilter) return false;

    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      const matchName = emp.fullName.toLowerCase().includes(kw);
      const matchCode = emp.employeeCode.toLowerCase().includes(kw);
      const matchEmail = emp.email.toLowerCase().includes(kw);
      const matchPhone = emp.phone.toLowerCase().includes(kw);
      if (!matchName && !matchCode && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  // KPI counts
  const totalEmployees = employees.filter(e => !e.isDelete).length;
  const officialCount = employees.filter(e => !e.isDelete && e.contractType === 'OFFICIAL').length;
  const probationCount = employees.filter(e => !e.isDelete && e.contractType === 'PROBATION').length;
  const activeCount = employees.filter(e => !e.isDelete && e.status === 1).length;

  // Open Create Modal
  const handleOpenCreate = () => {
    const nextCode = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    setFormData({
      ...initialFormData,
      employeeCode: nextCode,
      departmentId: departments[0]?.id || 1,
      positionId: positions[0]?.id || 1
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      email: emp.email,
      password: '',
      fullName: emp.fullName,
      shortName: emp.shortName || '',
      phone: emp.phone,
      gender: emp.gender,
      dob: emp.dob || '',
      address: emp.address || '',
      avatar: emp.avatar || '',
      profile: emp.profile || '',
      cccd: emp.cccd || '',
      cccdIssueDate: emp.cccdIssueDate || '',
      cccdIssuePlace: emp.cccdIssuePlace || '',
      bankAccount: emp.bankAccount || '',
      bankName: emp.bankName || 'Techcombank',
      employeeCode: emp.employeeCode,
      joinDate: emp.joinDate || '',
      contractType: emp.contractType,
      contractStartDate: emp.contractStartDate || '',
      contractEndDate: emp.contractEndDate || '',
      departmentId: emp.departmentId || departments[0]?.id || 1,
      positionId: emp.positionId || positions[0]?.id || 1,
      roleName: emp.roleName || 'ROLE_RECRUITER',
      status: emp.status
    });
    setIsEditModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetail = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // Submit Create
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.joinDate) {
      showNotification('error', 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const dept = departments.find(d => d.id === Number(formData.departmentId));
    const pos = positions.find(p => p.id === Number(formData.positionId));

    if (isBackendOnline) {
      try {
        const created = await employeeApi.createEmployee({
          email: formData.email,
          password: formData.password || 'Password123@',
          fullName: formData.fullName,
          shortName: formData.shortName,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob || undefined,
          address: formData.address || undefined,
          avatar: formData.avatar || undefined,
          profile: formData.profile || undefined,
          cccd: formData.cccd || undefined,
          cccdIssueDate: formData.cccdIssueDate || undefined,
          cccdIssuePlace: formData.cccdIssuePlace || undefined,
          bankAccount: formData.bankAccount || undefined,
          bankName: formData.bankName || undefined,
          employeeCode: formData.employeeCode,
          joinDate: formData.joinDate,
          contractType: formData.contractType,
          contractStartDate: formData.contractStartDate || undefined,
          contractEndDate: formData.contractEndDate || undefined,
          departmentId: Number(formData.departmentId),
          positionId: Number(formData.positionId),
          roleName: formData.roleName
        });
        setEmployees([created, ...employees]);
        showNotification('success', `Đã tạo nhân viên ${created.fullName} (${created.employeeCode}) thành công!`);
        setIsCreateModalOpen(false);
        return;
      } catch (err: any) {
        console.error('Error creating employee:', err);
        showNotification('error', err.message || 'Lỗi khi tạo nhân viên trên hệ thống backend.');
        return;
      }
    }

    // Offline / Demo mode
    const newEmp: Employee = {
      id: Date.now(),
      userId: Date.now() + 100,
      employeeCode: formData.employeeCode || `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      email: formData.email,
      fullName: formData.fullName,
      shortName: formData.shortName,
      phone: formData.phone,
      gender: formData.gender,
      genderCode: formData.gender === 'FEMALE' ? 0 : formData.gender === 'MALE' ? 1 : 2,
      dob: formData.dob,
      address: formData.address,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      profile: formData.profile,
      cccd: formData.cccd,
      cccdIssueDate: formData.cccdIssueDate,
      cccdIssuePlace: formData.cccdIssuePlace,
      bankAccount: formData.bankAccount,
      bankName: formData.bankName,
      joinDate: formData.joinDate,
      contractType: formData.contractType,
      contractStartDate: formData.contractStartDate,
      contractEndDate: formData.contractEndDate,
      departmentId: Number(formData.departmentId),
      departmentName: dept?.name || 'Công nghệ thông tin',
      positionId: Number(formData.positionId),
      positionName: pos?.name || 'Chuyên viên',
      roleName: formData.roleName,
      status: formData.status,
      isDelete: false,
      createdAt: new Date().toISOString()
    };

    setEmployees([newEmp, ...employees]);
    showNotification('success', `Đã thêm nhân viên ${newEmp.fullName} (${newEmp.employeeCode}) thành công!`);
    setIsCreateModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const dept = departments.find(d => d.id === Number(formData.departmentId));
    const pos = positions.find(p => p.id === Number(formData.positionId));

    if (isBackendOnline) {
      try {
        const updated = await employeeApi.updateEmployee(selectedEmployee.id, {
          fullName: formData.fullName,
          shortName: formData.shortName,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob || undefined,
          address: formData.address || undefined,
          avatar: formData.avatar || undefined,
          profile: formData.profile || undefined,
          cccd: formData.cccd || undefined,
          cccdIssueDate: formData.cccdIssueDate || undefined,
          cccdIssuePlace: formData.cccdIssuePlace || undefined,
          bankAccount: formData.bankAccount || undefined,
          bankName: formData.bankName || undefined,
          joinDate: formData.joinDate,
          contractType: formData.contractType,
          contractStartDate: formData.contractStartDate || undefined,
          contractEndDate: formData.contractEndDate || undefined,
          departmentId: Number(formData.departmentId),
          positionId: Number(formData.positionId),
          status: Number(formData.status)
        });
        setEmployees(employees.map(e => e.id === selectedEmployee.id ? updated : e));
        showNotification('success', `Cập nhật thông tin nhân viên ${updated.fullName} thành công!`);
        setIsEditModalOpen(false);
        return;
      } catch (err: any) {
        console.error('Error updating employee:', err);
        showNotification('error', err.message || 'Lỗi khi cập nhật nhân viên.');
        return;
      }
    }

    // Offline mode update
    const updatedEmp: Employee = {
      ...selectedEmployee,
      fullName: formData.fullName,
      shortName: formData.shortName,
      phone: formData.phone,
      gender: formData.gender,
      genderCode: formData.gender === 'FEMALE' ? 0 : formData.gender === 'MALE' ? 1 : 2,
      dob: formData.dob,
      address: formData.address,
      avatar: formData.avatar || selectedEmployee.avatar,
      profile: formData.profile,
      cccd: formData.cccd,
      cccdIssueDate: formData.cccdIssueDate,
      cccdIssuePlace: formData.cccdIssuePlace,
      bankAccount: formData.bankAccount,
      bankName: formData.bankName,
      joinDate: formData.joinDate,
      contractType: formData.contractType,
      contractStartDate: formData.contractStartDate,
      contractEndDate: formData.contractEndDate,
      departmentId: Number(formData.departmentId),
      departmentName: dept?.name || selectedEmployee.departmentName,
      positionId: Number(formData.positionId),
      positionName: pos?.name || selectedEmployee.positionName,
      status: Number(formData.status),
      updatedAt: new Date().toISOString()
    };

    setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmp : e));
    showNotification('success', `Cập nhật nhân viên ${updatedEmp.fullName} thành công!`);
    setIsEditModalOpen(false);
  };

  // Submit Delete
  const handleDeleteSubmit = async () => {
    if (!selectedEmployee) return;

    if (isBackendOnline) {
      try {
        await employeeApi.deleteEmployee(selectedEmployee.id);
        setEmployees(employees.filter(e => e.id !== selectedEmployee.id));
        showNotification('success', `Đã xóa nhân viên ${selectedEmployee.fullName} thành công!`);
        setIsDeleteModalOpen(false);
        return;
      } catch (err: any) {
        console.error('Error deleting employee:', err);
        showNotification('error', err.message || 'Lỗi khi xóa nhân viên.');
        return;
      }
    }

    // Offline mode
    setEmployees(employees.filter(e => e.id !== selectedEmployee.id));
    showNotification('success', `Đã xóa nhân viên ${selectedEmployee.fullName} thành công!`);
    setIsDeleteModalOpen(false);
  };

  // Filter positions by selected department in the form
  const availablePositionsInForm = positions.filter(
    p => !p.departmentId || p.departmentId === Number(formData.departmentId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm transition-all duration-300 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedbackMsg.text}</span>
          <button 
            onClick={() => setFeedbackMsg(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Nhân Sự & Hồ Sơ Nhân Viên (HR Profile & IAM)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module Nhân Sự Lõi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị toàn diện thông tin định danh, tài khoản hệ thống, chức vụ phòng ban, hồ sơ pháp lý CCCD & ngân hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEmployeesData}
            title="Làm mới dữ liệu từ máy chủ"
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhân viên mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng nhân viên</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalEmployees}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Chính thức (Official)</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{officialCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Thử việc (Probation)</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{probationCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Đang hoạt động</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{activeCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo Mã NV, Họ tên, Email, Số điện thoại..."
              className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-56">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất cả Phòng ban</option>
              {departments.map(d => (
                <option key={d.id} value={d.id.toString()}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div className="w-full md:w-56">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất cả Chức danh</option>
              {positions.map(p => (
                <option key={p.id} value={p.id.toString()}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Tạm khóa / Nghỉ</option>
            </select>
          </div>

          {/* Contract Type Filter */}
          <div className="w-full md:w-36">
            <select
              value={contractFilter}
              onChange={(e) => setContractFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Loại hợp đồng</option>
              <option value="OFFICIAL">Chính thức</option>
              <option value="PROBATION">Thử việc</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="INTERN">Thực tập</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nhân viên</th>
                <th className="py-3.5 px-4">Mã NV</th>
                <th className="py-3.5 px-4">Phòng ban & Chức danh</th>
                <th className="py-3.5 px-4">Hợp đồng & Ngày vào</th>
                <th className="py-3.5 px-4">Liên hệ & CCCD</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const isOfficial = emp.contractType === 'OFFICIAL';
                  const isProbation = emp.contractType === 'PROBATION';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                            alt={emp.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {emp.fullName}
                              {emp.shortName && (
                                <span className="text-[10px] text-slate-400 font-normal">({emp.shortName})</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Employee Code */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.employeeCode}
                        </span>
                      </td>

                      {/* Department & Position */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{emp.positionName || 'Chuyên viên'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{emp.departmentName || 'Chưa phân bổ'}</span>
                        </div>
                      </td>

                      {/* Contract & Join Date */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isOfficial ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            isProbation ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isOfficial ? 'Chính thức' : isProbation ? 'Thử việc' : emp.contractType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Vào làm: {emp.joinDate || '---'}</span>
                        </div>
                      </td>

                      {/* Contact & CCCD */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{emp.phone}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          <span>CCCD: {emp.cccd || '---'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                          emp.status === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {emp.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenDetail(emp)}
                            title="Xem chi tiết hồ sơ"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(emp)}
                            title="Xóa nhân viên"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VIEW EMPLOYEE DETAILS */}
      {isDetailModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  alt={selectedEmployee.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shadow"
                />
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedEmployee.fullName}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
                      {selectedEmployee.employeeCode}
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-200">
                    {selectedEmployee.positionName} • {selectedEmployee.departmentName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              {/* Group 1: Thông tin liên hệ & Định danh */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <UserIcon className="w-4 h-4 text-indigo-600" />
                  1. Thông tin cá nhân & Tài khoản
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email đăng nhập</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số điện thoại</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Giới tính</span>
                    <span className="font-semibold text-slate-800">
                      {selectedEmployee.gender === 'FEMALE' ? 'Nữ' : selectedEmployee.gender === 'MALE' ? 'Nam' : 'Khác'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày sinh</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.dob || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tên thường gọi / Viết tắt</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.shortName || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Vai trò hệ thống</span>
                    <span className="font-semibold text-indigo-600">{selectedEmployee.roleName || 'ROLE_RECRUITER'}</span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">Địa chỉ thường trú</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.address || 'Chưa cập nhật'}</span>
                  </div>
                  {selectedEmployee.profile && (
                    <div className="sm:col-span-3">
                      <span className="text-slate-400 block text-[11px]">Ghi chú hồ sơ / Giới thiệu</span>
                      <p className="text-slate-600 mt-1 italic">{selectedEmployee.profile}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Group 2: Pháp lý & Ngân hàng */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  2. Pháp lý & Ngân hàng nhận lương
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số Căn cước công dân</span>
                    <span className="font-mono font-bold text-slate-800">{selectedEmployee.cccd || 'Chưa có'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày cấp CCCD</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.cccdIssueDate || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nơi cấp CCCD</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.cccdIssuePlace || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số tài khoản ngân hàng</span>
                    <span className="font-mono font-bold text-slate-800">{selectedEmployee.bankAccount || '---'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Ngân hàng mở tài khoản</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.bankName || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Group 3: Công việc & Hợp đồng */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  3. Hợp đồng lao động & Tổ chức
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày gia nhập công ty</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Loại hợp đồng</span>
                    <span className="font-semibold text-indigo-600">{selectedEmployee.contractType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Thời hạn hợp đồng</span>
                    <span className="font-semibold text-slate-800">
                      {selectedEmployee.contractStartDate || 'Từ đầu'} {selectedEmployee.contractEndDate ? `đến ${selectedEmployee.contractEndDate}` : '(Vô thời hạn)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phòng ban</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.departmentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Chức danh</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.positionName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trạng thái hồ sơ</span>
                    <span className="font-semibold text-emerald-600">
                      {selectedEmployee.status === 1 ? 'Đang hoạt động' : 'Tạm khóa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEdit(selectedEmployee);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Chỉnh sửa hồ sơ
              </button>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT EMPLOYEE */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isCreateModalOpen ? 'Thêm Mới Nhân Viên & Tạo Tài Khoản' : `Chỉnh Sửa Hồ Sơ Nhân Viên (${selectedEmployee?.employeeCode})`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đảm bảo nhập đầy đủ các trường thông tin phục vụ quản lý nhân sự và phân quyền đăng nhập.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
                {/* Section 1: Tài khoản & Định danh */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1.5 mb-3">
                    <UserIcon className="w-3.5 h-3.5" />
                    1. Định danh & Tài khoản đăng nhập
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Mã nhân viên (*)</label>
                      <input
                        type="text"
                        required
                        disabled={isEditModalOpen}
                        value={formData.employeeCode}
                        onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                        placeholder="EMP-001"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Họ và tên đầy đủ (*)</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Tên thường gọi / Viết tắt</label>
                      <input
                        type="text"
                        value={formData.shortName}
                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                        placeholder="Alex, NamNV..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Email đăng nhập (*)</label>
                      <input
                        type="email"
                        required
                        disabled={isEditModalOpen}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ten.nhanvien@congty.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {isCreateModalOpen && (
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Mật khẩu khởi tạo</label>
                        <input
                          type="text"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Password123@"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Vai trò hệ thống (Role)</label>
                      <select
                        value={formData.roleName}
                        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ROLE_HR_MANAGER">HR Manager (Quản lý)</option>
                        <option value="ROLE_RECRUITER">Recruiter (Tuyển dụng)</option>
                        <option value="ROLE_INTERVIEWER">Interviewer (Phỏng vấn)</option>
                        <option value="ROLE_SUPER_ADMIN">Super Admin (Toàn quyền)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Thông tin cá nhân */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1.5 mb-3">
                    <UserIcon className="w-3.5 h-3.5" />
                    2. Thông tin cá nhân & Liên hệ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Số điện thoại (*)</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0912345678"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Giới tính</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ngày sinh</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-medium mb-1">Địa chỉ thường trú</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ảnh đại diện (Avatar URL)</label>
                      <input
                        type="text"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-600 font-medium mb-1">Ghi chú lý lịch / Giới thiệu</label>
                      <textarea
                        rows={2}
                        value={formData.profile}
                        onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                        placeholder="Mô tả kỹ năng, điểm mạnh hoặc ghi chú nhân sự..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Pháp lý & Ngân hàng */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1.5 mb-3">
                    <CreditCard className="w-3.5 h-3.5" />
                    3. Pháp lý CCCD & Ngân hàng nhận lương
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Số Căn cước công dân (12 số)</label>
                      <input
                        type="text"
                        maxLength={12}
                        value={formData.cccd}
                        onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                        placeholder="001092001122"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ngày cấp CCCD</label>
                      <input
                        type="date"
                        value={formData.cccdIssueDate}
                        onChange={(e) => setFormData({ ...formData, cccdIssueDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Nơi cấp CCCD</label>
                      <input
                        type="text"
                        value={formData.cccdIssuePlace}
                        onChange={(e) => setFormData({ ...formData, cccdIssuePlace: e.target.value })}
                        placeholder="Cục CS QLHC về TTXH"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Số tài khoản ngân hàng</label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        placeholder="19033445566778"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-medium mb-1">Ngân hàng nhận lương</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="Techcombank, Vietcombank, MB, BIDV..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Công việc & Hợp đồng */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1.5 mb-3">
                    <Briefcase className="w-3.5 h-3.5" />
                    4. Phòng ban, Chức danh & Hợp đồng
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Phòng ban (*)</label>
                      <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Chức danh / Vị trí (*)</label>
                      <select
                        value={formData.positionId}
                        onChange={(e) => setFormData({ ...formData, positionId: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {availablePositionsInForm.length > 0 ? (
                          availablePositionsInForm.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))
                        ) : (
                          positions.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Loại hợp đồng</label>
                      <select
                        value={formData.contractType}
                        onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="OFFICIAL">Chính thức (OFFICIAL)</option>
                        <option value="PROBATION">Thử việc (PROBATION)</option>
                        <option value="PART_TIME">Bán thời gian (PART_TIME)</option>
                        <option value="INTERN">Thực tập (INTERN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ngày vào làm (*)</label>
                      <input
                        type="date"
                        required
                        value={formData.joinDate}
                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ngày bắt đầu HĐ</label>
                      <input
                        type="date"
                        value={formData.contractStartDate}
                        onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Ngày kết thúc HĐ (nếu có)</label>
                      <input
                        type="date"
                        value={formData.contractEndDate}
                        onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Trạng thái hồ sơ</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={1}>Đang hoạt động</option>
                        <option value={0}>Tạm khóa / Nghỉ việc</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isCreateModalOpen ? 'Tạo nhân viên' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {isDeleteModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa nhân viên?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Bạn có chắc chắn muốn xóa nhân viên <span className="font-bold text-slate-800">{selectedEmployee.fullName}</span> ({selectedEmployee.employeeCode})?
              Hồ sơ này sẽ được chuyển sang trạng thái đã xóa mềm (soft delete).
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
