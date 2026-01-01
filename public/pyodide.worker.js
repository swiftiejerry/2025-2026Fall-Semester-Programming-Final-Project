/* eslint-disable no-restricted-globals */

// Pyodide Worker
// 负责在浏览器本地运行 Python 代码

importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');

let pyodide = null;
let pyodideReadyPromise = null;

// 初始化 Pyodide
async function loadPyodideAndPackages() {
    if (pyodideReadyPromise) return pyodideReadyPromise;

    pyodideReadyPromise = (async () => {
        // @ts-ignore
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        await pyodide.loadPackage(["micropip"]);
    })();

    return pyodideReadyPromise;
}

// 拦截 stdout
function setupStdoutCapturing() {
    pyodide.runPython(`
import sys
import io

class StdoutBuffer(io.TextIOBase):
    def write(self, string):
        # 发送 stdout 到主线程
        import js
        js.postMessage(string)

sys.stdout = StdoutBuffer()
sys.stderr = StdoutBuffer()
    `);

    // 注入 postMessage 到 Python 全局作用域
    pyodide.globals.set("postMessage", (msg) => {
        self.postMessage({ type: 'stdout', content: msg });
    });
}

self.onmessage = async (event) => {
    const { code, input } = event.data;

    try {
        if (!pyodide) {
            self.postMessage({ type: 'system', content: '>>> Initializing Python Environment (Pyodide)...' });
            await loadPyodideAndPackages();
            self.postMessage({ type: 'system', content: '>>> Python Environment Ready.' });
        }

        // 重置 stdout 捕获
        pyodide.setStdout({
            batched: (msg) => {
                self.postMessage({ type: 'stdout', content: msg + '\n' });
            }
        });
        pyodide.setStderr({
            batched: (msg) => {
                self.postMessage({ type: 'stderr', content: msg + '\n' });
            }
        });

        // 也可以选择在这里处理 stdin (input)

        const startTime = performance.now();

        // 运行代码
        // 使用 loadPackagesFromImports 自动加载 numpy 等库（如果代码里用了）
        await pyodide.loadPackagesFromImports(code);

        const result = await pyodide.runPythonAsync(code);

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;

        // 如果最后有返回值且不是 None，也打印出来
        if (result !== undefined && result !== null) {
            self.postMessage({ type: 'stdout', content: result.toString() });
        }

        self.postMessage({
            type: 'result',
            success: true,
            time: duration.toFixed(3)
        });

    } catch (error) {
        self.postMessage({
            type: 'result',
            success: false,
            error: error.message
        });
    }
};
