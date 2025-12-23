import React from 'react';
import ReactDOM from 'react-dom/client';
import WorkspaceApp from './features/workspace/WorkspacePage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WorkspaceApp />
    </ErrorBoundary>
  </React.StrictMode>,
);
