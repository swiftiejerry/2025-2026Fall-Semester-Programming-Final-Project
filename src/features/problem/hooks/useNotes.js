// 笔记管理 Hook
import { useState, useCallback, useEffect } from 'react';

/**
 * 管理每道题的笔记
 * @param {string} problemId - 当前题目ID
 */
export function useNotes(problemId) {
  const [notesMap, setNotesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('algo-notes-map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 获取当前题目的笔记
  const currentNotes = notesMap[problemId] || '';

  // 更新当前题目的笔记
  const updateNotes = useCallback((notes) => {
    setNotesMap(prev => {
      const updated = {
        ...prev,
        [problemId]: notes,
      };
      
      // 持久化到 localStorage
      try {
        localStorage.setItem('algo-notes-map', JSON.stringify(updated));
      } catch (error) {
        console.error('保存笔记失败:', error);
      }
      
      return updated;
    });
  }, [problemId]);

  // 清空当前题目的笔记
  const clearNotes = useCallback(() => {
    setNotesMap(prev => {
      const updated = { ...prev };
      delete updated[problemId];
      
      try {
        localStorage.setItem('algo-notes-map', JSON.stringify(updated));
      } catch (error) {
        console.error('清空笔记失败:', error);
      }
      
      return updated;
    });
  }, [problemId]);

  return {
    currentNotes,
    notesMap,
    updateNotes,
    clearNotes,
  };
}
