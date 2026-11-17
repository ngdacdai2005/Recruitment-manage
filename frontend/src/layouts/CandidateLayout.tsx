import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  UserCheck, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  ExternalLink,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import { appConfig } from '../config/app.config';

export const CandidateLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={appConfig.routes.candidate.dashboard} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                RECRUIT<span className="text-indigo-600">PRO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                  CANDIDATE
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Cổng Thông Tin & Quản Lý Ứng Tuyển</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            <NavLink
              to={appConfig.routes.candidate.dashboard}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Tổng quan
            </NavLink>
            <NavLink
              to={appConfig.routes.candidate.applications}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              Hồ sơ đã nộp & Tracking
            </NavLink>
            <NavLink
              to={appConfig.routes.candidate.profile}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UserCheck className="w-4 h-4" />
              Hồ sơ & CV của tôi
            </NavLink>
            <NavLink
              to={appConfig.routes.candidate.interviews}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Calendar className="w-4 h-4" />
              Lịch phỏng vấn
            </NavLink>
            <NavLink
              to={appConfig.routes.public.jobs}
              className="px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 hover:text-slate-900 hover:bg-slate-100 text-indigo-600 font-medium"
            >
              <Briefcase className="w-4 h-4" />
              Tìm việc mới
            </NavLink>
          </nav>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <Link
              to={appConfig.routes.public.jobs}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trang việc làm</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">{currentUser?.fullName || 'Ứng viên'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{currentUser?.email || ''}</p>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                title="Đăng xuất"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1 flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CandidateLayout;
