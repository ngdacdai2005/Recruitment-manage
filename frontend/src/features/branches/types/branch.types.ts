export type BranchStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  managerName: string;
  employeeCount: number;
  status: BranchStatus;
  openedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  totalEmployeesInBranches: number;
  majorCitiesCount: number;
}

export interface CreateBranchDto {
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  managerName: string;
  openedDate: string;
  status?: BranchStatus;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}
