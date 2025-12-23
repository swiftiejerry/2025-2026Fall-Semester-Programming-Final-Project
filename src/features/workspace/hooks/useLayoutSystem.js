// 布局管理器 - 管理布局树、拖拽、分栏等所有布局相关逻辑
import { useState, useCallback } from 'react';
import { VIEW_IDS } from '../config/viewConfig';

const createGroupId = () => `group-${Math.random().toString(36).slice(2, 8)}`;

// 默认布局配置
const getInitialLayout = () => ({
  id: 'root-group',
  type: 'row',
  size: 100,
  children: [
    {
      type: 'leaf',
      id: 'col-left',
      size: 30,
      tabs: [VIEW_IDS.PROBLEM, VIEW_IDS.SOLUTIONS],
      activeTab: VIEW_IDS.PROBLEM,
      collapsed: false,
    },
    {
      type: 'leaf',
      id: 'col-middle',
      size: 38,
      tabs: [VIEW_IDS.CODE],
      activeTab: VIEW_IDS.CODE,
      collapsed: false,
    },
    {
      type: 'leaf',
      id: 'col-right',
      size: 32,
      tabs: [VIEW_IDS.SUBMISSIONS, VIEW_IDS.PERF_ANALYSIS, VIEW_IDS.NOTES],
      activeTab: VIEW_IDS.SUBMISSIONS,
      collapsed: false,
    },
  ],
});

/**
 * 布局系统 Hook (Layout System)
 * 管理所有布局相关的状态和操作 (Layout Core)
 */
export function useLayoutSystem() {
  const [layout, setLayout] = useState(getInitialLayout());
  const [draggedTab, setDraggedTab] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [previewRect, setPreviewRect] = useState(null);

  // 在树中查找叶子节点
  const findLeafById = useCallback((node, leafId) => {
    if (node.type === 'leaf' && node.id === leafId) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findLeafById(child, leafId);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // 更新树中的叶子节点
  const updateLeafInTree = useCallback((node, leafId, updater) => {
    if (node.type === 'leaf' && node.id === leafId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateLeafInTree(child, leafId, updater)),
      };
    }
    return node;
  }, []);

  // 更新任意节点
  const updateNodeInTree = useCallback((node, targetId, updater) => {
    if (!node) return node;
    if (node.id === targetId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeInTree(child, targetId, updater)),
      };
    }
    return node;
  }, []);

  // 插入新叶子节点
  const insertLeafAt = useCallback((node, targetLeafId, position, newLeaf) => {
    if (node.type === 'leaf' && node.id === targetLeafId) {
      const isHorizontal = position === 'left' || position === 'right';
      const containerType = isHorizontal ? 'row' : 'column';

      const adjustedTarget = { ...node, size: 50 };
      const adjustedNew = { ...newLeaf, size: 50 };

      const children = position === 'left' || position === 'top'
        ? [adjustedNew, adjustedTarget]
        : [adjustedTarget, adjustedNew];

      return {
        id: createGroupId(),
        type: containerType,
        size: node.size,
        children,
      };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => insertLeafAt(child, targetLeafId, position, newLeaf)),
      };
    }
    return node;
  }, []);

  // 移除空叶子节点
  const removeEmptyLeaves = useCallback((node) => {
    if (node.type === 'leaf') {
      return node.tabs && node.tabs.length > 0 ? node : null;
    }

    if (node.children) {
      const filtered = node.children
        .map(child => removeEmptyLeaves(child))
        .filter(child => child !== null);

      if (filtered.length === 0) return null;
      if (filtered.length === 1) return filtered[0];

      return { ...node, children: filtered };
    }

    return node;
  }, []);

  // Tab拖拽开始
  const handleTabDragStart = useCallback((e, tabId, fromColId) => {
    setDraggedTab({ tabId, fromColId });
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }, []);

  // Tab拖拽经过
  const handleTabDragOver = useCallback((e, leafId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTab) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const threshold = 80;
    let position = null;

    if (x < threshold) position = 'left';
    else if (x > rect.width - threshold) position = 'right';
    else if (y < threshold) position = 'top';
    else if (y > rect.height - threshold) position = 'bottom';

    if (position) {
      setDropTarget({ type: 'split', leafId, position });
      const previewRectData = getPreviewRect(rect, position);
      setPreviewRect(previewRectData);
    } else {
      setDropTarget({ type: 'tab', leafId });
      setPreviewRect(null);
    }
  }, [draggedTab]);

  // 计算预览矩形
  const getPreviewRect = (rect, position) => {
    const margin = 4;
    switch (position) {
      case 'left':
        return { left: margin, top: margin, width: rect.width / 2 - margin, height: rect.height - 2 * margin };
      case 'right':
        return { left: rect.width / 2, top: margin, width: rect.width / 2 - margin, height: rect.height - 2 * margin };
      case 'top':
        return { left: margin, top: margin, width: rect.width - 2 * margin, height: rect.height / 2 - margin };
      case 'bottom':
        return { left: margin, top: rect.height / 2, width: rect.width - 2 * margin, height: rect.height / 2 - margin };
      default:
        return null;
    }
  };

  // Tab放置
  const handleTabDrop = useCallback(() => {
    if (!draggedTab || !dropTarget) {
      setDraggedTab(null);
      setPreviewRect(null);
      setDropTarget(null);
      return;
    }

    if (!draggedTab.tabId || !draggedTab.fromColId) {
      console.warn('[handleTabDrop] Invalid draggedTab:', draggedTab);
      setDraggedTab(null);
      setPreviewRect(null);
      setDropTarget(null);
      return;
    }

    setLayout(prev => {
      let newTree = { ...prev };

      // 从原位置移除tab
      newTree = updateLeafInTree(newTree, draggedTab.fromColId, (leaf) => {
        const newTabs = leaf.tabs.filter(t => t !== draggedTab.tabId);
        const newActiveTab = newTabs.includes(leaf.activeTab) ? leaf.activeTab : newTabs[0] || null;
        return { ...leaf, tabs: newTabs, activeTab: newActiveTab };
      });

      if (dropTarget.type === 'tab') {
        // 插入到现有标签页
        newTree = updateLeafInTree(newTree, dropTarget.leafId, (leaf) => ({
          ...leaf,
          tabs: leaf.tabs.includes(draggedTab.tabId) ? leaf.tabs : [...leaf.tabs, draggedTab.tabId],
          activeTab: draggedTab.tabId,
        }));
      } else if (dropTarget.type === 'split') {
        // 分栏
        const { leafId, position } = dropTarget;

        if (!['left', 'right', 'top', 'bottom'].includes(position)) {
          console.error('[handleTabDrop] Invalid position:', position);
          return prev;
        }

        const newLeafId = `leaf-${Date.now()}`;
        const newLeaf = {
          type: 'leaf',
          id: newLeafId,
          tabs: [draggedTab.tabId],
          activeTab: draggedTab.tabId,
          collapsed: false,
        };

        newTree = insertLeafAt(newTree, leafId, position, newLeaf);
      }

      // 清理空叶子
      const cleaned = removeEmptyLeaves(newTree);
      return cleaned || getInitialLayout();
    });

    setDraggedTab(null);
    setPreviewRect(null);
    setDropTarget(null);
  }, [draggedTab, dropTarget, updateLeafInTree, insertLeafAt, removeEmptyLeaves]);

  // 切换面板折叠状态
  const toggleCollapse = useCallback((leafId) => {
    setLayout(prev => updateLeafInTree(prev, leafId, (leaf) => ({
      ...leaf,
      collapsed: !leaf.collapsed,
    })));
  }, [updateLeafInTree]);

  // 关闭标签页
  const closeTab = useCallback((leafId, tabId) => {
    setLayout(prev => {
      let newTree = updateLeafInTree(prev, leafId, (leaf) => {
        const newTabs = leaf.tabs.filter(t => t !== tabId);
        const newActiveTab = newTabs.includes(leaf.activeTab)
          ? leaf.activeTab
          : newTabs[0] || null;
        return { ...leaf, tabs: newTabs, activeTab: newActiveTab };
      });

      const cleaned = removeEmptyLeaves(newTree);
      return cleaned || getInitialLayout();
    });
  }, [updateLeafInTree, removeEmptyLeaves]);

  // 切换活动标签页
  const setActiveTab = useCallback((leafId, tabId) => {
    setLayout(prev => updateLeafInTree(prev, leafId, (leaf) => ({
      ...leaf,
      activeTab: tabId,
    })));
  }, [updateLeafInTree]);

  // 添加标签页
  const addTab = useCallback((leafId, tabId) => {
    setLayout(prev => updateLeafInTree(prev, leafId, (leaf) => ({
      ...leaf,
      tabs: leaf.tabs.includes(tabId) ? leaf.tabs : [...leaf.tabs, tabId],
      activeTab: tabId,
      collapsed: false,
    })));
  }, [updateLeafInTree]);

  const handlePanelResize = useCallback((nodeId, size) => {
    setLayout(prev => updateNodeInTree(prev, nodeId, (node) => ({
      ...node,
      size,
    })));
  }, [updateNodeInTree]);

  return {
    layout,
    setLayout,
    draggedTab,
    dropTarget,
    previewRect,
    findLeafById,
    updateLeafInTree,
    updateNodeInTree,
    handleTabDragStart,
    handleTabDragOver,
    handleTabDrop,
    toggleCollapse,
    closeTab,
    setActiveTab,
    addTab,
    handlePanelResize,
    resetLayout: () => setLayout(getInitialLayout()),
  };
}
