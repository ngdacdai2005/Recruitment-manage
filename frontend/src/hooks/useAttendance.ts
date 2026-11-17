import { useState, useEffect, useMemo } from 'react';
import { AttendanceRecord, AttendanceStatsSummary } from '@/types/attendance.types';
import { attendanceApi, mockAttendanceRecords } from '@/api/attendanceApi';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [stats, setStats] = useState<AttendanceStatsSummary>({
    totalEmployees: 5,
    presentCount: 4,
    lateCount: 1,
    absentCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [keyword, setKeyword] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        attendanceApi.getDailyAttendance(selectedDate),
        attendanceApi.getStats(),
      ]);
      setRecords(list);
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        const matchName = r.employeeName.toLowerCase().includes(kw);
        const matchCode = r.employeeCode.toLowerCase().includes(kw);
        const matchDept = r.departmentName.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchDept) return false;
      }
      return true;
    });
  }, [records, statusFilter, keyword]);

  return {
    records: filteredRecords,
    allRecords: records,
    stats,
    loading,
    selectedDate,
    setSelectedDate,
    statusFilter,
    setStatusFilter,
    keyword,
    setKeyword,
    refresh: loadData,
  };
}
