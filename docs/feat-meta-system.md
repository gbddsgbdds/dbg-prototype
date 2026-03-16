# 元游戏系统（解锁、成就）

> 需求文档 | 创建时间: 2026-03-17 05:07

## 背景

游戏已完成核心玩法（角色、战斗、地图、Boss），但缺少长期进度系统。玩家通关后没有持久性奖励，重玩价值有限。

## 目标

实现元游戏系统，包含：
1. **成就系统** - 追踪玩家达成的里程碑
2. **解锁系统** - 通过成就解锁新内容
3. **统计数据** - 记录游戏历史数据

## 范围

### 要做
- 成就定义与追踪
- 解锁条件判断
- localStorage 持久化
- 成就界面UI
- 解锁提示通知

### 不做
- 排行榜
- 在线同步
- 复杂成就动画
- Steam/平台成就集成

## 验收标准

1. ✅ 玩家首次通关后显示成就解锁
2. ✅ 成就界面可查看所有成就及进度
3. ✅ 统计数据正确记录（通关次数、击杀数等）
4. ✅ 通过 `tsc --noEmit && vite build` 验证
5. ✅ 游戏运行正常，功能完整

## 开发计划

### 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/game/meta.ts` | 新建 | 元游戏系统核心逻辑 |
| `src/components/AchievementScreen.tsx` | 新建 | 成就界面组件 |
| `src/components/AchievementPopup.tsx` | 新建 | 成就解锁弹窗 |
| `src/game/store.ts` | 修改 | 集成元游戏系统 |
| `src/App.tsx` | 修改 | 添加成就入口 |
| `src/App.css` | 修改 | 成就界面样式 |

### 实现步骤

1. 定义成就类型和元游戏数据结构
2. 实现元游戏 Store（Zustand + localStorage）
3. 在胜利/失败结算时触发成就检查
4. 创建成就界面UI
5. 添加成就解锁弹窗通知
6. 在主菜单添加入口

## 成就设计

### 首次成就（一次性）

| ID | 名称 | 描述 | 解锁条件 |
|----|------|------|---------|
| `first_victory` | 初窥门径 | 首次通关游戏 | 击败最终Boss |
| `first_boss` | 斩妖除魔 | 首次击败任意Boss | 击败Boss |
| `first_elite` | 精英猎手 | 首次击败精英怪 | 击败精英 |
| `first_madness` | 走火入魔 | 首次进入入魔状态 | 煞气达到100 |
| `first_character` | 角色集 | 解锁全部角色 | 完成角色解锁 |

### 累计成就

| ID | 名称 | 描述 | 解锁条件 |
|----|------|------|---------|
| `kill_100` | 杀敌如麻 | 累计击败100个敌人 | 累计击杀≥100 |
| `kill_500` | 屠戮众生 | 累计击败500个敌人 | 累计击杀≥500 |
| `gold_1000` | 富甲一方 | 累计获得1000金币 | 累计金币≥1000 |
| `run_10` | 轮回十世 | 完成10次游戏流程 | 游戏次数≥10 |

### 挑战成就

| ID | 名称 | 描述 | 解锁条件 |
|----|------|------|---------|
| `speedrun` | 速通大师 | 20回合内通关 | 回合数≤20通关 |
| `no_damage` | 完美无瑕 | 一场战斗不受伤害 | 单场战斗0受伤 |
| `low_hp` | 绝境逢生 | HP≤10时击败Boss | 低HP击败Boss |

## 统计数据

```typescript
interface GameStats {
  // 游戏次数
  totalRuns: number
  victories: number
  defeats: number
  
  // 战斗统计
  totalKills: number
  eliteKills: number
  bossKills: number
  
  // 资源统计
  totalGoldEarned: number
  maxShaqiReached: number
  
  // 角色统计
  characterRuns: Record<string, number>
  characterVictories: Record<string, number>
}
```

---

## 开发记录

### 2026-03-17 05:07
- 创建需求文档
- 开始开发元游戏系统