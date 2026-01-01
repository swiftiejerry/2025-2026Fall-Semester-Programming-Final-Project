import React, { useMemo, useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { BenchmarkDataPoint } from '../../types';

interface BenchmarkChartProps {
    data: BenchmarkDataPoint[];
}

// 颜色池
const COLORS = [
    '#10B981', // Emerald 500
    '#F59E0B', // Amber 500
    '#EF4444', // Red 500
    '#3B82F6', // Blue 500
    '#8B5CF6', // Violet 500
    '#EC4899', // Pink 500
];

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ data }) => {
    const [revealProgress, setRevealProgress] = useState(0);
    const dataKey = useMemo(() => data.map(d => `${d.algorithm}-${d.size}`).join(','), [data]);

    // 当数据变化时，触发揭示动画
    useEffect(() => {
        if (data.length === 0) {
            setRevealProgress(0);
            return;
        }

        // 重置并启动动画
        setRevealProgress(0);
        const startTime = performance.now();
        const duration = 1200; // 1.2秒

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // 使用 ease-out 缓动
            const eased = 1 - Math.pow(1 - progress, 3);
            setRevealProgress(eased * 100);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [dataKey, data.length]);

    // 转换数据格式为 Recharts 可用的宽表格式
    const chartData = useMemo(() => {
        const sizeMap = new Map<number, Record<string, number | string>>();
        const algorithms = new Set<string>();

        data.forEach((point) => {
            algorithms.add(point.algorithm);
            if (!sizeMap.has(point.size)) {
                sizeMap.set(point.size, { size: point.size });
            }
            const entry = sizeMap.get(point.size)!;
            entry[point.algorithm] = point.timeMs;
        });

        return Array.from(sizeMap.values()).sort((a, b) => (a.size as number) - (b.size as number));
    }, [data]);

    const algorithms = useMemo(() => {
        const algos = new Set<string>();
        data.forEach(d => algos.add(d.algorithm));
        return Array.from(algos);
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-slate-500">
                Waiting for test results...
            </div>
        );
    }

    return (
        <div
            className="h-full w-full overflow-hidden"
            style={{
                clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis
                        dataKey="size"
                        stroke="#94a3b8"
                        label={{ value: 'Data Size (N)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number) => [`${value.toFixed(3)} ms`, 'Time']}
                    />
                    <Legend verticalAlign="top" height={36} />
                    {algorithms.map((algo, index) => (
                        <Line
                            key={algo}
                            type="monotone"
                            dataKey={algo}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            dot={{ r: 4, fill: COLORS[index % COLORS.length] }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
