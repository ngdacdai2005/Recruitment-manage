import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { authApi, checkBackendHealth, savedJobApi, getToken, removeToken } from '../api';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  activePortal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN';
  isBackendOnline: boolean;
  setActivePortal: (portal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN') => void;
  loginAs: (role: UserRole) => Promise<void> | void;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  savedJobIds: number[];
  toggleSaveJob: (jobId: number) => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePortal, setActivePortal] = useState<'PUBLIC' | 'CANDIDATE' | 'ADMIN'>('PUBLIC');
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  const checkConnection = async (): Promise<boolean> => {
    const isOnline = await checkBackendHealth();
    setIsBackendOnline(isOnline);
    return isOnline;
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);

    // Tự động khôi phục phiên nếu đã có token JWT trong localStorage
    const initSession = async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await authApi.getCurrentUser();
          if (me && me.id) {
            setCurrentUser(me);
            setActivePortal(me.role === 'ROLE_CANDIDATE' ? 'CANDIDATE' : 'ADMIN');
          }
        } catch {
          removeToken();
          setCurrentUser(null);
        }
      }
    };
    initSession();

    return () => clearInterval(interval);
  }, []);

  // Tự động tải danh sách việc làm đã lưu thật từ DB nếu là ứng viên
  useEffect(() => {
    if (currentUser?.role === 'ROLE_CANDIDATE' && isBackendOnline) {
      savedJobApi.getSavedJobs()
        .then(saved => {
          if (saved && Array.isArray(saved)) {
            setSavedJobIds(saved.map(item => item.job?.id || (item as any).jobId).filter(Boolean));
          }
        })
        .catch(() => {});
    } else if (!currentUser) {
      setSavedJobIds([]);
    }
  }, [currentUser?.id, currentUser?.role, isBackendOnline]);

  const loginAs = async (role: UserRole) => {
    const roleEmailMap: Record<string, string> = {
      ROLE_SUPER_ADMIN: 'admin@recruitment.com',
      ROLE_HR_MANAGER: 'hr.manager@recruitment.com',
      ROLE_RECRUITER: 'recruiter@recruitment.com',
      ROLE_INTERVIEWER: 'techlead@recruitment.com',
      ROLE_CANDIDATE: 'candidate@example.com',
    };

    const targetEmail = roleEmailMap[role] || 'admin@recruitment.com';

    // Đăng nhập thật vào Backend để lấy JWT Token chính danh
    if (isBackendOnline) {
      try {
        const res = await authApi.login({ email: targetEmail, password: 'password123' });
        if (res && res.accessToken) {
          const user: User = {
            id: res.userId,
            email: res.email,
            fullName: res.fullName,
            role: res.role as UserRole,
          };
          setCurrentUser(user);
          setActivePortal(role === 'ROLE_CANDIDATE' ? 'CANDIDATE' : 'ADMIN');
          return;
        }
      } catch (err) {
        console.warn('Real backend loginAs failed, using local user fallback:', err);
      }
    }

    // Fallback if offline
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    setCurrentUser(user);
    setActivePortal(role === 'ROLE_CANDIDATE' ? 'CANDIDATE' : 'ADMIN');
  };

  const login = async (email: string, pass: string): Promise<User | null> => {
    if (isBackendOnline) {
      try {
        const res = await authApi.login({ email, password: pass });
        if (res && res.accessToken) {
          const user: User = {
            id: res.userId,
            email: res.email,
            fullName: res.fullName,
            role: res.role as UserRole,
          };
          setCurrentUser(user);
          setActivePortal(user.role === 'ROLE_CANDIDATE' ? 'CANDIDATE' : 'ADMIN');
          return user;
        }
      } catch (err) {
        console.warn('Backend login error:', err);
      }
    }

    // Fallback to mock accounts if offline
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setActivePortal(user.role === 'ROLE_CANDIDATE' ? 'CANDIDATE' : 'ADMIN');
      return user;
    }
    return null;
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    removeToken();
    setCurrentUser(null);
    setSavedJobIds([]);
    setActivePortal('PUBLIC');
  };

  const toggleSaveJob = async (jobId: number) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập với tài khoản Ứng viên để lưu việc làm này vào danh sách theo dõi.');
      return;
    }
    if (currentUser.role !== 'ROLE_CANDIDATE') {
      alert('Tính năng lưu việc làm chỉ dành riêng cho tài khoản Ứng viên.');
      return;
    }

    try {
      const res = await savedJobApi.toggleSavedJob(jobId);
      if (res.saved) {
        setSavedJobIds(prev => [...prev, jobId]);
      } else {
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      }
    } catch (err: any) {
      console.error('Failed to toggle saved job in backend:', err);
      alert(err.message || 'Không thể cập nhật danh sách việc làm đã lưu.');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole: currentUser?.role || null,
      activePortal,
      isBackendOnline,
      setActivePortal,
      loginAs,
      login,
      logout,
      savedJobIds,
      toggleSaveJob,
      checkConnection
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
