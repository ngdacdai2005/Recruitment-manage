import { UserRole } from '../types';

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'EXPORT' | 'EVALUATE';
export type DomainResource = 
  | 'JOBS'
  | 'APPLICATIONS'
  | 'CANDIDATES'
  | 'INTERVIEWS'
  | 'EMPLOYEES'
  | 'ATTENDANCE'
  | 'BRANCHES'
  | 'DEPARTMENTS'
  | 'USERS';

export const RBAC_MATRIX: Record<UserRole, Partial<Record<DomainResource, PermissionAction[]>>> = {
  ROLE_SUPER_ADMIN: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EVALUATE', 'EXPORT'],
    EMPLOYEES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    ATTENDANCE: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    BRANCHES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    DEPARTMENTS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    USERS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
  },
  ROLE_HR_MANAGER: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EVALUATE', 'EXPORT'],
    EMPLOYEES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    ATTENDANCE: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    BRANCHES: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    DEPARTMENTS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    USERS: ['VIEW'],
  },
  ROLE_RECRUITER: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'EVALUATE'],
    EMPLOYEES: ['VIEW'],
    ATTENDANCE: ['VIEW'],
    BRANCHES: ['VIEW'],
    DEPARTMENTS: ['VIEW'],
  },
  ROLE_INTERVIEWER: {
    JOBS: ['VIEW'],
    APPLICATIONS: ['VIEW'],
    CANDIDATES: ['VIEW'],
    INTERVIEWS: ['VIEW', 'EVALUATE'],
  },
  ROLE_CANDIDATE: {
    JOBS: ['VIEW'],
    APPLICATIONS: ['VIEW', 'CREATE'],
  },
};

export const hasPermission = (
  role: UserRole | null | undefined,
  resource: DomainResource,
  action: PermissionAction = 'VIEW'
): boolean => {
  if (!role) return false;
  const permissions = RBAC_MATRIX[role]?.[resource];
  return Boolean(permissions && permissions.includes(action));
};
