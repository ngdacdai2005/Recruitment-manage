import React from 'react';
import { Sparkles, Heart, Coffee, ShieldCheck, Compass, Award } from 'lucide-react';

export const CulturePillars: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: '1. Tinh thần đổi mới liên tục',
      desc: 'Khuyến khích thử nghiệm công nghệ mới, không ngại thất bại sớm để tìm ra giải pháp tối ưu nhất cho khách hàng.',
    },
    {
      icon: Heart,
      title: '2. Tôn trọng & Đồng cảm',
      desc: 'Môi trường làm việc cởi mở, lắng nghe đa chiều, nơi mọi cá nhân đều được đối xử bình đẳng và trân trọng.',
    },
    {
      icon: Coffee,
      title: '3. Cân bằng công việc & Cuộc sống',
      desc: 'Chính sách làm việc linh hoạt kết hợp hybrid, quan tâm sâu sắc tới sức khỏe thể chất và tinh thần của từng nhân sự.',
    },
    {
      icon: ShieldCheck,
      title: '4. Minh bạch & Trách nhiệm',
      desc: 'Mọi chính sách thăng tiến, đánh giá hiệu quả (OKRs/KPIs) và đãi ngộ đều được minh bạch và công khai rõ ràng.',
    },
    {
      icon: Compass,
      title: '5. Lộ trình phát triển rõ ràng',
      desc: 'Kế hoạch đào tạo nội bộ bài bản, tài trợ chứng chỉ công nghệ quốc tế và cơ hội thăng tiến lên các vị trí quản lý.',
    },
    {
      icon: Award,
      title: '6. Tưởng thưởng xứng đáng',
      desc: 'Chế độ đãi ngộ cạnh tranh top đầu thị trường, thưởng hiệu quả kinh doanh và gói phúc lợi toàn diện cho cả gia đình.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pillars.map((p, idx) => {
        const Icon = p.icon;
        return (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{p.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
          </div>
        );
      })}
    </div>
  );
};
