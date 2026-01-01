import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    effectiveTheme: 'light' | 'dark';
    setMode: (mode: ThemeMode) => void;
    updateEffectiveTheme: () => void;
}

// 根据系统时间判断是否应该使用暗色模式 (晚上 6 点到早上 7 点)
function shouldUseDarkByTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 7;
}

// 检测系统偏好
function getSystemPreference(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return shouldUseDarkByTime() ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'system',
            effectiveTheme: getSystemPreference(),

            setMode: (mode) => {
                set({ mode });
                get().updateEffectiveTheme();
            },

            updateEffectiveTheme: () => {
                const { mode } = get();
                let effective: 'light' | 'dark';

                if (mode === 'system') {
                    effective = getSystemPreference();
                } else {
                    effective = mode;
                }

                set({ effectiveTheme: effective });

                // 更新 document class
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(effective);
                }
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // 重新加载时更新主题
                state?.updateEffectiveTheme();
            },
        }
    )
);

// 初始化时设置主题
if (typeof window !== 'undefined') {
    // 立即更新一次
    useThemeStore.getState().updateEffectiveTheme();

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 兼容性处理：部分旧浏览器可能不支持 addEventListener on matchMedia
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
            // 必须从 store 获取最新状态，不能使用闭包中的旧状态
            if (useThemeStore.getState().mode === 'system') {
                useThemeStore.getState().updateEffectiveTheme();
            }
        });
    } else {
        // @ts-ignore - Deprecated but fallback
        mediaQuery.addListener(() => {
            if (useThemeStore.getState().mode === 'system') {
                useThemeStore.getState().updateEffectiveTheme();
            }
        });
    }
}
