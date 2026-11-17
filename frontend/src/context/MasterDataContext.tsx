import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department, Position } from '../types';
import { departmentApi } from '../api/departmentApi';
import { positionApi } from '../api/employeeApi';
import { useAuth } from './AuthContext';

interface MasterDataContextType {
  departments: Department[];
  positions: Position[];
  isLoading: boolean;
  refreshMasterData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBackendOnline, currentUser } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMasterData = async () => {
    setIsLoading(true);
    try {
      const [deptRes, posRes] = await Promise.all([
        departmentApi.getDepartments().catch(() => [] as Department[]),
        positionApi.getAllPositions().catch(() => [] as Position[]),
      ]);

      if (deptRes) setDepartments(deptRes);
      if (posRes) setPositions(posRes);
    } catch (err) {
      console.warn('Could not load master data:', err);
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
