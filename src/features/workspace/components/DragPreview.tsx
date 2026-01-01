import React from 'react';
import { useLayoutStore, VIEW_IDS } from '../../../stores';
import { Code2, BookOpen, BarChart2, List, FileText, Lightbulb } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
    [VIEW_IDS.PROBLEM]: <BookOpen className="w-4 h-4" />,
    [VIEW_IDS.CODE]: <Code2 className="w-4 h-4" />,
    [VIEW_IDS.SOLUTIONS]: <Lightbulb className="w-4 h-4" />,
    [VIEW_IDS.SUBMISSIONS]: <List className="w-4 h-4" />,
    [VIEW_IDS.PERF_ANALYSIS]: <BarChart2 className="w-4 h-4" />,
    [VIEW_IDS.NOTES]: <FileText className="w-4 h-4" />,
};

const LABELS: Record<string, string> = {
    [VIEW_IDS.PROBLEM]: 'Description',
    [VIEW_IDS.CODE]: 'Code',
    [VIEW_IDS.SOLUTIONS]: 'Solutions',
    [VIEW_IDS.SUBMISSIONS]: 'Submissions',
    [VIEW_IDS.PERF_ANALYSIS]: 'Benchmark',
    [VIEW_IDS.NOTES]: 'Notes',
};

export const DragPreview: React.FC = () => {
    const { draggedTab, dropTarget, previewRect } = useLayoutStore();

    if (!draggedTab || !dropTarget || !previewRect) return null;

    const style: React.CSSProperties = {
        position: 'fixed',
        left: previewRect.left,
        top: previewRect.top,
        width: previewRect.width,
        height: previewRect.height,
        pointerEvents: 'none',
        zIndex: 100,
    };

    return (
        <div style={style} className="bg-emerald-500/20 border-2 border-emerald-500 rounded-lg backdrop-blur-sm transition-all duration-75 flex items-center justify-center">
            <div className="bg-emerald-600 text-white px-3 py-1.5 rounded shadow-lg flex items-center gap-2">
                {ICONS[draggedTab.tabId]}
                <span className="font-medium text-sm">{LABELS[draggedTab.tabId] || draggedTab.tabId}</span>
            </div>
        </div>
    );
};
