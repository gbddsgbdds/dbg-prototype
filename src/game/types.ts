// 卡牌数据类型
export type CardType = 'attack' | 'skill' | 'power'
export type CardClass = 'warrior' | 'puppet' | 'sorcerer' | 'firecraft'
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary'
export type EnemyType = 'normal' | 'elite' | 'boss'
export type GamePhase = 'title' | 'player_turn' | 'enemy_turn' | 'game_over' | 'victory' | 'madness' | 'map' | 'shop' | 'event' | 'character_select'
export type IntentType = 'attack' | 'defend' | 'buff' | 'debuff' | 'transform' | 'steal' | 'heal'

// 地图节点类型
export type MapNodeType = 'battle' | 'elite' | 'rest' | 'shop' | 'event' | 'boss' | 'start'

// 商店物品
export interface ShopItem {
  card: CardDef
  price: number
  sold: boolean
}

// 事件选项
export interface EventChoice {
  text: string
  effects: {
    hp?: number
    san?: number
    gold?: number
    shaqi?: number
    addCard?: CardDef
    removeRandomCard?: boolean
  }
}

// 游戏事件
export interface GameEvent {
  id: string
  title: string
  description: string
  choices?: EventChoice[]  // 有选项的事件
  autoEffects?: EventChoice['effects']  // 无选项，自动触发
}

// 地图节点
export interface MapNode {
  id: string
  type: MapNodeType
  layer: number        // 层数 (0 = 起点, 1-N = 普通层, N+1 = Boss)
  column: number       // 列位置 (用于可视化)
  completed: boolean
  connections: string[] // 相连的下一层节点ID
  enemyDef?: EnemyDef  // 战斗节点预分配的敌人
}

// 地图数据
export interface GameMap {
  nodes: MapNode[]
  layers: number       // 总层数
  startNodeId: string  // 起点节点ID
  bossNodeId: string   // Boss节点ID
}

// 条件类型
export type ConditionType = 
  | 'shaqi_gte'        // 煞气 >= 值
  | 'san_lte'          // 理智 <= 值
  | 'enemy_hp_pct_lte' // 敌人HP百分比 <= 值 (0-100)
  | 'madness'          // 已入魔

export interface ConditionEffect {
  condition: {
    type: ConditionType
    value?: number  // 可选，某些条件类型不需要值
  }
  // 条件满足时的额外效果
  bonusBlock?: number
  bonusDraw?: number
  bonusSanCost?: number
  damageMultiplier?: number  // 伤害倍率
  damageBonus?: number       // 固定伤害加成
}

export interface CardEffect {
  damage?: number
  block?: number
  selfBuff?: BuffEffect[]
  enemyDebuff?: BuffEffect[]
  draw?: number
  energyGain?: number
  shaqiGain?: number    // 获得煞气
  sanCost?: number      // 消耗理智
  hpCost?: number       // 消耗 HP
  upgradable?: boolean   // 是否可升级（商店升级）
  // 动态效果
  blockFromShaqi?: boolean    // 护甲 = 当前煞气值
  damagePerDaoxin?: number    // 每层道心额外伤害
  // 条件效果
  conditional?: ConditionEffect
}

export interface BuffEffect {
  type: string
  amount: number
  duration: number
}

export interface CardDef {
  id: string
  name: string
  type: CardType
  cardClass: CardClass
  cost: number
  rarity: CardRarity
  description: string
  effects: CardEffect
  icon?: string
  isHallucination?: boolean  // 心素幻觉牌标记
  illusion?: boolean         // 坐忘道幻象牌标记（随机效果）
}

// 敌人意图
export interface EnemyIntent {
  type: IntentType
  value?: number
  buffType?: string
  buffAmount?: number
  transform?: string  // 变身目标
}

// 敌人定义
export interface EnemyDef {
  id: string
  name: string
  hp: number
  type: EnemyType
  intents: EnemyIntent[]
  icon?: string
  phase?: number           // 当前阶段
  phaseThreshold?: number   // 阶段切换HP
  specialMechanics?: string
}

// 玩家状态
export interface PlayerState {
  hp: number
  maxHp: number
  energy: number
  maxEnergy: number
  block: number
  buffs: BuffEffect[]
  san: number          // 理智
  maxSan: number      // 理智上限
  shaqi: number        // 煞气
  maxShaqi: number    // 煞气上限(100)
  daoxin: number      // 道心层数（本回合）
  maxDaoxin: number   // 道心上限(10)
  isMad: boolean      // 是否入魔
  madTurnCount: number // 入魔持续回合数
  gold: number
}

// 敌人运行时状态
export interface EnemyState {
  def: EnemyDef
  hp: number
  maxHp: number
  block: number
  buffs: BuffEffect[]
  intent: EnemyIntent
}

// 伤害飘字数据
export interface DamageFloatItem {
  id: string
  value: number
  type: 'damage' | 'heal' | 'block' | 'san' | 'special'
  target: 'player' | 'enemy'
}

// 角色定义
export interface CharacterDef {
  id: string
  name: string
  title: string           // 称号/描述
  maxHp: number
  maxSan: number
  maxShaqi: number
  maxEnergy: number
  startingDeck: string[]  // 初始卡牌ID列表
  icon?: string
  description?: string    // 详细描述
}
