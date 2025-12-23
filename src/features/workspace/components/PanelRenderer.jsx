// 面板渲染 - 根据 viewId 显示对应视图
import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Problem } from '../../problem/ProblemPanel';
import { Solutions } from '../../problem/SolutionsPanel';
import { Submissions } from '../../submission/SubmissionListPanel';
import { SubmitDetail } from '../../submission/SubmissionDetailPanel';
import { Notes } from '../../problem/NotesPanel';
import { Performance } from '../../performance/PerformancePanel';
import { CodeEditor } from '../../editor/CodeEditor';
import { VIEW_IDS } from '../config/viewConfig';

export function PanelRenderer({ viewId, onRunPerfTest, onClearPerfResults }) {
  const ws = useWorkspace();

  switch (viewId) {
    case VIEW_IDS.PROBLEM:
      return <Problem problem={ws.current} />;

    case VIEW_IDS.CODE:
      return (
        <div className="h-full bg-editor-bg">
          <CodeEditor
            value={ws.currentCode}
            onChange={ws.updateCode}
            language={ws.lang}
          />
        </div>
      );

    case VIEW_IDS.SUBMISSIONS:
      return (
        <Submissions
          submissions={ws.currentSubmissions}
          isSubmitting={ws.isSubmitting}
          onSelectSubmission={(sub) => {
            ws.setSelectedSubmission(sub);
            ws.addTab('col-left', VIEW_IDS.SUBMISSION_DETAIL);
          }}
        />
      );

    case VIEW_IDS.SOLUTIONS:
      return (
        <Solutions
          solutions={ws.current?.solutions || []}
          onApplySolution={ws.handleApplySolution}
        />
      );

    case VIEW_IDS.PERF_ANALYSIS:
      return (
        <Performance
          problem={ws.current}
          results={ws.perf.results[ws.currentId] || []}
          onRunTest={onRunPerfTest}
          onClearResults={onClearPerfResults}
        />
      );

    case VIEW_IDS.NOTES:
      return (
        <Notes
          notes={ws.currentNotes}
          onNotesChange={ws.updateNotes}
        />
      );

    case VIEW_IDS.SUBMISSION_DETAIL:
      return <SubmitDetail submission={ws.selectedSubmission} />;

    default:
      return (
        <div className="h-full flex items-center justify-center text-zinc-500">
          <p className="text-sm">未知视图: {viewId}</p>
        </div>
      );
  }
}
