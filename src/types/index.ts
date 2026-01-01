// ============================================
// 核心类型定义 - Algorithm Verifier Platform
// ============================================

// ----------------------
// Problem Types (题目相关)
// ----------------------

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export interface Solution {
    name: string;
    complexity: string;
    pyCode: string;
    cppCode: string;
    jsCode?: string;
}

export interface Problem {
    id: string;
    number: number;
    title: string;
    difficulty: Difficulty;
    tags: string[];
    description: string;
    examples: Example[];
    constraints: string[];
    solutions: Solution[];
    starterCode?: {
        python?: string;
        cpp?: string;
    };
    testCases?: {
        input: Record<string, any>;
        expected: any;
        name: string;
    }[];
    meta?: {
        functionName: string;
        args: Array<{ name: string; type: string }>;
        returnType: string;
    };
}

// ----------------------
// Editor Types (编辑器相关)
// ----------------------

export type Language = 'python' | 'cpp';

export interface EditorState {
    code: string;
    language: Language;
    cursorPosition?: {
        lineNumber: number;
        column: number;
    };
}

// ----------------------
// Execution Types (代码执行相关)
// ----------------------

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error' | 'timeout';

export interface TestCase {
    input: unknown[];
    expected: unknown;
}

export interface ExecutionResult {
    status: ExecutionStatus;
    output?: unknown;
    stdout?: string;
    stderr?: string;
    executionTime?: number;
    memoryUsage?: number;
    error?: string;
}

export interface JudgeResult {
    passed: boolean;
    testCases: {
        input: unknown[];
        expected: unknown;
        actual: unknown;
        passed: boolean;
        executionTime: number;
    }[];
    totalTime: number;
    error?: string;
}

// ----------------------
// Performance Types (性能测试相关)
// ----------------------

export interface BenchmarkDataPoint {
    algorithm: string;
    size: number;
    timeMs: number;
    complexity: string;
    iterations: number;
    stdDev?: number;
    confidenceInterval?: [number, number];
}

export interface BenchmarkSummary {
    fastest: string;
    avgTime: number;
    dataPoints: BenchmarkDataPoint[];
}

export interface BenchmarkConfig {
    sizes: number[];
    iterations: number;
    warmupRuns: number;
    algorithms: string[];
}

export type BenchmarkStatus = 'idle' | 'running' | 'completed' | 'error';

export interface BenchmarkState {
    status: BenchmarkStatus;
    progress: number;
    currentAlgorithm?: string;
    currentSize?: number;
    results: Record<string, BenchmarkDataPoint[]>;
    summary: Record<string, BenchmarkSummary>;
    error?: string;
}

// ----------------------
// Submission Types (提交记录相关)
// ----------------------

export type SubmissionStatus = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Pending';

export interface Submission {
    id: string;
    problemId: string;
    code: string;
    language: Language;
    status: SubmissionStatus;
    runtime?: number;
    memory?: number;
    timestamp: number;
    passedCases?: number;
    totalCases?: number;
    complexity?: {
        time: string;
        space: string;
    };
}

// ----------------------
// Layout Types (布局系统相关)
// ----------------------

export type LayoutDirection = 'row' | 'column';
export type DropPosition = 'left' | 'right' | 'top' | 'bottom';

export interface LeafNode {
    type: 'leaf';
    id: string;
    size: number;
    tabs: string[];
    activeTab: string;
    collapsed: boolean;
}

export interface GroupNode {
    type: LayoutDirection;
    id: string;
    size: number;
    children: LayoutNode[];
}

export type LayoutNode = LeafNode | GroupNode;

export interface DragState {
    tabId: string;
    fromColId: string;
}

export interface DropTarget {
    type: 'tab' | 'split';
    leafId: string;
    position?: DropPosition;
}

export interface PreviewRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

// ----------------------
// Store Types (状态管理相关)
// ----------------------

export interface WorkspaceStore {
    // Current problem
    currentProblemId: string;
    setCurrentProblemId: (id: string) => void;

    // Language
    language: Language;
    setLanguage: (lang: Language) => void;

    // UI State
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;

    // Fullscreen
    fullscreenViewId: string | null;
    setFullscreenViewId: (id: string | null) => void;

    fullscreenOrigin: { x: number; y: number } | null;
    setFullscreenOrigin: (origin: { x: number; y: number } | null) => void;
}

export interface EditorStore {
    // Code state per problem
    codeMap: Record<string, Record<Language, string>>;

    // Actions
    getCode: (problemId: string, language: Language) => string;
    setCode: (problemId: string, language: Language, code: string) => void;
    resetCode: (problemId: string, language: Language) => void;
}

export interface LayoutStore {
    layout: LayoutNode;
    draggedTab: DragState | null;
    dropTarget: DropTarget | null;
    previewRect: PreviewRect | null;

    isResizing: boolean;
    setIsResizing: (isResizing: boolean) => void;

    // Actions
    setActiveTab: (leafId: string, tabId: string) => void;
    closeTab: (leafId: string, tabId: string) => void;
    addTab: (leafId: string, tabId: string) => void;
    toggleCollapse: (leafId: string) => void;
    startDrag: (tabId: string, fromColId: string) => void;
    updateDropTarget: (target: DropTarget | null, rect: PreviewRect | null) => void;
    endDrag: () => void;
    resetLayout: () => void;
}

export interface SubmissionStore {
    submissions: Record<string, Submission[]>;
    selectedSubmission: Submission | null;
    isSubmitting: boolean;

    // Actions
    addSubmission: (submission: Submission) => void;
    getSubmissions: (problemId: string) => Submission[];
    setSelectedSubmission: (submission: Submission | null) => void;
    clearSubmissions: (problemId: string) => void;
    setSubmitting: (isSubmitting: boolean) => void;
}

export interface BenchmarkStore extends BenchmarkState {
    config: BenchmarkConfig;

    // Actions
    setConfig: (config: Partial<BenchmarkConfig>) => void;
    startBenchmark: (problemId: string) => Promise<void>;
    stopBenchmark: () => void;
    clearResults: (problemId: string) => void;
    updateProgress: (progress: number, algorithm?: string, size?: number) => void;
    completeBenchmark: (problemId: string) => void;
}

// ----------------------
// Worker Message Types (Web Worker 通信相关)
// ----------------------

export type WorkerMessageType =
    | 'INIT'
    | 'EXECUTE'
    | 'BENCHMARK'
    | 'CANCEL'
    | 'READY'
    | 'RESULT'
    | 'ERROR'
    | 'PROGRESS';

export interface WorkerMessage<T = unknown> {
    type: WorkerMessageType;
    id: string;
    payload: T;
}

export interface ExecutePayload {
    code: string;
    language: Language;
    testCases: TestCase[];
    timeout: number;
}

export interface BenchmarkPayload {
    problemId: string;
    algorithms: Record<string, string>;
    config: BenchmarkConfig;
}

// ----------------------
// UI Types (UI 组件相关)
// ----------------------

export interface TabItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterState {
    status: SubmissionStatus[];
    difficulty: Difficulty[];
    tags: string[];
    searchQuery: string;
}

// ----------------------
// WASM Types (WebAssembly 相关)
// ----------------------

export interface WasmAlgorithmModule {
    twoSum: (nums: Int32Array, target: number) => Int32Array;
    bubbleSort: (nums: Int32Array) => Int32Array;
    quickSort: (nums: Int32Array) => Int32Array;
    fibonacci: (n: number) => number;
    binarySearch: (nums: Int32Array, target: number) => number;
}
