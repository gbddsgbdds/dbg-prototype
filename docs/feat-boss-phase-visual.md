# Boss 阶段切换视觉效果

## 背景
Boss战是DBG游戏的核心体验，阶段切换是Boss战的关键时刻。当前实现只有一个日志提示，不够明显。

## 目标
- 玩家能清楚感知Boss进入了新阶段
- 增强Boss战的紧张感和戏剧性
- 提供足够的视觉反馈

## 范围
- 在store中追踪Boss阶段状态
- 添加屏幕震动特效
- 添加大文字提示动画
- Boss外观变化（抖动+红色光环）

## 不做
- 不添加音效（后续独立任务）
- 不修改Boss数值逻辑

## 验收标准
- [ ] Boss HP降到阈值时触发阶段切换视觉
- [ ] 屏幕震动效果持续约1秒
- [ ] 大文字提示「Boss进入狂暴阶段！」
- [ ] Boss外观有明显变化
- [ ] tsc --noEmit && vite build 通过
- [ ] 游戏运行正常

## 开发计划

### 涉及文件
1. `src/game/store.ts` - 添加bossPhase状态，阶段切换时设置动画标记
2. `src/game/types.ts` - 添加BossPhase类型
3. `src/App.tsx` - 添加屏幕震动效果和阶段提示组件
4. `src/App.css` - 添加震动动画和阶段提示样式
5. `src/components/Enemy.tsx` - Boss外观变化

### 实现步骤
1. 添加bossPhase状态到store
2. 修改endPlayerTurn中的阶段切换逻辑
3. 添加阶段提示UI组件
4. 添加CSS动画
5. 测试验证