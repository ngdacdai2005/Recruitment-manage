export const appConfig = {
  appName: 'RecruitPro Enterprise ATS & HRM',
  version: '1.0.0',
  defaultPageSize: 10,
  storageKeys: {
    accessToken: 'recruitment_access_token',
    userData: 'recruitment_user_data',
    activePortal: 'recruitment_active_portal',
    theme: 'recruitment_theme',
  },
  roles: {
    SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
    HR_MANAGER: 'ROLE_HR_MANAGER',
    RECRUITER: 'ROLE_RECRUITER',
    INTERVIEWER: 'ROLE_INTERVIEWER',
    CANDIDATE: 'ROLE_CANDIDATE',
  },
  routes: {
    public: {
      home: '/',
      jobs: '/jobs',
      jobDetail: '/jobs/:id',
      culture: '/culture',
      auth: '/auth',
    },
    candidate: {
      dashboard: '/candidate/dashboard',
      profile: '/candidate/profile',
      applications: '/candidate/applications',
      interviews: '/candidate/interviews',
      cv: '/candidate/cv',
    },
    admin: {
      dashboard: '/admin/dashboard',
      pipeline: '/admin/pipeline',
      jobs: '/admin/jobs',
      candidates: '/admin/candidates',
      interviews: '/admin/interviews',
      employees: '/admin/employees',
      departments: '/admin/departments',
      branches: '/admin/branches',
      attendance: '/admin/attendance',
    },
  },
} as const;

export default appConfig;
