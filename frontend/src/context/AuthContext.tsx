import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { authApi, checkBackendHealth, savedJobApi } from '../api';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  activePortal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN';
  isBackendOnline: boolean;
  setActivePortal: (portal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN') => void;
  loginAs: (role: UserRole) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  savedJobIds: number[];
  toggleSaveJob: (jobId: number) => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to HR Manager for easy evaluation or Public
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[1]); // Default HR Manager
  const [activePortal, setActivePortal] = useState<'PUBLIC' | 'CANDIDATE' | 'ADMIN'>('ADMIN');
  const [savedJobIds, setSavedJobIds] = useState<number[]>([1, 2]);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  const checkConnection = async (): Promise<boolean> => {
    const isOnline = await checkBackendHealth();
    setIsBackendOnline(isOnline);
    return isOnline;
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const loginAs = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    setCurrentUser(user);
    if (role === 'ROLE_CANDIDATE') {
      setActivePortal('CANDIDATE');
    } else {
      setActivePortal('ADMIN');
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
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
          if (user.role === 'ROLE_CANDIDATE') {
            setActivePortal('CANDIDATE');
          } else {
            setActivePortal('ADMIN');
          }
          return true;
        }
      } catch (err) {
        console.warn('Backend login error, falling back to mock login:', err);
      }
    }

    // Fallback to mock accounts
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      if (user.role === 'ROLE_CANDIDATE') {
        setActivePortal('CANDIDATE');
      } else {
        setActivePortal('ADMIN');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    authApi.logout();
    setCurrentUser(null);
    setActivePortal('PUBLIC');
  };

  const toggleSaveJob = async (jobId: number) => {
    if (isBackendOnline && currentUser) {
      try {
        const res = await savedJobApi.toggleSavedJob(jobId);
        if (res.saved) {
          setSavedJobIds(prev => [...prev, jobId]);
        } else {
          setSavedJobIds(prev => prev.filter(id => id !== jobId));
        }
        return;
      } catch (e) {
        console.warn('toggleSavedJob API error, fallback to local state', e);
      }
    }

    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
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
