import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { brandConfig } from '../config/brand';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Brand Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">{brandConfig.name}</span>
              <p className="text-xs text-indigo-300 font-light">Nền tảng Tuyển dụng & Quản trị Nhân sự Lõi</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-md">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
              Doanh Nghiệp & HR Tech
            </span>
            <h2 className="text-3xl font-extrabold leading-tight">
              Tự động hóa tuyển dụng, chuẩn hóa quản trị nhân sự
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Tối ưu phễu tuyển dụng, sàng lọc ứng viên tức thời, chấm công và quản lý hồ sơ nhân viên tập trung trên một giao diện duy nhất.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-indigo-900/60 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảo mật JWT đa lớp, HttpOnly Cookie & Blacklist Redis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kanban Pipeline kéo thả thời gian thực</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hồ sơ nhân viên 7 nhóm nghiệp vụ tiêu chuẩn quốc tế</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>{brandConfig.copyright}</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO/IEC 27001
          </span>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
