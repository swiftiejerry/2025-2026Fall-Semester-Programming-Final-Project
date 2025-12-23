import React from 'react';
import { DIFFICULTY_STYLES } from '../workspace/config/viewConfig';

// 题目详情
export function Problem({ problem }) {
  if (!problem) {
    return <div className="p-4 text-text-tertiary">加载中...</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-4 text-sm leading-relaxed text-text-primary space-y-4">
      {/* 标题 */}
      <h2 className="text-lg font-semibold text-text-primary">
        {problem.number}. {problem.title}
      </h2>

      {/* 难度和标签 */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        {problem.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded text-xs bg-surface-tertiary text-text-secondary border border-border-secondary">
            {tag}
          </span>
        ))}
      </div>

      {/* 描述 */}
      <div className="space-y-4 text-text-secondary">
        {problem.description.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* 示例 */}
      <div className="space-y-2 mt-4">
        {problem.examples.map((ex, idx) => (
          <div key={idx} className="bg-surface-tertiary rounded-lg p-3 space-y-2 border border-border-secondary">
            <div className="text-xs font-medium text-text-secondary">
              示例 {idx + 1}：
            </div>
            <div className="pl-2 border-l-2 border-border-primary space-y-1 font-mono text-xs">
              <div>
                <span className="text-text-tertiary">输入：</span>
                <span className="text-text-secondary">{ex.input}</span>
              </div>
              <div>
                <span className="text-text-tertiary">输出：</span>
                <span className="text-text-secondary">{ex.output}</span>
              </div>
              {ex.explanation && (
                <div>
                  <span className="text-text-tertiary">解释：</span>
                  <span className="text-text-secondary">{ex.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
