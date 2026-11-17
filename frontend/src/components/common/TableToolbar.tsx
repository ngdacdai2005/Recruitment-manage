import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface TableToolbarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onResetFilters?: () => void;
  extraActions?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  keyword,
  onKeywordChange,
  searchPlaceholder = 'Tìm kiếm từ khóa...',
  filters,
  onResetFilters,
  extraActions,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search & Filters */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="w-full sm:max-w-xs relative">
          <Input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              keyword ? (
                <button
                  type="button"
                  onClick={() => onKeywordChange('')}
                  className="hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {filters && <div className="flex flex-wrap items-center gap-2.5">{filters}</div>}

        {onResetFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Đặt lại bộ lọc"
          >
            Đặt lại
          </Button>
        )}
      </div>

      {/* Extra Actions */}
      {extraActions && <div className="flex items-center gap-2 shrink-0">{extraActions}</div>}
    </div>
  );
};

export default TableToolbar;
