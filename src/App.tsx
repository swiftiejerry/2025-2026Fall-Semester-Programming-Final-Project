import React, { useEffect } from 'react';
import { WorkspacePage } from './features/workspace/WorkspacePage';
import ErrorBoundary from './components/ErrorBoundary';
import { useThemeStore } from './stores';

const App: React.FC = () => {
    const updateEffectiveTheme = useThemeStore(s => s.updateEffectiveTheme);

    // 初始化主题
    useEffect(() => {
        updateEffectiveTheme();
    }, [updateEffectiveTheme]);

    return (
        <ErrorBoundary>
            <WorkspacePage />
        </ErrorBoundary>
    );
};

export default App;
