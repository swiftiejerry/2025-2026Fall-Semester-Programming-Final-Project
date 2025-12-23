import React, { useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { useFullscreenMode } from './hooks/useFullscreenMode';
import { usePerformanceTest } from '../performance/hooks/usePerformanceTest';
import { ProblemDrawer } from '../problem/components/ProblemDrawer';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { FullscreenOverlay } from './components/FullscreenOverlay';
import { DragPreview } from './components/DragPreview';

// 背景渐变
function BackgroundLayer() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-black to-slate-900">
      <div className="absolute -top-40 -left-40 w-[45vw] h-[45vw] bg-purple-700/25 blur-3xl rounded-full" />
      <div className="absolute bottom-[-30vh] right-[-20vw] w-[50vw] h-[50vw] bg-blue-600/25 blur-3xl rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[32vw] h-[32vw] bg-emerald-500/10 blur-3xl rounded-full" />
    </div>
  );
}

/**
 * Workspace 主容器
 */
function WorkspaceContainer() {
  const ws = useWorkspace();

  // 全屏模式
  const { enterFullscreen, exitFullscreen } = useFullscreenMode(
    ws.fullscreenState,
    ws.setFullscreenState,
    ws.setIsAnimating,
    ws.setAnimationStyle
  );

  // 性能测试 - 直接传 perf state 对象
  const { handleRunPerfTest: runPerfTest, handleClearPerfResults: clearPerfResults } = usePerformanceTest(
    ws.perf,
    ws.updatePerf
  );

  const handleRunPerfTest = (params) => {
    const { algorithms, sizes, repeats } = params;
    return runPerfTest(ws.currentId, algorithms, sizes, repeats);
  };

  const handleClearPerfResults = () => {
    return clearPerfResults(ws.currentId);
  };

  // ESC 退出
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && ws.fullscreenState) {
        exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [ws.fullscreenState, exitFullscreen]);

  return (
    <div className="h-screen w-screen overflow-hidden text-white flex flex-col relative">
      <BackgroundLayer />

      {/* 遮罩层 */}
      {ws.isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={() => ws.setIsDrawerOpen(false)}
        />
      )}

      {/* 题库抽屉 */}
      <ProblemDrawer
        isOpen={ws.isDrawerOpen}
        onClose={() => ws.setIsDrawerOpen(false)}
        problemList={ws.problemList}
        currentId={ws.currentId}
        onSelectProblem={(id) => {
          ws.setCurrentId(id);
          ws.setIsDrawerOpen(false);
        }}
      />

      {/* 主布局 */}
      <WorkspaceLayout
        onOpenDrawer={() => ws.setIsDrawerOpen(true)}
        onEnterFullscreen={enterFullscreen}
        onRunPerfTest={handleRunPerfTest}
        onClearPerfResults={handleClearPerfResults}
      />

      {/* 全屏遮罩 */}
      {ws.fullscreenState && !ws.isAnimating && (
        <div className="fixed inset-0 bg-[#0a0a12] z-[90]" />
      )}

      {/* 全屏覆盖层 */}
      {ws.fullscreenState && (
        <FullscreenOverlay
          viewId={ws.fullscreenState.viewId}
          onExit={exitFullscreen}
          isAnimating={ws.isAnimating}
          onRunPerfTest={handleRunPerfTest}
          onClearPerfResults={handleClearPerfResults}
        />
      )}

      {/* 拖拽预览 */}
      {ws.draggedTab && (
        <DragPreview
          draggedTab={ws.draggedTab}
          dropTarget={ws.dropTarget}
          previewRect={ws.previewRect}
        />
      )}
    </div>
  );
}

export default function WorkspaceApp() {
  return (
    <WorkspaceProvider>
      <WorkspaceContainer />
    </WorkspaceProvider>
  );
}
