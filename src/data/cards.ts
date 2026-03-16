import type { CardDef, EnemyDef } from '../game/types'

// ==================== 初始卡牌 ====================

// 攻击牌 - 兵家
const STRIKE: CardDef = {
  id: 'strike',
  name: '挥刀',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '造成 8 点伤害。',
  effects: { damage: 8, shaqiGain: 3 },
  icon: 'sword strike',
}

const WILD_SLASH: CardDef = {
  id: 'wild_slash',
  name: '狂斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '造成 6 伤害，获得 5 煞气。',
  effects: { damage: 6, shaqiGain: 5 },
  icon: 'wild slash',
}

const BLOOD_BLADE: CardDef = {
  id: 'blood_blade',
  name: '血刃',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '消耗 5 HP，造成 15 伤害。代价换输出。',
  effects: { damage: 15, shaqiGain: 3, hpCost: 5 },
  icon: 'blood blade',
}

// 技能牌 - 兵家
const GUARD: CardDef = {
  id: 'guard',
  name: '防御',
  type: 'skill',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '获得 5 护甲。',
  effects: { block: 5, shaqiGain: 0 },
  icon: 'shield',
}

const NUO_MASK: CardDef = {
  id: 'nuo_mask',
  name: '傩面',
  type: 'skill',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'starter',
  description: '获得 8 护甲，获得 3 煞气。',
  effects: { block: 8, shaqiGain: 3 },
  icon: 'puppet mask',
}

const HEAVY_STRIKE: CardDef = {
  id: 'heavy_strike',
  name: '重击',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '造成 15 伤害，获得 3 煞气。',
  effects: { damage: 15, shaqiGain: 3 },
  icon: 'heavy strike',
}

const BURN_BODY: CardDef = {
  id: 'burn_body',
  name: '烧身法',
  type: 'attack',
  cardClass: 'firecraft',
  cost: 1,
  rarity: 'starter',
  description: '消耗 5 HP 和 5 理智，造成 8 伤害，获得 5 煞气。',
  effects: { damage: 8, shaqiGain: 5, hpCost: 5, sanCost: 5 },
  icon: 'burn body',
}

const SHIELD_OF_FAITH: CardDef = {
  id: 'shield_of_faith',
  name: '铜钱护身',
  type: 'skill',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'starter',
  description: '获得与当前煞气等值的护甲。',
  effects: { block: 12, shaqiGain: 0 },
  icon: 'coin shield',
}

// 能力牌 - 兵家
const WARRIOR_ROAR: CardDef = {
  id: 'warrior_roar',
  name: '兵家怒吼',
  type: 'power',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '本战斗中，你的攻击永久 +3。',
  effects: { selfBuff: [{ type: 'attackBuff', amount: 3, duration: 999 }] },
  icon: 'warrior roar',
}

// 技能牌 - 通用
const MADNESS_MANTRA: CardDef = {
  id: 'madness_mantra',
  name: '走火入魔',
  type: 'power',
  cardClass: 'firecraft',
  cost: 0,
  rarity: 'starter',
  description: '强制煞性达到 100，进入入魔状态。',
  effects: {},
  icon: 'madness eye',
}

const EXORCISM_TALISMAN: CardDef = {
  id: 'exorcism_talisman',
  name: '驱魔符',
  type: 'skill',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'starter',
  description: '翻开一张背面朝上的牌，判断真伪。',
  effects: {},
  icon: 'talisman',
}

const CALM_HEART: CardDef = {
  id: 'calm_heart',
  name: '静心诀',
  type: 'skill',
  cardClass: 'puppet',
  cost: 0,
  rarity: 'starter',
  description: '恢复 10 理智。',
  effects: { sanCost: -10 },
  icon: 'calm heart',
}

// ==================== 奖励卡池（第 1 层） ====================

const SHOCK_SLASH: CardDef = {
  id: 'shock_slash',
  name: '顺劈斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '造成 10 伤害。',
  effects: { damage: 10, shaqiGain: 3 },
  icon: 'shock slash',
}

const IRON_WAVE: CardDef = {
  id: 'iron_wave',
  name: '铁壁波',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '造成 7 伤害，获得 5 护甲。',
  effects: { damage: 7, block: 5, shaqiGain: 2 },
  icon: 'iron wave',
}

const BLOOD_DRAIN: CardDef = {
  id: 'blood_drain',
  name: '嗑血',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '造成 5 伤害，获得 8 煞气，自扣 3 HP。',
  effects: { damage: 5, shaqiGain: 8, hpCost: 3 },
  icon: 'blood drain',
}

const QUICK_STRIKE: CardDef = {
  id: 'quick_strike',
  name: '捷击',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '造成 9 伤害，抽 1 张牌。',
  effects: { damage: 9, draw: 1, shaqiGain: 2 },
  icon: 'quick strike',
}

const DAOXIN_POWER: CardDef = {
  id: 'daoxin_power',
  name: '兵权术',
  type: 'power',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '道心层数 +2。',
  effects: { selfBuff: [{ type: 'daoxin', amount: 2, duration: 999 }] },
  icon: 'dao xin',
}

const BLOOD_MERGE: CardDef = {
  id: 'blood_merge',
  name: '禁术·血肉嫁接',
  type: 'power',
  cardClass: 'firecraft',
  cost: 2,
  rarity: 'uncommon',
  description: '永久失去 3 最大HP，所有自残效果翻倍。',
  effects: { selfBuff: [{ type: 'blood_merge', amount: 1, duration: 999 }], hpCost: 3 },
  icon: 'blood merge',
}

// ==================== 敌人 ====================

export const JAW_WORM: EnemyDef = {
  id: 'jaw_worm',
  name: '颌虫',
  hp: 14,
  type: 'normal',
  intents: [
    { type: 'attack', value: 7 },
    { type: 'defend', value: 5 },
    { type: 'attack', value: 7 },
  { type: 'attack', value: 7 },
  ],
  icon: 'jaw worm',
}

export const GHOST: EnemyDef = {
  id: 'ghost',
  name: '画皮',
  hp: 12,
  type: 'normal',
  intents: [
    { type: 'defend', value: 6 },
    { type: 'transform', transform: 'attack', value: 12 },
    { type: 'attack', value: 6 },
  ],
  specialMechanics: '变装回合随机切换意图',
  icon: 'ghost',
}

export const BLOOD_CORPSE: EnemyDef = {
  id: 'blood_corpse',
  name: '尸煞',
  hp: 24,
  type: 'elite',
  intents: [
    { type: 'attack', value: 8 },
    { type: 'attack', value: 8 },
    { type: 'buff', value: 0, buffType: 'weak', buffAmount: 1 },
  ],
  icon: 'blood corpse',
}

// ==================== Boss ====================

const DAN_YANGZI: EnemyDef = {
  id: 'dan_yangzi',
  name: '丹阳子',
  hp: 75,
  type: 'boss',
  phase: 1,
  phaseThreshold: 38,
  specialMechanics: '半仙之体，飞升失败',
  intents: [
    { type: 'attack', value: 12 },
    { type: 'buff', value: 0, buffType: 'poison', buffAmount: 3 },
    { type: 'attack', value: 12 },
    { type: 'attack', value: 12 },
  ],
  icon: 'dan yangzi',
}

export const ALL_CARDS: CardDef[] = [
  STRIKE, STRIKE, STRIKE, STRIKE,
  GUARD, GUARD, GUARD, GUARD, GUARD,
  WILD_SLASH,
  NUO_MASK,
  HEAVY_STRIKE,
]

export const REWARD_CARDS: CardDef[] = [
  SHOCK_SLASH, IRON_WAVE, BLOOD_DRAIN, QUICK_STRIKE,
  DAOXIN_POWER, CALM_HEART, EXORCISM_TALISMAN, BLOOD_MERGE,
  BLOOD_BLADE, BURN_BODY, HEAVY_STRIKE,
]

export const ALL_ENEMIES: EnemyDef[] = [JAW_WORM, GHOST, BLOOD_CORPSE]
export const BOSS_ENEMY: EnemyDef = DAN_YANGZI
