# 需求文档：卡牌动画优化

## 背景
当前游戏使用 framer-motion 提供基础的悬停和点击动画，但缺少卡牌流动的视觉反馈。玩家在抽牌、打出卡牌、弃牌时没有直观的动画提示，影响游戏体验的沉浸感。

## 目标
为卡牌添加三种核心动画，让玩家更直观感受卡牌流动：
1. **抽牌动画**：卡牌从左侧牌堆飞入手中
2. **打出动画**：卡牌飞向敌人或上方后消失
3. **弃牌动画**：回合结束时卡牌飞向右侧弃牌堆

## 范围

### 包含
- Hand.tsx 组件动画增强
- App.css 动画样式
- store.ts 动画状态管理

### 不包含
- 卡牌旋转、翻转等高级动画
- 粒子特效
- 音效联动

## 验收标准
- [x] 抽牌时有飞入动画（从左侧进入）
- [x] 打出卡牌时有飞出动画（向上飞出并淡出）
- [x] 回合结束时弃牌有飞出动画（向右飞出）
- [x] 动画流畅不卡顿
- [x] tsc --noEmit && vite build 通过
- [x] TODO.md 更新

## 开发计划

### 涉及文件
1. `src/components/Hand.tsx` - 添加动画变体
2. `src/App.css` - 添加动画样式
3. `src/game/store.ts` - 添加动画状态（可选）

### 实现步骤
1. 为 motion.div 添加 initial、animate、exit 属性
2. 定义抽牌、打出、弃牌三种动画变体
3. 使用 AnimatePresence 处理卡牌进入/退出
4. 测试动画效果

## 技术方案

### 动画变体定义
```typescript
const cardVariants = {
  // 抽牌动画：从左侧飞入
  draw: {
    x: [-200, 0],
    opacity: [0, 1],
    scale: [0.8, 1],
    rotate: [-5, 0],
  },
  // 打出动画：向上飞出并淡出
  play: {
    y: [0, -100],
    opacity: [1, 0],
    scale: [1, 0.8],
    transition: { duration: 0.3 },
  },
  // 弃牌动画：向右飞出
  discard: {
    x: [0, 200],
    opacity: [1, 0],
    transition: { duration: 0.4 },
  },
}
```

### 状态追踪
- 使用 `playingCard` 状态追踪正在打出的卡牌索引
- 使用 `discarding` 状态追踪是否正在弃牌