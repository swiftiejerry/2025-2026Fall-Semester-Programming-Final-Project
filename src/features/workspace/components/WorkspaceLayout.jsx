// Workspace 主布局组件
import React, { useState } from 'react';
import {
  Menu, ChevronLeft, ChevronRight, ChevronDown,
  Maximize2, X, FileText, Code, List, Shuffle, Repeat2
} from 'lucide-react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useWorkspace } from '../context/WorkspaceContext';
import { PanelRenderer } from './PanelRenderer';
import { VIEW_IDS, VIEW_META, DIFFICULTY_STYLES } from '../config/viewConfig';

/**
 * Workspace 主布局组件
 * 负责渲染整个工作区布局
 */
export function WorkspaceLayout({
  onOpenDrawer,
  onEnterFullscreen,
  onRunPerfTest,
  onClearPerfResults
}) {
  const workspace = useWorkspace();
  const [mode, setMode] = useState('sequence'); // 'sequence' | 'random'

  // 随机题目
  const handleRandom = () => {
    if (mode === 'sequence') {
      setMode('random');
      // 随机选一题
      const randomIndex = Math.floor(Math.random() * workspace.problemList.length);
      workspace.setCurrentId(workspace.problemList[randomIndex].id);
    } else {
      setMode('sequence');
    }
  };

  // 渲染单个面板（叶子节点）
  const renderLeaf = (leaf) => {
    if (!leaf || !leaf.tabs || leaf.tabs.length === 0) return null;

    const activeTab = leaf.activeTab || leaf.tabs[0];

    return (
      <div
        id={leaf.id}
        style={{
          minWidth: leaf.collapsed ? '40px' : '200px',
        }}
        className="flex flex-col h-full border-r border-white/10 bg-[#050509] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative"
        onDragOver={(e) => !leaf.collapsed && workspace.handleTabDragOver(e, leaf.id)}
        onDrop={workspace.handleTabDrop}
      >
        {/* 列头部 (Tabs) */}
        <div
          className={`flex-shrink-0 border-b border-white/10 bg-black/40 ${leaf.collapsed ? 'writing-mode-vertical' : ''
            }`}
        >
          {leaf.collapsed ? (
            // 折叠状态：垂直显示
            <div className="flex flex-col">
              {leaf.tabs.map((tabId) => {
                const meta = VIEW_META[tabId];
                const Icon = meta ? meta.icon : FileText;
                return (
                  <button
                    key={tabId}
                    onClick={() => workspace.toggleCollapse(leaf.id)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors border-b border-white/5"
                    title={meta ? meta.title : tabId}
                  >
                    <Icon className="w-4 h-4 text-zinc-400" />
                  </button>
                );
              })}
            </div>
          ) : (
            // 展开状态：水平标签栏
            <div className="flex items-center px-1 py-1">
              <div className="flex-1 flex items-center gap-0.5 min-w-0">
                {leaf.tabs.map((tabId) => {
                  const meta = VIEW_META[tabId];
                  const Icon = meta ? meta.icon : FileText;
                  const isActive = activeTab === tabId;

                  return (
                    <div
                      key={tabId}
                      data-tab-id={tabId}
                      draggable
                      onDragStart={(e) => workspace.handleTabDragStart(e, tabId, leaf.id)}
                      onClick={() => workspace.setActiveTab(leaf.id, tabId)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer transition-all duration-200 ${isActive
                        ? 'bg-blue-500/20 text-blue-300 shadow-sm'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {meta ? meta.title : tabId}
                      </span>

                      {/* 关闭按钮 */}
                      {leaf.tabs.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            workspace.closeTab(leaf.id, tabId);
                          }}
                          className="ml-1 p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 折叠/展开按钮 */}
              <button
                onClick={() => workspace.toggleCollapse(leaf.id)}
                className="ml-2 p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="折叠面板"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 列内容区 */}
        {!leaf.collapsed && (
          <div className="flex-1 relative overflow-hidden">
            {/* Tab 内容 */}
            <div className="absolute inset-0">
              {/* Tab Actions */}
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <button
                  onClick={() => {
                    const panelElement = document.getElementById(leaf.id);
                    if (panelElement) {
                      onEnterFullscreen(activeTab, leaf.id, panelElement);
                    }
                  }}
                  className="p-1.5 rounded bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
                  title="全屏查看"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 渲染内容 */}
              <PanelRenderer
                viewId={activeTab}
                onRunPerfTest={onRunPerfTest}
                onClearPerfResults={onClearPerfResults}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // 递归渲染布局树
  const renderLayoutTree = (node) => {
    if (!node) return null;

    if (node.type === 'leaf') {
      return renderLeaf(node);
    }

    if (node.type === 'row' || node.type === 'column') {
      const childElements = [];
      const direction = node.type === 'row' ? 'horizontal' : 'vertical';

      node.children?.forEach((child, index) => {
        childElements.push(
          <Panel
            key={`panel-${child.id || index}`}
            id={`${child.id}-panel`}
            defaultSize={child.size}
            minSize={child.collapsed ? 8 : 15}
            className="flex flex-col min-h-0"
            onResize={(size) => child.id && workspace.handlePanelResize(child.id, size)}
          >
            {child.type === 'leaf' ? renderLeaf(child) : renderLayoutTree(child)}
          </Panel>
        );

        if (index < (node.children?.length || 0) - 1) {
          childElements.push(
            <PanelResizeHandle
              key={`handle-${child.id || index}`}
              className="bg-white/5 hover:bg-white/20 transition-colors data-[panel-group-direction=horizontal]:w-1 data-[panel-group-direction=horizontal]:cursor-col-resize data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize"
            />
          );
        }
      });

      return (
        <PanelGroup
          key={node.id}
          id={node.id}
          direction={direction}
          autoSaveId={`workspace-${node.id}`}
          className="flex-1 min-h-0"
        >
          {childElements}
        </PanelGroup>
      );
    }

    return null;
  };

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="h-12 border-b border-white/10 bg-black/60 backdrop-blur flex items-center px-3 z-20 relative">
        {/* 左侧：Logo + 题目控制 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Code className="w-4 h-4 text-black" />
            </div>
            <span className="tracking-tight">Algo Workspace</span>
          </div>

          <div className="h-6 w-px bg-white/15" />

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={onOpenDrawer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/85 border border-white/10 transition-colors"
            >
              <List className="w-3.5 h-3.5" />
              <span>题库</span>
            </button>

            <div className="flex items-center ml-1 rounded border border-white/10 bg-white/5 overflow-hidden">
              <button
                onClick={() => {
                  const prevIndex = workspace.currentIndex - 1;
                  if (prevIndex >= 0) {
                    workspace.setCurrentId(workspace.problemList[prevIndex].id);
                  }
                }}
                disabled={workspace.currentIndex === 0}
                className="px-1.5 py-1 hover:bg-white/10 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
                title="上一题"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => {
                  const nextIndex = workspace.currentIndex + 1;
                  if (nextIndex < workspace.problemList.length) {
                    workspace.setCurrentId(workspace.problemList[nextIndex].id);
                  }
                }}
                disabled={workspace.currentIndex === workspace.problemList.length - 1}
                className="px-1.5 py-1 hover:bg-white/10 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
                title="下一题"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleRandom}
              className={`ml-1 px-1.5 py-1 rounded border text-white/85 flex items-center gap-1 transition-colors ${mode === 'random'
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              title="随机一题 / 顺序模式切换"
            >
              {mode === 'random' ? (
                <Shuffle className="w-3.5 h-3.5" />
              ) : (
                <Repeat2 className="w-3.5 h-3.5" />
              )}
              <span>{mode === 'random' ? '随机' : '顺序'}</span>
            </button>
          </div>
        </div>

        {/* 中间：功能键（绝对居中） */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {/* 运行并提交 */}
          <button
            onClick={workspace.handleSubmit}
            disabled={workspace.isSubmitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${workspace.isSubmitting
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 cursor-wait'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              }`}
            title="运行并提交"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            <span className="text-xs">{workspace.isSubmitting ? '判题中' : '提交'}</span>
          </button>

          <div className="h-6 w-px bg-white/15" />

          {/* 笔记 */}
          <button
            onClick={() => {
              workspace.addTab('col-right', VIEW_IDS.NOTES);
            }}
            className="p-2 rounded-lg border transition-colors bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
            title="笔记"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </button>
        </div>

        {/* 右侧：当前题目状态 */}
        <div className="ml-auto flex items-center gap-3 text-xs text-zinc-400">
          <span>
            {workspace.current?.number}. {workspace.current?.title}
          </span>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex overflow-hidden relative">
        {renderLayoutTree(workspace.layout)}
      </main>
    </>
  );
}
