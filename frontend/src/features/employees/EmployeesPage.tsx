import React from 'react';
import './EmployeesPage.css';
import { AdminEmployeesPage } from './components/AdminEmployeesPage';

export const EmployeesPage: React.FC = () => {
  return (
    <div className="employees-page-container">
      <AdminEmployeesPage />
    </div>
  );
};

export default EmployeesPage;
