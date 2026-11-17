import React from 'react';
import './AttendancePage.css';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceStats } from './components/AttendanceStats';
import { AttendanceFilter } from './components/AttendanceFilter';
import { AttendanceTable } from './components/AttendanceTable';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Download } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const {
    records,
    stats,
    loading,
    selectedDate,
    setSelectedDate,
    statusFilter,
    setStatusFilter,
    keyword,
    setKeyword,
    refresh,
  } = useAttendance();

  return (
    <div className="attendance-page-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Chấm Công & Điểm Danh</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Module Chấm công HRM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi thời gian vào/ra thực tế, tỷ lệ chuyên cần và giờ công làm việc của toàn bộ cán bộ nhân viên.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Làm mới
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Xuất bảng công
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AttendanceStats stats={stats} />

      {/* Filter */}
      <AttendanceFilter
        keyword={keyword}
        onKeywordChange={setKeyword}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Table */}
      <AttendanceTable records={records} isLoading={loading} />
    </div>
  );
};

export default AttendancePage;
