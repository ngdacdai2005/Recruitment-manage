import React, { useState, useEffect } from 'react';
import './AuthPage.css';
import { Briefcase, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AuthPage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    if (!isLoading && currentUser) {
      if (currentUser.role === 'ROLE_CANDIDATE') {
        navigate('/candidate/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'register' && mode !== 'register') {
      setMode('register');
    } else if (urlMode === 'login' && mode !== 'login') {
      setMode('login');
    }
  }, [searchParams]);

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  return (
    <div className="auth-page-container flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            {mode === 'login' ? <Briefcase className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản Ứng Viên'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Hệ thống Quản trị Tuyển dụng ATS & Cổng Thông tin Ứng viên'
              : 'Tạo tài khoản nhanh chóng để nộp hồ sơ và theo dõi tiến độ phỏng vấn'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng ký</span>
          </button>
        </div>

        {/* Content Form */}
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => handleModeChange('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => handleModeChange('login')} />
        )}

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
