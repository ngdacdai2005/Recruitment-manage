import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const configs = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    },
  };

  const current = configs[type];

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs transition-all duration-300 max-w-sm animate-in fade-in slide-in-from-bottom-3 ${current.bg}`}
    >
      <div className="pt-0.5">{current.icon}</div>
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-bold text-slate-900">{title}</h5>}
        <p className="leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
