import React from 'react';

// 题解展示
export function Solutions({ solutions = [], onApplySolution }) {
  const handleCopy = (code, e) => {
    navigator.clipboard.writeText(code);
    const btn = e.currentTarget;
    const oldText = btn.textContent;
    btn.textContent = '已复制!';
    btn.classList.add('text-emerald-400');
    setTimeout(() => {
      btn.textContent = oldText;
      btn.classList.remove('text-emerald-400');
    }, 1500);
  };

  if (!solutions || solutions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary">
        <p className="text-sm">暂无题解</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {solutions.map((sol, idx) => (
        <div
          key={idx}
          className="border border-border-primary rounded-lg bg-surface-tertiary overflow-hidden"
        >
          {/* 题解标题和复杂度 */}
          <div className="px-3 py-2 bg-surface-elevated border-b border-border-primary flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">
              {sol.name}
            </h3>
            <span className="text-xs font-mono text-accent-success bg-accent-success/20 px-2 py-0.5 rounded border border-accent-success/40">
              {sol.complexity}
            </span>
          </div>

          <div className="p-3 space-y-3">
            {/* Python 代码 */}
            {sol.pyCode && (
              <div className="space-y-1.5">
                <div className="text-sm font-semibold text-blue-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Python
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onApplySolution?.('python', sol.pyCode)}
                      className="text-xs px-2.5 py-0.5 rounded bg-blue-500/40 hover:bg-blue-500/60 text-blue-50 font-medium shadow-sm transition-colors"
                    >
                      写入代码
                    </button>
                    <button
                      onClick={(e) => handleCopy(sol.pyCode, e)}
                      className="text-xs px-2.5 py-0.5 rounded bg-surface-elevated hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <pre className="bg-[#050509] border border-border-primary rounded-lg p-3 text-[13px] font-mono text-text-primary overflow-x-auto leading-relaxed">
                  {sol.pyCode}
                </pre>
              </div>
            )}

            {/* C++ 代码 */}
            {sol.cppCode && (
              <div className="space-y-1.5">
                <div className="text-sm font-semibold text-purple-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    C++
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onApplySolution?.('cpp', sol.cppCode)}
                      className="text-xs px-2.5 py-0.5 rounded bg-purple-500/40 hover:bg-purple-500/60 text-purple-50 font-medium shadow-sm transition-colors"
                    >
                      写入代码
                    </button>
                    <button
                      onClick={(e) => handleCopy(sol.cppCode, e)}
                      className="text-xs px-2.5 py-0.5 rounded bg-surface-elevated hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <pre className="bg-[#050509] border border-border-primary rounded-lg p-3 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed">
                  {sol.cppCode}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
