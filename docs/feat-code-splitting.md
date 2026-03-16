# 代码分割优化

## 背景
当前 App.tsx 同步导入所有 14 个组件，导致首屏加载包含所有代码。用户首次进入游戏需要下载完整的 JS 包（397KB），影响加载体验。

## 目标
- 实现代码分割，减少首屏 JS 包大小
- 非首屏组件使用 React.lazy() 懒加载
- 保持用户体验流畅，无感知加载延迟

## 范围

### 首屏必需（同步加载）
- App 本身
- Hand、Enemy、PlayerStatus、BattleLog（战斗界面核心）
- StartScreen 相关组件

### 懒加载组件
1. VictoryScreen - 胜利界面
2. GameOverScreen - 失败界面
3. Changelog - 更新日志
4. DeckViewer - 卡组查看
5. MapScreen - 地图界面
6. ShopScreen - 商店界面
7. EventScreen - 事件界面
8. CharacterSelect - 角色选择
9. AchievementScreen - 成就界面
10. AchievementPopup - 成就弹窗
11. BossPhaseAlert - Boss 阶段提示
12. MadnessOverlay - 入魔特效

## 验收标准
1. ✅ `npx tsc --noEmit` 通过
2. ✅ `npx vite build` 成功
3. ✅ 首屏 JS 包大小减少 **38.5%**（397KB → 244KB）
4. ✅ 游戏各界面功能正常
5. ✅ 懒加载组件有加载状态（Suspense fallback）

## 开发计划

### 涉及文件
- `src/App.tsx` - 主要修改

### 实现步骤
1. 识别可懒加载组件
2. 使用 React.lazy() 包装导入
3. 添加 Suspense 边界和 fallback
4. 验证构建和功能

### 预期效果
- 首屏包减少约 100-150KB
- 懒加载 chunk 约 10-20 个
- gzip 后总大小不变，但首屏加载更快