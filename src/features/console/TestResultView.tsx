import React, { useState } from 'react';
import { TestCaseResult } from '../../services/testRunner';
import { CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';

interface TestResultViewProps {
    results: TestCaseResult[];
}

export const TestResultView: React.FC<TestResultViewProps> = ({ results }) => {
    const [activeTab, setActiveTab] = useState(0);

    const allPassed = results.every(r => r.passed);
    const totalTime = results.reduce((acc, curr) => acc + (curr.time || 0), 0);

    const activeResult = results[activeTab];

    return (
        <div className="flex flex-col h-full theme-bg-elevated theme-text-secondary font-mono text-sm overflow-hidden">
            {/* Header Status */}
            <div className={`flex items-center gap-4 p-4 border-b theme-border ${allPassed ? 'text-green-500' : 'text-red-500'}`}>
                <div className="flex items-center gap-2 text-lg font-bold">
                    {allPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    <span>{allPassed ? 'Accepted' : 'Wrong Answer'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs ml-auto">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{totalTime.toFixed(1)} ms</span>
                </div>
            </div>

            {/* Case Tabs */}
            <div className="flex theme-bg-panel border-b theme-border overflow-x-auto">
                {results.map((result, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center gap-2 px-4 py-2 border-r theme-border transition-colors
                            ${activeTab === index ? 'theme-bg-elevated theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'}
                        `}
                    >
                        <span className={`w-2 h-2 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                        Case {index + 1}
                    </button>
                ))}
            </div>

            {/* Case Detail Content */}
            {activeResult && (
                <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* Error Message if any */}
                    {activeResult.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded">
                            <h4 className="font-bold mb-1">Runtime Error</h4>
                            <pre className="whitespace-pre-wrap text-xs">{activeResult.error}</pre>
                        </div>
                    )}

                    {/* Input */}
                    {activeResult.input && (
                        <div className="space-y-2">
                            <div className="theme-text-tertiary text-xs uppercase font-semibold">Input</div>
                            <div className="theme-bg-tertiary p-3 rounded border theme-border">
                                {Object.entries(activeResult.input).map(([key, value]) => (
                                    <div key={key} className="mb-2 last:mb-0">
                                        <span className="text-blue-500 dark:text-blue-400">{key} = </span>
                                        <span className="theme-text-primary">{JSON.stringify(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Output */}
                    <div className="space-y-2">
                        <div className="theme-text-tertiary text-xs uppercase font-semibold">Output</div>
                        <div className={`p-3 rounded border font-medium ${activeResult.passed
                            ? 'theme-bg-tertiary theme-border theme-text-primary'
                            : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-100'
                            }`}>
                            {activeResult.actual !== undefined ? JSON.stringify(activeResult.actual) : 'null'}
                        </div>
                    </div>

                    {/* Expected - Always show */}
                    <div className="space-y-2">
                        <div className="theme-text-tertiary text-xs uppercase font-semibold">Expected</div>
                        <div className={`p-3 rounded border font-medium ${activeResult.passed
                            ? 'theme-bg-tertiary theme-border text-green-600 dark:text-green-400'
                            : 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                            }`}>
                            {JSON.stringify(activeResult.expected)}
                        </div>
                    </div>

                    {/* Stdout (Logs) */}
                    {activeResult.stdout && (
                        <div className="space-y-2 pt-4 border-t theme-border">
                            <div className="flex items-center gap-2 theme-text-tertiary text-xs uppercase font-semibold">
                                <Terminal className="w-3 h-3" />
                                Stdout
                            </div>
                            <pre className="theme-bg-panel p-2 rounded theme-text-secondary text-xs font-mono whitespace-pre-wrap">
                                {activeResult.stdout}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
