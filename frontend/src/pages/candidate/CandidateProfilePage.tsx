import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  UploadCloud, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Download, 
  Building2, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CandidateProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Đỗ Văn Ứng Viên');
  const [email, setEmail] = useState(currentUser?.email || 'candidate@example.com');
  const [phone, setPhone] = useState('0945678901');
  const [address, setAddress] = useState('Cầu Giấy, Hà Nội');
  const [headline, setHeadline] = useState('Senior Java Backend Engineer | Microservices Specialist');
  const [summary, setSummary] = useState(
    'Hơn 3 năm kinh nghiệm phát triển phần mềm doanh nghiệp với Java Spring Boot, kiến trúc Microservices, Redis Caching và Message Queue (Kafka). Đam mê tối ưu hiệu năng cơ sở dữ liệu và xây dựng giải pháp CI/CD tự động.'
  );

  const [cvName, setCvName] = useState('CV_DoVanUngVien_Backend_2026.pdf');
  const [skills, setSkills] = useState<string[]>([
    'Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'RESTful API', 'Git', 'Kafka'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hồ Sơ & Quản Lý CV Cá Nhân</h1>
          <p className="text-xs text-slate-500 mt-1">
            Thông tin đầy đủ giúp hồ sơ của bạn nổi bật hơn trong mắt nhà tuyển dụng.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Đã lưu thay đổi thành công!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. CV Upload & Management Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              CV Đính kèm của tôi
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Sẵn sàng ứng tuyển
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-800">{cvName}</div>
                <div className="text-[11px] text-slate-400">Đã cập nhật 2 ngày trước • 1.8 MB (PDF)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => alert('Mở xem bản xem trước của CV')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải CV</span>
              </button>

              <label className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Thay CV mới</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCvName(e.target.files[0].name);
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 3000);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 2. Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Địa chỉ Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Địa chỉ hiện tại</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tiêu đề hồ sơ (Headline)</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ví dụ: Senior Java Backend Developer | Spring Boot"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Giới thiệu bản thân (Summary)</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Kỹ năng chuyên môn
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Thêm kỹ năng mới (Docker, CI/CD...)"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
          >
            Lưu thay đổi hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
};

