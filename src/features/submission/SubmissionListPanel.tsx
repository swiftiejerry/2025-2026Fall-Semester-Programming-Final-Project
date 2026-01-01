import React from 'react';
import { useSubmissionStore, useWorkspaceStore } from '../../stores';
import { Clock, CheckCircle2, XCircle, AlertCircle, Timer } from 'lucide-react';
import { Submission } from '../../types';

// 稳定的空数组引用，避免无限循环
const EMPTY_SUBMISSIONS: Submission[] = [];

export const SubmissionListPanel: React.FC = () => {
    const currentId = useWorkspaceStore((state) => state.currentProblemId);
    // 使用稳定的空数组引用
    const submissions = useSubmissionStore((state) => state.submissions[currentId] ?? EMPTY_SUBMISSIONS);

    if (submissions.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center theme-bg-primary theme-text-tertiary gap-2">
                <Clock className="w-8 h-8 opacity-20" />
                <p className="text-sm">No submissions yet</p>
            </div>
        );
    }

    const getStatusIcon = (status: Submission['status']) => {
        switch (status) {
            case 'Accepted': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Wrong Answer': return <XCircle className="w-4 h-4 text-rose-500" />;
            case 'Time Limit Exceeded': return <Timer className="w-4 h-4 text-amber-500" />;
            default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusColor = (status: Submission['status']) => {
        switch (status) {
            case 'Accepted': return 'text-emerald-500';
            case 'Wrong Answer': return 'text-rose-500';
            case 'Time Limit Exceeded': return 'text-amber-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="h-full overflow-y-auto theme-bg-primary">
            <div className="divide-y theme-border">
                {submissions.map((sub) => (
                    <div
                        key={sub.id}
                        className="w-full p-4 flex items-center justify-between hover:theme-bg-tertiary transition-colors text-left group"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(sub.status)}
                                <span className={`text-sm font-medium ${getStatusColor(sub.status)}`}>
                                    {sub.status}
                                </span>
                            </div>
                            <div className="text-xs theme-text-tertiary font-mono">
                                {new Date(sub.timestamp).toLocaleTimeString()}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-xs theme-text-secondary">
                            {sub.runtime && (
                                <span>{sub.runtime.toFixed(2)} ms</span>
                            )}
                            {sub.memory && (
                                <span>{(sub.memory / 1024).toFixed(1)} MB</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
