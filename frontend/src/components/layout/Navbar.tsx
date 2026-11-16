import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  UserCheck, 
  ShieldAlert, 
  LogOut, 
  ChevronDown, 
  Bookmark, 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  FileText, 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, currentRole, activePortal, setActivePortal, loginAs, logout, isBackendOnline, checkConnection } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ROLE_HR_MANAGER', label: 'HR Manager', desc: 'Trưởng phòng tuyển dụng' },
    { role: 'ROLE_RECRUITER', label: 'Recruiter', desc: 'Chuyên viên tuyển dụng' },
    { role: 'ROLE_INTERVIEWER', label: 'Interviewer', desc: 'Tech Lead phỏng vấn' },
    { role: 'ROLE_SUPER_ADMIN', label: 'Super Admin', desc: 'Quản trị viên toàn quyền' },
    { role: 'ROLE_CANDIDATE', label: 'Candidate', desc: 'Ứng viên tìm việc' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner: Portal Switcher & Role Selector */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Chuyển khu vực:</span>
          <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => { setActivePortal('PUBLIC'); setCurrentTab('home'); }}
              className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 ${
                activePortal === 'PUBLIC' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              1. Public Website
            </button>
            <button
              onClick={() => { 
                if (currentRole !== 'ROLE_CANDIDATE') loginAs('ROLE_CANDIDATE');
                setActivePortal('CANDIDATE'); 
                setCurrentTab('candidate-dashboard'); 
              }}
              className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 ${
                activePortal === 'CANDIDATE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              2. Candidate Portal
            </button>
            <button
              onClick={() => { 
                if (currentRole === 'ROLE_CANDIDATE') loginAs('ROLE_HR_MANAGER');
                setActivePortal('ADMIN'); 
                setCurrentTab('admin-dashboard'); 
              }}
              className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 ${
                activePortal === 'ADMIN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              3. Admin / ATS Portal
            </button>
          </div>
        </div>

        {/* Demo Fast Role Switcher & Backend Indicator */}
        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <button
            onClick={() => checkConnection()}
            title="Nhấn để kiểm tra lại kết nối Spring Boot Backend"
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
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">Thử nghiệm vai trò:</span>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 px-3 py-1 rounded flex items-center gap-2 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{currentUser ? currentUser.fullName : 'Chưa đăng nhập'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

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
                      setCurrentTab('candidate-dashboard');
                    } else {
                      setCurrentTab('admin-dashboard');
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
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (activePortal === 'PUBLIC') setCurrentTab('home');
            else if (activePortal === 'CANDIDATE') setCurrentTab('candidate-dashboard');
            else setCurrentTab('admin-dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-2">
              RECRUIT<span className="text-indigo-600">PRO</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                activePortal === 'ADMIN' ? 'bg-rose-100 text-rose-700' :
                activePortal === 'CANDIDATE' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {activePortal}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Enterprise Recruitment Platform</p>
          </div>
        </div>

        {/* Dynamic Navigation according to Portal */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
          {activePortal === 'PUBLIC' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${currentTab === 'home' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Trang chủ
              </button>
              <button
                onClick={() => setCurrentTab('jobs')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${currentTab === 'jobs' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Cơ hội việc làm
              </button>
              <button
                onClick={() => setCurrentTab('culture')}
                className={`px-3.5 py-2 rounded-lg transition-colors ${currentTab === 'culture' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Văn hóa & Đãi ngộ
              </button>
            </>
          )}

          {activePortal === 'CANDIDATE' && (
            <>
              <button
                onClick={() => setCurrentTab('candidate-dashboard')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'candidate-dashboard' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Tổng quan
              </button>
              <button
                onClick={() => setCurrentTab('candidate-applications')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'candidate-applications' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <FileText className="w-4 h-4" />
                Hồ sơ đã nộp & Tracking
              </button>
              <button
                onClick={() => setCurrentTab('candidate-profile')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'candidate-profile' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <UserCheck className="w-4 h-4" />
                Hồ sơ & CV của tôi
              </button>
              <button
                onClick={() => setCurrentTab('candidate-interviews')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'candidate-interviews' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Calendar className="w-4 h-4" />
                Lịch phỏng vấn
              </button>
              <button
                onClick={() => setCurrentTab('jobs')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 hover:text-slate-900 hover:bg-slate-100`}
              >
                <Briefcase className="w-4 h-4" />
                Tìm việc mới
              </button>
            </>
          )}

          {activePortal === 'ADMIN' && (
            <>
              <button
                onClick={() => setCurrentTab('admin-dashboard')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'admin-dashboard' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard KPI
              </button>
              <button
                onClick={() => setCurrentTab('admin-pipeline')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'admin-pipeline' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Kanban className="w-4 h-4" />
                Kanban Pipeline
              </button>
              <button
                onClick={() => setCurrentTab('admin-jobs')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'admin-jobs' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Briefcase className="w-4 h-4" />
                Quản lý tin đăng
              </button>
              <button
                onClick={() => setCurrentTab('admin-candidates')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'admin-candidates' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <UserCheck className="w-4 h-4" />
                Kho ứng viên
              </button>
              <button
                onClick={() => setCurrentTab('admin-interviews')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'admin-interviews' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Calendar className="w-4 h-4" />
                Lịch & Đánh giá
              </button>
            </>
          )}
        </nav>

        {/* User profile / Log in */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    {currentUser.role.replace('ROLE_', '').replace('_', ' ')}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginAs('ROLE_CANDIDATE')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

