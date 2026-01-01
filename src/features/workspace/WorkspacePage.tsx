import React, { useEffect, useMemo } from 'react';
import { useWorkspaceStore, useThemeStore } from '../../stores';
import { PROBLEMS } from '../../data/problems';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { FullscreenOverlay } from './components/FullscreenOverlay';
import { DragPreview } from './components/DragPreview';
import { ProblemDrawer } from '../problem/ProblemDrawer';
import { Menu, Box, Github, ChevronLeft, ChevronRight, Shuffle, ListOrdered, ExternalLink, Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Problem } from '../../types';

const Background: React.FC = () => (
    <div className="fixed inset-0 -z-50 theme-bg-primary overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
    </div>
);

// 主题切换组件
const ThemeToggle: React.FC = () => {
    const { mode, effectiveTheme, setMode } = useThemeStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const themes = [
        { id: 'light' as const, icon: <Sun className="w-4 h-4" />, label: '浅色' },
        { id: 'dark' as const, icon: <Moon className="w-4 h-4" />, label: '深色' },
        { id: 'system' as const, icon: <Monitor className="w-4 h-4" />, label: '跟随系统' },
    ];

    const currentIcon = effectiveTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary rounded-lg transition-colors"
                title={`当前: ${mode === 'system' ? '跟随系统' : mode === 'dark' ? '深色' : '浅色'}`}
            >
                {currentIcon}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute right-0 top-full mt-2 w-36 theme-bg-elevated border theme-border rounded-lg shadow-xl z-50 py-1 overflow-hidden"
                        >
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => { setMode(theme.id); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${mode === theme.id
                                        ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400'
                                        : 'theme-text-secondary hover:theme-bg-tertiary'
                                        }`}
                                >
                                    {theme.icon}
                                    <span>{theme.label}</span>
                                    {mode === theme.id && (
                                        <span className="ml-auto text-emerald-500">✓</span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// 题目导航组件
const ProblemNavigator: React.FC<{
    currentProblem: Problem | undefined;
    allProblems: Problem[];
}> = ({ currentProblem, allProblems }) => {
    const setCurrentProblemId = useWorkspaceStore((s) => s.setCurrentProblemId);

    const [isRandomMode, setIsRandomMode] = React.useState(false);

    // 按题号排序
    const sortedProblems = useMemo(() =>
        [...allProblems].sort((a, b) => a.number - b.number),
        [allProblems]
    );

    const currentIndex = sortedProblems.findIndex(p => p.id === currentProblem?.id);

    const goToPrev = () => {
        const prevProblem = sortedProblems[currentIndex - 1];
        if (currentIndex > 0 && prevProblem) {
            setCurrentProblemId(prevProblem.id);
        }
    };

    const goToNext = () => {
        if (isRandomMode) {
            const randomIndex = Math.floor(Math.random() * sortedProblems.length);
            // 避免随机到当前题目
            const targetIndex = randomIndex === currentIndex ? (randomIndex + 1) % sortedProblems.length : randomIndex;
            const randomProblem = sortedProblems[targetIndex];
            if (randomProblem) {
                setCurrentProblemId(randomProblem.id);
            }
        } else {
            const nextProblem = sortedProblems[currentIndex + 1];
            if (currentIndex < sortedProblems.length - 1 && nextProblem) {
                setCurrentProblemId(nextProblem.id);
            }
        }
    };

    if (!currentProblem) return null;

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < sortedProblems.length - 1 || isRandomMode; // 随机模式下总是有"下一题"

    return (
        <div className="flex items-center gap-1 theme-bg-panel rounded-lg px-2 py-1 border theme-border">
            {/* 题目信息 */}
            <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{currentProblem.number}</span>
                </div>
                <span className="text-sm font-medium theme-text-primary max-w-[120px] truncate">
                    {currentProblem.title}
                </span>
                <a
                    href={`https://leetcode.cn/problems/${currentProblem.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="theme-text-tertiary hover:text-emerald-500 transition-colors"
                    title="在 LeetCode 查看"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

            <div className="h-4 w-[1px] theme-bg-tertiary mx-1" />

            {/* 导航按钮 */}
            <div className="flex items-center gap-0.5">
                <button
                    onClick={goToPrev}
                    disabled={!hasPrev}
                    className="p-1.5 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="上一题"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={goToNext}
                    disabled={!hasNext}
                    className="p-1.5 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={isRandomMode ? "随机下一题" : "下一题"}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIsRandomMode(!isRandomMode)}
                    className={`p-1.5 rounded transition-colors ${isRandomMode
                        ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                        : 'theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary'
                        }`}
                    title={isRandomMode ? "当前：随机模式 (点击切换为顺序)" : "当前：顺序模式 (点击切换为随机)"}
                >
                    {isRandomMode ? <Shuffle className="w-4 h-4" /> : <ListOrdered className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

export const WorkspacePage: React.FC = () => {
    const isDrawerOpen = useWorkspaceStore((s) => s.isDrawerOpen);
    const setIsDrawerOpen = useWorkspaceStore((s) => s.setIsDrawerOpen);
    const currentId = useWorkspaceStore((s) => s.currentProblemId);

    const currentProblem = PROBLEMS[currentId];
    const allProblems = Object.values(PROBLEMS);

    // Global shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setIsDrawerOpen(!isDrawerOpen);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isDrawerOpen, setIsDrawerOpen]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
            <Background />

            {/* Top Navigation Bar */}
            <header className="h-12 theme-bg-secondary border-b theme-border flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className="p-2 -ml-2 theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary rounded-md transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold theme-text-primary tracking-tight leading-none">AlgoVerifier</h1>
                            <div className="text-[10px] theme-text-tertiary font-mono mt-0.5">算法验证平台</div>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] theme-bg-panel mx-2" />

                    {/* Problem Navigation Widget */}
                    <ProblemNavigator
                        currentProblem={currentProblem}
                        allProblems={allProblems}
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    <a href="https://github.com/swiftiejerry?tab=repositories" target="_blank" rel="noreferrer" className="theme-text-secondary hover:theme-text-primary transition-colors" title="My GitHub Repositories">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Main Workspace Area */}
            <div className="flex-1 relative overflow-hidden flex">
                {/* Drawer with AnimatePresence */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm"
                                onClick={() => setIsDrawerOpen(false)}
                            />
                            {/* Drawer */}
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="absolute inset-y-0 left-0 z-40"
                            >
                                <ProblemDrawer problems={allProblems} onClose={() => setIsDrawerOpen(false)} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Layout System */}
                <div className="flex-1 relative z-0">
                    <WorkspaceLayout />
                </div>
            </div>

            {/* Global Overlays */}
            <FullscreenOverlay />
            <DragPreview />
        </div>
    );
};
