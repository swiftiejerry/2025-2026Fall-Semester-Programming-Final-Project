/**
 * Layout Store - 管理 IDE 布局系统
 * 实现可拖拽的多面板布局
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { LayoutNode, LeafNode, DragState, DropTarget, PreviewRect, DropPosition } from '../types';

// View IDs
export const VIEW_IDS = {
    PROBLEM: 'problem',
    SOLUTIONS: 'solutions',
    CODE: 'code',
    SUBMISSIONS: 'submissions',
    PERF_ANALYSIS: 'perf-analysis',
    NOTES: 'notes',
    GENERATOR: 'generator',
    CONSOLE: 'console',
} as const;

const createGroupId = () => `group-${Math.random().toString(36).slice(2, 8)}`;

// 默认布局配置
const getInitialLayout = (): LayoutNode => ({
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
            type: 'column',
            id: 'col-middle',
            size: 38,
            children: [
                {
                    type: 'leaf',
                    id: 'code-panel',
                    size: 65,
                    tabs: [VIEW_IDS.CODE],
                    activeTab: VIEW_IDS.CODE,
                    collapsed: false,
                },
                {
                    type: 'leaf',
                    id: 'console-panel-bottom',
                    size: 35,
                    tabs: [VIEW_IDS.CONSOLE],
                    activeTab: VIEW_IDS.CONSOLE,
                    collapsed: false,
                },
            ],
        },
        {
            type: 'leaf',
            id: 'col-right',
            size: 32,
            tabs: [VIEW_IDS.SUBMISSIONS, VIEW_IDS.GENERATOR, VIEW_IDS.PERF_ANALYSIS],
            activeTab: VIEW_IDS.SUBMISSIONS,
            collapsed: false,
        },
    ],
});

interface LayoutState {
    layout: LayoutNode;
    draggedTab: DragState | null;
    dropTarget: DropTarget | null;
    previewRect: PreviewRect | null;
    isResizing: boolean;

    // Actions
    setIsResizing: (isResizing: boolean) => void;
    setActiveTab: (leafId: string, tabId: string) => void;
    closeTab: (leafId: string, tabId: string) => void;
    addTab: (leafId: string, tabId: string) => void;
    toggleCollapse: (leafId: string) => void;
    setCollapsed: (leafId: string, collapsed: boolean) => void;

    // Drag & Drop
    startDrag: (tabId: string, fromColId: string) => void;
    updateDropTarget: (target: DropTarget | null, rect: PreviewRect | null) => void;
    endDrag: () => void;

    // Layout management
    resetLayout: () => void;
    focusTab: (tabId: string) => void;
    resizeNode: (nodeId: string, size: number) => void;
}

// Helper: 递归查找叶子节点
const findLeafById = (node: LayoutNode, leafId: string): LeafNode | null => {
    if (node.type === 'leaf' && node.id === leafId) {
        return node;
    }
    if ('children' in node) {
        for (const child of node.children) {
            const found = findLeafById(child, leafId);
            if (found) return found;
        }
    }
    return null;
};

// Helper: 根据 Tab ID 查找所属的叶子节点 ID
const findLeafByTabId = (node: LayoutNode, tabId: string): string | null => {
    if (node.type === 'leaf') {
        if (node.tabs.includes(tabId)) {
            return node.id;
        }
        return null;
    }
    if ('children' in node) {
        for (const child of node.children) {
            const foundId = findLeafByTabId(child, tabId);
            if (foundId) return foundId;
        }
    }
    return null;
};

// Helper: 递归更新叶子节点
const updateLeafInTree = (
    node: LayoutNode,
    leafId: string,
    updater: (leaf: LeafNode) => LeafNode
): LayoutNode => {
    if (node.type === 'leaf' && node.id === leafId) {
        return updater(node);
    }
    if ('children' in node) {
        return {
            ...node,
            children: node.children.map((child) => updateLeafInTree(child, leafId, updater)),
        };
    }
    return node;
};

// Helper: 插入新叶子节点
const insertLeafAt = (
    node: LayoutNode,
    targetLeafId: string,
    position: DropPosition,
    newLeaf: LeafNode
): LayoutNode => {
    if (node.type === 'leaf' && node.id === targetLeafId) {
        const isHorizontal = position === 'left' || position === 'right';
        const containerType = isHorizontal ? 'row' : 'column';

        const adjustedTarget: LeafNode = { ...node, size: 50 };
        const adjustedNew: LeafNode = { ...newLeaf, size: 50 };

        const children =
            position === 'left' || position === 'top'
                ? [adjustedNew, adjustedTarget]
                : [adjustedTarget, adjustedNew];

        return {
            id: createGroupId(),
            type: containerType,
            size: node.size,
            children,
        };
    }

    if ('children' in node) {
        return {
            ...node,
            children: node.children.map((child) =>
                insertLeafAt(child, targetLeafId, position, newLeaf)
            ),
        };
    }
    return node;
};

// Helper: 移除空叶子节点
const removeEmptyLeaves = (node: LayoutNode): LayoutNode | null => {
    if (node.type === 'leaf') {
        return node.tabs && node.tabs.length > 0 ? node : null;
    }

    if ('children' in node) {
        const filtered = node.children
            .map((child) => removeEmptyLeaves(child))
            .filter((child): child is LayoutNode => child !== null);

        if (filtered.length === 0) return null;
        if (filtered.length === 1) return filtered[0]!;
        return { ...node, children: filtered };
    }

    return node;
};

export const useLayoutStore = create<LayoutState>()(
    persist(
        immer((set) => ({
            layout: getInitialLayout(),
            draggedTab: null,
            dropTarget: null,
            previewRect: null,
            isResizing: false,

            setIsResizing: (isResizing: boolean) => {
                set((state) => {
                    state.isResizing = isResizing;
                });
            },

            setActiveTab: (leafId: string, tabId: string) => {
                set((state) => {
                    state.layout = updateLeafInTree(state.layout, leafId, (leaf) => ({
                        ...leaf,
                        activeTab: tabId,
                    })) as LayoutNode;
                });
            },

            closeTab: (leafId: string, tabId: string) => {
                set((state) => {
                    let newLayout = updateLeafInTree(state.layout, leafId, (leaf) => {
                        const newTabs = leaf.tabs.filter((t) => t !== tabId);
                        const newActiveTab = newTabs.includes(leaf.activeTab)
                            ? leaf.activeTab
                            : newTabs[0] || '';
                        return { ...leaf, tabs: newTabs, activeTab: newActiveTab };
                    });

                    const cleaned = removeEmptyLeaves(newLayout);
                    state.layout = cleaned || getInitialLayout();
                });
            },

            addTab: (leafId: string, tabId: string) => {
                set((state) => {
                    state.layout = updateLeafInTree(state.layout, leafId, (leaf) => ({
                        ...leaf,
                        tabs: leaf.tabs.includes(tabId) ? leaf.tabs : [...leaf.tabs, tabId],
                        activeTab: tabId,
                        collapsed: false,
                    })) as LayoutNode;
                });
            },

            toggleCollapse: (leafId: string) => {
                set((state) => {
                    state.layout = updateLeafInTree(state.layout, leafId, (leaf) => ({
                        ...leaf,
                        collapsed: !leaf.collapsed,
                    })) as LayoutNode;
                });
            },

            focusTab: (tabId: string) => {
                set((state) => {
                    const leafId = findLeafByTabId(state.layout, tabId);
                    if (leafId) {
                        state.layout = updateLeafInTree(state.layout, leafId, (leaf) => ({
                            ...leaf,
                            activeTab: tabId,
                            collapsed: false,
                        })) as LayoutNode;
                    }
                });
            },

            resizeNode: (nodeId: string, size: number) => {
                set((state) => {
                    const updateSize = (node: LayoutNode): LayoutNode => {
                        if (node.id === nodeId) {
                            return { ...node, size };
                        }
                        if ('children' in node) {
                            return {
                                ...node,
                                children: node.children.map(updateSize)
                            };
                        }
                        return node;
                    };
                    state.layout = updateSize(state.layout);
                });
            },

            setCollapsed: (leafId: string, collapsed: boolean) => {
                set((state) => {
                    state.layout = updateLeafInTree(state.layout, leafId, (leaf) => ({
                        ...leaf,
                        collapsed,
                    })) as LayoutNode;
                });
            },

            startDrag: (tabId: string, fromColId: string) => {
                set((state) => {
                    state.draggedTab = { tabId, fromColId };
                });
            },

            updateDropTarget: (target: DropTarget | null, rect: PreviewRect | null) => {
                set((state) => {
                    state.dropTarget = target;
                    state.previewRect = rect;
                });
            },

            endDrag: () => {
                set((state) => {
                    const { draggedTab, dropTarget } = state;

                    if (!draggedTab || !dropTarget) {
                        state.draggedTab = null;
                        state.dropTarget = null;
                        state.previewRect = null;
                        return;
                    }

                    // 从原位置移除 tab
                    let newLayout = updateLeafInTree(state.layout, draggedTab.fromColId, (leaf) => {
                        const newTabs = leaf.tabs.filter((t) => t !== draggedTab.tabId);
                        const newActiveTab = newTabs.includes(leaf.activeTab)
                            ? leaf.activeTab
                            : newTabs[0] || '';
                        return { ...leaf, tabs: newTabs, activeTab: newActiveTab };
                    });

                    if (dropTarget.type === 'tab') {
                        // 插入到现有标签页
                        newLayout = updateLeafInTree(newLayout, dropTarget.leafId, (leaf) => ({
                            ...leaf,
                            tabs: leaf.tabs.includes(draggedTab.tabId)
                                ? leaf.tabs
                                : [...leaf.tabs, draggedTab.tabId],
                            activeTab: draggedTab.tabId,
                        }));
                    } else if (dropTarget.type === 'split' && dropTarget.position) {
                        // 分栏
                        const newLeaf: LeafNode = {
                            type: 'leaf',
                            id: `leaf-${Date.now()}`,
                            size: 50,
                            tabs: [draggedTab.tabId],
                            activeTab: draggedTab.tabId,
                            collapsed: false,
                        };
                        newLayout = insertLeafAt(newLayout, dropTarget.leafId, dropTarget.position, newLeaf);
                    }

                    // 清理空叶子
                    const cleaned = removeEmptyLeaves(newLayout);
                    state.layout = cleaned || getInitialLayout();
                    state.draggedTab = null;
                    state.dropTarget = null;
                    state.previewRect = null;
                });
            },

            resetLayout: () => {
                set((state) => {
                    state.layout = getInitialLayout();
                });
            },
        })),
        {
            name: 'ide-layout-storage', // unique name
            partialize: (state) => ({ layout: state.layout }), // only persist layout
        }
    )
);
