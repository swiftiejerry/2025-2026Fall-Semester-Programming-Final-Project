import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore, useEditorStore } from '../../stores';
import { PROBLEMS } from '../../data/problems';
import { Copy, ChevronRight, Check } from 'lucide-react';

export const SolutionsPanel: React.FC = () => {
    const currentId = useWorkspaceStore((state) => state.currentProblemId);
    const setCode = useEditorStore((state) => state.setCode);
    const setLanguage = useWorkspaceStore((state) => state.setLanguage);

    const problem = PROBLEMS[currentId];
    // 使用 Set 支持多个题解同时展开
    const [expandedIdxs, setExpandedIdxs] = useState<Set<number>>(new Set([0]));
    const [copiedLang, setCopiedLang] = useState<string | null>(null);

    const handleApply = (code: string, lang: 'python' | 'cpp') => {
        setCode(currentId, lang, code);
        setLanguage(lang);
        setCopiedLang(lang);
        setTimeout(() => setCopiedLang(null), 1500);
    };

    const toggleExpanded = (idx: number) => {
        setExpandedIdxs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
                newSet.delete(idx);
            } else {
                newSet.add(idx);
            }
            return newSet;
        });
    };

    if (!problem || !problem.solutions.length) {
        return (
            <div className="h-full flex items-center justify-center theme-text-tertiary p-6 text-center">
                该题目暂无题解
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto theme-bg-elevated p-4">
            <div className="space-y-4">
                {problem.solutions.map((sol, idx) => {
                    const isExpanded = expandedIdxs.has(idx);

                    return (
                        <div key={idx} className="border theme-border rounded-xl overflow-hidden theme-bg-panel">
                            <button
                                onClick={() => toggleExpanded(idx)}
                                className="w-full flex items-center justify-between p-4 hover:theme-bg-tertiary transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight className="w-4 h-4 theme-text-tertiary" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-sm font-medium theme-text-primary">{sol.name}</h3>
                                        <div className="text-xs theme-text-secondary mt-1">时间复杂度: {sol.complexity}</div>
                                    </div>
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t theme-border theme-bg-tertiary p-4 space-y-4">
                                            {/* Python Code */}
                                            <div className="relative group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                                        Python
                                                    </span>
                                                    <button
                                                        onClick={() => handleApply(sol.pyCode, 'python')}
                                                        className="text-xs flex items-center gap-1.5 px-2 py-1 theme-bg-panel hover:bg-emerald-600 theme-text-secondary hover:text-white rounded transition-colors"
                                                    >
                                                        {copiedLang === 'python' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        {copiedLang === 'python' ? '已应用' : '应用到编辑器'}
                                                    </button>
                                                </div>
                                                <pre className="text-xs font-mono theme-text-secondary p-3 theme-bg-primary rounded-lg overflow-x-auto border theme-border">
                                                    {sol.pyCode}
                                                </pre>
                                            </div>

                                            {/* C++ Code */}
                                            <div className="relative group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                                                        C++
                                                    </span>
                                                    <button
                                                        onClick={() => handleApply(sol.cppCode, 'cpp')}
                                                        className="text-xs flex items-center gap-1.5 px-2 py-1 theme-bg-panel hover:bg-emerald-600 theme-text-secondary hover:text-white rounded transition-colors"
                                                    >
                                                        {copiedLang === 'cpp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        {copiedLang === 'cpp' ? '已应用' : '应用到编辑器'}
                                                    </button>
                                                </div>
                                                <pre className="text-xs font-mono theme-text-secondary p-3 theme-bg-primary rounded-lg overflow-x-auto border theme-border">
                                                    {sol.cppCode}
                                                </pre>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
