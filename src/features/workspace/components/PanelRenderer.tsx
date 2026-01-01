import React from 'react';
import { VIEW_IDS } from '../../../stores';
import { CodeEditor } from '../../editor/CodeEditor';
import { PerformancePanel } from '../../performance/PerformancePanel';
import { ProblemPanel } from '../../problem/ProblemPanel';
import { SolutionsPanel } from '../../problem/SolutionsPanel';
import { SubmissionListPanel } from '../../submission/SubmissionListPanel';
import { SubmissionDetailPanel } from '../../submission/SubmissionDetailPanel';
import { NotesPanel } from '../../problem/NotesPanel';
import { TestCaseGeneratorPanel } from '../../generator/TestCaseGeneratorPanel';
import { ConsolePanel } from '../../console/ConsolePanel';


interface PanelRendererProps {
    viewId: string;
}

export const PanelRenderer: React.FC<PanelRendererProps> = ({ viewId }) => {
    switch (viewId) {
        case VIEW_IDS.CODE:
            return <CodeEditor />;
        case VIEW_IDS.PERF_ANALYSIS:
            return <PerformancePanel />;
        case VIEW_IDS.PROBLEM:
            return <ProblemPanel />;
        case VIEW_IDS.SOLUTIONS:
            return <SolutionsPanel />;
        case VIEW_IDS.SUBMISSIONS:
            return <SubmissionListPanel />;
        case 'submission-detail':
            return <SubmissionDetailPanel />;
        case VIEW_IDS.NOTES:
            return <NotesPanel />;
        case VIEW_IDS.GENERATOR:
            return <TestCaseGeneratorPanel />;
        case VIEW_IDS.CONSOLE:
            return <ConsolePanel />;
        default:
            return <div className="p-4 text-slate-500">Unknown View: {viewId}</div>;
    }
};
