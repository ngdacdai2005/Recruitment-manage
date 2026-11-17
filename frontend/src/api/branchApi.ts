import { axiosClient } from './axiosClient';
import { Branch, CreateBranchDto, UpdateBranchDto } from '@/types/branch.types';
import { mockBranches } from '@/data/mockBranches';

export const branchApi = {
  getBranches: async (): Promise<Branch[]> => {
    try {
      const res = await axiosClient.get<Branch[]>('/branches');
      return (res as any)?.data || res || mockBranches;
    } catch {
      return mockBranches;
    }
  },

  getBranchById: async (id: number): Promise<Branch> => {
    try {
      const res = await axiosClient.get<Branch>(`/branches/${id}`);
      return (res as any)?.data || res;
    } catch {
      const found = mockBranches.find((b) => b.id === id);
      if (!found) throw new Error('Không tìm thấy chi nhánh');
      return found;
    }
  },

  createBranch: async (dto: CreateBranchDto): Promise<Branch> => {
    try {
      const res = await axiosClient.post<Branch>('/branches', dto);
      return (res as any)?.data || res;
    } catch {
      const newBranch: Branch = {
        id: Date.now(),
        ...dto,
        status: dto.status || 'ACTIVE',
        employeeCount: 0,
        createdAt: new Date().toISOString(),
      };
      return newBranch;
    }
  },

  updateBranch: async (id: number, dto: UpdateBranchDto): Promise<Branch> => {
    try {
      const res = await axiosClient.put<Branch>(`/branches/${id}`, dto);
      return (res as any)?.data || res;
    } catch {
      const existing = mockBranches.find((b) => b.id === id) || mockBranches[0];
      return { ...existing, ...dto, updatedAt: new Date().toISOString() };
    }
  },

  deleteBranch: async (id: number): Promise<void> => {
    try {
      await axiosClient.delete(`/branches/${id}`);
    } catch {
      // Mock delete fallback
    }
  },
};

export default branchApi;
