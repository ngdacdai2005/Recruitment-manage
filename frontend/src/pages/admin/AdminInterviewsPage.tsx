import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Video, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Award, 
  X, 
  ExternalLink, 
  FileCheck 
} from 'lucide-react';
import { Interview, InterviewEvaluation, Application } from '../../types';
import { mockUsers } from '../../data/mockData';

interface AdminInterviewsPageProps {
  interviews: Interview[];
  applications: Application[];
  onAddInterview: (newInv: Interview) => void;
  onSaveEvaluation: (interviewId: number, evaluation: InterviewEvaluation) => void;
}

export const AdminInterviewsPage: React.FC<AdminInterviewsPageProps> = ({
  interviews,
  applications,
  onAddInterview,
  onSaveEvaluation
}) => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [evaluatingInterview, setEvaluatingInterview] = useState<Interview | null>(null);

  // New Interview Form
  const [selectedAppId, setSelectedAppId] = useState<number>(applications[0]?.id || 1);
  const [interviewerId, setInterviewerId] = useState<number>(4); // default Tech Lead
  const [scheduledAt, setScheduledAt] = useState('2026-11-22T10:00');
  const [duration, setDuration] = useState(60);
  const [interviewType, setInterviewType] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [locationOrLink, setLocationOrLink] = useState('https://meet.google.com/rec-interview-2026');
  const [notes, setNotes] = useState('Phỏng vấn vòng chuyên môn kỹ thuật.');

  // Evaluation Form
  const [techScore, setTechScore] = useState(8);
  const [commScore, setCommScore] = useState(8);
  const [probScore, setProbScore] = useState(8);
  const [teamScore, setTeamScore] = useState(9);
  const [generalNotes, setGeneralNotes] = useState('');
  const [result, setResult] = useState<'PASS' | 'FAIL' | 'PENDING'>('PASS');

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find(a => a.id === selectedAppId);
    const interviewer = mockUsers.find(u => u.id === interviewerId) || mockUsers[3];

    const newInv: Interview = {
      id: Date.now(),
      applicationId: selectedAppId,
      candidateName: app?.candidate.fullName || 'Ứng viên',
      jobTitle: app?.job.title || 'Vị trí tuyển dụng',
      interviewerName: interviewer.fullName,
      scheduledAt,
      durationMinutes: duration,
      interviewType,
      locationOrLink,
      notes,
      status: 'SCHEDULED'
    };

    onAddInterview(newInv);
    setScheduleModalOpen(false);
  };

  const handleOpenEvaluation = (inv: Interview) => {
    setEvaluatingInterview(inv);
    if (inv.evaluation) {
      setTechScore(inv.evaluation.technicalScore);
      setCommScore(inv.evaluation.communicationScore);
      setProbScore(inv.evaluation.problemSolvingScore);
      setTeamScore(inv.evaluation.teamworkScore);
      setGeneralNotes(inv.evaluation.generalNotes);
      setResult(inv.evaluation.result);
    } else {
      setTechScore(8);
      setCommScore(8);
      setProbScore(8);
      setTeamScore(9);
      setGeneralNotes('Ứng viên nắm chắc kiến thức cơ bản, tư duy logic tốt.');
      setResult('PASS');
    }
  };

  const handleSaveEvalForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingInterview) return;

    const evalData: InterviewEvaluation = {
      technicalScore: techScore,
      communicationScore: commScore,
      problemSolvingScore: probScore,
      teamworkScore: teamScore,
      generalNotes,
      result
    };

    onSaveEvaluation(evaluatingInterview.id, evalData);
    setEvaluatingInterview(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý & Đánh Giá Phỏng Vấn (Interview Management)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối lịch phỏng vấn, liên kết Google Meet và phiếu đánh giá tiêu chí chuyên môn chuẩn hóa.
          </p>
        </div>

        <button
          onClick={() => setScheduleModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo lịch phỏng vấn mới</span>
        </button>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {interviews.map(inv => (
          <div
            key={inv.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-200 transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  inv.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  inv.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {inv.status}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {inv.interviewType} • {inv.durationMinutes} phút
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">{inv.candidateName}</h3>
                <span className="text-slate-400">/</span>
                <span className="text-xs font-semibold text-slate-600">{inv.jobTitle}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-600" /> {inv.scheduledAt.replace('T', ' lúc ')}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-600" /> Interviewer: {inv.interviewerName}</span>
              </div>

              {inv.evaluation && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Kết quả: {inv.evaluation.result}</span>
                    <span className="text-[11px]">
                      Kỹ thuật: {inv.evaluation.technicalScore}/10 • Giao tiếp: {inv.evaluation.communicationScore}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 italic">{inv.evaluation.generalNotes}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {inv.locationOrLink && (
                <a
                  href={inv.locationOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Google Meet</span>
                </a>
              )}

              <button
                onClick={() => handleOpenEvaluation(inv)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{inv.evaluation ? 'Xem / Sửa phiếu chấm' : 'Chấm điểm phỏng vấn'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Tạo lịch phỏng vấn mới</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ứng viên ứng tuyển *</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                >
                  {applications.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.candidate.fullName} - {a.job.title} ({a.currentStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Người phỏng vấn (Interviewer) *</label>
                  <select
                    value={interviewerId}
                    onChange={(e) => setInterviewerId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {mockUsers.filter(u => u.role !== 'ROLE_CANDIDATE').map(u => (
                      <option key={u.id} value={u.id}>{u.fullName} ({u.role.replace('ROLE_', '')})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hình thức phỏng vấn</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="ONLINE">Online (Google Meet)</option>
                    <option value="OFFLINE">Offline tại văn phòng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Ngày và giờ hẹn *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Link họp trực tuyến hoặc địa điểm *</label>
                <input
                  type="text"
                  required
                  value={locationOrLink}
                  onChange={(e) => setLocationOrLink(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ghi chú cho Interviewer & Ứng viên</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200"
                >
                  Lưu & Gửi Email thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Evaluation Sheet Modal (Section 3.5 Requirement) */}
      {evaluatingInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Phiếu Đánh Giá Phỏng Vấn Chuyên Môn</h3>
                <p className="text-xs text-slate-500">Ứng viên: {evaluatingInterview.candidateName} - {evaluatingInterview.jobTitle}</p>
              </div>
              <button onClick={() => setEvaluatingInterview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvalForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Kiến thức chuyên môn (1-10): {techScore}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={techScore}
                    onChange={(e) => setTechScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Kỹ năng giao tiếp (1-10): {commScore}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={commScore}
                    onChange={(e) => setCommScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Khả năng giải quyết vấn đề (1-10): {probScore}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={probScore}
                    onChange={(e) => setProbScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Khả năng làm việc nhóm (1-10): {teamScore}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={teamScore}
                    onChange={(e) => setTeamScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nhận xét tổng quan của Hội đồng phỏng vấn *</label>
                <textarea
                  rows={3}
                  required
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Ghi nhận điểm mạnh, điểm cần cải thiện và tiềm năng phát triển của ứng viên..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Kết luận cuối cùng *</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 cursor-pointer">
                    <input
                      type="radio"
                      name="evalResult"
                      value="PASS"
                      checked={result === 'PASS'}
                      onChange={() => setResult('PASS')}
                      className="accent-emerald-600"
                    />
                    <span>PASS (Đạt yêu cầu)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-rose-700 cursor-pointer">
                    <input
                      type="radio"
                      name="evalResult"
                      value="FAIL"
                      checked={result === 'FAIL'}
                      onChange={() => setResult('FAIL')}
                      className="accent-rose-600"
                    />
                    <span>FAIL (Chưa đạt)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-amber-700 cursor-pointer">
                    <input
                      type="radio"
                      name="evalResult"
                      value="PENDING"
                      checked={result === 'PENDING'}
                      onChange={() => setResult('PENDING')}
                      className="accent-amber-600"
                    />
                    <span>PENDING (Cân nhắc thêm)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvaluatingInterview(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200"
                >
                  Lưu phiếu đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

