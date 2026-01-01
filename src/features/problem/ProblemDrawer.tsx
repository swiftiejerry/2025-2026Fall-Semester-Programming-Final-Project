import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Filter, ChevronDown, Check, X } from 'lucide-react';
import { Problem, Difficulty } from '../../types';
import { useWorkspaceStore } from '../../stores';

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const DIFFICULTY_CN: Record<Difficulty, string> = {
    Easy: '简单',
    Medium: '中等',
    Hard: '困难',
};

interface ProblemDrawerProps {
    problems: Problem[];
    onClose: () => void;
}

export const ProblemDrawer: React.FC<ProblemDrawerProps> = ({ problems, onClose }) => {
    const currentId = useWorkspaceStore((s) => s.currentProblemId);
    const setCurrentId = useWorkspaceStore((s) => s.setCurrentProblemId);

    const [search, setSearch] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState<Difficulty[]>([]);
    const [sortKey, setSortKey] = useState<'id' | 'title' | 'difficulty'>('id');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const filtered = useMemo(() => {
        return problems
            .filter((p) => {
                const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                    p.number.toString().includes(search);
                const matchDiff = filterDifficulty.length === 0 || filterDifficulty.includes(p.difficulty);
                return matchSearch && matchDiff;
            })
            .sort((a, b) => {
                let cmp = 0;
                if (sortKey === 'id') cmp = a.number - b.number;
                else if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
                else if (sortKey === 'difficulty') {
                    const map: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
                    cmp = map[a.difficulty] - map[b.difficulty];
                }
                return sortDir === 'asc' ? cmp : -cmp;
            });
    }, [problems, search, filterDifficulty, sortKey, sortDir]);

    const handleSelect = (id: string) => {
        setCurrentId(id);
        onClose();
    };

    const SORT_KEY_CN: Record<string, string> = {
        id: '序号',
        title: '标题',
        difficulty: '难度',
    };

    return (
        <div className="h-full w-80 theme-bg-elevated border-r theme-border shadow-2xl flex flex-col font-sans">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b theme-border">
                <h2 className="text-sm font-semibold theme-text-primary tracking-wide">题目列表</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs theme-text-tertiary font-mono">{filtered.length} 题</span>
                    <button onClick={onClose} className="p-1 hover:theme-bg-tertiary rounded theme-text-tertiary hover:theme-text-primary">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="p-3 border-b theme-border space-y-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="搜索题目..."
                    className="w-full theme-bg-tertiary text-xs theme-text-primary px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:theme-text-tertiary"
                />

                <div className="flex gap-2">
                    {/* Sort Menu */}
                    <div className="relative flex-1">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="w-full h-8 flex items-center justify-between px-2 theme-bg-tertiary rounded text-xs theme-text-secondary hover:theme-text-primary transition-colors"
                        >
                            <span className="flex items-center gap-1.5">
                                <ArrowUpDown className="w-3 h-3" /> 排序
                            </span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>

                        {showSortMenu && (
                            <div className="absolute top-full left-0 w-full mt-1 py-1 theme-bg-panel border theme-border rounded shadow-xl z-10">
                                {(['id', 'title', 'difficulty'] as const).map(k => (
                                    <button
                                        key={k}
                                        onClick={() => { setSortKey(k); setShowSortMenu(false); }}
                                        className="w-full px-3 py-1.5 text-left text-xs theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary flex items-center justify-between"
                                    >
                                        {SORT_KEY_CN[k]}
                                        {sortKey === k && <Check className="w-3 h-3 text-emerald-500" />}
                                    </button>
                                ))}
                                <div className="h-[1px] theme-bg-tertiary my-1" />
                                <button
                                    onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                                    className="w-full px-3 py-1.5 text-left text-xs theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary flex items-center justify-between"
                                >
                                    {sortDir === 'asc' ? '升序' : '降序'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filter Menu */}
                    <div className="relative flex-1">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`w-full h-8 flex items-center justify-between px-2 rounded text-xs transition-colors ${filterDifficulty.length ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'theme-bg-tertiary theme-text-secondary hover:theme-text-primary'}`}
                        >
                            <span className="flex items-center gap-1.5">
                                <Filter className="w-3 h-3" /> 筛选
                            </span>
                            {filterDifficulty.length > 0 && <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full" />}
                        </button>

                        {showFilterMenu && (
                            <div className="absolute top-full right-0 w-40 mt-1 py-1 theme-bg-panel border theme-border rounded shadow-xl z-10 space-y-1">
                                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => {
                                            setFilterDifficulty(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
                                        }}
                                        className="w-full px-3 py-1.5 text-left text-xs theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary flex items-center justify-between"
                                    >
                                        {DIFFICULTY_CN[d]}
                                        {filterDifficulty.includes(d) && <Check className="w-3 h-3 text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {filtered.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className={`w-full text-left px-4 py-3 border-b theme-border hover:theme-bg-tertiary transition-colors group ${currentId === p.id ? 'theme-bg-tertiary border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-sm font-medium ${currentId === p.id ? 'theme-text-primary' : 'theme-text-secondary group-hover:theme-text-primary'}`}>
                                {p.number}. {p.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium border ${DIFFICULTY_STYLES[p.difficulty]}`}>
                                {DIFFICULTY_CN[p.difficulty]}
                            </span>
                            {p.tags.slice(0, 2).map(t => (
                                <span key={t} className="px-1.5 py-0.5 rounded-[3px] theme-bg-panel theme-text-tertiary text-[10px]">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="p-8 text-center theme-text-tertiary text-xs">未找到题目</div>
                )}
            </div>

            <div className="p-3 border-t theme-border theme-bg-panel">
                <button className="w-full py-2 theme-bg-tertiary hover:theme-bg-elevated theme-text-secondary hover:theme-text-primary rounded text-xs transition-colors" onClick={onClose}>
                    关闭
                </button>
            </div>
        </div>
    );
};
