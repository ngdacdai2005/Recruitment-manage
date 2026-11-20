import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Briefcase, UserCheck, ShieldAlert, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import { appConfig } from '../config/app.config';

export const PublicLayout: React.FC<{ onApplyClick?: (job: any) => void }> = ({ onApplyClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={appConfig.routes.public.home} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                RECRUIT<span className="text-indigo-600">PRO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-indigo-100 text-indigo-700">
                  PUBLIC
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Cổng Thông Tin Tuyển Dụng</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            <NavLink
              to={appConfig.routes.public.home}
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to={appConfig.routes.public.jobs}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              Cơ hội việc làm
            </NavLink>
            <NavLink
              to={appConfig.routes.public.culture}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              Văn hóa & Đãi ngộ
            </NavLink>
          </nav>

          {/* Right Action / Auth Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {currentUser.role === 'ROLE_CANDIDATE' ? (
                  <Link
                    to={appConfig.routes.candidate.dashboard}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Bàn làm việc Ứng viên
                  </Link>
                ) : (
                  <Link
                    to={appConfig.routes.admin.dashboard}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Trang quản trị ATS
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentUser.role === 'ROLE_CANDIDATE' ? 'Ứng viên' : currentUser.role.replace('ROLE_', '').replace('_', ' ')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    title="Đăng xuất"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=register"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Đăng ký</span>
                </Link>
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet context={{ onApplyClick }} />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
