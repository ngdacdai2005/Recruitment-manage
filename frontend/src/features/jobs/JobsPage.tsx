import React from 'react';
import './JobsPage.css';
import { AdminJobsPage } from './components/AdminJobsPage';

export const JobsPage: React.FC = () => {
  return (
    <div className="jobs-page-container">
      <AdminJobsPage />
    </div>
  );
};

export default JobsPage;
