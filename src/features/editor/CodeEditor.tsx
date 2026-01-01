import React, { useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, ChevronDown, CloudUpload, Loader2 } from 'lucide-react';
import { useEditorStore, useWorkspaceStore, useSubmissionStore, useLayoutStore, VIEW_IDS, useThemeStore } from '../../stores';
import { createSubmission } from '../../stores/submissionStore';
import { useConsoleStore } from '../../stores/consoleStore';
import { PROBLEMS } from '../../data/problems';
import { runCodeZeroConfig } from '../../services/codeRunner';

interface CodeEditorProps {
    className?: string;
}

// 语言选项（仅 Python 和 C++）
const LANGUAGES = [
    { id: 'python', name: 'Python 3' },
    { id: 'cpp', name: 'C++' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
    const currentProblemId = useWorkspaceStore((state) => state.currentProblemId);
    const language = useWorkspaceStore((state) => state.language);
    const setLanguage = useWorkspaceStore((state) => state.setLanguage);

    const { codeMap, setCode } = useEditorStore();
    const { addSubmission, setSubmitting, isSubmitting } = useSubmissionStore();
    const { addOutput, clearOutputs, setResult, setRunning } = useConsoleStore();
    const focusTab = useLayoutStore((state) => state.focusTab);

    const editorRef = useRef<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 获取当前代码
    const currentCode = codeMap[currentProblemId]?.[language] ??
        (PROBLEMS[currentProblemId]?.starterCode?.[language] || '# Loading...');

    const { effectiveTheme } = useThemeStore(); // Used for syncing editor theme

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    const handleChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(currentProblemId, language, value);
        }
    };

    // 真正的代码运行 - 零配置方案
    const handleRun = async () => {
        // 自动聚焦到控制台
        focusTab(VIEW_IDS.CONSOLE);

        clearOutputs();
        setRunning(true);
        // addOutput('system', `>>> Running ${language === 'python' ? 'Python 3 (Local Pyodide)' : 'C++ (Coliru)'} code...`);

        const currentProblem = PROBLEMS[currentProblemId];
        let codeToRun = currentCode;
        let isTestMode = false;

        // 生成测试脚本 (Python / C++)
        if (currentProblem?.testCases) {
            if (language === 'python') {
                const { generatePythonTestScript } = await import('../../services/testRunner');
                codeToRun = generatePythonTestScript(currentCode, currentProblem.testCases, currentProblem.meta);
                isTestMode = true;
            } else if (language === 'cpp' && currentProblem.meta) {
                // Use the new C++ Runner
                const { generateCppTestRunner } = await import('../../services/cppTestRunner');
                codeToRun = generateCppTestRunner(currentCode, currentProblem);
                isTestMode = true;
            }
        }

        let fullOutput = '';
        let isInsideJsonResult = false;

        try {
            const result = await runCodeZeroConfig({
                code: codeToRun,
                language: language as 'python' | 'cpp',
                onOutput: (type, content) => {
                    if (isTestMode && type === 'stdout') {
                        fullOutput += content;

                        // 检测 JSON 结果区域的开始和结束
                        if (content.includes('___JSON_RESULT_START___')) {
                            isInsideJsonResult = true;
                        }
                        if (content.includes('___JSON_RESULT_END___')) {
                            isInsideJsonResult = false;
                        }

                        // 只输出 JSON 区域之外的内容（用户的 print 调试）
                        if (!isInsideJsonResult && !content.includes('___JSON_RESULT_')) {
                            addOutput(type, content);
                        }
                    } else {
                        addOutput(type, content);
                    }
                }
            });

            // 解析测试结果
            if (isTestMode && result.success) {
                const startTag = '___JSON_RESULT_START___';
                const endTag = '___JSON_RESULT_END___';
                const startIndex = fullOutput.indexOf(startTag);
                const endIndex = fullOutput.indexOf(endTag);

                if (startIndex !== -1 && endIndex !== -1) {
                    const jsonStr = fullOutput.substring(startIndex + startTag.length, endIndex).trim();
                    try {
                        const testResults = JSON.parse(jsonStr);
                        const { setTestResults, setViewMode } = useConsoleStore.getState();

                        // 设置测试结果并切换到测试结果视图
                        setViewMode('test-result');
                        setTestResults(testResults);

                        // 更新状态为最后的状态
                        const allPassed = testResults.every((r: any) => r.passed);
                        setResult({
                            status: allPassed ? 'success' : 'error',
                            statusText: allPassed ? 'Accepted' : 'Wrong Answer',
                            time: result.time,
                        });
                        return; // 成功处理测试结果，直接返回
                    } catch (e) {
                        addOutput('stderr', `\nError parsing test results: ${e}`);
                    }
                }
            }

            // 如果不是测试模式，或者解析失败，回退到普通显示
            const { setTestResults } = useConsoleStore.getState();
            setTestResults(null); // 确保切回日志模式

            // 如果执行失败，显示错误信息
            if (!result.success && result.error) {
                addOutput('stderr', `\nExecution Error: ${result.error}`);
            }

            setResult({
                status: result.success ? 'success' : 'error',
                statusText: result.success ? 'Finished' : 'Failed',
                time: result.time,
                exitCode: result.success ? 0 : 1,
            });

        } catch (error) {
            addOutput('stderr', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setResult({ status: 'error', statusText: 'Execution Failed' });
        } finally {
            setRunning(false);
        }
    };

    // 真正的代码提交 - (目前复用运行逻辑，或者添加特定的提交逻辑)
    // 注意：Submit 也应该跑所有 TestCases，逻辑几乎一样，只是最后要提交记录
    const handleSubmit = async () => {
        // 自动聚焦到控制台
        focusTab(VIEW_IDS.CONSOLE);

        // ... (Submit logic needs similar update to handle test cases if we want detailed feedback on submit)
        // 简单起见，Submit 逻辑复用 handleRun 的大部分逻辑，但最后添加 Submission Record

        setSubmitting(true);
        clearOutputs();
        setRunning(true);

        // ... (Simplified: Reuse handleRun logic for now, or copy-paste the enhanced logic above)
        // 为了确保一致性，这里简化为调用 runCodeZeroConfig 并手动处理
        // 理想情况下应该重构 handleRun 为 runWithTests

        // ... (Wait, user wants Submit to trigger the detailed view too)

        // Let's copy the enhanced logic
        const currentProblem = PROBLEMS[currentProblemId];
        let codeToRun = currentCode;
        let isTestMode = false;

        if (currentProblem?.testCases) {
            if (language === 'python') {
                const { generatePythonTestScript } = await import('../../services/testRunner');
                codeToRun = generatePythonTestScript(currentCode, currentProblem.testCases, currentProblem.meta);
                isTestMode = true;
            } else if (language === 'cpp' && currentProblem.meta) {
                const { generateCppTestRunner } = await import('../../services/cppTestRunner');
                codeToRun = generateCppTestRunner(currentCode, currentProblem);
                isTestMode = true;
            }
        }

        let fullOutput = '';

        try {
            const result = await runCodeZeroConfig({
                code: codeToRun,
                language: language as 'python' | 'cpp',
                onOutput: (type, content) => {
                    if (isTestMode && type === 'stdout') {
                        fullOutput += content;
                        if (!content.includes('___JSON_RESULT_')) {
                            addOutput(type, content);
                        }
                    } else {
                        addOutput(type, content);
                    }
                }
            });

            let isAccepted = result.success;
            let passedCount = 0;
            let totalCount = currentProblem?.testCases ? currentProblem.testCases.length : 20;

            if (isTestMode && result.success) {
                const startTag = '___JSON_RESULT_START___';
                const endTag = '___JSON_RESULT_END___';
                const startIndex = fullOutput.indexOf(startTag);
                const endIndex = fullOutput.indexOf(endTag);

                if (startIndex !== -1 && endIndex !== -1) {
                    const jsonStr = fullOutput.substring(startIndex + startTag.length, endIndex).trim();
                    try {
                        const testResults = JSON.parse(jsonStr);
                        const { setTestResults } = useConsoleStore.getState();
                        setTestResults(testResults);

                        isAccepted = testResults.every((r: any) => r.passed);
                        passedCount = testResults.filter((r: any) => r.passed).length;
                        totalCount = testResults.length;
                    } catch (e) {
                        // ignore
                    }
                }
            } else {
                const { setTestResults } = useConsoleStore.getState();
                setTestResults(null);
            }

            addSubmission(createSubmission(
                currentProblemId,
                currentCode,
                language,
                {
                    status: isAccepted ? 'Accepted' : (isTestMode ? 'Wrong Answer' : 'Runtime Error'),
                    passedCases: passedCount,
                    totalCases: totalCount,
                    runtime: result.time ? parseFloat(result.time) * 1000 : undefined,
                }
            ));

            setResult({
                status: isAccepted ? 'success' : 'error',
                statusText: isAccepted ? 'Accepted' : 'Failed',
                time: result.time,
            });

        } catch (error) {
            addOutput('stderr', `Submit Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setResult({ status: 'error', statusText: 'Submission Failed' });
        } finally {
            setSubmitting(false);
            setRunning(false);
        }
    };

    // 键盘快捷键
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRun();
        }
    };

    return (
        <div
            className={`h-full w-full flex flex-col theme-bg-elevated ${className}`}
            onKeyDown={handleKeyDown}
        >
            {/* LeetCode Style Toolbar */}
            <div className="h-10 flex items-center justify-between px-3 theme-bg-panel border-b theme-border select-none">

                {/* Left: Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-1 text-xs theme-text-secondary hover:theme-text-primary px-2 py-1 rounded hover:theme-bg-tertiary transition-colors"
                    >
                        <span>{LANGUAGES.find(l => l.id === language)?.name}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 mt-1 w-32 theme-bg-elevated border theme-border rounded shadow-xl z-20 py-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => {
                                            setLanguage(lang.id as any);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors
                                            ${language === lang.id ? 'bg-emerald-600 text-white' : 'theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary'}
                                        `}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">


                    <div className="h-4 w-[1px] theme-bg-tertiary mx-1" />

                    <button
                        onClick={handleRun}
                        disabled={isSubmitting}
                        className={`flex items-center gap-1.5 px-3 py-1 theme-text-secondary text-xs rounded transition-colors font-medium
                            ${isSubmitting ? 'theme-bg-tertiary cursor-not-allowed theme-text-muted' : 'theme-bg-tertiary hover:theme-bg-elevated hover:theme-text-primary'}
                        `}
                        title="运行代码 (Ctrl+Enter)"
                    >
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        运行
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all font-medium ${isSubmitting ? 'bg-emerald-600/50 cursor-not-allowed text-white/50' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.2)]'
                            }`}
                    >
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                        提交
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    width="100%"
                    language={language === 'cpp' ? 'cpp' : 'python'}
                    value={currentCode}
                    theme={effectiveTheme === 'dark' ? 'vs-dark' : 'light'}
                    onChange={handleChange}
                    onMount={handleEditorDidMount}
                    loading={
                        <div className="flex items-center justify-center gap-2 text-slate-400 h-full">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading Editor...</span>
                        </div>
                    }
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        minimap: { enabled: false },
                        folding: true,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: 'line',
                        contextmenu: true,
                        scrollbar: {
                            vertical: 'visible',
                            horizontal: 'visible',
                            useShadows: false,
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                        },
                        overviewRulerBorder: false, // Cleaner look
                        hideCursorInOverviewRuler: true,
                    }}
                />
            </div>
        </div>
    );
};
