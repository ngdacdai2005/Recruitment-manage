import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  Send 
} from 'lucide-react';
import { Job, Application } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { fileApi, applicationApi } from '../../api';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newApplication: Application) => void;
  existingApplications: Application[];
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmitSuccess,
  existingApplications
}) => {
  const { currentUser, loginAs, isBackendOnline } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Đỗ Văn Ứng Viên');
  const [email, setEmail] = useState(currentUser?.email || 'candidate@example.com');
  const [phone, setPhone] = useState('0945678901');
  const [expectedSalary, setExpectedSalary] = useState<string>('25000000');
  const [availableDate, setAvailableDate] = useState<string>('2026-12-01');
  const [coverLetter, setCoverLetter] = useState<string>('Tôi rất mong muốn được cống hiến và đồng hành cùng công ty.');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('CV_DoVanUngVien_Fullstack.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Check if candidate already applied to this job!
  const hasAlreadyApplied = existingApplications.some(
    app => app.job.id === job.id && app.candidate.email.toLowerCase() === email.toLowerCase()
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Dung lượng file CV không được vượt quá 10MB.');
        return;
      }
      setCvFile(file);
      setFileName(file.name);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasAlreadyApplied) {
      setErrorMsg('Bạn đã nộp hồ sơ vào vị trí này rồi. Vui lòng theo dõi tiến trình tại mục "Hồ sơ của tôi".');
      return;
    }

    if (!fileName && !cvFile) {
      setErrorMsg('Vui lòng tải lên file CV (PDF hoặc DOCX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let uploadedUrl = '';
      let uploadedFilename = fileName || '';

      if (cvFile) {
        const uploadRes = await fileApi.uploadCv(cvFile);
        uploadedUrl = uploadRes.fileUrl;
        uploadedFilename = uploadRes.fileName;
      }

      const backendApp = await applicationApi.applyJob({
        jobId: job.id,
        fullName,
        email,
        phone,
        expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
        availableDate,
        resumeUrl: uploadedUrl,
        resumeFilename: uploadedFilename,
        coverLetter,
      });

      setIsSubmitting(false);
      setSuccess(true);
      onSubmitSuccess(backendApp);
    } catch (err: any) {
      console.error('Apply job error:', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Không thể gửi hồ sơ. Vui lòng kiểm tra kết nối Backend và thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Nộp hồ sơ ứng tuyển</div>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">{job.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Ứng tuyển thành công!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Hệ thống đã ghi nhận hồ sơ và gửi email xác nhận. Bạn có thể theo dõi tiến độ xét duyệt trực tiếp tại mục <strong className="text-slate-800">Candidate Tracking Timeline</strong>.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {hasAlreadyApplied && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cảnh báo:</strong> Bạn đã ứng tuyển vào vị trí này trước đó. Để đảm bảo công bằng trong quy trình tuyển dụng, bạn không thể gửi thêm hồ sơ trùng lặp.
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Personal info fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="0912345678"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mức lương mong muốn (VNĐ/tháng)</label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="20000000"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ngày có thể bắt đầu nhận việc</label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* CV Upload Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Tải lên file CV (PDF, DOCX - Tối đa 10MB) *</label>
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-indigo-600" />
                  <div className="text-xs font-semibold text-slate-800">
                    {fileName ? `File đã chọn: ${fileName}` : 'Kéo thả file CV vào đây hoặc bấm để duyệt'}
                  </div>
                  <div className="text-[11px] text-slate-400">Định dạng hỗ trợ: PDF, DOC, DOCX (Dung lượng ≤ 10MB)</div>
                </div>
              </div>
            </div>

            {/* Cover letter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Thư giới thiệu bản thân / Cover Letter (Tùy chọn)</label>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="Chia sẻ ngắn gọn lý do bạn phù hợp với vị trí này..."
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasAlreadyApplied}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang tải lên...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Xác nhận nộp hồ sơ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

