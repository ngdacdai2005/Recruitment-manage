import React from 'react';
import { Building, CheckCircle2, Users, MapPin } from 'lucide-react';
import { BranchStats } from '@/types/branch.types';

export interface BranchStatCardsProps {
  stats: BranchStats;
}

export const BranchStatCards: React.FC<BranchStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tổng số chi nhánh</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalBranches}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Building className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Chi nhánh hoạt động</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.activeBranches}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tổng nhân sự chi nhánh</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.totalEmployeesInBranches}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tỉnh / Thành phố</p>
          <h3 className="text-2xl font-bold text-violet-600 mt-1">{stats.majorCitiesCount}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
