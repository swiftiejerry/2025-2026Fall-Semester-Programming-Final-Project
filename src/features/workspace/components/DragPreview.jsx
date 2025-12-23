// 拖拽预览组件
import React from 'react';
import { FileText } from 'lucide-react';
import { VIEW_META } from '../config/viewConfig';

/**
 * 拖拽预览组件
 * 显示拖拽时的视觉反馈
 */
export function DragPreview({ draggedTab, dropTarget, previewRect }) {
  if (!draggedTab) return null;

  const meta = VIEW_META[draggedTab.tabId];
  const Icon = meta ? meta.icon : FileText;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* 预览矩形（分栏时显示） */}
      {previewRect && (
        <div
          className="absolute bg-blue-500/20 border-2 border-blue-400/60 rounded-lg transition-all duration-150"
          style={{
            left: `${previewRect.left}px`,
            top: `${previewRect.top}px`,
            width: `${previewRect.width}px`,
            height: `${previewRect.height}px`,
          }}
        />
      )}

      {/* 拖拽指示器 */}
      <div
        className="absolute flex items-center gap-2 px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm border border-blue-400/50 rounded-lg shadow-xl text-white text-sm"
        style={{
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Icon className="w-3.5 h-3.5 text-blue-200" />
        <span className="font-medium">{meta ? meta.title : draggedTab.tabId}</span>
        <span className="opacity-70 border-l border-white/20 pl-2 ml-1">
          {dropTarget?.type === 'tab'
            ? '插入导航栏'
            : dropTarget?.type === 'split'
              ? '分栏视图'
              : '拖动中...'}
        </span>
      </div>
    </div>
  );
}
