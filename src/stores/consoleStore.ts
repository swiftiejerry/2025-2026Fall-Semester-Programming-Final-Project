import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { TestCaseResult } from '../services/testRunner';

export interface ConsoleOutput {
    id: string;
    timestamp: number;
    type: 'stdout' | 'stderr' | 'compile' | 'system' | 'input';
    content: string;
}

export interface ExecutionResult {
    status: 'idle' | 'running' | 'success' | 'error' | 'warning';
    statusText: string;
    time?: string;      // 运行时间 (秒)
    memory?: number;    // 内存使用 (KB)
    exitCode?: number;
}

interface ConsoleState {
    outputs: ConsoleOutput[];
    result: ExecutionResult;
    isRunning: boolean;

    // 新增：测试结果相关
    viewMode: 'log' | 'test-result';
    testResults: TestCaseResult[] | null;

    // Actions
    addOutput: (type: ConsoleOutput['type'], content: string) => void;
    clearOutputs: () => void;
    setResult: (result: Partial<ExecutionResult>) => void;
    setRunning: (running: boolean) => void;
    setViewMode: (mode: 'log' | 'test-result') => void;
    setTestResults: (results: TestCaseResult[] | null) => void;
    reset: () => void;
}

export const useConsoleStore = create<ConsoleState>()(
    immer((set) => ({
        outputs: [],
        result: {
            status: 'idle',
            statusText: 'Ready',
        },
        isRunning: false,
        viewMode: 'log',
        testResults: null,

        addOutput: (type, content) => {
            set((state) => {
                state.outputs.push({
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    timestamp: Date.now(),
                    type,
                    content,
                });
            });
        },

        clearOutputs: () => {
            set((state) => {
                state.outputs = [];
                state.testResults = null;
                state.viewMode = 'log'; // 默认回退到日志，除非运行后成功解析测试
            });
        },

        setResult: (result) => {
            set((state) => {
                state.result = { ...state.result, ...result };
            });
        },

        setRunning: (running) => {
            set((state) => {
                state.isRunning = running;
                if (running) {
                    state.result = {
                        status: 'running',
                        statusText: 'Running...',
                    };
                }
            });
        },

        setViewMode: (mode) => {
            set((state) => {
                state.viewMode = mode;
            });
        },

        setTestResults: (results) => {
            set((state) => {
                state.testResults = results;
                if (results && results.length > 0) {
                    state.viewMode = 'test-result';
                }
            });
        },

        reset: () => {
            set((state) => {
                state.outputs = [];
                state.result = {
                    status: 'idle',
                    statusText: 'Ready',
                };
                state.isRunning = false;
                state.testResults = null;
                state.viewMode = 'log';
            });
        },
    }))
);
