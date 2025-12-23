import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PerformanceChart } from './components/PerformanceChart';

// 性能分析面板
export function Performance({ problem, results = [], onRunTest, onClearResults }) {
  const solutions = problem?.solutions || [];
  const hasSolutions = solutions.length > 0;

  // 默认选中所有算法
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    solutions.map((sol) => sol.name)
  );
  const [repeats, setRepeats] = useState(3);
  const [chartCollapsed, setChartCollapsed] = useState(false);

  // 预设规模配置 - 根据题目类型动态调整
  const getPresets = (problemId) => {
    // 指数级算法题目 (递归斐波那契、爬楼梯等)
    const exponentialProblems = ['fibonacci', 'climbStairs', 'partitionEqualSubsetSum'];

    if (exponentialProblems.includes(problemId)) {
      return {
        small: [10, 20, 25],
        medium: [20, 30, 35],
        large: [30, 35, 40],
      };
    }

    // 默认题目 (O(n) / O(n^2))
    return {
      small: [1000, 2000, 5000],
      medium: [5000, 10000, 20000],
      large: [10000, 50000, 100000],
    };
  };

  const currentPresets = getPresets(problem?.id);

  // 初始化时根据题目设置默认规模
  const [testSizes, setTestSizes] = useState(currentPresets.small);

  // 监听题目变化，重置规模
  React.useEffect(() => {
    const presets = getPresets(problem?.id);
    setTestSizes(presets.small);
  }, [problem?.id]);

  const handleToggleAlgorithm = (name) => {
    setSelectedAlgorithms((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSetPreset = (preset) => {
    setTestSizes(currentPresets[preset]);
  };

  const isPresetActive = (preset) => {
    const target = currentPresets[preset];
    return testSizes.length === target.length && testSizes.every((v, i) => v === target[i]);
  };

  const handleCustomSizesChange = (e) => {
    const input = e.target.value;
    const parsed = input.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
    if (parsed.length > 0) {
      setTestSizes(parsed);
    }
  };

  const handleRunTest = () => {
    if (!hasSolutions || selectedAlgorithms.length === 0 || testSizes.length === 0) {
      return;
    }
    onRunTest?.({ algorithms: selectedAlgorithms, sizes: testSizes, repeats });
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4 text-base text-text-primary overflow-y-auto">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-wide text-text-secondary">
            性能分析与总结
          </div>
          <div className="text-base font-semibold text-text-primary mt-1">
            {problem?.number}. {problem?.title}
          </div>
        </div>
        <div className="text-xs text-text-tertiary">
          经典算法数量：{solutions.length}
        </div>
      </div>

      {/* 配置区域 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 算法选择 */}
        <div className="border border-border-primary rounded-lg bg-surface-tertiary p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">参与对比的算法</span>
            <span className="text-xs text-text-tertiary">
              已选 {selectedAlgorithms.length} / {solutions.length}
            </span>
          </div>
          {!hasSolutions ? (
            <div className="text-xs text-text-tertiary mt-1">
              当前题目暂未配置经典算法。
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {solutions.map((sol) => {
                const active = selectedAlgorithms.includes(sol.name);
                return (
                  <button
                    key={sol.name}
                    onClick={() => handleToggleAlgorithm(sol.name)}
                    className={`px-2 py-1 rounded-full text-xs border transition-colors flex items-center gap-1.5 ${active
                      ? 'bg-accent-primary/20 border-accent-primary/60 text-accent-primary'
                      : 'bg-surface-elevated border-border-primary text-text-secondary hover:bg-surface-secondary'
                      }`}
                  >
                    <span>{sol.name}</span>
                    {sol.complexity && (
                      <span className="text-[10px] text-text-tertiary">{sol.complexity}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 测试规模配置 */}
        <div className="border border-border-primary rounded-lg bg-surface-tertiary p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">测试规模与重复次数</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {['small', 'medium', 'large'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSetPreset(preset)}
                className={`px-2 py-1 rounded-full border text-xs transition-colors ${isPresetActive(preset)
                  ? 'border-accent-primary/80 bg-accent-primary/40 text-white'
                  : 'border-border-primary bg-surface-elevated hover:bg-surface-secondary text-text-secondary'
                  }`}
              >
                {preset === 'small' ? '小规模' : preset === 'medium' ? '中等规模' : '大规模'}
              </button>
            ))}
          </div>
          <div className="space-y-1 mt-1">
            <div className="text-xs text-text-tertiary">自定义规模（逗号分隔）</div>
            <input
              value={testSizes.join(', ')}
              onChange={handleCustomSizesChange}
              className="w-full bg-surface-tertiary border border-border-primary rounded px-2 py-1 text-xs text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              placeholder="例如: 100, 500, 1000"
            />
          </div>
          <div className="space-y-1 mt-2">
            <div className="text-xs text-text-tertiary">每个规模重复次数</div>
            <input
              type="number"
              min={1}
              max={10}
              value={repeats}
              onChange={(e) => setRepeats(parseInt(e.target.value, 10) || 1)}
              className="w-20 bg-surface-tertiary border border-border-primary rounded px-2 py-1 text-xs text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus"
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTest}
            disabled={!hasSolutions || selectedAlgorithms.length === 0 || testSizes.length === 0}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-accent-primary hover:bg-blue-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            运行性能测试
          </button>
          <button
            onClick={onClearResults}
            disabled={results.length === 0}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-surface-elevated hover:bg-surface-secondary text-text-secondary border border-border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            清除结果
          </button>
        </div>
        <div className="text-xs text-text-tertiary">
          {results.length > 0 && `已生成测试报告`}
        </div>
      </div>

      {/* 图表展示 */}
      <div className="border border-border-primary rounded-lg bg-surface-tertiary overflow-hidden transition-all duration-300">
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-secondary transition-colors"
          onClick={() => setChartCollapsed(!chartCollapsed)}
        >
          <div className="text-xs font-medium text-text-secondary">性能对比图表</div>
          <button className="text-text-tertiary hover:text-text-primary">
            {chartCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${chartCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
            }`}
        >
          <div className="p-4 pt-0">
            <PerformanceChart results={results} />
          </div>
        </div>
      </div>
    </div>
  );
}
