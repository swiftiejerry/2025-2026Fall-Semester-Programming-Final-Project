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
import type { ComplexityType } from '../../data/benchmarkAlgorithms';

interface SpaceComplexityChartProps {
    algorithms: { name: string; spaceComplexity: ComplexityType }[];
    sizes: number[];
    animationTrigger?: number; // 当这个值变化时重新触发动画
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

// 根据复杂度类型计算理论空间使用量
function calculateTheoreticalSpace(complexity: ComplexityType, n: number): number {
    switch (complexity) {
        case 'O(1)':
            return 1;
        case 'O(log n)':
            return Math.log2(n);
        case 'O(n)':
            return n;
        case 'O(n log n)':
            return n * Math.log2(n);
        case 'O(n²)':
            return n * n;
        case 'O(2^n)':
            return Math.min(Math.pow(2, n), 1e10); // 限制最大值避免爆炸
        default:
            return n;
    }
}

export const SpaceComplexityChart: React.FC<SpaceComplexityChartProps> = ({ algorithms, sizes, animationTrigger }) => {
    const [revealProgress, setRevealProgress] = useState(0);

    // 当数据变化时，触发揭示动画
    useEffect(() => {
        if (algorithms.length === 0) {
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
    }, [animationTrigger, algorithms.length]);

    const chartData = useMemo(() => {
        if (algorithms.length === 0 || sizes.length === 0) return [];

        // 归一化：找到最大值用于缩放
        let maxValue = 0;
        const rawData: Record<string, number[]> = {};

        algorithms.forEach(algo => {
            const values = sizes.map(size => calculateTheoreticalSpace(algo.spaceComplexity, size));
            rawData[algo.name] = values;
            maxValue = Math.max(maxValue, ...values);
        });

        // 转换为图表数据格式
        return sizes.map((size, i) => {
            const point: Record<string, number | string> = { size };
            algorithms.forEach(algo => {
                const values = rawData[algo.name];
                if (values && values[i] !== undefined) {
                    // 归一化到 0-100 范围便于比较
                    point[algo.name] = (values[i] / maxValue) * 100;
                }
            });
            return point;
        });
    }, [algorithms, sizes]);

    if (algorithms.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-slate-500">
                无算法数据
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
                        label={{ value: '数据规模 (N)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        label={{ value: '相对空间使用', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        tickFormatter={() => ''}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(_: number, name: string) => {
                            const algo = algorithms.find(a => a.name === name);
                            return [algo?.spaceComplexity || '', name];
                        }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    {algorithms.map((algo, index) => (
                        <Line
                            key={algo.name}
                            type="monotone"
                            dataKey={algo.name}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            strokeDasharray="5 5"
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
