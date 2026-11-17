import React from 'react';
import { Table, Column } from '../../../components/ui/Table';
import { AttendanceRecord, AttendanceStatus } from '../types/attendance.types';

export interface AttendanceTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, isLoading }) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'ON_TIME':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đúng giờ</span>;
      case 'LATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Đi muộn</span>;
      case 'EARLY_LEAVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">Về sớm</span>;
      case 'ABSENT':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Vắng mặt</span>;
      case 'LEAVE_WITH_PAY':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Nghỉ phép</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeCode',
      header: 'Mã NV',
      render: (r) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">
          {r.employeeCode}
        </span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Nhân viên',
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900">{r.employeeName}</span>
          <p className="text-[11px] text-slate-500">{r.departmentName}</p>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'Giờ vào (Check-in)',
      align: 'center',
      render: (r) => (
        <span className="font-mono text-slate-800">{r.checkIn || '---'}</span>
      ),
    },
    {
      key: 'checkOut',
      header: 'Giờ ra (Check-out)',
      align: 'center',
      render: (r) => (
        <span className="font-mono text-slate-800">{r.checkOut || '---'}</span>
      ),
    },
    {
      key: 'workingHours',
      header: 'Tổng giờ làm',
      align: 'center',
      render: (r) => (
        <span className="font-semibold text-slate-800">{r.workingHours > 0 ? `${r.workingHours}h` : '0h'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (r) => getStatusBadge(r.status),
    },
    {
      key: 'note',
      header: 'Ghi chú',
      render: (r) => (
        <span className="text-slate-500 text-[11px] italic">{r.note || '---'}</span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={records}
      rowKey={(r) => r.id}
      isLoading={isLoading}
      emptyText="Không có dữ liệu điểm danh trong ngày đã chọn."
    />
  );
};
