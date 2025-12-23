// 提交记录管理 Hook
import { useState, useCallback } from 'react';

/**
 * 管理代码提交和提交记录
 * @param {string} problemId - 当前题目ID
 */
export function useSubmissions(problemId) {
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // 提交代码
  const submitCode = useCallback(async (code, language) => {
    setIsSubmitting(true);
    
    try {
      // TODO: 实际项目中应该调用真实的判题 API
      // const result = await fetch('/api/submit', {
      //   method: 'POST',
      //   body: JSON.stringify({ code, language, problemId }),
      // });
      
      // 模拟判题过程
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const submission = {
        id: Date.now().toString(),
        status: Math.random() > 0.3 ? '通过' : '未通过',
        language: language === 'python' ? 'Python3' : 'C++',
        runtime: Math.floor(Math.random() * 100 + 10),
        memory: (Math.random() * 20 + 10).toFixed(1),
        time: new Date().toLocaleString(),
        code,
        testCases: {
          passed: Math.random() > 0.3 ? 589 : Math.floor(Math.random() * 500),
          total: 589,
        },
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
      };

      setSubmissionsMap((prev) => ({
        ...prev,
        [problemId]: [submission, ...(prev[problemId] || [])],
      }));

      setIsSubmitting(false);
      return submission;
    } catch (error) {
      console.error('提交失败:', error);
      setIsSubmitting(false);
      throw error;
    }
  }, [problemId]);

  // 清空当前题目的提交记录
  const clearSubmissions = useCallback(() => {
    setSubmissionsMap((prev) => {
      const updated = { ...prev };
      delete updated[problemId];
      return updated;
    });
  }, [problemId]);

  // 获取当前题目的提交记录
  const currentSubmissions = submissionsMap[problemId] || [];

  return {
    submissionsMap,
    currentSubmissions,
    isSubmitting,
    selectedSubmission,
    setSelectedSubmission,
    submitCode,
    clearSubmissions,
  };
}
