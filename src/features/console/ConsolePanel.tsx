import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, ListChecks, FileText } from 'lucide-react';
import { useConsoleStore } from '../../stores/consoleStore';
import { TestResultView } from './TestResultView';

export const ConsolePanel: React.FC<{ className?: string }> = ({ className }) => {
    const {
        outputs, result, isRunning, clearOutputs,
        viewMode, setViewMode, testResults
    } = useConsoleStore();
    const outputRef = useRef<HTMLDivElement>(null);

    // 自动滚动到底部
    useEffect(() => {
        if (outputRef.current && viewMode === 'log') {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [outputs, viewMode]);

    const getStatusIcon = () => {
        switch (result.status) {
            case 'running':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            default:
                return <Terminal className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = () => {
        switch (result.status) {
            case 'running': return 'text-blue-400';
            case 'success': return 'text-emerald-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getOutputColor = (type: string) => {
        switch (type) {
            case 'stdout': return 'theme-text-primary';
            case 'stderr': return 'text-red-500 dark:text-red-400';
            case 'compile': return 'text-amber-500 dark:text-yellow-400';
            case 'system': return 'text-blue-500 dark:text-blue-400';
            case 'input': return 'text-emerald-500 dark:text-emerald-400';
            default: return 'theme-text-tertiary';
        }
    };

    return (
        <div className={`h-full flex flex-col theme-bg-elevated ${className}`}>
            {/* 标题栏 */}
            <div className="h-9 flex items-center justify-between px-3 theme-bg-panel border-b theme-border select-none flex-none">
                <div className="flex items-center gap-4">
                    {/* 状态指示 */}
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className={`text-xs font-medium ${getStatusColor()}`}>
                            {result.statusText}
                        </span>
                    </div>

                    {/* 视图切换器 */}
                    {/* 视图切换器 */}
                    {testResults && (
                        <div className="flex items-center theme-bg-elevated rounded p-0.5 ml-4">
                            <button
                                onClick={() => setViewMode('test-result')}
                                className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${viewMode === 'test-result' ? 'theme-bg-tertiary theme-text-primary' : 'theme-text-tertiary hover:theme-text-secondary'
                                    }`}
                            >
                                <ListChecks className="w-3 h-3" />
                                结果
                            </button>
                            <button
                                onClick={() => setViewMode('log')}
                                className={`px-2 py-0.5 text-xs rounded flex items-center gap-1 ${viewMode === 'log' ? 'theme-bg-tertiary theme-text-primary' : 'theme-text-tertiary hover:theme-text-secondary'
                                    }`}
                            >
                                <FileText className="w-3 h-3" />
                                日志
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* 性能指标 (仅在 Log 模式或无 TestResults 时显示简单版) */}
                    {viewMode === 'log' && result.time && (
                        <span className="text-xs theme-text-tertiary flex items-center gap-1 mr-2">
                            <Clock className="w-3 h-3" />
                            {result.time}s
                        </span>
                    )}

                    <button
                        onClick={clearOutputs}
                        className="p-1 theme-text-tertiary hover:theme-text-primary rounded hover:theme-bg-tertiary transition-colors"
                        title="清空控制台"
                        disabled={isRunning}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* 内容区域 */}
            {viewMode === 'test-result' && testResults ? (
                <TestResultView results={testResults} />
            ) : (
                <div
                    ref={outputRef}
                    className="flex-1 overflow-auto p-3 font-mono text-sm"
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }}
                >
                    {outputs.length === 0 ? (
                        <div className="theme-text-tertiary text-xs">
                            运行代码后，输出将显示在这里...
                        </div>
                    ) : (
                        outputs.map((output) => (
                            <div
                                key={output.id}
                                className={`whitespace-pre-wrap break-all ${getOutputColor(output.type)}`}
                            >
                                {output.type === 'system' && <span className="text-gray-600">[system] </span>}
                                {output.type === 'input' && <span className="text-gray-600">[input] </span>}
                                {output.type === 'compile' && <span className="text-gray-600">[compile] </span>}
                                {output.content}
                            </div>
                        ))
                    )}
                    {isRunning && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs mt-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>执行中...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
