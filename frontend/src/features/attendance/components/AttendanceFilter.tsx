import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export interface AttendanceFilterProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
  keyword,
  onKeywordChange,
  statusFilter,
  onStatusChange,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Tìm theo Mã NV, Họ tên hoặc Phòng ban..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>
      <div className="w-full sm:w-44">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4" />}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'ON_TIME', label: 'Đúng giờ' },
            { value: 'LATE', label: 'Đi muộn' },
            { value: 'EARLY_LEAVE', label: 'Về sớm' },
            { value: 'ABSENT', label: 'Vắng mặt' },
            { value: 'LEAVE_WITH_PAY', label: 'Nghỉ có lương' },
          ]}
        />
      </div>
    </div>
  );
};
