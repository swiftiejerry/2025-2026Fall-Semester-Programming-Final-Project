import React from 'react';
import { useWorkspaceStore } from '../../stores';
import { PROBLEMS } from '../../data/problems';
import { Tag } from 'lucide-react';

const DIFFICULTY_STYLES = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const ProblemPanel: React.FC = () => {
    const currentId = useWorkspaceStore((state) => state.currentProblemId);
    const problem = PROBLEMS[currentId];

    if (!problem) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500">
                Problem not found
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 theme-bg-primary theme-text-secondary selection:bg-emerald-500/20">
            {/* Header */}
            <h1 className="text-xl font-bold theme-text-primary mb-4">
                {problem.number}. {problem.title}
            </h1>

            {/* Meta Tags */}
            <div className="flex items-center gap-2 mb-6">
                <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                    {problem.difficulty}
                </span>
                {problem.tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded text-xs theme-bg-panel theme-text-secondary border theme-border"
                    >
                        <Tag className="w-3 h-3" />
                        {tag}
                    </span>
                ))}
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm leading-relaxed mb-8">
                {problem.description.split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                ))}
            </div>

            {/* Examples */}
            <div className="space-y-4">
                {problem.examples.map((ex, idx) => (
                    <div key={idx} className="theme-bg-secondary rounded-xl p-4 border theme-border">
                        <h3 className="text-xs font-medium theme-text-tertiary mb-3">Example {idx + 1}</h3>
                        <div className="space-y-2 font-mono text-sm">
                            <div className="flex gap-2">
                                <span className="theme-text-secondary select-none">Input:</span>
                                <span className="theme-text-primary">{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="theme-text-secondary select-none">Output:</span>
                                <span className="theme-text-primary">{ex.output}</span>
                            </div>
                            {ex.explanation && (
                                <div className="flex gap-2">
                                    <span className="theme-text-secondary select-none">Notes:</span>
                                    <span className="theme-text-secondary">{ex.explanation}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Constraints */}
            <div className="mt-8 pt-6 border-t theme-border">
                <h3 className="text-xs font-medium theme-text-tertiary mb-3 uppercase tracking-wider">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm theme-text-secondary marker:theme-text-tertiary">
                    {problem.constraints.map((c, i) => (
                        <li key={i} className="pl-2">
                            <span className="font-mono theme-bg-tertiary px-1 py-0.5 rounded theme-text-primary">{c}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
