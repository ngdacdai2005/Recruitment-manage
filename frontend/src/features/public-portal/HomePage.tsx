import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Bookmark 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMasterData } from '@/context/MasterDataContext';
import { jobApi } from '@/api/jobApi';
import { Job } from '@/types';

interface HomePageProps {
  onSelectJob: (job: Job) => void;
  onNavigateJobs: (searchParams?: { keyword: string; departmentId?: number }) => void;
  onApplyClick: (job: Job) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectJob, onNavigateJobs, onApplyClick }) => {
  const [keyword, setKeyword] = useState('');
  const [deptId, setDeptId] = useState<number | undefined>();
  const { savedJobIds, toggleSaveJob } = useAuth();
  const { departments } = useMasterData();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    jobApi.getPublicJobs({ size: 10, sortBy: 'createdAt', direction: 'desc' })
      .then(res => {
        if (isMounted) {
          setJobs(res?.content || []);
        }
      })
      .catch(err => {
        console.warn('Failed to load public jobs from API:', err);
        if (isMounted) setJobs([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const deptList = departments;
  const featuredJobs = jobs.filter(j => j.status === 'PUBLISHED').slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateJobs({ keyword, departmentId: deptId });
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gia nhập đội ngũ kiến tạo tương lai số</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Nơi Khởi Đầu Cho Những <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400">
              Bước Tiến Sự Nghiệp Đột Phá
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Khám phá hơn 20+ vị trí tuyển dụng với mức thu nhập cạnh tranh, môi trường làm việc cởi mở, trang thiết bị tối tân và lộ trình thăng tiến rõ ràng.
          </p>

          {/* Quick Search Form */}
          <form 
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 gap-2 border-b sm:border-b-0 sm:border-r border-slate-200 py-2 sm:py-0">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Vị trí, kỹ năng (Java, React, Marketing...)"
                className="w-full text-slate-800 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex-1 flex items-center px-4 gap-2 py-2 sm:py-0">
              <Briefcase className="w-5 h-5 text-indigo-600 shrink-0" />
              <select
                value={deptId || ''}
                onChange={(e) => setDeptId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full text-slate-800 text-sm focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="">Tất cả phòng ban</option>
                {deptList.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Tìm việc ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Highlights Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-left max-w-3xl mx-auto border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-white">20+</div>
              <div className="text-xs text-slate-400 mt-0.5">Vị trí đang mở tuyển</div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-emerald-400">48h</div>
              <div className="text-xs text-slate-400 mt-0.5">Tốc độ phản hồi hồ sơ</div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-indigo-400">4.9★</div>
              <div className="text-xs text-slate-400 mt-0.5">Môi trường làm việc</div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Bảo hiểm sức khỏe VIP</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Cơ hội việc làm hot</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Vị trí tuyển dụng nổi bật</h2>
          </div>
          <button
            onClick={() => onNavigateJobs()}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1 group"
          >
            <span>Xem tất cả công việc</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-10 bg-slate-100 rounded mt-6"></div>
              </div>
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            Hiện tại chưa có tin tuyển dụng nào được đăng tải trên hệ thống.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map(job => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                        {job.department?.name || 'Chung'}
                      </span>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Bỏ lưu' : 'Lưu công việc'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h3 
                      onClick={() => onSelectJob(job)}
                      className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 cursor-pointer line-clamp-2 transition-colors"
                    >
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.employmentType}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Mức lương:</span>
                    <span className="font-bold text-indigo-700 text-sm">
                      {job.salaryMin ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax! / 1000000).toFixed(0)} triệu` : 'Thỏa thuận'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => onApplyClick(job)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                  >
                    Ứng tuyển ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* 3. Why Join Us (Employer Branding) */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Giá trị cốt lõi</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Tại sao bạn nên chọn chúng tôi?</h2>
          <p className="text-slate-600 text-sm mt-3">
            Chúng tôi coi trọng con người và sự sáng tạo, xây dựng môi trường để mỗi thành viên phát huy tối đa tiềm năng bản thân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Đãi ngộ hàng đầu</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mức lương cạnh tranh, thưởng dự án, review định kỳ 2 lần/năm và cổ phần thưởng cho nhân sự cống hiến.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Lộ trình thăng tiến</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Định hướng Career Path rõ ràng: Technical Specialist hoặc Management Track với ngân sách đào tạo 20 triệu/năm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Văn hóa cởi mở</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Không khoảng cách cấp bậc, khuyến khích phản biện thẳng thắn, trang bị Macbook Pro và giờ làm việc linh hoạt.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Chăm sóc toàn diện</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bảo hiểm sức khỏe VIP, khám sức khỏe định kỳ tại bệnh viện quốc tế, hỗ trợ cơm trưa và câu lạc bộ thể thao.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Recruitment Workflow (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Quy trình minh bạch</div>
          <h2 className="text-3xl font-extrabold text-slate-900">4 Bước Ứng Tuyển Chuẩn Hóa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-black text-indigo-600/30 mb-2">01</div>
            <h3 className="font-bold text-slate-900 mb-1">Nộp hồ sơ trực tuyến</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ứng viên chọn vị trí phù hợp, đính kèm file CV định dạng PDF/DOCX và cung cấp thông tin liên hệ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-black text-indigo-600/30 mb-2">02</div>
            <h3 className="font-bold text-slate-900 mb-1">Sàng lọc CV (48h)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              HR Review hồ sơ dựa trên kỹ năng và yêu cầu công việc. Kết quả được cập nhật trực tiếp trên Candidate Portal.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-black text-indigo-600/30 mb-2">03</div>
            <h3 className="font-bold text-slate-900 mb-1">Phỏng vấn chuyên môn</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trao đổi kỹ thuật cùng Tech Lead hoặc Trưởng phòng ban (Online qua Google Meet hoặc Offline tại văn phòng).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-black text-indigo-600/30 mb-2">04</div>
            <h3 className="font-bold text-slate-900 mb-1">Nhận Offer & Gia nhập</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gửi thư đề nghị làm việc chi tiết về đãi ngộ, chế độ phúc lợi và chào đón bạn gia nhập công ty!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

