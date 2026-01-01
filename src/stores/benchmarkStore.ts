/**
 * Benchmark Store - 管理性能测试状态
 * 实现真正的性能基准测试，无假数据
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { BenchmarkDataPoint, BenchmarkSummary, BenchmarkConfig, BenchmarkStatus } from '../types';

interface BenchmarkState {
    status: BenchmarkStatus;
    progress: number;
    currentAlgorithm: string | null;
    currentSize: number | null;
    results: Record<string, BenchmarkDataPoint[]>;
    summary: Record<string, BenchmarkSummary>;
    error: string | null;

    // Config per problem
    configs: Record<string, BenchmarkConfig>;

    // Actions
    getConfig: (problemId: string) => BenchmarkConfig;
    setConfig: (problemId: string, config: Partial<BenchmarkConfig>) => void;

    startBenchmark: (problemId: string) => void;
    updateProgress: (progress: number, algorithm?: string, size?: number) => void;
    addResult: (problemId: string, dataPoint: BenchmarkDataPoint) => void;
    completeBenchmark: (problemId: string) => void;
    failBenchmark: (error: string) => void;
    clearResults: (problemId: string) => void;
    reset: () => void;
}

const DEFAULT_CONFIG: BenchmarkConfig = {
    sizes: [100, 500, 1000, 5000, 10000],
    iterations: 5,
    warmupRuns: 3,
    algorithms: [],
};

// 针对特定题目的配置（如 fibonacci 需要小 size 避免 O(2^n) 爆炸）
const PROBLEM_SPECIFIC_CONFIGS: Record<string, BenchmarkConfig> = {
    fibonacci: {
        sizes: [10, 15, 20, 25, 30],  // 递归版本 O(2^n)，超过 30 会非常慢
        iterations: 3,
        warmupRuns: 1,
        algorithms: [],
    },
    climbingstairs: {
        sizes: [10, 15, 20, 25, 30],  // 递归版本 O(2^n)
        iterations: 3,
        warmupRuns: 1,
        algorithms: [],
    },
    coinchange: {
        sizes: [10, 20, 30, 50, 100],  // 递归版本很慢，限制 amount
        iterations: 3,
        warmupRuns: 1,
        algorithms: [],
    },
    // Binary Search 极其快，需要很大的 N 才能显现出 O(log n) 和 O(n) 的区别
    binarysearch: {
        sizes: [1000, 10000, 100000, 500000, 1000000],
        iterations: 5,
        warmupRuns: 3,
        algorithms: [],
    },
};

export const useBenchmarkStore = create<BenchmarkState>()(
    immer((set, get) => ({
        status: 'idle',
        progress: 0,
        currentAlgorithm: null,
        currentSize: null,
        results: {},
        summary: {},
        error: null,
        configs: {},

        getConfig: (problemId: string) => {
            // 优先返回用户自定义配置，其次是题目专属配置，最后是默认配置
            return get().configs[problemId] || PROBLEM_SPECIFIC_CONFIGS[problemId] || DEFAULT_CONFIG;
        },

        setConfig: (problemId: string, config: Partial<BenchmarkConfig>) => {
            set((state) => {
                if (!state.configs[problemId]) {
                    state.configs[problemId] = { ...DEFAULT_CONFIG };
                }
                Object.assign(state.configs[problemId], config);
            });
        },

        startBenchmark: (problemId: string) => {
            set({
                status: 'running',
                progress: 0,
                currentAlgorithm: null,
                currentSize: null,
                error: null,
            });
            set((state) => {
                state.results[problemId] = [];
            });
        },

        updateProgress: (progress: number, algorithm?: string, size?: number) => {
            set({
                progress,
                currentAlgorithm: algorithm ?? null,
                currentSize: size ?? null,
            });
        },

        addResult: (problemId: string, dataPoint: BenchmarkDataPoint) => {
            set((state) => {
                if (!state.results[problemId]) {
                    state.results[problemId] = [];
                }
                state.results[problemId].push(dataPoint);
            });
        },

        completeBenchmark: (problemId: string) => {
            set((state) => {
                state.status = 'completed';
                state.progress = 100;
                state.currentAlgorithm = null;
                state.currentSize = null;

                // 计算 summary
                const results = state.results[problemId] || [];
                if (results.length > 0) {
                    const maxSize = Math.max(...results.map((r) => r.size));
                    const maxSizeResults = results.filter((r) => r.size === maxSize);
                    const fastest = maxSizeResults.sort((a, b) => a.timeMs - b.timeMs)[0];

                    state.summary[problemId] = {
                        fastest: fastest?.algorithm || '',
                        avgTime: fastest?.timeMs || 0,
                        dataPoints: results,
                    };
                }
            });
        },

        failBenchmark: (error: string) => {
            set({
                status: 'error',
                error,
                currentAlgorithm: null,
                currentSize: null,
            });
        },

        clearResults: (problemId: string) => {
            set((state) => {
                delete state.results[problemId];
                delete state.summary[problemId];
                state.status = 'idle';
                state.progress = 0;
            });
        },

        reset: () => {
            set({
                status: 'idle',
                progress: 0,
                currentAlgorithm: null,
                currentSize: null,
                error: null,
            });
        },
    }))
);
