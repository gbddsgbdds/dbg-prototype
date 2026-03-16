# CI/CD 自动化

## 背景
项目目前没有 CI/CD 流程，部署依赖手动操作。已搭建好：
- Vitest 单元测试框架
- Playwright E2E 测试框架
- gh-pages 部署配置

## 目标
实现完整的 CI/CD 自动化：
1. PR 提交时自动运行：类型检查 + 单元测试
2. 主分支推送时自动运行：类型检查 + 测试 + 构建 + 部署

## 范围
- 创建 `.github/workflows/ci.yml` - CI 工作流
- 创建 `.github/workflows/deploy.yml` - CD 工作流（可选合并）
- 配置 Node.js 环境、依赖缓存、并行测试

## 验收标准
- [x] PR 创建/更新时自动运行类型检查和测试
- [x] main 分支推送时自动部署到 GitHub Pages
- [x] 工作流文件语法正确
- [x] 通过 `tsc --noEmit && vite build` 验证

## 实现记录

### 创建的文件
1. `.github/workflows/ci.yml` - CI 工作流
   - 触发条件：push 到 main、PR 到 main
   - 步骤：类型检查 → 单元测试 → 构建 → E2E 测试
   - 依赖缓存、多 job 并行

2. `.github/workflows/deploy.yml` - 部署工作流
   - 触发条件：push 到 main、手动触发
   - 步骤：类型检查 → 单元测试 → 构建 → 部署到 GitHub Pages
   - 使用 GitHub Pages 官方 action

### 验收结果
- ✅ TypeScript 类型检查通过
- ✅ 单元测试 33 用例全部通过
- ✅ 构建成功（dist/ 输出正常）
- ✅ 工作流文件创建完成