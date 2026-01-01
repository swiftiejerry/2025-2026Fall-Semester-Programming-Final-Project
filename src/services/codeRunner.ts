import { runCppCode } from './judge0Service';

// Pyodide Worker 相关变量
let pyodideWorker: Worker | null = null;

interface RunOptions {
    code: string;
    language: 'python' | 'cpp';
    input?: string;
    onOutput: (type: 'stdout' | 'stderr' | 'system', content: string) => void;
}

interface RunResult {
    success: boolean;
    time?: string;
    error?: string;
}

/**
 * 初始化 Python Worker
 */
function initPythonWorker() {
    if (pyodideWorker) return pyodideWorker;

    pyodideWorker = new Worker(new URL('../../public/pyodide.worker.js', import.meta.url));
    return pyodideWorker;
}

// 简单的全局 resolve，用于 await worker 结果
// 注意：这意味着同一时间只能运行一个 Python 任务
let globalResolve: ((value: RunResult) => void) | null = null;
let currentOnOutput: RunOptions['onOutput'] | null = null;

/**
 * 统一的代码运行入口
 * 真正执行代码，无需 API Key
 */
export async function runCodeZeroConfig(options: RunOptions): Promise<RunResult> {
    const { code, language, onOutput } = options;

    if (language === 'python') {
        const worker = initPythonWorker();

        // 每次运行都更新回调，确保输出发送到正确的地方
        currentOnOutput = onOutput;

        worker!.onmessage = (event) => {
            const { type, content, success, time, error } = event.data;

            if (type === 'stdout') {
                currentOnOutput?.('stdout', content);
            } else if (type === 'stderr') {
                currentOnOutput?.('stderr', content);
            } else if (type === 'system') {
                currentOnOutput?.('system', content);
            } else if (type === 'result') {
                if (globalResolve) {
                    globalResolve({ success, time, error });
                    globalResolve = null;
                }
            }
        };

        return new Promise((resolve) => {
            globalResolve = resolve;
            worker!.postMessage({ code, input: options.input });
        });
    }

    else if (language === 'cpp') {
        onOutput('system', '>>> Compiling and running C++ code (via Judge0)...');
        const startTime = performance.now();

        const result = await runCppCode(code);

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(3);

        if (result.output) {
            onOutput('stdout', result.output);
        }

        if (result.error) {
            onOutput('stderr', result.error);
        }

        return {
            success: result.success,
            time: duration,
            error: result.error
        };
    }

    return { success: false, error: 'Unsupported language' };
}
