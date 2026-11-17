import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'violet';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'indigo',
  trend,
}) => {
  const colorStyles = {
    indigo: { iconBg: 'bg-indigo-50 text-indigo-600', valText: 'text-indigo-600' },
    emerald: { iconBg: 'bg-emerald-50 text-emerald-600', valText: 'text-emerald-600' },
    amber: { iconBg: 'bg-amber-50 text-amber-600', valText: 'text-amber-600' },
    rose: { iconBg: 'bg-rose-50 text-rose-600', valText: 'text-rose-600' },
    blue: { iconBg: 'bg-blue-50 text-blue-600', valText: 'text-blue-600' },
    violet: { iconBg: 'bg-violet-50 text-violet-600', valText: 'text-violet-600' },
  };

  const current = colorStyles[color];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        {trend && (
          <p
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${current.iconBg}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
