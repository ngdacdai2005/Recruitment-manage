import React from 'react';
import './AuthPage.css';
import { useAuth } from '@/context/AuthContext';
import { Briefcase } from 'lucide-react';
import { LoginForm } from './components/LoginForm';

export const AuthPage: React.FC = () => {
  const { loginAs } = useAuth();

  return (
    <div className="auth-page-container flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Đăng Nhập Hệ Thống</h2>
          <p className="text-xs text-slate-500">
            Hệ thống Quản trị Tuyển dụng ATS & Quản lý Nhân sự Doanh nghiệp
          </p>
        </div>

        <LoginForm />

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <p className="text-center text-xs font-semibold text-slate-400">DEMO: Đăng nhập nhanh theo vai trò</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => loginAs('ROLE_SUPER_ADMIN')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-center transition-colors"
            >
              👑 Super Admin
            </button>
            <button
              onClick={() => loginAs('ROLE_HR_MANAGER')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-center transition-colors"
            >
              💼 HR Manager
            </button>
            <button
              onClick={() => loginAs('ROLE_RECRUITER')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-center transition-colors"
            >
              🎯 Recruiter
            </button>
            <button
              onClick={() => loginAs('ROLE_CANDIDATE')}
              className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/50 font-bold text-indigo-700 text-center transition-colors"
            >
              👤 Ứng Viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
