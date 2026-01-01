import React, { useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { X, Maximize2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLayoutStore, VIEW_IDS, useWorkspaceStore } from '../../../stores';
import { PanelRenderer } from './PanelRenderer';
import { LayoutNode, LeafNode } from '../../../types';
import { Code2, BookOpen, BarChart2, List, Terminal, Lightbulb } from 'lucide-react';

const TAB_CONFIG: Record<string, { icon: React.ReactNode, label: string }> = {
    [VIEW_IDS.PROBLEM]: { icon: <BookOpen className="w-3.5 h-3.5" />, label: '题目描述' },
    [VIEW_IDS.CODE]: { icon: <Code2 className="w-3.5 h-3.5" />, label: '代码编辑' },
    [VIEW_IDS.SOLUTIONS]: { icon: <Lightbulb className="w-3.5 h-3.5" />, label: '题解' },
    [VIEW_IDS.SUBMISSIONS]: { icon: <List className="w-3.5 h-3.5" />, label: '提交记录' },
    [VIEW_IDS.PERF_ANALYSIS]: { icon: <BarChart2 className="w-3.5 h-3.5" />, label: '性能分析' },
    [VIEW_IDS.GENERATOR]: { icon: <Terminal className="w-3.5 h-3.5" />, label: '生成器' },
    [VIEW_IDS.CONSOLE]: { icon: <Terminal className="w-3.5 h-3.5" />, label: '控制台' },
};

// LeetCode 风格的折叠侧边栏
const CollapsedSidebar: React.FC<{
    node: LeafNode;
    onExpand: () => void;
    parentDirection?: 'row' | 'column';
}> = ({ node, onExpand, parentDirection = 'row' }) => {
    const setActiveTab = useLayoutStore((s) => s.setActiveTab);
    const isColumn = parentDirection === 'column';
    const isEndPanel = node.id.includes('right') || node.id.includes('bottom');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
                h-full w-full theme-bg-elevated flex 
                ${isColumn ? 'flex-row items-center px-2 py-1 border-t border-slate-800' : 'flex-col items-center py-2 border-r border-slate-800'}
            `}
        >
            <div className={`flex ${isColumn ? 'flex-row gap-4 h-full items-center flex-1 overflow-x-auto' : 'flex-col gap-2 w-full items-center'}`}>
                {node.tabs.map((tabId) => {
                    const conf = TAB_CONFIG[tabId] || { icon: <div />, label: tabId };
                    const isActive = node.activeTab === tabId;

                    return (
                        <button
                            key={tabId}
                            onClick={() => {
                                setActiveTab(node.id, tabId);
                                onExpand();
                            }}
                            className={`
                                group relative flex items-center gap-2 
                                transition-all hover:bg-slate-800/50 rounded
                                ${isColumn
                                    ? 'px-3 py-1.5 flex-row'
                                    : 'py-3 px-1 flex-col w-full'
                                }
                                ${isActive ? 'text-emerald-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'}
                            `}
                            title={conf.label}
                        >
                            <span className="text-lg">{conf.icon}</span>
                            <span
                                className="text-[10px] font-medium whitespace-nowrap"
                                style={isColumn ? {} : {
                                    writingMode: 'vertical-rl',
                                    textOrientation: 'mixed',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {conf.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId={`active-indicator-${node.id}`}
                                    className={`absolute bg-emerald-500 ${isColumn ? 'bottom-0 left-0 right-0 h-0.5' : 'left-0 top-0 bottom-0 w-0.5'}`}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 展开按钮 - 箭头指向展开方向 */}
            <div className={`
                flex justify-center flex-none
                ${isColumn ? 'ml-auto pl-2 border-l border-slate-800' : 'mt-auto pt-2 border-t border-slate-800 w-full'}
            `}>
                <button
                    onClick={onExpand}
                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    title="展开面板"
                >
                    {/* 根据布局方向和面板位置选择箭头 */}
                    {(() => {
                        if (isColumn) {
                            // 垂直布局
                            return isEndPanel
                                ? <ChevronUp className="w-4 h-4" />
                                : <ChevronDown className="w-4 h-4" />;
                        } else {
                            // 水平布局
                            return isEndPanel
                                ? <ChevronLeft className="w-4 h-4" />
                                : <ChevronRight className="w-4 h-4" />;
                        }
                    })()}
                </button>
            </div>
        </motion.div>
    );
};

const LeafContent: React.FC<{
    node: LeafNode;
    parentDirection?: 'row' | 'column';
    onToggleCollapse: () => void;
}> = ({ node, parentDirection = 'row', onToggleCollapse }) => {
    const isCollapsed = node.collapsed;
    const panelElRef = useRef<HTMLDivElement>(null);

    const handleExpand = () => {
        onToggleCollapse(); // Re-expand
    };

    return (
        <div ref={panelElRef} className="h-full w-full relative overflow-hidden">
            {/* 折叠状态 - 侧边栏 */}
            <div
                className={`absolute inset-0 transition-opacity duration-200 ${isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <CollapsedSidebar
                    node={node}
                    onExpand={handleExpand}
                    parentDirection={parentDirection}
                />
            </div>

            {/* 展开状态 - 完整内容 */}
            <div
                className={`h-full w-full transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                    }`}
            >
                <LeafNodeRenderer
                    node={node}
                    onToggleCollapse={onToggleCollapse}
                    panelElRef={panelElRef}
                    parentDirection={parentDirection}
                />
            </div>
        </div>
    );
};

const ResizeHandle = ({ direction }: { direction: 'row' | 'column' }) => {
    const setIsResizing = useLayoutStore((s) => s.setIsResizing);

    return (
        <PanelResizeHandle
            onDragging={setIsResizing}
            className={`
        group flex items-center justify-center theme-bg-tertiary transition-all z-10
        ${direction === 'row' ? 'w-1 cursor-col-resize hover:bg-emerald-500/20' : 'h-1 cursor-row-resize hover:bg-emerald-500/20'}
    `}>
            <div className={`theme-bg-panel group-hover:bg-emerald-400 rounded-full transition-all ${direction === 'row' ? 'h-6 w-0.5' : 'w-6 h-0.5'}`} />
        </PanelResizeHandle>
    );
};

const LeafNodeRenderer: React.FC<{
    node: LeafNode;
    onToggleCollapse: () => void;
    panelElRef: React.RefObject<HTMLDivElement | null>;
    parentDirection?: 'row' | 'column';
}> = ({ node, onToggleCollapse, panelElRef, parentDirection = 'row' }) => {
    const {
        setActiveTab,
        closeTab,
        startDrag,
        endDrag,
        updateDropTarget,
        draggedTab
    } = useLayoutStore();

    const { setFullscreenViewId, setFullscreenOrigin } = useWorkspaceStore();
    const tabBarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent, tabId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        startDrag(tabId, node.id);
    };

    // Tab bar drop zone - always merge
    const handleTabBarDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedTab) return;

        const rect = e.currentTarget.getBoundingClientRect();
        updateDropTarget(
            { type: 'tab', leafId: node.id },
            { left: rect.left, top: rect.top, width: rect.width, height: rect.height + 100 }
        );
    };

    // Content area - split zones at edges, merge in center
    const handleContentDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedTab) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        // Edge detection (20% for split)
        let position: 'left' | 'right' | 'top' | 'bottom' | undefined;
        const edgeThreshold = 0.2;

        if (x < w * edgeThreshold) position = 'left';
        else if (x > w * (1 - edgeThreshold)) position = 'right';
        else if (y < h * edgeThreshold) position = 'top';
        else if (y > h * (1 - edgeThreshold)) position = 'bottom';

        const previewRect = { left: rect.left, top: rect.top, width: w, height: h };

        if (position) {
            // Split preview
            if (position === 'left') previewRect.width = w * 0.5;
            if (position === 'right') { previewRect.left += w * 0.5; previewRect.width = w * 0.5; }
            if (position === 'top') previewRect.height = h * 0.5;
            if (position === 'bottom') { previewRect.top += h * 0.5; previewRect.height = h * 0.5; }
            updateDropTarget({ type: 'split', leafId: node.id, position }, previewRect);
        } else {
            // Center = merge into this panel
            updateDropTarget({ type: 'tab', leafId: node.id }, previewRect);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        endDrag();
    };

    const isDragOver = draggedTab && draggedTab.fromColId !== node.id;

    const handleWheel = (e: React.WheelEvent) => {
        if (tabBarRef.current) {
            // 将垂直滚动转换为水平滚动
            tabBarRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className="h-full w-full flex flex-col theme-bg-elevated overflow-hidden">
            {/* Tab Header */}
            <div
                ref={tabBarRef}
                className={`flex items-center theme-bg-panel border-b theme-border h-9 shrink-0 select-none transition-colors overflow-x-auto no-scrollbar ${isDragOver ? 'bg-emerald-900/20' : ''}`}
                onDragOver={handleTabBarDragOver}
                onDrop={handleDrop}
                onWheel={handleWheel}
            >
                <div className="flex px-1 h-full relative">
                    {node.tabs.map((tabId) => {
                        const isActive = node.activeTab === tabId;
                        const conf = TAB_CONFIG[tabId] || { icon: <div />, label: tabId };
                        return (
                            <div
                                key={tabId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, tabId)}
                                onClick={() => setActiveTab(node.id, tabId)}
                                className={`
                                    group relative flex items-center gap-2 px-3 h-full text-xs cursor-pointer select-none transition-colors z-10
                                    ${isActive
                                        ? 'text-emerald-500 dark:text-emerald-400'
                                        : 'theme-text-secondary hover:theme-text-primary'}
                                `}
                            >
                                {/* 滑动指示器背景 */}
                                {isActive && (
                                    <motion.div
                                        layoutId={`tab-indicator-${node.id}`}
                                        className="absolute inset-0 theme-bg-elevated border-b-2 border-b-emerald-500"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                <span className="opacity-80">{conf.icon}</span>
                                <span className="truncate max-w-[100px]">{conf.label}</span>
                                {node.tabs.length > 1 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); closeTab(node.id, tabId); }}
                                        className="ml-1 p-0.5 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center px-1 gap-0.5 h-full">
                    <button
                        onClick={onToggleCollapse}
                        className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-gray-700 transition-colors"
                        title={node.collapsed ? "展开面板" : "折叠面板"}
                    >
                        {/* 箭头指向点击后将要移动的方向 */}
                        {(() => {
                            // 判断面板在布局中的位置
                            const isEndPanel = node.id.includes('right') || node.id.includes('bottom');

                            if (parentDirection === 'column') {
                                // 垂直布局：使用上下箭头
                                if (isEndPanel) {
                                    // 底部面板：折叠时向上展开，展开时向下折叠
                                    return node.collapsed
                                        ? <ChevronUp className="w-3.5 h-3.5" />
                                        : <ChevronDown className="w-3.5 h-3.5" />;
                                } else {
                                    // 顶部/中间面板：折叠时向下展开，展开时向上折叠
                                    return node.collapsed
                                        ? <ChevronDown className="w-3.5 h-3.5" />
                                        : <ChevronUp className="w-3.5 h-3.5" />;
                                }
                            } else {
                                // 水平布局：使用左右箭头
                                if (isEndPanel) {
                                    // 右侧面板：折叠时向左展开，展开时向右折叠
                                    return node.collapsed
                                        ? <ChevronLeft className="w-3.5 h-3.5" />
                                        : <ChevronRight className="w-3.5 h-3.5" />;
                                } else {
                                    // 左侧/中间面板：折叠时向右展开，展开时向左折叠
                                    return node.collapsed
                                        ? <ChevronRight className="w-3.5 h-3.5" />
                                        : <ChevronLeft className="w-3.5 h-3.5" />;
                                }
                            }
                        })()}
                    </button>
                    <button
                        onClick={(e) => {
                            const panelRect = panelElRef.current?.getBoundingClientRect();
                            if (panelRect) {
                                setFullscreenOrigin({
                                    x: panelRect.left + panelRect.width / 2,
                                    y: panelRect.top + panelRect.height / 2,
                                });
                            } else {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setFullscreenOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                            }
                            setFullscreenViewId(node.activeTab);
                        }}
                        className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-gray-700 transition-colors"
                        title="全屏"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                className={`flex-1 min-h-0 relative theme-bg-primary transition-all ${isDragOver ? 'ring-2 ring-inset ring-emerald-500/50' : ''}`}
                onDragOver={handleContentDragOver}
                onDrop={handleDrop}
            >
                {node.activeTab ? (
                    <PanelRenderer viewId={node.activeTab} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">空视图</div>
                )}
            </div>
        </div>
    );
};

const RecursiveLayout: React.FC<{ node: LayoutNode; parentDirection?: 'row' | 'column' }> = ({
    node,
}) => {

    const containerNode = node as {
        type: 'row' | 'column';
        children: LayoutNode[];
        id: string;
        size: number;
    };
    const direction = containerNode.type;

    return (
        <PanelGroup
            direction={direction === 'row' ? 'horizontal' : 'vertical'}
            id={containerNode.id}
            autoSaveId={`workspace-layout-${containerNode.id}`}
            className="!overflow-hidden"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
            {containerNode.children.map((child, index) => (
                <React.Fragment key={child.id}>
                    {index > 0 && <ResizeHandle direction={direction} />}
                    <PanelWrapper
                        node={child}
                        parentDirection={direction}
                    />
                </React.Fragment>
            ))}
        </PanelGroup>
    );
};

// Helper component to wrap Panel logic and Ref
const PanelWrapper: React.FC<{
    node: LayoutNode;
    parentDirection: 'row' | 'column';
}> = ({ node, parentDirection }) => {
    const panelRef = useRef<ImperativePanelHandle>(null);
    const toggleCollapse = useLayoutStore((s) => s.toggleCollapse);
    const setCollapsed = useLayoutStore((s) => s.setCollapsed);
    const isResizing = useLayoutStore((s) => s.isResizing);

    // Sync store 'collapsed' state with imperative Panel API
    React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        if (node.type === 'leaf') {
            if ((node as LeafNode).collapsed) {
                panel.collapse();
            } else {
                panel.expand();
            }
        }
    }, [(node as LeafNode).collapsed]);

    const transitionClass = !isResizing ? 'transition-all duration-300 ease-in-out' : '';

    if (node.type === 'leaf') {
        const leafNode = node as LeafNode;
        return (
            <Panel
                ref={panelRef}
                defaultSize={node.size}
                minSize={5}
                maxSize={100}
                collapsedSize={4}
                collapsible={true}
                onCollapse={() => {
                    if (!leafNode.collapsed) setCollapsed(node.id, true);
                }}
                onExpand={() => {
                    if (leafNode.collapsed) setCollapsed(node.id, false);
                }}
                id={node.id}
                className={`relative overflow-hidden ${transitionClass}`}
            >
                <LeafContent
                    node={leafNode}
                    parentDirection={parentDirection}
                    onToggleCollapse={() => toggleCollapse(node.id)}
                />
            </Panel>
        );
    } else {
        return (
            <Panel defaultSize={node.size} minSize={5} maxSize={90} id={node.id} className={transitionClass}>
                <div className="w-full h-full">
                    <RecursiveLayout node={node} parentDirection={parentDirection} />
                </div>
            </Panel>
        );
    }
};

export const WorkspaceLayout: React.FC = () => {
    const layout = useLayoutStore((state) => state.layout);
    // Root handling: if root is group, use RecursiveLayout.
    // If root is leaf (rare), wrap it.

    return (
        <div className="h-full w-full overflow-hidden" style={{ contain: 'strict' }}>
            {layout.type === 'leaf' ? (
                /* Root Leaf Case - rare but possible */
                <RecursiveLayout node={layout} />
            ) : (
                <RecursiveLayout node={layout} />
            )}
        </div>
    );
};
