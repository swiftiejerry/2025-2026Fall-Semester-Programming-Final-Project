// 代码编辑器状态管理 Hook
import { useState, useCallback, useEffect } from 'react';

/**
 * 管理代码编辑器的状态
 * @param {string} problemId - 当前题目ID
 * @param {string} language - 当前编程语言
 * @param {Object} starterCode - 初始代码模板
 */
export function useCodeEditor(problemId, language, starterCode = {}) {
  const [codeMap, setCodeMap] = useState(() => {
    try {
      const saved = localStorage.getItem('algo-code-map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 获取当前代码
  const currentCode = codeMap[problemId]?.[language] || starterCode[language] || '';

  // 更新代码
  const updateCode = useCallback((code) => {
    setCodeMap(prev => {
      const updated = {
        ...prev,
        [problemId]: {
          ...(prev[problemId] || {}),
          [language]: code,
        },
      };
      
      // 持久化到 localStorage
      try {
        localStorage.setItem('algo-code-map', JSON.stringify(updated));
      } catch (error) {
        console.error('保存代码失败:', error);
      }
      
      return updated;
    });
  }, [problemId, language]);

  // 应用题解代码到编辑器
  const applySolutionCode = useCallback((solutionLanguage, code) => {
    setCodeMap(prev => {
      const updated = {
        ...prev,
        [problemId]: {
          ...(prev[problemId] || {}),
          [solutionLanguage]: code,
        },
      };
      
      try {
        localStorage.setItem('algo-code-map', JSON.stringify(updated));
      } catch (error) {
        console.error('保存代码失败:', error);
      }
      
      return updated;
    });
  }, [problemId]);

  // 清空当前题目的代码
  const clearCode = useCallback(() => {
    setCodeMap(prev => {
      const updated = { ...prev };
      delete updated[problemId];
      
      try {
        localStorage.setItem('algo-code-map', JSON.stringify(updated));
      } catch (error) {
        console.error('清空代码失败:', error);
      }
      
      return updated;
    });
  }, [problemId]);

  return {
    currentCode,
    codeMap,
    updateCode,
    applySolutionCode,
    clearCode,
  };
}
