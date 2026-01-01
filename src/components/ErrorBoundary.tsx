import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(_: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
                                <h1 className="text-xl font-bold text-white">Application Error</h1>
                                <p className="text-sm text-zinc-400 mt-1">Something went wrong.</p>
                            </div>
                        </div>

                        {this.state.error && (
                            <div className="bg-black/60 border border-white/10 rounded-lg p-4 space-y-2">
                                <div className="text-xs font-medium text-red-400">Error Message</div>
                                <pre className="text-xs text-white/70 overflow-auto max-h-32 font-mono">
                                    {this.state.error.toString()}
                                </pre>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
