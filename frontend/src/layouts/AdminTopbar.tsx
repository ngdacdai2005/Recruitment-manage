import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCheck,
  ShieldAlert,
  ChevronDown,
  ExternalLink,
  Bell,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { brandConfig } from '../config/brand';
import { UserRole } from '../types';

export const AdminTopbar: React.FC = () => {
  const { currentUser, currentRole, loginAs, logout, isBackendOnline, checkConnection } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ROLE_HR_MANAGER', label: 'HR Manager', desc: 'Trưởng phòng tuyển dụng & nhân sự' },
    { role: 'ROLE_RECRUITER', label: 'Recruiter', desc: 'Chuyên viên tuyển dụng' },
    { role: 'ROLE_INTERVIEWER', label: 'Interviewer', desc: 'Tech Lead phỏng vấn kỹ thuật' },
    { role: 'ROLE_SUPER_ADMIN', label: 'Super Admin', desc: 'Quản trị viên toàn quyền hệ thống' },
    { role: 'ROLE_CANDIDATE', label: 'Candidate', desc: 'Ứng viên tìm kiếm việc làm' },
  ];

  return (
    <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
      {/* 1. Portal Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium">Chuyển khu vực:</span>
        <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
          <Link
            to="/"
            className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            1. Public Website
          </Link>
          <Link
            to="/candidate/dashboard"
            onClick={() => {
              if (currentRole !== 'ROLE_CANDIDATE') loginAs('ROLE_CANDIDATE');
            }}
            className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <UserCheck className="w-3.5 h-3.5" />
            2. Candidate Portal
          </Link>
          <Link
            to="/admin/dashboard"
            className="px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 bg-indigo-600 text-white shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            3. Admin / ATS & HRM
          </Link>
        </div>
      </div>

      {/* 2. Topbar Utilities: Health, Fast Role Switcher, Profile */}
      <div className="flex items-center gap-3">
        {/* Backend Connection Health Badge */}
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
          <span>{isBackendOnline ? 'Backend: Online' : 'Demo Mode'}</span>
        </button>

        {/* Fast Role Switcher for Evaluation */}
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
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Thử nghiệm phân quyền vai trò (RBAC)
              </div>
              {rolesList.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    loginAs(item.role);
                    setShowRoleMenu(false);
                    if (item.role === 'ROLE_CANDIDATE') {
                      navigate('/candidate/dashboard');
                    } else {
                      navigate('/admin/dashboard');
                    }
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${currentRole === item.role ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {currentRole === item.role && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;
