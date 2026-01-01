/**
 * Editor Store - 管理代码编辑器状态
 * 支持多题目、多语言代码的持久化存储
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Language } from '../types';

interface EditorState {
    // 代码映射: problemId -> language -> code
    codeMap: Record<string, Record<Language, string>>;

    // Actions
    getCode: (problemId: string, language: Language, defaultCode?: string) => string;
    setCode: (problemId: string, language: Language, code: string) => void;
    resetCode: (problemId: string, language: Language, defaultCode: string) => void;
    clearAllCode: () => void;
}

export const useEditorStore = create<EditorState>()(
    persist(
        immer((set, get) => ({
            codeMap: {},

            getCode: (problemId: string, language: Language, defaultCode = '') => {
                const state = get();
                return state.codeMap[problemId]?.[language] ?? defaultCode;
            },

            setCode: (problemId: string, language: Language, code: string) => {
                set((state) => {
                    if (!state.codeMap[problemId]) {
                        state.codeMap[problemId] = {} as Record<Language, string>;
                    }
                    state.codeMap[problemId][language] = code;
                });
            },

            resetCode: (problemId: string, language: Language, defaultCode: string) => {
                set((state) => {
                    if (!state.codeMap[problemId]) {
                        state.codeMap[problemId] = {} as Record<Language, string>;
                    }
                    state.codeMap[problemId][language] = defaultCode;
                });
            },

            clearAllCode: () => {
                set({ codeMap: {} });
            },
        })),
        {
            name: 'algo-editor-code',
        }
    )
);
