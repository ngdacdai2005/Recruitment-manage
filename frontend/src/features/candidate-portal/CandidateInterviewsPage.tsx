import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  User 
} from 'lucide-react';
import { Interview } from '@/types';

interface CandidateInterviewsPageProps {
  interviews: Interview[];
}

export const CandidateInterviewsPage: React.FC<CandidateInterviewsPageProps> = ({ interviews }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Lịch Phỏng Vấn Của Tôi</h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi thời gian, người phỏng vấn và truy cập phòng họp trực tuyến Google Meet.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">Chưa có lịch phỏng vấn nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khi hồ sơ của bạn vượt qua vòng sàng lọc sơ loại, chuyên viên tuyển dụng sẽ sắp xếp thời gian phỏng vấn phù hợp và gửi thông báo cho bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map(inv => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-200 transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    inv.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    inv.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {inv.status === 'COMPLETED' ? 'Đã hoàn thành' :
                     inv.status === 'CANCELLED' ? 'Đã hủy' : 'Sắp diễn ra'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {inv.interviewType} • {inv.durationMinutes} phút
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{inv.jobTitle}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Thời gian: <strong>{inv.scheduledAt ? inv.scheduledAt.replace('T', ' lúc ') : 'Chưa xếp lịch'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Người phỏng vấn: <strong>{inv.interviewerName}</strong></span>
                  </div>
                </div>

                {inv.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Nội dung trao đổi:</span> {inv.notes}
                  </p>
                )}
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2">
                {inv.locationOrLink && inv.status === 'SCHEDULED' && (
                  <a
                    href={inv.locationOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Vào Google Meet</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpful Interview Tips */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white space-y-3">
        <h4 className="font-bold text-sm flex items-center gap-2 text-indigo-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Lưu ý trước buổi phỏng vấn trực tuyến
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5 font-light leading-relaxed">
          <li>Kiểm tra camera, micro và kết nối mạng trước giờ hẹn 10 phút.</li>
          <li>Chuẩn bị sẵn máy tính có cài đặt môi trường lập trình nếu tham gia vòng kỹ thuật (Live coding).</li>
          <li>Tìm hiểu kỹ về sản phẩm, định hướng công nghệ của công ty để có phần trao đổi hiệu quả.</li>
        </ul>
      </div>
    </div>
  );
};

