import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { JobsPage } from '../features/jobs/JobsPage';
import { CandidatesPage } from '../features/candidates/CandidatesPage';
import { InterviewsPage } from '../features/interviews/InterviewsPage';
import { EmployeesPage } from '../features/employees/EmployeesPage';
import { DepartmentsPage } from '../features/departments/DepartmentsPage';
import { ApplicationsPage } from '../features/applications/ApplicationsPage';
import { UsersPage } from '../features/users/UsersPage';
import { ProtectedRoute } from './guards/ProtectedRoute';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute
        allowedRoles={[
          'ROLE_SUPER_ADMIN',
          'ROLE_HR_MANAGER',
          'ROLE_RECRUITER',
          'ROLE_INTERVIEWER',
        ]}
      >
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'pipeline',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER']}
            moduleName="Kanban Pipeline"
          >
            <ApplicationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'jobs',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER']}
            moduleName="Tin tuyển dụng"
          >
            <JobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'candidates',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER']}
            moduleName="Kho ứng viên"
          >
            <CandidatesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'interviews',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER']}
            moduleName="Lịch phỏng vấn"
          >
            <InterviewsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employees',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER']}
            moduleName="Quản trị Nhân sự (HRM)"
          >
            <EmployeesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'departments',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER']}
            moduleName="Cơ cấu Phòng ban"
          >
            <DepartmentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute
            allowedRoles={['ROLE_SUPER_ADMIN']}
            moduleName="Hệ thống & Phân quyền IAM"
          >
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default adminRoutes;
