import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  activePortal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN';
  setActivePortal: (portal: 'PUBLIC' | 'CANDIDATE' | 'ADMIN') => void;
  loginAs: (role: UserRole) => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  savedJobIds: number[];
  toggleSaveJob: (jobId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to HR Manager for easy evaluation or Public
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[1]); // Default HR Manager
  const [activePortal, setActivePortal] = useState<'PUBLIC' | 'CANDIDATE' | 'ADMIN'>('ADMIN');
  const [savedJobIds, setSavedJobIds] = useState<number[]>([1, 2]);

  const loginAs = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    setCurrentUser(user);
    if (role === 'ROLE_CANDIDATE') {
      setActivePortal('CANDIDATE');
    } else {
      setActivePortal('ADMIN');
    }
  };

  const login = (email: string, _pass: string) => {
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
    setCurrentUser(null);
    setActivePortal('PUBLIC');
  };

  const toggleSaveJob = (jobId: number) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole: currentUser?.role || null,
      activePortal,
      setActivePortal,
      loginAs,
      login,
      logout,
      savedJobIds,
      toggleSaveJob
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

