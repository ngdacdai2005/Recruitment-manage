import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Check, 
  FileCheck2, 
  Sparkles, 
  Award, 
  XCircle 
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';

interface ApplicationTrackingPageProps {
  application: Application;
  onBack: () => void;
}

export const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({
  application,
  onBack
}) => {
  // Define standard candidate-facing stages
  const stages = [
    {
      id: 'APPLIED',
      title: 'Đã tiếp nhận hồ sơ',
      desc: 'Hồ sơ ứng tuyển đã được tiếp nhận an toàn vào hệ thống tuyển dụng.',
      date: application.createdAt.split(' ')[0]
    },
    {
      id: 'SCREENING',
      title: 'Sàng lọc hồ sơ (CV Review)',
      desc: 'Bộ phận nhân sự xem xét độ phù hợp về kỹ năng và kinh nghiệm.',
      date: '12/11/2026'
    },
    {
      id: 'INTERVIEW',
      title: 'Phỏng vấn chuyên môn & Văn hóa',
      desc: 'Trao đổi cùng Tech Lead hoặc Trưởng phòng chuyên môn qua Google Meet.',
      date: '20/11/2026'
    },
    {
      id: 'OFFER',
      title: 'Thư đề nghị nhận việc (Offer Letter)',
      desc: 'Trao đổi về mức đãi ngộ, chế độ phúc lợi và hợp đồng lao động.',
      date: 'Dự kiến'
    },
    {
      id: 'HIRED',
      title: 'Tuyển dụng thành công',
      desc: 'Chào mừng bạn chính thức gia nhập đại gia đình công ty!',
      date: 'Hoàn tất'
    }
  ];

  // Helper to determine stage status: 'COMPLETED' | 'CURRENT' | 'WAITING' | 'REJECTED'
  const getStageStatus = (stageId: string, currentStatus: ApplicationStatus) => {
    if (currentStatus === 'REJECTED') {
      if (stageId === 'APPLIED') return 'COMPLETED';
      return 'REJECTED';
    }

    const order = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];
    const currentIndex = order.indexOf(currentStatus === 'ASSESSMENT' ? 'INTERVIEW' : currentStatus);
    const targetIndex = order.indexOf(stageId);

    if (targetIndex < currentIndex) return 'COMPLETED';
    if (targetIndex === currentIndex) return 'CURRENT';
    return 'WAITING';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại tổng quan</span>
      </button>

      {/* Header Application Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {application.job.department.name}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{application.job.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {application.job.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Nộp ngày: {application.createdAt}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-slate-400 font-medium">Trạng thái hiện tại:</span>
            <span className={`text-sm font-extrabold px-3 py-1 rounded-full mt-1 inline-flex items-center gap-1.5 ${
              application.currentStatus === 'HIRED' ? 'bg-emerald-100 text-emerald-800' :
              application.currentStatus === 'OFFER' ? 'bg-purple-100 text-purple-800' :
              application.currentStatus === 'INTERVIEW' ? 'bg-indigo-100 text-indigo-800' :
              application.currentStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {application.currentStatus === 'HIRED' && <Award className="w-4 h-4" />}
              {application.currentStatus === 'INTERVIEW' && <Clock className="w-4 h-4" />}
              {application.currentStatus === 'REJECTED' ? 'Chưa phù hợp' :
               application.currentStatus === 'HIRED' ? 'Trúng tuyển' :
               application.currentStatus === 'OFFER' ? 'Đã gửi Offer' :
               application.currentStatus === 'INTERVIEW' ? 'Đang phỏng vấn' : 'Đang xử lý'}
            </span>
          </div>
        </div>

        {application.rejectionReason && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Phản hồi từ Bộ phận tuyển dụng</span>
            </div>
            <p className="leading-relaxed pl-5">{application.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Visual Stepper Timeline (Section 2.6 Requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            Dòng thời gian xử lý hồ sơ (Tracking Timeline)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình tuyển dụng minh bạch, cập nhật tự động ngay khi hội đồng tuyển dụng phê duyệt các giai đoạn.
          </p>
        </div>

        {/* Vertical Timeline Steps */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {stages.map((st, idx) => {
            const status = getStageStatus(st.id, application.currentStatus);

            return (
              <div key={st.id} className="relative group">
                {/* Node icon */}
                <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' :
                  status === 'CURRENT' ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse' :
                  status === 'REJECTED' ? 'bg-slate-200 border-slate-300 text-slate-400' :
                  'bg-white border-slate-300 text-slate-400'
                }`}>
                  {status === 'COMPLETED' ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : status === 'CURRENT' ? (
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  ) : (
                    <span className="text-[11px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Content card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  status === 'CURRENT' ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' :
                  status === 'COMPLETED' ? 'bg-white border-slate-200' :
                  'bg-slate-50/50 border-slate-200 opacity-60'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={`font-bold text-sm ${status === 'CURRENT' ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {st.title}
                    </h3>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto ${
                      status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      status === 'CURRENT' ? 'bg-indigo-600 text-white' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {status === 'COMPLETED' ? 'Hoàn thành' :
                       status === 'CURRENT' ? 'Đang xử lý' : 'Chờ cập nhật'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {st.desc}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Mốc thời gian: {st.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Confidentiality Note (from user requirement 2.6) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Lưu ý: Hệ thống chỉ hiển thị trạng thái công khai, các phiếu chấm điểm kỹ thuật và nhận xét đánh giá nội bộ của HR/Tech Lead được bảo mật.</span>
        </div>
      </div>
    </div>
  );
};

