export type ID = number | string;

export type Gender = 'FEMALE' | 'MALE' | 'OTHER';

export type ContractType = 'OFFICIAL' | 'PROBATION' | 'PART_TIME' | 'INTERN';

export type UserRole = 
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_HR_MANAGER'
  | 'ROLE_RECRUITER'
  | 'ROLE_INTERVIEWER'
  | 'ROLE_CANDIDATE';

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}
