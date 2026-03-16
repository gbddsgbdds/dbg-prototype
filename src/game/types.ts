// 卡牌数据类型
export type CardType = 'attack' | 'skill' | 'power'
export type CardClass = 'warrior' | 'puppet' | 'sorcerer' | 'firecraft'
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary'
export type EnemyType = 'normal' | 'elite' | 'boss'
export type GamePhase = 'player_turn' | 'enemy_turn' | 'game_over' | 'victory' | 'madness' | 'map'
export type IntentType = 'attack' | 'defend' | 'buff' | 'debuff' | 'transform' | 'steal'

// 地图节点类型
export type MapNodeType = 'battle' | 'elite' | 'rest' | 'shop' | 'event' | 'boss' | 'start'

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
