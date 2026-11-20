import { UserRole } from '../types';

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'EXPORT' | 'EVALUATE';
export type DomainResource = 
  | 'JOBS'
  | 'APPLICATIONS'
  | 'CANDIDATES'
  | 'INTERVIEWS'
  | 'EMPLOYEES'
  | 'DEPARTMENTS'
  | 'USERS';

export const RBAC_MATRIX: Record<UserRole, Partial<Record<DomainResource, PermissionAction[]>>> = {
  ROLE_SUPER_ADMIN: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EVALUATE', 'EXPORT'],
    EMPLOYEES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    DEPARTMENTS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    USERS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
  },
  ROLE_HR_MANAGER: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EVALUATE', 'EXPORT'],
    EMPLOYEES: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
    DEPARTMENTS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    USERS: ['VIEW'],
  },
  ROLE_RECRUITER: {
    JOBS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    APPLICATIONS: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT', 'EXPORT'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT', 'EVALUATE'],
    EMPLOYEES: ['VIEW'],
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
  ROLE_DEPARTMENT_HEAD: {
    JOBS: ['VIEW', 'CREATE', 'EDIT'],
    APPLICATIONS: ['VIEW'],
    CANDIDATES: ['VIEW'],
    INTERVIEWS: ['VIEW', 'EVALUATE'],
    DEPARTMENTS: ['VIEW'],
  },
  ROLE_TALENT_SOURCER: {
    JOBS: ['VIEW'],
    APPLICATIONS: ['VIEW', 'CREATE'],
    CANDIDATES: ['VIEW', 'CREATE', 'EDIT'],
    INTERVIEWS: ['VIEW'],
  },
  ROLE_HR_ASSISTANT: {
    JOBS: ['VIEW'],
    APPLICATIONS: ['VIEW'],
    CANDIDATES: ['VIEW'],
    INTERVIEWS: ['VIEW', 'CREATE', 'EDIT'],
    EMPLOYEES: ['VIEW'],
  },
  ROLE_SYSTEM_AUDITOR: {
    JOBS: ['VIEW'],
    APPLICATIONS: ['VIEW'],
    CANDIDATES: ['VIEW'],
    INTERVIEWS: ['VIEW'],
    EMPLOYEES: ['VIEW'],
    DEPARTMENTS: ['VIEW'],
    USERS: ['VIEW'],
  },
  ROLE_GUEST: {
    JOBS: ['VIEW'],
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
