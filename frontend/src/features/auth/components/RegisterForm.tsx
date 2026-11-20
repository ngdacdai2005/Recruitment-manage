import React, { useState } from 'react';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config/app.config';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Email không đúng định dạng.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });

      if (user) {
        navigate(appConfig.routes.candidate.dashboard);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Đăng ký không thành công. Email này có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3.5">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Họ và tên <span className="text-rose-500">*</span>
        </label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Văn A"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Email liên hệ <span className="text-rose-500">*</span>
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="candidate@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Số điện thoại
        </label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mật khẩu <span className="text-rose-500">*</span>
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Xác nhận mật khẩu <span className="text-rose-500">*</span>
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản Ứng viên'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {onSwitchToLogin && (
        <p className="text-center text-xs text-slate-500 pt-1">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
