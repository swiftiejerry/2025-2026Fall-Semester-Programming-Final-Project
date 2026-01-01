import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Terminal } from 'lucide-react';

interface GeneratorConfig {
    type: 'array' | 'number' | 'matrix' | 'string';
    size: number;
    min: number;
    max: number;
}

export const TestCaseGeneratorPanel: React.FC = () => {
    // Default config based on problem
    const [config, setConfig] = useState<GeneratorConfig>({
        type: 'array',
        size: 100,
        min: -1000,
        max: 1000
    });

    const [output, setOutput] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const generate = () => {
        let result: any;
        if (config.type === 'array') {
            result = Array.from({ length: config.size }, () =>
                Math.floor(Math.random() * (config.max - config.min + 1)) + config.min
            );
        } else if (config.type === 'number') {
            result = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
        } else if (config.type === 'string') {
            // Simple random string
            const chars = 'abcdefghijklmnopqrstuvwxyz';
            result = Array.from({ length: config.size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }

        // Formatting for Python/JS input
        setOutput(JSON.stringify(result, null, 2));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col theme-bg-elevated theme-text-secondary p-4">
            <div className="flex items-center gap-2 mb-6 border-b theme-border pb-4">
                <Terminal className="w-5 h-5 text-emerald-500" />
                <h2 className="font-bold theme-text-primary">测试用例生成器</h2>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-xs font-medium theme-text-tertiary uppercase mb-1.5 block">数据类型</label>
                    <select
                        value={config.type}
                        onChange={e => setConfig({ ...config, type: e.target.value as any })}
                        className="w-full theme-bg-tertiary border theme-border rounded px-3 py-2 text-sm theme-text-primary outline-none focus:border-emerald-500 transition-colors"
                    >
                        <option value="array">整数数组 (Array)</option>
                        <option value="number">整数 (Integer)</option>
                        <option value="string">字符串 (String)</option>
                        {/* <option value="matrix">Matrix</option> */}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium theme-text-tertiary uppercase mb-1.5 block">数据规模 (Size)</label>
                        <input
                            type="number"
                            value={config.size}
                            onChange={e => setConfig({ ...config, size: parseInt(e.target.value) || 0 })}
                            className="w-full theme-bg-tertiary border theme-border rounded px-3 py-2 text-sm theme-text-primary focus:border-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        {/* Placeholder for layout */}
                    </div>
                </div>

                {(config.type === 'array' || config.type === 'number') && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium theme-text-tertiary uppercase mb-1.5 block">最小值 (Min)</label>
                            <input
                                type="number"
                                value={config.min}
                                onChange={e => setConfig({ ...config, min: parseInt(e.target.value) || 0 })}
                                className="w-full theme-bg-tertiary border theme-border rounded px-3 py-2 text-sm theme-text-primary focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium theme-text-tertiary uppercase mb-1.5 block">最大值 (Max)</label>
                            <input
                                type="number"
                                value={config.max}
                                onChange={e => setConfig({ ...config, max: parseInt(e.target.value) || 0 })}
                                className="w-full theme-bg-tertiary border theme-border rounded px-3 py-2 text-sm theme-text-primary focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={generate}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
            >
                <RefreshCw className="w-4 h-4" />
                生成随机用例
            </button>

            {output && (
                <div className="mt-6 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium theme-text-tertiary">生成结果 (Preview)</span>
                        <button
                            onClick={copyToClipboard}
                            className="text-xs flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? '已复制' : '复制'}
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={output}
                        className="flex-1 w-full theme-bg-primary border theme-border rounded p-3 font-mono text-xs theme-text-secondary resize-none outline-none focus:border-emerald-500"
                    />
                </div>
            )}
        </div>
    );
};
