export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    JOBS: '/jobs',
    JOB_DETAIL: '/jobs/:id',
    CULTURE: '/culture',
  },
  CANDIDATE: {
    DASHBOARD: '/candidate/dashboard',
    PROFILE: '/candidate/profile',
    APPLICATIONS: '/candidate/applications',
    INTERVIEWS: '/candidate/interviews',
    CV: '/candidate/cv',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PIPELINE: '/admin/pipeline',
    JOBS: '/admin/jobs',
    CANDIDATES: '/admin/candidates',
    INTERVIEWS: '/admin/interviews',
    EMPLOYEES: '/admin/employees',
    DEPARTMENTS: '/admin/departments',
    USERS: '/admin/users',
  },
} as const;
