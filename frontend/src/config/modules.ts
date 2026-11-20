import { UserRole } from '../types';

export interface AppModule {
  key: string;
  path: string;
  label: string;
  description: string;
  icon: string;
  group: 'ATS' | 'HRM' | 'SYSTEM';
  groupLabel: string;
  allowedRoles: UserRole[];
  badge?: string;
}

export const APP_MODULES: AppModule[] = [
  // ==========================================
  // NHÓM 1: TUYỂN DỤNG & ATS (Talent Acquisition)
  // ==========================================
  {
    key: 'dashboard',
    path: '/admin/dashboard',
    label: 'Dashboard KPI',
    description: 'Thống kê chỉ số tuyển dụng và tỷ lệ chuyển đổi phễu ứng viên',
    icon: 'LayoutDashboard',
    group: 'ATS',
    groupLabel: 'Quản trị Tuyển dụng (ATS)',
    allowedRoles: [
      'ROLE_SUPER_ADMIN',
      'ROLE_HR_MANAGER',
      'ROLE_RECRUITER',
      'ROLE_INTERVIEWER',
      'ROLE_DEPARTMENT_HEAD',
      'ROLE_TALENT_SOURCER',
      'ROLE_HR_ASSISTANT',
      'ROLE_SYSTEM_AUDITOR',
    ],
  },
  {
    key: 'pipeline',
    path: '/admin/pipeline',
    label: 'Kanban Pipeline',
    description: 'Quy trình xử lý hồ sơ ứng viên kéo thả theo thời gian thực',
    icon: 'Kanban',
    group: 'ATS',
    groupLabel: 'Quản trị Tuyển dụng (ATS)',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_TALENT_SOURCER'],
    badge: 'Real-time',
  },
  {
    key: 'jobs',
    path: '/admin/jobs',
    label: 'Tin tuyển dụng',
    description: 'Quản lý chiến dịch tuyển dụng, tin đăng và duyệt vị trí',
    icon: 'Briefcase',
    group: 'ATS',
    groupLabel: 'Quản trị Tuyển dụng (ATS)',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_DEPARTMENT_HEAD', 'ROLE_TALENT_SOURCER'],
  },
  {
    key: 'candidates',
    path: '/admin/candidates',
    label: 'Kho ứng viên',
    description: 'Talent Pool lưu trữ hồ sơ, kỹ năng và CV ứng viên',
    icon: 'UserCheck',
    group: 'ATS',
    groupLabel: 'Quản trị Tuyển dụng (ATS)',
    allowedRoles: [
      'ROLE_SUPER_ADMIN',
      'ROLE_HR_MANAGER',
      'ROLE_RECRUITER',
      'ROLE_INTERVIEWER',
      'ROLE_DEPARTMENT_HEAD',
      'ROLE_TALENT_SOURCER',
      'ROLE_HR_ASSISTANT',
    ],
  },
  {
    key: 'interviews',
    path: '/admin/interviews',
    label: 'Lịch phỏng vấn',
    description: 'Điều phối lịch phỏng vấn, link Google Meet và chấm điểm ứng viên',
    icon: 'Calendar',
    group: 'ATS',
    groupLabel: 'Quản trị Tuyển dụng (ATS)',
    allowedRoles: [
      'ROLE_SUPER_ADMIN',
      'ROLE_HR_MANAGER',
      'ROLE_RECRUITER',
      'ROLE_INTERVIEWER',
      'ROLE_DEPARTMENT_HEAD',
      'ROLE_HR_ASSISTANT',
    ],
  },

  // ==========================================
  // NHÓM 2: QUẢN TRỊ NHÂN SỰ LÕI (Core HRM)
  // ==========================================
  {
    key: 'employees',
    path: '/admin/employees',
    label: 'Hồ sơ nhân sự',
    description: 'Quản lý 7 nhóm thông tin nhân viên, hợp đồng, CCCD và ngân hàng',
    icon: 'Users',
    group: 'HRM',
    groupLabel: 'Quản trị Nhân sự (HRM)',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER'],
    badge: 'Core',
  },
  {
    key: 'departments',
    path: '/admin/departments',
    label: 'Cơ cấu phòng ban',
    description: 'Sơ đồ tổ chức phòng ban, khối chuyên môn và vị trí',
    icon: 'Building2',
    group: 'HRM',
    groupLabel: 'Quản trị Nhân sự (HRM)',
    allowedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPARTMENT_HEAD'],
  },

  // ==========================================
  // NHÓM 3: HỆ THỐNG & BẢO MẬT (System & IAM)
  // ==========================================
  {
    key: 'users',
    path: '/admin/users',
    label: 'Tài khoản & Phân quyền',
    description: 'Quản lý tài khoản đăng nhập, phiên xác thực JWT và vai trò RBAC',
    icon: 'ShieldAlert',
    group: 'SYSTEM',
    groupLabel: 'Hệ thống & Bảo mật',
    allowedRoles: ['ROLE_SUPER_ADMIN'],
  },
];

export const getModulesByRole = (role?: UserRole | null): AppModule[] => {
  if (!role) return [];
  return APP_MODULES.filter((m) => m.allowedRoles.includes(role));
};

export const getModuleByPath = (path: string): AppModule | undefined => {
  return APP_MODULES.find((m) => m.path === path || path.startsWith(m.path));
};
