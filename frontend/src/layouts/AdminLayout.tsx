import React, { useMemo } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminTopbar } from './AdminTopbar';
import { Footer } from './Footer';
import { APP_MODULES, AppModule } from '../config/modules';
import { ModuleIcon } from '../components/common/ModuleIcon';
import { brandConfig } from '../config/brand';

export const AdminLayout: React.FC = () => {
  const { currentRole } = useAuth();

  // Filter modules based on current user role
  const authorizedModules = useMemo(() => {
    if (!currentRole) return [];
    return APP_MODULES.filter((m) => m.allowedRoles.includes(currentRole));
  }, [currentRole]);

  // Group modules by group
  const groupedModules = useMemo(() => {
    const groups: { label: string; modules: AppModule[] }[] = [];
    const atsModules = authorizedModules.filter((m) => m.group === 'ATS');
    const hrmModules = authorizedModules.filter((m) => m.group === 'HRM');
    const sysModules = authorizedModules.filter((m) => m.group === 'SYSTEM');

    if (atsModules.length > 0) groups.push({ label: 'Tuyển dụng & ATS', modules: atsModules });
    if (hrmModules.length > 0) groups.push({ label: 'Quản trị Nhân sự (HRM)', modules: hrmModules });
    if (sysModules.length > 0) groups.push({ label: 'Hệ thống', modules: sysModules });

    return groups;
  }, [authorizedModules]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Universal Topbar */}
      <AdminTopbar />

      {/* 2. Main Admin Navbar (Single Source of Truth from modules.ts) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

          {/* Dynamic Module NavLinks generated from modules.ts */}
          <nav className="hidden xl:flex items-center gap-1 font-medium text-xs text-slate-600">
            {authorizedModules.map((mod) => (
              <NavLink
                key={mod.key}
                to={mod.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-semibold shadow-xs'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <ModuleIcon name={mod.icon} className="w-4 h-4 shrink-0" />
                <span>{mod.label}</span>
                {mod.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                    {mod.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Sub-navigation for Medium Screens */}
        <div className="xl:hidden bg-slate-100/70 border-t border-slate-200 px-4 py-2 overflow-x-auto flex items-center gap-1.5 text-xs">
          {authorizedModules.map((mod) => (
            <NavLink
              key={mod.key}
              to={mod.path}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 text-xs ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`
              }
            >
              <ModuleIcon name={mod.icon} className="w-3.5 h-3.5 shrink-0" />
              <span>{mod.label}</span>
            </NavLink>
          ))}
        </div>
      </header>

      {/* 3. Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
