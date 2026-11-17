import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department, Position } from '../types';
import { Branch } from '@/types/branch.types';
import { departmentApi } from '../api/departmentApi';
import { positionApi } from '../api/employeeApi';
import { branchApi } from '@/api/branchApi';
import { mockDepartments, mockPositions } from '../data/mockData';
import { mockBranches } from '@/data/mockBranches';
import { useAuth } from './AuthContext';

interface MasterDataContextType {
  departments: Department[];
  positions: Position[];
  branches: Branch[];
  isLoading: boolean;
  refreshMasterData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBackendOnline, currentUser } = useAuth();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMasterData = async () => {
    if (!isBackendOnline) return;
    setIsLoading(true);
    try {
      const [deptRes, posRes, branchRes] = await Promise.all([
        departmentApi.getDepartments().catch(() => mockDepartments),
        positionApi.getAllPositions().catch(() => mockPositions),
        branchApi.getBranches().catch(() => mockBranches),
      ]);

      if (deptRes && deptRes.length > 0) setDepartments(deptRes);
      if (posRes && posRes.length > 0) setPositions(posRes);
      if (branchRes && branchRes.length > 0) setBranches(branchRes);
    } finally {
      setIsLoading(false);
    }
  };

  // Prefetch ngay khi backend online hoặc user thay đổi
  useEffect(() => {
    fetchMasterData();
  }, [isBackendOnline, currentUser?.id]);

  return (
    <MasterDataContext.Provider
      value={{
        departments,
        positions,
        branches,
        isLoading,
        refreshMasterData: fetchMasterData,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within MasterDataProvider');
  }
  return context;
};
