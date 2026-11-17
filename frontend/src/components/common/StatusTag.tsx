import React from 'react';

export interface StatusTagProps {
  status: string | number;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, label, size = 'sm' }) => {
  const getStatusConfig = (val: string | number) => {
    switch (val) {
      // 1. Job statuses
      case 'PUBLISHED':
        return { text: 'Đang mở tuyển', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'DRAFT':
        return { text: 'Bản nháp', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
      case 'PENDING_APPROVAL':
        return { text: 'Chờ duyệt', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'CLOSED':
        return { text: 'Đã đóng', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };

      // 2. Application statuses
      case 'APPLIED':
        return { text: 'Mới ứng tuyển', bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' };
      case 'SCREENING':
        return { text: 'Sàng lọc CV', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
      case 'INTERVIEW':
        return { text: 'Phỏng vấn', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' };
      case 'ASSESSMENT':
        return { text: 'Bài test chuyên môn', bg: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' };
      case 'OFFER':
        return { text: 'Thư mời Offer', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'HIRED':
        return { text: 'Đã tuyển dụng', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'REJECTED':
        return { text: 'Không đạt', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'WITHDRAWN':
        return { text: 'Ứng viên rút', bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' };

      // 3. General active/inactive
      case 1:
      case 'ACTIVE':
        return { text: 'Hoạt động', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 0:
      case 'INACTIVE':
        return { text: 'Tạm khóa', bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
      case 'MAINTENANCE':
        return { text: 'Bảo trì', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };

      // 4. Attendance
      case 'ON_TIME':
        return { text: 'Đúng giờ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'LATE':
        return { text: 'Đi muộn', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'EARLY_LEAVE':
        return { text: 'Về sớm', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
      case 'ABSENT':
        return { text: 'Vắng mặt', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'LEAVE_WITH_PAY':
        return { text: 'Nghỉ phép', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };

      default:
        return { text: String(val), bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig(status);
  const displayText = label || config.text;

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`}></span>
      <span>{displayText}</span>
    </span>
  );
};

export default StatusTag;
