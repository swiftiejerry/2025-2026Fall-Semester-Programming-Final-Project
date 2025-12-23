# 多阶段构建：先构建前端，再用 Node 运行后端代理 + 静态文件

# 1️⃣ 构建阶段：打包 React + Vite 前端
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 告诉前端使用服务器代理模式，请求 /api
ENV VITE_USE_SERVER_PROXY=true

RUN npm run build

# 2️⃣ 运行阶段：只带运行所需依赖 + 已构建前端
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# 拷贝构建产物和后端服务器脚本
COPY --from=build /app/dist ./dist
COPY server.js ./server.js

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
