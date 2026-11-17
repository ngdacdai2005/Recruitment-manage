import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface DetailModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  code?: string;
  subtitle?: string;
  avatarUrl?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const DetailModalShell: React.FC<DetailModalShellProps> = ({
  isOpen,
  onClose,
  title,
  code,
  subtitle,
  avatarUrl,
  icon,
  children,
  actions,
  maxWidth = '2xl',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      title={
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={title}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
            />
          ) : icon ? (
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              {icon}
            </div>
          ) : null}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              {code && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {code}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
          {actions}
        </div>
      }
    >
      <div className="space-y-4">{children}</div>
    </Modal>
  );
};

export default DetailModalShell;
