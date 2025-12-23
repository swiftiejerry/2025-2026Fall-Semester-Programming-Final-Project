// 全屏覆盖层组件
import React from 'react';
import { Minimize2, FileText } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { PanelRenderer } from './PanelRenderer';
import { VIEW_IDS, VIEW_META } from '../config/viewConfig';

/**
 * 全屏覆盖层组件
 * 用于全屏显示某个视图
 */
export function FullscreenOverlay({ viewId, onExit, isAnimating, onRunPerfTest, onClearPerfResults }) {
  const workspace = useWorkspace();
  const meta = VIEW_META[viewId];
  const Icon = meta ? meta.icon : FileText;

  // 如果没有 animationStyle，使用默认的全屏样式
  const defaultStyle = {
    top: '0px',
    left: '0px',
    width: '100vw',
    height: '100vh',
  };

  return (
    <div
      style={workspace.animationStyle || defaultStyle}
      className={`fixed z-[100] bg-[#0a0a12] flex flex-col overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${viewId ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
    >
      {/* 全屏头部 */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-black/60 backdrop-blur">
        <div className="flex items-center gap-3 text-zinc-300">
          <Icon className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">{meta ? meta.title : '全屏模式'}</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          {/* 如果是代码编辑器，显示语言切换 */}
          {viewId === VIEW_IDS.CODE && (
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={() => workspace.setLang('python')}
                className={`px-2.5 py-1 rounded text-xs ${workspace.lang === 'python'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10'
                  }`}
              >
                Python
              </button>
              <button
                onClick={() => workspace.setLang('cpp')}
                className={`px-2.5 py-1 rounded text-xs ${workspace.lang === 'cpp'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10'
                  }`}
              >
                C++
              </button>
            </div>
          )}

          <button
            onClick={onExit}
            className="px-2 py-1 rounded hover:bg-white/5 flex items-center gap-1 text-xs"
            title="退出全屏"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>退出全屏</span>
          </button>
        </div>
      </div>

      {/* 全屏内容 */}
      <div className="flex-1 relative bg-[#0a0a12] overflow-hidden">
        <PanelRenderer
          viewId={viewId}
          onRunPerfTest={onRunPerfTest}
          onClearPerfResults={onClearPerfResults}
        />
      </div>

      {/* 如果是代码编辑器，显示底栏 */}
      {viewId === VIEW_IDS.CODE && (
        <div className="h-12 border-t border-white/10 flex items-center justify-between px-4 text-xs bg-black/60">
          <div className="text-zinc-500">按 ESC 退出全屏</div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-200">
              运行
            </button>
            <button
              className={`px-4 py-1.5 rounded text-white font-semibold transition-colors ${workspace.isSubmitting
                ? 'bg-yellow-600 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              onClick={workspace.handleSubmit}
              disabled={workspace.isSubmitting}
            >
              {workspace.isSubmitting ? '判题中...' : '提交'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
