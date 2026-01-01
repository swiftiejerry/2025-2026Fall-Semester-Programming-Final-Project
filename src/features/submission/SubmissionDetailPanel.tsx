import React from 'react';
import { useSubmissionStore } from '../../stores';
import { CheckCircle2, XCircle, Timer, AlertCircle, Calendar, Cpu, HardDrive } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'Accepted': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Wrong Answer': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        'Time Limit Exceeded': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Runtime Error': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        'Pending': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    const icons: Record<string, React.ReactNode> = {
        'Accepted': <CheckCircle2 className="w-4 h-4" />,
        'Wrong Answer': <XCircle className="w-4 h-4" />,
        'Time Limit Exceeded': <Timer className="w-4 h-4" />,
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${styles[status] || styles['Pending']}`}>
            {icons[status] || <AlertCircle className="w-4 h-4" />}
            <span className="font-medium text-sm">{status}</span>
        </div>
    );
};

export const SubmissionDetailPanel: React.FC = () => {
    const selectedSubmission = useSubmissionStore(state => state.selectedSubmission);

    if (!selectedSubmission) {
        return (
            <div className="h-full flex items-center justify-center theme-text-tertiary">
                Select a submission to view details
            </div>
        );
    }

    const { status, runtime, memory, timestamp, passedCases, totalCases, code } = selectedSubmission;

    return (
        <div className="h-full overflow-y-auto theme-bg-elevated p-6">
            {/* Header Stat */}
            <div className="border-b theme-border pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={status} />
                    <span className="text-xs theme-text-tertiary flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(timestamp).toLocaleString()}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="theme-bg-panel rounded-xl p-4 border theme-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs theme-text-tertiary mb-0.5">Runtime</div>
                            <div className="text-lg font-bold theme-text-primary font-mono">
                                {runtime ? `${runtime.toFixed(1)} ms` : 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="theme-bg-panel rounded-xl p-4 border theme-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-xs theme-text-tertiary mb-0.5">Memory</div>
                            <div className="text-lg font-bold theme-text-primary font-mono">
                                {memory ? `${(memory / 1024).toFixed(1)} MB` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Cases / Visual */}
            <div className="mb-8">
                <h3 className="text-sm font-medium theme-text-secondary mb-3">Test Cases</h3>
                <div className="theme-bg-tertiary rounded-lg overflow-hidden border theme-border">
                    <div className="flex items-center justify-between px-4 py-3 theme-bg-panel border-b theme-border">
                        <span className="text-sm theme-text-primary">Passed {passedCases} / {totalCases}</span>
                        <div className="flex gap-1">
                            {Array.from({ length: totalCases || 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < (passedCases || 0) ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Complexity Visualization (SVG) */}
                    <div className="p-6 flex flex-col items-center justify-center gap-4 relative">
                        <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-80">
                            <path d="M 20 90 L 190 90" stroke="#334155" strokeWidth="1" />
                            <path d="M 20 90 L 20 10" stroke="#334155" strokeWidth="1" />
                            <path
                                d="M 20 90 Q 60 85, 100 60 T 190 20"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeDasharray="200"
                                className="animate-[draw-curve_1.5s_ease-out_forwards]"
                            />
                        </svg>
                        <div className="text-xs text-emerald-400/70 font-mono">Beats 86% of users (Time Complexity O(n))</div>
                    </div>
                </div>
            </div>

            {/* Submitted Code */}
            <div>
                <h3 className="text-sm font-medium theme-text-secondary mb-3">Submitted Code</h3>
                <div className="theme-bg-primary rounded-lg p-4 font-mono text-xs overflow-x-auto theme-text-secondary border theme-border">
                    <pre>{code}</pre>
                </div>
            </div>
        </div>
    );
};
