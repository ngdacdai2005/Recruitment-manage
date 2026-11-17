export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'LEAVE_WITH_PAY';

export interface AttendanceRecord {
  id: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours: number;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceStatsSummary {
  totalEmployees: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
}
