# 需求文档：第 3 层卡池和 Boss

## 背景

当前游戏有 2 层普通层 + 1 层 Boss 层。第 3 层是游戏后期的高难度挑战，需要更强的敌人和更丰厚的奖励卡牌来提供完整游戏体验。

## 目标

1. 新增第 3 层奖励卡池（6-8 张强力卡牌）
2. 新增第 3 层敌人（2-3 个普通敌人 + 1 个精英）
3. 新增第 3 层 Boss
4. 更新层级逻辑，让第 3 层使用新的敌人/卡池

## 范围

### 包含
- `src/data/cards.ts` - 新增卡牌和敌人定义
- `src/game/store.ts` - 更新层级逻辑
- `tools/generate_images.py` - 生成新卡牌/敌人图片（如需要）
- `public/cards/` 和 `public/enemies/` - 新图片

### 不包含
- UI 改动
- 新机制实现（使用现有机制）

## 设计方案

### 第 3 层奖励卡池（主题：终极力量、高风险高回报）

| ID | 名称 | 类型 | 流派 | 费用 | 稀有度 | 描述 |
|----|------|------|------|------|--------|------|
| `void_strike` | 虚空斩 | attack | warrior | 2 | rare | 造成 25 伤害。每有 1 层道心，额外造成 3 伤害 |
| `soul_burn` | 燃魂术 | attack | firecraft | 1 | uncommon | 消耗 10 理智，造成 30 伤害 |
| `puppet_master` | 傀儡师 | power | puppet | 2 | rare | 本场战斗，你的技能牌额外获得 +4 护甲 |
| `demon_possess` | 附身术 | power | firecraft | 1 | rare | 进入入魔状态，但 HP 降到 1。入魔结束时恢复 30 HP |
| `blood_fury` | 血怒 | skill | warrior | 0 | common | 失去 5 HP，抽 2 张牌 |
| `spirit_shield` | 心素屏障 | skill | puppet | 2 | uncommon | 获得 20 护甲。若理智 < 50，额外获得 10 护甲 |
| `fatal_blade` | 必杀刃 | attack | warrior | 3 | legendary | 造成 40 伤害。若击杀敌人，恢复 20 HP |
| `dao_merge` | 合道 | power | sorcerer | 2 | rare | 道心层数翻倍 |

### 第 3 层敌人

**普通敌人：**

1. **煞魔** (sha_demon)
   - HP: 35
   - 意图: 攻击 14 → 攻击 14 → 强化(力量+4) → 攻击 18
   - 特点: 高伤害成长型

2. **心煞** (heart_sha)
   - HP: 28
   - 意图: 防御 10 → 理智攻击 12 → 理智攻击 12 → 攻击 10
   - 特点: 攻击理智的中等威胁

3. **血尸** (blood_corpse_2)
   - HP: 40
   - 意图: 攻击 10 → 攻击 10 → 自愈 8 → 攻击 12
   - 特点: 自愈型敌人

**精英敌人：**

**血煞宗师** (blood_sha_master)
- HP: 80
- 意图: 攻击 15 → 攻击 15 → 强化(力量+5) → 攻击 20 → 攻击 20
- 特点: 高血量高伤害，需要策略应对

### 第 3 层 Boss

**黑莲老祖** (black_lotus_ancestor)
- HP: 120
- 类型: Boss
- 阶段切换阈值: 60 HP
- 特殊机制: 黑莲化身，修仙界魔头
- 意图:
  - 阶段1: 攻击 18 → 理智攻击 10 → 召唤(获得护甲 15) → 攻击 18
  - 阶段2(狂暴): 攻击 25 → 理智攻击 15 → 攻击 25 → 攻击 30

## 验收标准

1. 第 3 层战斗出现新的敌人和精英
2. 第 3 层胜利后出现新的奖励卡牌
3. 第 3 层 Boss 战正常运作，阶段切换视觉效果正常
4. 所有新卡牌可以正常打出，效果正确
5. `tsc --noEmit && vite build` 通过
6. 游戏可以正常通关

## 开发计划

### 步骤 1：新增卡牌定义
- 在 `cards.ts` 中添加第 3 层奖励卡池
- 导出 `REWARD_CARDS_LAYER3`

### 步骤 2：新增敌人定义
- 在 `cards.ts` 中添加第 3 层敌人
- 导出 `ALL_ENEMIES_LAYER3`, `ELITE_ENEMY_LAYER3`, `BOSS_ENEMY_LAYER3`

### 步骤 3：更新层级逻辑
- 修改 `store.ts` 中的层级判断
- 让第 3 层使用新的敌人/卡池/Boss

### 步骤 4：生成图片资源
- 使用 Python 工具生成新卡牌和敌人图片

### 步骤 5：验证
- tsc + vite build
- 游戏测试

## 涉及文件

- `src/data/cards.ts` - 卡牌和敌人定义
- `src/game/store.ts` - 层级逻辑
- `tools/generate_images.py` - 图片生成（可选）
- `public/cards/` - 卡牌图片目录
- `public/enemies/` - 敌人图片目录