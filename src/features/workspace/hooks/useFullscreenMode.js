// 全屏模式管理 Hook
import { useCallback } from 'react';

/**
 * 全屏模式管理（带完整位置动画）
 * @param {Object} fullscreenState - 全屏状态
 * @param {Function} setFullscreenState - 设置全屏状态
 * @param {Function} setIsAnimating - 设置动画状态
 * @param {Function} setAnimationStyle - 设置动画样式
 */
export function useFullscreenMode(fullscreenState, setFullscreenState, setIsAnimating, setAnimationStyle) {
  
  // 进入全屏
  const enterFullscreen = useCallback((viewId, leafId, panelElement) => {
    console.log('[Fullscreen] Entering fullscreen for:', viewId, leafId);
    
    if (!panelElement) {
      console.warn('[Fullscreen] Panel element not provided');
      return;
    }
    
    const rect = panelElement.getBoundingClientRect();
    console.log('[Fullscreen] Panel rect:', rect);
    
    setIsAnimating(true);
    setFullscreenState({ viewId, leafId });
    
    // 初始位置：面板位置
    setAnimationStyle({
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: '0px',
    });
    
    // 下一帧：过渡到全屏
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log('[Fullscreen] Animating to fullscreen');
        setAnimationStyle({
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
        });
      });
    });
    
    // 动画结束
    setTimeout(() => {
      console.log('[Fullscreen] Animation complete');
      setIsAnimating(false);
    }, 500);
  }, [setFullscreenState, setIsAnimating, setAnimationStyle]);

  // 退出全屏
  const exitFullscreen = useCallback(() => {
    if (!fullscreenState) {
      setFullscreenState(null);
      setAnimationStyle(null);
      setIsAnimating(false);
      return;
    }
    
    const panelElement = document.getElementById(fullscreenState.leafId);
    if (!panelElement) {
      console.warn('[Fullscreen] Panel element not found on exit:', fullscreenState.leafId);
      setFullscreenState(null);
      setAnimationStyle(null);
      setIsAnimating(false);
      return;
    }
    
    const rect = panelElement.getBoundingClientRect();
    setIsAnimating(true);
    
    // 从全屏过渡回面板位置
    setAnimationStyle({
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
    });
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimationStyle({
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: '8px',
        });
      });
    });
    
    // 动画结束后清理
    setTimeout(() => {
      setFullscreenState(null);
      setAnimationStyle(null);
      setIsAnimating(false);
    }, 500);
  }, [fullscreenState, setFullscreenState, setIsAnimating, setAnimationStyle]);

  // 切换全屏
  const toggleFullscreen = useCallback((viewId, leafId) => {
    if (fullscreenState) {
      exitFullscreen();
    } else {
      enterFullscreen(viewId, leafId);
    }
  }, [fullscreenState, enterFullscreen, exitFullscreen]);

  return {
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
