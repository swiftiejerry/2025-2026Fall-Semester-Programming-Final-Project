module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // LeetCode 风格的中文和界面字体栈
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
        // LeetCode 风格的代码字体栈
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        // 语义化设计系统
        surface: {
          primary: '#050509',      // 主背景
          secondary: '#0b0b10',    // 次级背景（抽屉、面板）
          tertiary: '#101018',     // 三级背景（输入框）
          elevated: '#1e1e1e',     // 悬浮层（tooltip、dropdown）
        },
        border: {
          primary: 'rgba(255, 255, 255, 0.1)',
          secondary: 'rgba(255, 255, 255, 0.05)',
          focus: 'rgba(139, 92, 246, 0.6)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.92)',
          secondary: 'rgba(255, 255, 255, 0.7)',
          tertiary: 'rgba(255, 255, 255, 0.5)',
          disabled: 'rgba(255, 255, 255, 0.3)',
        },
        accent: {
          primary: '#60a5fa',      // 主要强调色
          success: '#22c55e',      // 成功
          warning: '#f97316',      // 警告
          error: '#ef4444',        // 错误
        },
      },
      spacing: {
        // 统一间距系统
        xs: '0.25rem',   // 4px
        sm: '0.5rem',    // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
        '2xl': '2rem',   // 32px
      },
    },
  },
  plugins: [],
};
