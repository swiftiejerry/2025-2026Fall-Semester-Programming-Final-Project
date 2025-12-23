// 视图配置和常量
import { FileText, List, Code, Activity } from 'lucide-react';

export const DIFFICULTY_STYLES = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

export const VIEW_IDS = {
  PROBLEM: 'problem',
  SUBMISSIONS: 'submissions',
  SOLUTIONS: 'solutions',
  CODE: 'code',
  PERF_ANALYSIS: 'perf-analysis',
  NOTES: 'notes',
  SUBMISSION_DETAIL: 'submission-detail',
};

export const VIEW_META = {
  [VIEW_IDS.PROBLEM]: { title: '题目', icon: FileText },
  [VIEW_IDS.SUBMISSIONS]: { title: '提交记录', icon: List },
  [VIEW_IDS.SOLUTIONS]: { title: '题解', icon: Code },
  [VIEW_IDS.CODE]: { title: '代码', icon: Code },
  [VIEW_IDS.PERF_ANALYSIS]: { title: '性能分析', icon: Activity },
  [VIEW_IDS.NOTES]: { title: '笔记', icon: FileText },
  [VIEW_IDS.SUBMISSION_DETAIL]: { title: '提交详情', icon: FileText, closable: true },
};
