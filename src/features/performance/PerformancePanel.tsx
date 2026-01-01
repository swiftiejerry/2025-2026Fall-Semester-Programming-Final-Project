import React, { useState } from 'react';
import { Play, RotateCcw, Activity, ChevronDown, Clock, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkerBenchmark } from '../../hooks/useWorkerBenchmark';
import { useWorkspaceStore } from '../../stores';
import { BenchmarkChart } from '../../components/charts/BenchmarkChart';
import { SpaceComplexityChart } from '../../components/charts/SpaceComplexityChart';
import { BENCHMARK_ALGORITHMS } from '../../data/benchmarkAlgorithms';

// 可折叠区块组件
interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    isOpen,
    onToggle,
    children
}) => (
    <div className="border theme-border rounded-lg overflow-hidden theme-bg-panel">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 hover:theme-bg-tertiary transition-colors"
        >
            <div className="flex items-center gap-2 text-sm font-medium theme-text-primary">
                {icon}
                {title}
            </div>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                <ChevronDown className="w-4 h-4 theme-text-tertiary" />
            </motion.div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export const PerformancePanel: React.FC = () => {
    const currentProblemId = useWorkspaceStore(state => state.currentProblemId);
    const {
        status,
        progress,
        currentAlgorithm,
        currentSize,
        results,
        summary,
        getConfig,
        runBenchmark,
        clearResults,
        stopBenchmark
    } = useWorkerBenchmark();

    // 切题时停止之前的 Benchmark，避免 Worker 任务堆积
    React.useEffect(() => {
        return () => {
            // 离开当前 Panel 或切题时停止
            // 注意：这里可能需要判断是否真的要停止，比如用户可能想在后台跑
            // 但鉴于 Worker 是单例且会阻塞，最好还是停止
            if (status === 'running') {
                stopBenchmark();
            }
        };
    }, [currentProblemId, stopBenchmark, status]);

    // 折叠状态
    const [isTimeOpen, setIsTimeOpen] = useState(true);
    const [isSpaceOpen, setIsSpaceOpen] = useState(true);

    // 获取当前题目的 Benchmark 定义
    const algoDef = BENCHMARK_ALGORITHMS[currentProblemId];
    const problemResults = results[currentProblemId] || [];
    const problemSummary = summary[currentProblemId];
    const config = getConfig(currentProblemId);

    // 解决切题后状态残留问题：
    // 如果全局 status 是 completed，但当前题目没有结果，说明那是上一个题目的状态
    const effectiveStatus = (status === 'completed' && problemResults.length === 0) ? 'idle' : status;

    const handleRun = () => {
        runBenchmark(currentProblemId);
    };

    const handleClear = () => {
        clearResults(currentProblemId);
    };

    const statusText = effectiveStatus === 'running'
        ? `Running: ${currentAlgorithm} (N=${currentSize})... ${progress}%`
        : effectiveStatus === 'completed'
            ? 'Benchmark Completed'
            : 'Ready';

    if (!algoDef) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-slate-950">
                <Activity className="w-12 h-12 mb-4 opacity-20" />
                <p>当前题目暂无性能分析配置</p>
            </div>
        );
    }

    // 准备空间复杂度图表的数据
    const spaceAlgorithms = algoDef.implementations.map(impl => ({
        name: impl.name,
        spaceComplexity: impl.spaceComplexity
    }));

    return (
        <div className="h-full flex flex-col theme-bg-elevated border-l theme-border">
            {/* Header / Controls - Fixed */}
            <div className="shrink-0 p-4 border-b theme-border theme-bg-panel backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold theme-text-primary flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        性能分析
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRun}
                            disabled={effectiveStatus === 'running'}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="w-3 h-3" />
                            {effectiveStatus === 'running' ? '运行中...' : '运行分析'}
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={effectiveStatus === 'running'}
                            className="p-1.5 theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary rounded-md transition-colors"
                            title="清除结果"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="h-1 w-full theme-bg-tertiary rounded-full overflow-hidden mb-2">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex justify-between text-xs theme-text-tertiary font-mono">
                    <span>{statusText}</span>
                    {problemSummary && (
                        <span className="text-emerald-400">
                            最优: {problemSummary.fastest} (~{problemSummary.avgTime.toFixed(3)}ms)
                        </span>
                    )}
                </div>
            </div>

            {/* Configuration (Mini) - Fixed */}
            <div className="shrink-0 px-4 py-2 border-b theme-border flex items-center gap-4 text-xs theme-text-secondary overflow-x-auto">
                <div className="flex items-center gap-2">
                    <span>数据规模:</span>
                    {config.sizes.map(s => (
                        <span key={s} className="theme-bg-tertiary px-1.5 py-0.5 rounded theme-text-primary">{s}</span>
                    ))}
                </div>
                <div className="h-3 w-[1px] theme-bg-tertiary" />
                <div>算法数量: {algoDef.implementations.length}</div>
            </div>

            {/* Scrollable Charts Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 时间复杂度图表 */}
                <CollapsibleSection
                    title="时间复杂度对比 (实测)"
                    icon={<Clock className="w-4 h-4 text-amber-500" />}
                    isOpen={isTimeOpen}
                    onToggle={() => setIsTimeOpen(!isTimeOpen)}
                >
                    <div className="h-80">
                        <BenchmarkChart data={problemResults} />
                    </div>
                </CollapsibleSection>

                {/* 空间复杂度图表 - 只在有结果后显示 */}
                <AnimatePresence>
                    {problemResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <CollapsibleSection
                                title="空间复杂度对比 (理论)"
                                icon={<HardDrive className="w-4 h-4 text-blue-500" />}
                                isOpen={isSpaceOpen}
                                onToggle={() => setIsSpaceOpen(!isSpaceOpen)}
                            >
                                <div className="h-80">
                                    <SpaceComplexityChart
                                        algorithms={spaceAlgorithms}
                                        sizes={config.sizes}
                                        animationTrigger={problemResults.length}
                                    />
                                </div>
                            </CollapsibleSection>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 算法详情 */}
                <div className="border theme-border rounded-lg overflow-hidden theme-bg-panel p-4">
                    <h3 className="text-sm font-medium theme-text-primary mb-3">算法复杂度摘要</h3>
                    <div className="space-y-2">
                        {algoDef.implementations.map((impl) => (
                            <div
                                key={impl.name}
                                className="flex items-center justify-between p-2 theme-bg-tertiary rounded-md"
                            >
                                <span className="text-sm theme-text-secondary">{impl.name}</span>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-amber-400">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {impl.timeComplexity}
                                    </span>
                                    <span className="text-blue-400">
                                        <HardDrive className="w-3 h-3 inline mr-1" />
                                        {impl.spaceComplexity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
