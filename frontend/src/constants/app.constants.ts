export const APP_NAME = 'Recruitment Management & ATS';

export const USER_ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  HR_MANAGER: 'ROLE_HR_MANAGER',
  RECRUITER: 'ROLE_RECRUITER',
  INTERVIEWER: 'ROLE_INTERVIEWER',
  CANDIDATE: 'ROLE_CANDIDATE',
} as const;

export const CONTRACT_TYPES = {
  OFFICIAL: 'OFFICIAL',
  PROBATION: 'PROBATION',
  PART_TIME: 'PART_TIME',
  INTERN: 'INTERN',
} as const;

export const GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'recruitment_access_token',
  USER_DATA: 'recruitment_user_data',
  ACTIVE_PORTAL: 'recruitment_active_portal',
  THEME: 'recruitment_theme',
} as const;
