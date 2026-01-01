import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// 兼容 ESM 环境下的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        // 强制 Vite 尝试解析这些扩展名
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    worker: {
        format: 'es',
    },
    optimizeDeps: {
        exclude: [],
    },
    // 确保服务能在容器或本地正确暴露
    server: {
        host: '0.0.0.0',
        port: 5173, // 保持默认端口
        proxy: {
            '/api/compile-cpp': {
                target: 'https://wandbox.org',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/compile-cpp/, '/api/compile.json'),
            },
        },
    }
});
