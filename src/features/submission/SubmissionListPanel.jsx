import React from 'react';
import { List } from 'lucide-react';

// 提交记录列表
export function Submissions({ submissions = [], isSubmitting = false, onSelectSubmission }) {
  if (submissions.length === 0 && !isSubmitting) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-tertiary space-y-2">
        <div className="w-12 h-12 rounded-full bg-surface-tertiary flex items-center justify-center">
          <List className="w-6 h-6 opacity-50" />
        </div>
        <p className="text-xs">暂无提交记录</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 判题中提示 */}
      {isSubmitting && (
        <div className="flex items-center justify-between p-3 border-b border-border-secondary bg-accent-warning/5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-warning" />
            <span className="text-accent-warning font-medium text-sm">
              判题中...
            </span>
          </div>
          <span className="text-xs text-text-tertiary font-mono">-- ms</span>
        </div>
      )}

      {/* 提交记录列表 */}
      <div className="flex-1 overflow-y-auto">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            onClick={() => onSelectSubmission?.(sub)}
            className="flex items-center justify-between p-3 border-b border-border-secondary hover:bg-surface-tertiary transition-colors cursor-pointer group"
          >
            {/* 左侧：状态和时间 */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${sub.status === '通过'
                      ? 'text-accent-success'
                      : 'text-accent-error'
                    }`}
                >
                  {sub.status}
                </span>
                <span className="text-xs text-text-tertiary">
                  {sub.language}
                </span>
              </div>
              <span className="text-[10px] text-text-disabled">
                {sub.time}
              </span>
            </div>

            {/* 右侧：性能指标 */}
            <div className="flex items-center gap-4 text-right">
              <div className="flex flex-col gap-0.5">
                <div className="text-xs text-text-secondary font-mono">
                  {sub.runtime} ms
                </div>
                <div className="text-[10px] text-text-tertiary">
                  运行时间
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-xs text-text-secondary font-mono">
                  {sub.memory} MB
                </div>
                <div className="text-[10px] text-text-tertiary">内存</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
