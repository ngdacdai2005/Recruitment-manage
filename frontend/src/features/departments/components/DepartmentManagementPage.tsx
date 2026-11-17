import React, { useState, useEffect } from 'react';
import { Department } from '@/types';
import { mockDepartments } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { departmentApi } from '@/api';
import { Building2, Plus, Users, Search } from 'lucide-react';
import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

export const DepartmentManagementPage: React.FC = () => {
  const { isBackendOnline } = useAuth();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (isBackendOnline) {
      departmentApi.getDepartments()
        .then(res => {
          if (res && res.length > 0) setDepartments(res);
        })
        .catch(err => console.warn('Could not load departments:', err));
    }
  }, [isBackendOnline]);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(keyword.toLowerCase()) ||
    d.code.toLowerCase().includes(keyword.toLowerCase())
  );

  const columns: Column<Department>[] = [
    {
      key: 'name',
      header: 'Tên phòng ban',
      render: (d) => (
        <div>
          <span className="font-bold text-slate-900">{d.name}</span>
          <p className="text-[11px] text-slate-500">{d.description}</p>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Mã phòng ban',
      render: (d) => (
        <span className="px-2.5 py-1 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
          {d.code}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Trạng thái',
      align: 'center',
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Đang hoạt động
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Phòng Ban & Khối Nghiệp Vụ</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cơ cấu tổ chức doanh nghiệp, đơn vị tuyển dụng và trung tâm chi phí (Cost Center).
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên phòng ban hoặc mã bộ phận..."
          className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(d) => d.id}
        emptyText="Không tìm thấy phòng ban nào."
      />
    </div>
  );
};

export default DepartmentManagementPage;
