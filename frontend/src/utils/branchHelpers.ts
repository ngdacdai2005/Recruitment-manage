import { BranchStatus } from '@/types/branch.types';

export const getBranchStatusLabel = (status: BranchStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Đang hoạt động';
    case 'INACTIVE':
      return 'Tạm dừng';
    case 'MAINTENANCE':
      return 'Đang sửa chữa';
    default:
      return status;
  }
};

export const getBranchStatusColor = (status: BranchStatus): { bg: string; text: string; dot: string } => {
  switch (status) {
    case 'ACTIVE':
      return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'INACTIVE':
      return { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' };
    case 'MAINTENANCE':
      return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
    default:
      return { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' };
  }
};
