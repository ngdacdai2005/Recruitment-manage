import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export interface Forbidden403Props {
  requiredRoles?: string[];
  moduleName?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({ requiredRoles, moduleName }) => {
  const { currentRole } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (currentRole === 'ROLE_CANDIDATE') {
      navigate('/candidate/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            HTTP 403 FORBIDDEN
          </span>
          <h2 className="text-xl font-black text-slate-900">Truy Cập Bị Giới Hạn</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tài khoản vai trò <span className="font-bold text-slate-800">{currentRole}</span> của bạn không được phân quyền truy cập {moduleName ? `phân hệ "${moduleName}"` : 'tài nguyên này'}.
          </p>
        </div>

        {requiredRoles && requiredRoles.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600">
            <span className="text-slate-400 block mb-1">Yêu cầu một trong các vai trò:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {requiredRoles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] font-semibold text-slate-700"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGoBack}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Về Dashboard chính
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden403;
