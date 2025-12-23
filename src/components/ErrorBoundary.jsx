import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0a0a0f] flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-black/60 border border-red-500/30 rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">应用遇到了错误</h1>
                <p className="text-sm text-zinc-400 mt-1">抱歉，应用运行时发生了意外错误</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-black/60 border border-white/10 rounded-lg p-4 space-y-2">
                <div className="text-xs font-medium text-red-400">错误信息</div>
                <pre className="text-xs text-white/70 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <div className="text-xs font-medium text-red-400 mt-3">堆栈跟踪</div>
                    <pre className="text-[10px] text-zinc-500 overflow-auto max-h-48 font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                重新加载应用
              </button>
              <button
                onClick={() => {
                  const errorReport = {
                    error: this.state.error?.toString(),
                    stack: this.state.errorInfo?.componentStack,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                  };
                  console.log('[ErrorBoundary] Error Report:', errorReport);
                  navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
                  alert('错误信息已复制到剪贴板');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                复制错误信息
              </button>
            </div>

            <p className="text-xs text-zinc-600 text-center">
              如果问题持续出现，请尝试清除浏览器缓存或联系技术支持
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
