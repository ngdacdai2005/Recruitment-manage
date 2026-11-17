import React from 'react';
import { Briefcase, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              RECRUIT<span className="text-indigo-400">PRO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống quản trị tuyển dụng và thu hút nhân tài doanh nghiệp (ATS & HRM Platform), kết nối ứng viên tiềm năng và tối ưu quy trình phỏng vấn chuẩn hóa.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Chuẩn bảo mật ISO/IEC</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Về công ty</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white transition-colors">Giới thiệu văn hóa</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Chế độ & Đãi ngộ</a></li>
              <li><a href="#teams" className="hover:text-white transition-colors">Các khối phòng ban</a></li>
              <li><a href="#tech" className="hover:text-white transition-colors">Công nghệ & Đổi mới</a></li>
            </ul>
          </div>

          {/* Candidate support */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Dành cho ứng viên</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#jobs" className="hover:text-white transition-colors">Tìm kiếm việc làm</a></li>
              <li><a href="#guide" className="hover:text-white transition-colors">Hướng dẫn nộp hồ sơ CV</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Câu hỏi thường gặp (FAQ)</a></li>
              <li><a href="#tracking" className="hover:text-white transition-colors">Quy trình phỏng vấn tiêu chuẩn</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Liên hệ tuyển dụng</h4>
            <p className="text-xs text-slate-400">Hotline: 0901 234 567</p>
            <p className="text-xs text-slate-400">Email: hr@recruitment.com</p>
            <p className="text-xs text-slate-400">Địa chỉ: Hà Nội & TP. Hồ Chí Minh</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} RecruitPro Enterprise ATS & HRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
