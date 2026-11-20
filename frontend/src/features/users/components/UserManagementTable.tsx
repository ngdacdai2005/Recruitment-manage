import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { userApi } from '@/api';
import { Users, Search, Mail, Shield } from 'lucide-react';
import { Table, Column } from '@/components/ui/Table';

export const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    userApi.getAllUsers()
      .then(res => {
        if (!isMounted) return;
        setUsers(res || []);
      })
      .catch(err => {
        console.warn('Could not load users:', err);
        if (isMounted) setUsers([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filtered = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(keyword.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(keyword.toLowerCase())
  );

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      header: 'Người dùng',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
            alt={u.fullName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-900">{u.fullName || 'Người dùng'}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò hệ thống',
      render: (u) => {
        const roleName = typeof (u as any).role === 'object' ? (u as any).role?.name : u.role;
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {roleName || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'id',
      header: 'Trạng thái',
      align: 'center',
      render: (u) => {
        const active = (u as any).active ?? (u as any).isActive ?? true;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
            active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {active ? 'Hoạt động' : 'Đã khóa'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Tài Khoản Người Dùng (IAM & Security)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách tài khoản hệ thống, phân quyền RBAC và quản lý phiên xác thực.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên hoặc email người dùng..."
          className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(u) => u.id}
        emptyText="Không tìm thấy người dùng nào."
      />
    </div>
  );
};

export default UserManagementTable;
