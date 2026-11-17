import React from 'react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
  isLoading?: boolean;
}

export function Table<T>({
  columns,
  data,
  rowKey,
  emptyText = 'Không tìm thấy dữ liệu',
  isLoading = false,
}: TableProps<T>) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${col.align ? alignClasses[col.align] : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                  <p>Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={rowKey(row)} className="hover:bg-slate-50/70 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 ${col.align ? alignClasses[col.align] : 'text-left'} ${col.className || ''}`}
                    >
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
