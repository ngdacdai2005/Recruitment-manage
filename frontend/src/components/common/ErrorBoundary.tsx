import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-6 text-center shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Đã xảy ra lỗi không mong muốn</h2>
            <p className="text-xs text-slate-500 mt-2 mb-4">
              {this.state.error?.message || 'Giao diện gặp sự cố khi xử lý dữ liệu. Vui lòng tải lại trang.'}
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={this.handleReload}
            >
              Tải lại trang
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
