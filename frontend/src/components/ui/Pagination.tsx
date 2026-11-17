import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 shadow-sm">
      <div>
        {totalElements !== undefined && pageSize !== undefined ? (
          <span>
            Hiển thị{' '}
            <span className="font-semibold text-slate-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, totalElements)}
            </span>{' '}
            trên tổng số{' '}
            <span className="font-semibold text-slate-900">{totalElements}</span> bản ghi
          </span>
        ) : (
          <span>
            Trang <span className="font-semibold text-slate-900">{currentPage}</span> / {totalPages}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((page, idx, arr) => {
            const prevPage = arr[idx - 1];
            return (
              <React.Fragment key={page}>
                {prevPage && page - prevPage > 1 && (
                  <span className="px-2 text-slate-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
