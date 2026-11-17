import React from 'react';
import { Eye, Edit3, Trash2, MapPin, Phone, Mail, Building } from 'lucide-react';
import { Branch } from '../types/branch.types';
import { getBranchStatusLabel, getBranchStatusColor } from '../utils/branchHelpers';
import { Table, Column } from '../../../components/ui/Table';

export interface BranchListTableProps {
  branches: Branch[];
  isLoading?: boolean;
  onView: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export const BranchListTable: React.FC<BranchListTableProps> = ({
  branches,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: Column<Branch>[] = [
    {
      key: 'name',
      header: 'Chi nhánh & Địa chỉ',
      render: (b) => (
        <div>
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{b.name}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{b.address}, {b.city}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Mã chi nhánh',
      render: (b) => (
        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-700">
          {b.code}
        </span>
      ),
    },
    {
      key: 'managerName',
      header: 'Quản lý & Liên hệ',
      render: (b) => (
        <div>
          <span className="font-medium text-slate-800">{b.managerName}</span>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {b.phone}</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {b.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCount',
      header: 'Nhân sự',
      align: 'center',
      render: (b) => (
        <span className="font-bold text-slate-800 text-xs">{b.employeeCount} NV</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (b) => {
        const badge = getBranchStatusColor(b.status);
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg} ${badge.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
            {getBranchStatusLabel(b.status)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (b) => (
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => onView(b)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(b)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(b)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Xóa chi nhánh"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={branches}
      rowKey={(b) => b.id}
      isLoading={isLoading}
      emptyText="Không tìm thấy chi nhánh nào phù hợp."
    />
  );
};
