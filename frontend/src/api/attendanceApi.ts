import { axiosClient } from './axiosClient';
import { AttendanceRecord, AttendanceStatsSummary } from '@/types/attendance.types';

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    employeeCode: 'EMP-001',
    employeeName: 'Nguyễn Quản Trị',
    departmentName: 'Công nghệ thông tin',
    date: '2026-11-17',
    checkIn: '08:25:10',
    checkOut: '17:45:00',
    workingHours: 8.5,
    status: 'ON_TIME',
  },
  {
    id: 2,
    employeeCode: 'EMP-002',
    employeeName: 'Trần Thị Thu Hà',
    departmentName: 'Nhân sự & Hành chính',
    date: '2026-11-17',
    checkIn: '08:15:30',
    checkOut: '18:00:20',
    workingHours: 8.8,
    status: 'ON_TIME',
  },
  {
    id: 3,
    employeeCode: 'EMP-003',
    employeeName: 'Lê Tuyển Dụng',
    departmentName: 'Nhân sự & Hành chính',
    date: '2026-11-17',
    checkIn: '08:48:00',
    checkOut: '17:30:00',
    workingHours: 7.8,
    status: 'LATE',
    note: 'Đi muộn 18 phút do kẹt xe',
  },
  {
    id: 4,
    employeeCode: 'EMP-004',
    employeeName: 'Phạm Công Nghệ',
    departmentName: 'Công nghệ thông tin',
    date: '2026-11-17',
    checkIn: '08:10:00',
    checkOut: '19:15:00',
    workingHours: 9.2,
    status: 'ON_TIME',
  },
  {
    id: 5,
    employeeCode: 'EMP-007',
    employeeName: 'Vũ Hoàng Nam',
    departmentName: 'Công nghệ thông tin',
    date: '2026-11-17',
    checkIn: undefined,
    checkOut: undefined,
    workingHours: 0,
    status: 'LEAVE_WITH_PAY',
    note: 'Nghỉ phép năm',
  },
];

export const attendanceApi = {
  getDailyAttendance: async (date?: string): Promise<AttendanceRecord[]> => {
    try {
      const res = await axiosClient.get<AttendanceRecord[]>('/attendance', {
        params: { date },
      });
      return (res as any)?.data || res || mockAttendanceRecords;
    } catch {
      return mockAttendanceRecords;
    }
  },

  getStats: async (): Promise<AttendanceStatsSummary> => {
    return {
      totalEmployees: 5,
      presentCount: 4,
      lateCount: 1,
      absentCount: 0,
    };
  },
};

export default attendanceApi;
