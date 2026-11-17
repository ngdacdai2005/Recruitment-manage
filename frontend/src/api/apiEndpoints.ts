export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  JOBS: {
    PUBLIC_LIST: '/public/jobs',
    PUBLIC_DETAIL: (id: number | string) => `/public/jobs/${id}`,
    PUBLIC_SLUG: (slug: string) => `/public/jobs/slug/${slug}`,
    ADMIN_LIST: '/admin/jobs',
    ADMIN_CREATE: '/admin/jobs',
    ADMIN_DETAIL: (id: number | string) => `/admin/jobs/${id}`,
    ADMIN_STATUS: (id: number | string) => `/admin/jobs/${id}/status`,
  },
  APPLICATIONS: {
    APPLY: '/applications/apply',
    MY_APPLICATIONS: '/candidate/applications',
    ADMIN_LIST: '/admin/applications',
    ADMIN_UPDATE_STATUS: (id: number | string) => `/admin/applications/${id}/status`,
  },
  CANDIDATES: {
    ME: '/candidate/profile',
    UPDATE_ME: '/candidate/profile',
    ADMIN_LIST: '/admin/candidates',
    ADMIN_DETAIL: (id: number | string) => `/admin/candidates/${id}`,
  },
  INTERVIEWS: {
    ADMIN_LIST: '/admin/interviews',
    CREATE: '/admin/interviews',
    UPDATE: (id: number | string) => `/admin/interviews/${id}`,
    EVALUATE: (id: number | string) => `/admin/interviews/${id}/evaluation`,
    MY_INTERVIEWS: '/candidate/interviews',
  },
  EMPLOYEES: {
    LIST: '/admin/employees',
    DETAIL: (id: number | string) => `/admin/employees/${id}`,
    BY_USER: (userId: number | string) => `/admin/employees/by-user/${userId}`,
    CREATE: '/admin/employees',
    UPDATE: (id: number | string) => `/admin/employees/${id}`,
    DELETE: (id: number | string) => `/admin/employees/${id}`,
  },
  POSITIONS: {
    LIST: '/positions',
    BY_DEPT: (deptId: number | string) => `/positions/department/${deptId}`,
    DETAIL: (id: number | string) => `/positions/${id}`,
  },
  DEPARTMENTS: {
    LIST: '/departments',
    DETAIL: (id: number | string) => `/departments/${id}`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: number | string) => `/users/${id}`,
  },
  FILES: {
    UPLOAD: '/files/upload',
  },
  REPORTS: {
    DASHBOARD_STATS: '/reports/dashboard-stats',
  },
} as const;
