import React, { useMemo } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Briefcase, ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import { APP_MODULES } from '../config/modules';
import { ModuleIcon } from '../components/common/ModuleIcon';
import { brandConfig } from '../config/brand';

export const AdminLayout: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const navigate = useNavigate();

  // Filter modules based on current user role
  const authorizedModules = useMemo(() => {
    if (!currentRole) return [];
    return APP_MODULES.filter((m) => m.allowedRoles.includes(currentRole));
  }, [currentRole]);

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN': return 'Super Admin';
      case 'ROLE_HR_MANAGER': return 'HR Manager';
      case 'ROLE_RECRUITER': return 'Recruiter';
      case 'ROLE_INTERVIEWER': return 'Tech Interviewer';
      case 'ROLE_DEPARTMENT_HEAD': return 'Trưởng bộ phận';
      case 'ROLE_TALENT_SOURCER': return 'Talent Sourcer';
      case 'ROLE_HR_ASSISTANT': return 'Trợ lý HR';
      case 'ROLE_SYSTEM_AUDITOR': return 'Kiểm toán hệ thống';
      default: return role || 'Admin ATS';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Main Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                RECRUIT<span className="text-indigo-600">PRO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-rose-100 text-rose-700">
                  ATS & HRM
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{brandConfig.tagline}</p>
            </div>
          </Link>

          {/* Right Section: Public Portal link, User Info & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              target="_blank"
              title="Xem trang thông tin tuyển dụng công khai"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trang tin tuyển dụng</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">{currentUser?.fullName || 'Quản trị viên'}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {getRoleDisplayName(currentRole)}
                </p>
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

        {/* Dynamic Module Sub-navigation */}
        <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-2 overflow-x-auto flex items-center gap-1.5 text-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-1.5 overflow-x-auto py-0.5">
            {authorizedModules.map((mod) => (
              <NavLink
                key={mod.key}
                to={mod.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 text-xs font-medium shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`
                }
              >
                <ModuleIcon name={mod.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{mod.label}</span>
                {mod.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-bold ml-1">
                    {mod.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
