import React from 'react';
import './DepartmentsPage.css';
import { DepartmentManagementPage } from './components/DepartmentManagementPage';

export const DepartmentsPage: React.FC = () => {
  return (
    <div className="departments-page-container">
      <DepartmentManagementPage />
    </div>
  );
};

export default DepartmentsPage;
