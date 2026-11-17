import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  Users, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Footer } from './Footer';
import { ROUTES } from '../../constants/routes.constants';
import { UserRole } from '../../types';

export const AdminLayout: React.FC = () => {
  const { currentUser, currentRole, loginAs, isBackendOnline, checkConnection } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ROLE_HR_MANAGER', label: 'HR Manager', desc: 'Trưởng phòng tuyển dụng' },
    { role: 'ROLE_RECRUITER', label: 'Recruiter', desc: 'Chuyên viên tuyển dụng' },
    { role: 'ROLE_INTERVIEWER', label: 'Interviewer', desc: 'Tech Lead phỏng vấn' },
    { role: 'ROLE_SUPER_ADMIN', label: 'Super Admin', desc: 'Quản trị viên toàn quyền' },
    { role: 'ROLE_CANDIDATE', label: 'Candidate', desc: 'Ứng viên tìm việc' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Banner */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Chuyển khu vực:</span>
            <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
              <Link
                to={ROUTES.PUBLIC.HOME}
                className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                1. Public Website
              </Link>
              <Link
                to={ROUTES.CANDIDATE.DASHBOARD}
                onClick={() => {
                  if (currentRole !== 'ROLE_CANDIDATE') loginAs('ROLE_CANDIDATE');
                }}
                className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <UserCheck className="w-3.5 h-3.5" />
                2. Candidate Portal
              </Link>
              <Link
                to={ROUTES.ADMIN.DASHBOARD}
                className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 bg-indigo-600 text-white shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                3. Admin / ATS Portal
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => checkConnection()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors border"
              style={{
                backgroundColor: isBackendOnline ? 'rgba(6, 78, 59, 0.4)' : 'rgba(120, 53, 15, 0.4)',
                color: isBackendOnline ? '#34d399' : '#fcd34d',
                borderColor: isBackendOnline ? '#059669' : '#d97706'
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isBackendOnline ? 'Backend: Connected' : 'Demo Mode (Offline)'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 px-3 py-1 rounded flex items-center gap-2 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentUser ? currentUser.fullName : 'Admin ATS'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Chuyển đổi Role để trải nghiệm
                  </div>
                  {rolesList.map(item => (
                    <button
                      key={item.role}
                      onClick={() => {
                        loginAs(item.role);
                        setShowRoleMenu(false);
                        if (item.role === 'ROLE_CANDIDATE') {
                          navigate(ROUTES.CANDIDATE.DASHBOARD);
                        } else {
                          navigate(ROUTES.ADMIN.DASHBOARD);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                        currentRole === item.role ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {currentRole === item.role && <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Đang chọn</span>}
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                RECRUIT<span className="text-indigo-600">PRO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-rose-100 text-rose-700">
                  ATS & HR
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Quản Trị Tuyển Dụng & Nhân Sự Doanh Nghiệp</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 font-medium text-xs text-slate-600">
            <NavLink
              to={ROUTES.ADMIN.DASHBOARD}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard KPI
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN.PIPELINE}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Kanban className="w-4 h-4" />
              Kanban Pipeline
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN.JOBS}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Briefcase className="w-4 h-4" />
              Quản lý tin đăng
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN.CANDIDATES}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <UserCheck className="w-4 h-4" />
              Kho ứng viên
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN.INTERVIEWS}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Calendar className="w-4 h-4" />
              Lịch & Đánh giá
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN.EMPLOYEES}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Users className="w-4 h-4" />
              Quản lý nhân sự
            </NavLink>
          </nav>
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
