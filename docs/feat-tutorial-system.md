# 新手引导系统

## 背景
游戏有独特的"煞气/理智/入魔/幻觉"机制，新玩家难以理解。当前无任何引导，影响新玩家留存率。

## 目标
- 首次游戏时自动触发引导
- 分步解释核心机制
- 可跳过、可重播

## 范围
### 包含
- 引导覆盖：煞气系统、理智系统、入魔机制、幻觉牌
- 首次游戏自动触发
- 设置界面可重播

### 不包含
- 所有卡牌详情
- 高级策略教学
- 语音解说

## 验收标准
1. 首次进入战斗界面时，自动显示引导第一步
2. 引导包含至少4个步骤：煞气、理智、入魔、幻觉
3. 每步有清晰的文字说明和视觉指示
4. 可点击"跳过"按钮跳过整个引导
5. 可点击"下一步"逐步浏览
6. 引导完成后，设置界面有"重播引导"按钮
7. 引导状态持久化到 localStorage
8. tsc --noEmit && vite build 通过

## 技术方案
- 新建 `src/components/Tutorial.tsx` 组件
- 使用 Zustand store 管理 tutorial 状态
- 使用 overlay + highlight 方式高亮目标元素
- 步骤数据驱动，便于扩展

## 涉及文件
- `src/components/Tutorial.tsx` (新建)
- `src/game/store.ts` (添加 tutorial 状态)
- `src/game/types.ts` (添加 TutorialStep 类型)
- `src/components/BattleScreen.tsx` (集成 Tutorial)
- `src/components/SoundSettings.tsx` (添加重播按钮)