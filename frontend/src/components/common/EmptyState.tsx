import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Không có dữ liệu',
  description = 'Chưa có bản ghi nào phù hợp với điều kiện tìm kiếm hoặc dữ liệu trống.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
