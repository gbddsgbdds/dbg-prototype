# 需求：实现心素幻觉牌机制

## 背景
GDD 4.4节定义了幻觉牌：煞性≥60时每回合20%概率一张手牌变成背面朝上的幻觉牌。当前代码只在 endPlayerTurn 中输出日志，没有实际生成幻觉牌和效果结算。

## 目标
- 回合开始时按概率将手牌标记为幻觉牌
- 幻觉牌渲染为背面（无法看到内容）
- 幻觉牌打出时结算随机效果：0伤害(40%) / 反伤50%(30%) / 恐惧debuff(30%)
- 驱魔符可以翻面查看（消耗1能量，查看后移除幻觉标记）

## 范围
- 包含：幻觉牌状态、生成逻辑、结算逻辑、UI渲染、驱魔符功能
- 不包含：幻觉牌的升级版、特殊幻觉事件

## 验收标准
- [ ] 煞性≥60时每回合有20%概率将一张手牌标记为幻觉
- [ ] 幻觉牌在手牌区显示为背面（名称显示为"???"）
- [ ] 打出幻觉牌时结算随机效果并显示日志
- [ ] 驱魔符可选择一张幻觉牌翻面（移除幻觉标记，显示真实内容）
- [ ] tsc --noEmit && vite build 通过

## 开发计划

### 涉及文件
- src/game/types.ts - CardDef 增加 isHallucination 字段
- src/game/store.ts - endPlayerTurn 增加幻觉生成逻辑，playCard 增加幻觉结算逻辑
- src/game/store.ts - 驱魔符逻辑改为选择目标
- src/components/Hand.tsx - 幻觉牌背面渲染

### 实现步骤
1. types.ts: CardDef 增加可选 isHallucination: boolean
2. store.ts: endPlayerTurn 新回合开始前检查煞性≥60且20%概率，随机选一张手牌标记
3. store.ts: playCard 处理幻觉牌打出时的随机效果（伤害牌变0伤害/反伤/debuff）
4. store.ts: 驱魔符改为打开选择模式（下次点击手牌移除幻觉标记）
5. Hand.tsx: isHallucination 的牌显示背面样式
6. 构建验证
