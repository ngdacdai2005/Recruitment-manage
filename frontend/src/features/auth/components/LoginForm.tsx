import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config/app.config';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser) {
        if (loggedUser.role === 'ROLE_CANDIDATE') {
          navigate(appConfig.routes.candidate.dashboard);
        } else {
          navigate(appConfig.routes.admin.dashboard);
        }
      } else {
        setError('Email hoặc mật khẩu không chính xác.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi xác thực');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {onSwitchToRegister && (
        <p className="text-center text-xs text-slate-500 pt-1">
          Chưa có tài khoản ứng viên?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Đăng ký ngay
          </button>
        </p>
      )}
    </form>
  );
};
