import React from 'react';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { AttendanceStatsSummary } from '../types/attendance.types';

export interface AttendanceStatsProps {
  stats: AttendanceStatsSummary;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tổng nhân sự</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalEmployees}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Có mặt đúng giờ</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.presentCount}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Đi muộn / Về sớm</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.lateCount}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Vắng mặt / Nghỉ phép</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">{stats.absentCount}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
