import React from 'react';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Đang tải...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
