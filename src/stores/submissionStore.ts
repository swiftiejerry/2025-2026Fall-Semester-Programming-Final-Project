/**
 * Submission Store - 管理提交记录
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Submission, Language } from '../types';

interface SubmissionState {
    // 提交记录: problemId -> submissions[]
    submissions: Record<string, Submission[]>;
    selectedSubmission: Submission | null;
    isSubmitting: boolean;

    // Actions
    addSubmission: (submission: Submission) => void;
    getSubmissions: (problemId: string) => Submission[];
    setSelectedSubmission: (submission: Submission | null) => void;
    clearSubmissions: (problemId: string) => void;
    setSubmitting: (isSubmitting: boolean) => void;
}

export const useSubmissionStore = create<SubmissionState>()(
    persist(
        immer((set, get) => ({
            submissions: {},
            selectedSubmission: null,
            isSubmitting: false,

            addSubmission: (submission: Submission) => {
                set((state) => {
                    if (!state.submissions[submission.problemId]) {
                        state.submissions[submission.problemId] = [];
                    }
                    state.submissions[submission.problemId]!.unshift(submission);
                });
            },

            getSubmissions: (problemId: string) => {
                return get().submissions[problemId] || [];
            },

            setSelectedSubmission: (submission: Submission | null) => {
                set((state) => {
                    state.selectedSubmission = submission;
                });
            },

            clearSubmissions: (problemId: string) => {
                set((state) => {
                    delete state.submissions[problemId];
                    if (state.selectedSubmission?.problemId === problemId) {
                        state.selectedSubmission = null;
                    }
                });
            },

            setSubmitting: (isSubmitting: boolean) => {
                set((state) => {
                    state.isSubmitting = isSubmitting;
                });
            },
        })),
        {
            name: 'algo-submissions',
            partialize: (state) => ({
                submissions: state.submissions,
            }),
        }
    )
);

// 创建提交记录的工厂函数
export const createSubmission = (
    problemId: string,
    code: string,
    language: Language,
    result: {
        status: Submission['status'];
        runtime?: number;
        memory?: number;
        passedCases?: number;
        totalCases?: number;
        complexity?: { time: string; space: string };
    }
): Submission => ({
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemId,
    code,
    language,
    timestamp: Date.now(),
    ...result,
});
