// Monaco Editor 组件（VS Code 使用的编辑器）
import React, { useRef, useEffect } from 'react';

export function CodeEditor({ value, onChange, language }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    // 加载 Monaco Editor
    if (!window.monaco) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
      script.async = true;
      script.onload = () => {
        window.require.config({
          paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }
        });
        window.require(['vs/editor/editor.main'], () => {
          initEditor();
        });
      };
      document.head.appendChild(script);
    } else {
      initEditor();
    }

    function initEditor() {
      if (!containerRef.current || editorRef.current) return;

      const monacoLanguage = language === 'python' ? 'python' : 'cpp';

      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value: value || '',
        language: monacoLanguage,
        theme: 'vs-dark',
        fontSize: 14,
        lineHeight: 21,
        fontFamily: 'Consolas, "Courier New", monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'off',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
      });

      // 监听内容变化
      monacoRef.current = editorRef.current.onDidChangeModelContent(() => {
        const newValue = editorRef.current.getValue();
        if (onChange && newValue !== value) {
          onChange(newValue);
        }
      });
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // 更新语言
  useEffect(() => {
    if (editorRef.current && window.monaco) {
      const model = editorRef.current.getModel();
      const monacoLanguage = language === 'python' ? 'python' : 'cpp';
      window.monaco.editor.setModelLanguage(model, monacoLanguage);
    }
  }, [language]);

  // 更新内容
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      const position = editorRef.current.getPosition();
      editorRef.current.setValue(value || '');
      if (position) {
        editorRef.current.setPosition(position);
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '200px'
      }}
    />
  );
}
