import React, { useState } from 'react';
import { Clock, Database, Copy, ChevronDown } from 'lucide-react';

// 提交详情
export function SubmitDetail({ submission }) {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  if (!submission) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary">
        <p className="text-sm">请选择一条提交记录</p>
      </div>
    );
  }

  const renderComplexityCurve = (complexity) => {
    // 根据复杂度类型绘制不同的SVG曲线
    if (complexity.includes('n²')) {
      return (
        <path
          d="M 10 110 Q 105 55, 190 10"
          fill="none"
          stroke="url(#gradient-purple)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300,
            animation: 'draw-curve 1.5s ease-out forwards'
          }}
        />
      );
    } else if (complexity.includes('log')) {
      return (
        <path
          d="M 10 110 Q 50 30, 190 10"
          fill="none"
          stroke="url(#gradient-purple)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300,
            animation: 'draw-curve 1.5s ease-out forwards'
          }}
        />
      );
    } else if (complexity.includes('2^n')) {
      return (
        <path
          d="M 10 110 L 80 60 Q 140 20, 190 5"
          fill="none"
          stroke="url(#gradient-purple)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300,
            animation: 'draw-curve 1.5s ease-out forwards'
          }}
        />
      );
    } else if (complexity === 'O(1)') {
      return (
        <line
          x1="10"
          y1="60"
          x2="190"
          y2="60"
          stroke="url(#gradient-purple)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: 200,
            animation: 'draw-curve 1.5s ease-out forwards'
          }}
        />
      );
    } else {
      // 默认：O(n) 线性
      return (
        <line
          x1="10"
          y1="110"
          x2="190"
          y2="10"
          stroke="url(#gradient-purple)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 250,
            strokeDashoffset: 250,
            animation: 'draw-curve 1.5s ease-out forwards'
          }}
        />
      );
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between pb-3 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <span className={`text-base font-semibold ${submission.status === '通过' ? 'text-accent-success' : 'text-accent-error'
            }`}>
            {submission.status}
          </span>
          <span className="text-xs text-text-tertiary">
            {submission.testCases?.passed} / {submission.testCases?.total} 个通过的测试用例
          </span>
        </div>
        <span className="text-xs text-text-disabled">
          {submission.time}
        </span>
      </div>

      {/* 运行时间和内存卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-tertiary border border-border-primary rounded-lg p-3">
          <div className="flex items-center gap-2 text-text-tertiary text-xs mb-2">
            <Clock className="w-3.5 h-3.5" />
            执行用时
          </div>
          <div className="text-2xl font-bold text-text-primary font-mono">
            {submission.runtime} <span className="text-sm text-text-disabled">ms</span>
          </div>

        </div>

        <div className="bg-surface-tertiary border border-border-primary rounded-lg p-3">
          <div className="flex items-center gap-2 text-text-tertiary text-xs mb-2">
            <Database className="w-3.5 h-3.5" />
            消耗内存
          </div>
          <div className="text-2xl font-bold text-text-primary font-mono">
            {submission.memory} <span className="text-sm text-text-disabled">MB</span>
          </div>

        </div>
      </div>

      {/* 时间和空间复杂度 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 时间复杂度 */}
        <div className="bg-surface-tertiary border border-border-primary rounded-lg p-4 overflow-hidden relative">
          <div className="text-xs font-medium text-purple-400 mb-3">时间复杂度</div>
          <div className="text-xl font-serif italic text-text-primary text-center mb-4">
            {submission.timeComplexity}
          </div>
          {/* 复杂度曲线动画 */}
          <div className="relative h-24 border-l-2 border-b-2 border-border-secondary">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
              {renderComplexityCurve(submission.timeComplexity)}
              <defs>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 空间复杂度 */}
        <div className="bg-surface-tertiary border border-border-primary rounded-lg p-4">
          <div className="text-xs font-medium text-blue-400 mb-3">空间复杂度</div>
          <div className="text-xl font-serif italic text-text-primary text-center">
            {submission.spaceComplexity}
          </div>
        </div>
      </div>

      {/* 代码区域 */}
      <div className="bg-surface-tertiary border border-border-primary rounded-lg overflow-hidden">
        <div
          className="px-3 py-2 bg-surface-elevated border-b border-border-primary flex items-center justify-between cursor-pointer hover:bg-surface-tertiary transition-colors"
          onClick={() => setIsCodeExpanded(!isCodeExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-primary">代码</span>
            <span className="text-[10px] text-text-disabled">{submission.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(submission.code);
              }}
              className="p-1 hover:bg-surface-tertiary rounded text-text-tertiary hover:text-text-primary transition-colors"
              title="复制代码"
            >
              <Copy className="w-3 h-3" />
            </button>
            <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${isCodeExpanded ? 'rotate-180' : ''
              }`} />
          </div>
        </div>
        {isCodeExpanded && (
          <pre className="p-3 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed bg-[#050509] max-h-80 overflow-y-auto">
            {submission.code}
          </pre>
        )}
      </div>
    </div>
  );
}
