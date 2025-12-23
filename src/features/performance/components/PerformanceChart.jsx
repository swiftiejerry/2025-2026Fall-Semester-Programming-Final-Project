// 性能分析图表组件 - 使用成熟的 recharts 库
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * 性能对比图表
 * @param {Array} results - 性能测试结果 [{ algorithm, size, timeMs, complexity }]
 */
export function PerformanceChart({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-zinc-500 text-sm">
        暂无性能数据，请先运行性能测试
      </div>
    );
  }

  // 将数据转换为 recharts 需要的格式
  // 按 size 分组，每个 size 是一个数据点，包含所有算法的时间
  const sizeMap = {};
  results.forEach((r) => {
    if (!sizeMap[r.size]) {
      sizeMap[r.size] = { size: r.size };
    }
    sizeMap[r.size][r.algorithm] = r.timeMs;
  });

  const chartData = Object.values(sizeMap).sort((a, b) => a.size - b.size);

  // 提取所有算法名称和复杂度
  const algorithmInfo = {};
  results.forEach((r) => {
    if (!algorithmInfo[r.algorithm]) {
      algorithmInfo[r.algorithm] = r.complexity;
    }
  });

  // 颜色方案
  const colors = ['#60a5fa', '#f97316', '#22c55e', '#eab308', '#a855f7', '#ec4899'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="size"
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
          label={{ value: '数据规模 (n)', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)' }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
          label={{ value: '耗时 (ms)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="line"
        />
        {Object.keys(algorithmInfo).map((algo, idx) => (
          <Line
            key={algo}
            name={`${algo} (${algorithmInfo[algo]})`}
            type="monotone"
            dataKey={algo}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[idx % colors.length], r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
