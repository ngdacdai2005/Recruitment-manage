import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Coffee, 
  Laptop, 
  Plane, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  Award 
} from 'lucide-react';

export const CulturePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-indigo-600" />
          <span>Văn Hóa Doanh Nghiệp & Con Người</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Nơi Nuôi Dưỡng Sự Sáng Tạo & Đột Phá Công Nghệ
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
          Chúng tôi tin rằng sản phẩm xuất sắc bắt nguồn từ một tập thể gắn kết, được tự do tư duy và luôn được trao quyền để tạo nên những điều phi thường.
        </p>
      </div>

      {/* 4 Pillars of Culture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">1. Tinh thần đổi mới liên tục</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Khuyến khích thử nghiệm công nghệ mới, không ngại thất bại sớm để tìm ra giải pháp tối ưu nhất cho khách hàng.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">2. Minh bạch & Tôn trọng</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mọi ý kiến đóng góp đều được lắng nghe bình đẳng. Văn hóa phản biện cởi mở không bị giới hạn bởi cấp bậc hành chính.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">3. Học tập & Phát triển không ngừng</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tài trợ ngân sách tham gia hội thảo quốc tế, thi chứng chỉ AWS/CKA/PMP và tổ chức các buổi Tech Sharing nội bộ hàng tuần.
          </p>
        </div>
      </div>

      {/* Comprehensive Benefits Checklist */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Đãi Ngộ Toàn Diện Chuẩn Quốc Tế</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Chúng tôi chăm sóc đời sống vật chất và tinh thần của từng nhân sự và gia đình.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
          <div className="flex items-start gap-3">
            <Laptop className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-white">Macbook M-series</h4>
              <p className="text-[11px] text-slate-400">Trang bị màn hình 4K và thiết bị làm việc tối tân nhất.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-white">Bảo hiểm VIP 24/7</h4>
              <p className="text-[11px] text-slate-400">Bảo hiểm sức khỏe cao cấp cho nhân viên và người thân.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-white">Company Trip 5★</h4>
              <p className="text-[11px] text-slate-400">Nghỉ dưỡng hàng năm tại các resort cao cấp trong và ngoài nước.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Coffee className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-white">Pantry & Cơm trưa</h4>
              <p className="text-[11px] text-slate-400">Pantry miễn phí bánh kẹo, hoa quả và phụ cấp ăn trưa hàng tháng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

