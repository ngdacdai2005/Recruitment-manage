import { useState, useEffect, useMemo } from 'react';
import { Branch, BranchStats, CreateBranchDto, UpdateBranchDto } from '@/types/branch.types';
import { branchApi } from '@/api/branchApi';
import { mockBranches, mockBranchStats } from '@/data/mockBranches';

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [stats, setStats] = useState<BranchStats>(mockBranchStats);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await branchApi.getBranches();
      if (data && data.length > 0) {
        setBranches(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        const matchName = b.name.toLowerCase().includes(kw);
        const matchCode = b.code.toLowerCase().includes(kw);
        const matchCity = b.city.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchCity) return false;
      }
      return true;
    });
  }, [branches, keyword, statusFilter]);

  const createBranch = async (dto: CreateBranchDto) => {
    const created = await branchApi.createBranch(dto);
    setBranches((prev) => [created, ...prev]);
    return created;
  };

  const updateBranch = async (id: number, dto: UpdateBranchDto) => {
    const updated = await branchApi.updateBranch(id, dto);
    setBranches((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };

  const deleteBranch = async (id: number) => {
    await branchApi.deleteBranch(id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    branches: filteredBranches,
    allBranches: branches,
    stats,
    loading,
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    refresh: fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  };
}
