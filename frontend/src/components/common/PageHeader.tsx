import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'indigo',
  actions,
}) => {
  const badgeStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 max-w-3xl">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
