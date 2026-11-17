import React from 'react';
import './UsersPage.css';
import { UserManagementTable } from './components/UserManagementTable';

export const UsersPage: React.FC = () => {
  return (
    <div className="users-page-container">
      <UserManagementTable />
    </div>
  );
};

export default UsersPage;
