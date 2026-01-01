/**
 * Workspace Store - 管理当前工作区状态
 * 使用 Zustand 进行状态管理，避免不必要的重渲染
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, WorkspaceStore } from '../types';

export const useWorkspaceStore = create<WorkspaceStore>()(
    persist(
        (set) => ({
            // Current problem
            currentProblemId: 'twosum',
            setCurrentProblemId: (id: string) => {
                set({ currentProblemId: id });
                // 切题时清空控制台，避免状态混乱
                // 使用延迟导入避免循环依赖
                import('./consoleStore').then(({ useConsoleStore }) => {
                    useConsoleStore.getState().reset();
                });
            },

            // Language
            language: 'python' as Language,
            setLanguage: (lang: Language) => set({ language: lang }),

            // UI State
            isDrawerOpen: false,
            setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

            // Fullscreen
            fullscreenViewId: null,
            setFullscreenViewId: (id: string | null) => set({ fullscreenViewId: id }),

            fullscreenOrigin: null,
            setFullscreenOrigin: (origin: { x: number; y: number } | null) => set({ fullscreenOrigin: origin }),
        }),
        {
            name: 'algo-workspace',
            partialize: (state) => ({
                currentProblemId: state.currentProblemId,
                language: state.language,
            }),
        }
    )
);
