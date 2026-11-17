import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MasterDataProvider } from './context/MasterDataContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export const AppBootstrap: React.FC<AppBootstrapProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MasterDataProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </MasterDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppBootstrap;
