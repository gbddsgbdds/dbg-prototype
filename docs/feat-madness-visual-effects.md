# 入魔视觉特效增强

## 背景
当前入魔状态只有简单的背景脉冲效果，缺乏视觉冲击力。入魔是游戏的核心机制之一，玩家触发入魔后伤害×3、能量+2，是非常激爽的时刻，需要更强烈的视觉反馈。

## 目标
增强入魔状态的视觉特效，包括：
1. **屏幕扭曲效果** - 整体画面扭曲、边缘暗角
2. **文字抖动效果** - 关键UI元素（HP、伤害等）抖动
3. **持续氛围** - 入魔期间的整体氛围渲染

## 范围
- 修改文件：`src/App.css`、`src/App.tsx`、`src/components/PlayerStatus.tsx`、`src/components/Hand.tsx`
- 不涉及：游戏逻辑、数值平衡

## 验收标准
- [x] 入魔时屏幕出现扭曲效果（CSS filter）
- [x] 入魔时屏幕边缘出现暗角
- [x] 入魔期间关键UI元素抖动
- [x] 效果不影响游戏可玩性（不要太影响阅读）
- [x] 通过 `npx tsc --noEmit && npx vite build` 验证

## 开发计划

### 涉及文件
1. `src/App.css` - 新增入魔特效 CSS
2. `src/App.tsx` - 应用屏幕级特效类
3. `src/components/PlayerStatus.tsx` - 文字抖动效果
4. `src/components/Hand.tsx` - 卡牌抖动效果

### 实现步骤
1. 在 App.css 中添加入魔特效动画
2. 修改 App.tsx 增强屏幕级特效
3. 修改 PlayerStatus.tsx 添加文字抖动
4. 修改 Hand.tsx 添加卡牌微颤
5. 测试验证

## 实现细节

### 屏幕扭曲效果
使用 CSS filter 实现：
- `filter: url(#madness-distort)` - SVG 滤镜扭曲
- 或使用 `backdrop-filter` 实现背景扭曲
- 边缘暗角使用 `box-shadow: inset`

### 文字抖动效果
使用 CSS animation：
```css
@keyframes textShake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, 2px); }
}
```

### 氛围渲染
- 红色边缘光晕
- 屏幕轻微缩放呼吸
- 卡牌边框闪烁