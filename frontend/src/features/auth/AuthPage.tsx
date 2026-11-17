import React from 'react';
import './AuthPage.css';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { Link } from 'react-router-dom';

export const AuthPage: React.FC = () => {
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

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ tuyển dụng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
