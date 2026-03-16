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

// ==================== 第 2 层奖励卡池 ====================

// 血煞斩 - 高费高伤自残卡
const BLOOD_SHA_SLASH: CardDef = {
  id: 'blood_sha_slash',
  name: '血煞斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 2,
  rarity: 'uncommon',
  description: '造成 20 伤害，消耗 5 HP，获得 10 煞气。',
  effects: { damage: 20, shaqiGain: 10, hpCost: 5 },
  icon: 'blood sha slash',
}

// 鬼影步 - 条件增益技能
const GHOST_STEP: CardDef = {
  id: 'ghost_step',
  name: '鬼影步',
  type: 'skill',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'uncommon',
  description: '获得 12 护甲。若煞气 ≥50，额外抽 1 张牌。',
  effects: { block: 12, draw: 1, shaqiGain: 0 },
  icon: 'ghost step',
}

// 破心击 - 处决型攻击
const HEARTBREAKER: CardDef = {
  id: 'heartbreaker',
  name: '破心击',
  type: 'attack',
  cardClass: 'warrior',
  cost: 2,
  rarity: 'uncommon',
  description: '造成 12 伤害。若敌人 HP < 50%，伤害翻倍。',
  effects: { damage: 12, shaqiGain: 3 },
  icon: 'heartbreaker',
}

// 傩舞 - 煞气成长能力牌
const NUO_DANCE: CardDef = {
  id: 'nuo_dance',
  name: '傩舞',
  type: 'power',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'rare',
  description: '本场战斗，每打出一张攻击牌获得 2 煞气。',
  effects: { selfBuff: [{ type: 'shaqiOnAttack', amount: 2, duration: 999 }] },
  icon: 'nuo dance',
}

// 禁术·血祭 - 终极自残牌
const BLOOD_SACRIFICE: CardDef = {
  id: 'blood_sacrifice',
  name: '禁术·血祭',
  type: 'attack',
  cardClass: 'firecraft',
  cost: 3,
  rarity: 'rare',
  description: '消耗 15 HP，造成 40 伤害。',
  effects: { damage: 40, shaqiGain: 5, hpCost: 15 },
  icon: 'blood sacrifice',
}

// 心眼 - 高风险抽牌
const MIND_EYE: CardDef = {
  id: 'mind_eye',
  name: '心眼',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'uncommon',
  description: '抽 2 张牌。若煞气 ≥70，额外消耗 2 理智。',
  effects: { draw: 2, sanCost: 2 },
  icon: 'mind eye',
}

// ==================== 第 2 层敌人 ====================

// 煞鬼 - 高攻低防
export const SHA_GHOST: EnemyDef = {
  id: 'sha_ghost',
  name: '煞鬼',
  hp: 22,
  type: 'normal',
  intents: [
    { type: 'attack', value: 10 },
    { type: 'attack', value: 10 },
    { type: 'defend', value: 8 },
    { type: 'attack', value: 12 },
  ],
  icon: 'sha ghost',
}

// 心魔 - 攻击理智
export const HEART_DEMON: EnemyDef = {
  id: 'heart_demon',
  name: '心魔',
  hp: 18,
  type: 'normal',
  intents: [
    { type: 'defend', value: 6 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 8 },
    { type: 'attack', value: 8 },
    { type: 'attack', value: 8 },
  ],
  specialMechanics: '攻击玩家的理智',
  icon: 'heart demon',
}

// 血傀儡 - 成长型精英
export const BLOOD_PUPPET: EnemyDef = {
  id: 'blood_puppet',
  name: '血傀儡',
  hp: 55,
  type: 'elite',
  intents: [
    { type: 'attack', value: 12 },
    { type: 'attack', value: 12 },
    { type: 'buff', value: 0, buffType: 'strength', buffAmount: 3 },
    { type: 'attack', value: 16 },
  ],
  specialMechanics: '每3回合获得力量',
  icon: 'blood puppet',
}

// ==================== 第 3 层奖励卡池 ====================

// 虚空斩 - 道心联动攻击
const VOID_STRIKE: CardDef = {
  id: 'void_strike',
  name: '虚空斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 2,
  rarity: 'rare',
  description: '造成 25 伤害。每有 1 层道心，额外造成 3 伤害。',
  effects: { damage: 25, shaqiGain: 5 },
  icon: 'void strike',
}

// 燃魂术 - 理智换伤害
const SOUL_BURN: CardDef = {
  id: 'soul_burn',
  name: '燃魂术',
  type: 'attack',
  cardClass: 'firecraft',
  cost: 1,
  rarity: 'uncommon',
  description: '消耗 10 理智，造成 30 伤害。',
  effects: { damage: 30, shaqiGain: 8, sanCost: 10 },
  icon: 'soul burn',
}

// 傀儡师 - 技能增强
const PUPPET_MASTER: CardDef = {
  id: 'puppet_master',
  name: '傀儡师',
  type: 'power',
  cardClass: 'puppet',
  cost: 2,
  rarity: 'rare',
  description: '本场战斗，你的技能牌额外获得 +4 护甲。',
  effects: { selfBuff: [{ type: 'skillArmor', amount: 4, duration: 999 }] },
  icon: 'puppet master',
}

// 附身术 - 极端入魔
const DEMON_POSSESS: CardDef = {
  id: 'demon_possess',
  name: '附身术',
  type: 'power',
  cardClass: 'firecraft',
  cost: 1,
  rarity: 'rare',
  description: '进入入魔状态，但 HP 降到 1。入魔结束时恢复 30 HP。',
  effects: { selfBuff: [{ type: 'demonPossess', amount: 1, duration: 999 }] },
  icon: 'demon possess',
}

// 血怒 - 牺牲抽牌
const BLOOD_FURY: CardDef = {
  id: 'blood_fury',
  name: '血怒',
  type: 'skill',
  cardClass: 'warrior',
  cost: 0,
  rarity: 'common',
  description: '失去 5 HP，抽 2 张牌。',
  effects: { draw: 2, hpCost: 5 },
  icon: 'blood fury',
}

// 心素屏障 - 理智条件护甲
const SPIRIT_SHIELD: CardDef = {
  id: 'spirit_shield',
  name: '心素屏障',
  type: 'skill',
  cardClass: 'puppet',
  cost: 2,
  rarity: 'uncommon',
  description: '获得 20 护甲。若理智 < 50，额外获得 10 护甲。',
  effects: { block: 20, shaqiGain: 0 },
  icon: 'spirit shield',
}

// 必杀刃 - 击杀恢复
const FATAL_BLADE: CardDef = {
  id: 'fatal_blade',
  name: '必杀刃',
  type: 'attack',
  cardClass: 'warrior',
  cost: 3,
  rarity: 'legendary',
  description: '造成 40 伤害。若击杀敌人，恢复 20 HP。',
  effects: { damage: 40, shaqiGain: 8 },
  icon: 'fatal blade',
}

// 合道 - 道心翻倍
const DAO_MERGE: CardDef = {
  id: 'dao_merge',
  name: '合道',
  type: 'power',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'rare',
  description: '道心层数翻倍。',
  effects: { selfBuff: [{ type: 'daoxinDouble', amount: 1, duration: 999 }] },
  icon: 'dao merge',
}

// ==================== 第 3 层敌人 ====================

// 煞魔 - 高伤害成长型
export const SHA_DEMON: EnemyDef = {
  id: 'sha_demon',
  name: '煞魔',
  hp: 35,
  type: 'normal',
  intents: [
    { type: 'attack', value: 14 },
    { type: 'attack', value: 14 },
    { type: 'buff', value: 0, buffType: 'strength', buffAmount: 4 },
    { type: 'attack', value: 18 },
  ],
  specialMechanics: '每3回合获得力量',
  icon: 'sha demon',
}

// 心煞 - 理智攻击型
export const HEART_SHA: EnemyDef = {
  id: 'heart_sha',
  name: '心煞',
  hp: 28,
  type: 'normal',
  intents: [
    { type: 'defend', value: 10 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 12 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 12 },
    { type: 'attack', value: 10 },
  ],
  specialMechanics: '攻击玩家的理智',
  icon: 'heart sha',
}

// 血尸 - 自愈型
export const BLOOD_CORPSE_2: EnemyDef = {
  id: 'blood_corpse_2',
  name: '血尸',
  hp: 40,
  type: 'normal',
  intents: [
    { type: 'attack', value: 10 },
    { type: 'attack', value: 10 },
    { type: 'defend', value: 12 },
    { type: 'attack', value: 14 },
  ],
  specialMechanics: '高血量防御型',
  icon: 'blood corpse 2',
}

// 血煞宗师 - 第3层精英
export const BLOOD_SHA_MASTER: EnemyDef = {
  id: 'blood_sha_master',
  name: '血煞宗师',
  hp: 80,
  type: 'elite',
  intents: [
    { type: 'attack', value: 15 },
    { type: 'attack', value: 15 },
    { type: 'buff', value: 0, buffType: 'strength', buffAmount: 5 },
    { type: 'attack', value: 20 },
    { type: 'attack', value: 20 },
  ],
  specialMechanics: '高血量高伤害，力量成长',
  icon: 'blood sha master',
}

// ==================== 第 3 层 Boss ====================

// 黑莲老祖 - 最终Boss
const BLACK_LOTUS_ANCESTOR: EnemyDef = {
  id: 'black_lotus_ancestor',
  name: '黑莲老祖',
  hp: 120,
  type: 'boss',
  phase: 1,
  phaseThreshold: 60,
  specialMechanics: '黑莲化身，修仙界魔头',
  intents: [
    { type: 'attack', value: 18 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 10 },
    { type: 'defend', value: 15 },
    { type: 'attack', value: 18 },
  ],
  icon: 'black lotus ancestor',
}

// ==================== 第 2 层导出 ====================

export const REWARD_CARDS_LAYER2: CardDef[] = [
  BLOOD_SHA_SLASH, GHOST_STEP, HEARTBREAKER,
  NUO_DANCE, BLOOD_SACRIFICE, MIND_EYE,
]

export const ALL_ENEMIES_LAYER2: EnemyDef[] = [SHA_GHOST, HEART_DEMON]
export const ELITE_ENEMY_LAYER2: EnemyDef = BLOOD_PUPPET

// ==================== 第 3 层导出 ====================

export const REWARD_CARDS_LAYER3: CardDef[] = [
  VOID_STRIKE, SOUL_BURN, PUPPET_MASTER,
  DEMON_POSSESS, BLOOD_FURY, SPIRIT_SHIELD,
  FATAL_BLADE, DAO_MERGE,
]

export const ALL_ENEMIES_LAYER3: EnemyDef[] = [SHA_DEMON, HEART_SHA, BLOOD_CORPSE_2]
export const ELITE_ENEMY_LAYER3: EnemyDef = BLOOD_SHA_MASTER
export const BOSS_ENEMY_LAYER3: EnemyDef = BLACK_LOTUS_ANCESTOR

// ==================== 基础导出 ====================

export const ALL_CARDS: CardDef[] = [
  STRIKE, STRIKE, STRIKE, STRIKE,
  GUARD, GUARD, GUARD, GUARD,
  WILD_SLASH,
  NUO_MASK,
  HEAVY_STRIKE,
  EXORCISM_TALISMAN,  // 初始携带一张驱魔符
]

export const REWARD_CARDS: CardDef[] = [
  SHOCK_SLASH, IRON_WAVE, BLOOD_DRAIN, QUICK_STRIKE,
  DAOXIN_POWER, CALM_HEART, EXORCISM_TALISMAN, BLOOD_MERGE,
  BLOOD_BLADE, BURN_BODY, HEAVY_STRIKE,
  SHIELD_OF_FAITH, WARRIOR_ROAR, MADNESS_MANTRA,
]

export const ALL_ENEMIES: EnemyDef[] = [JAW_WORM, GHOST]
export const ELITE_ENEMY: EnemyDef = BLOOD_CORPSE
export const BOSS_ENEMY: EnemyDef = DAN_YANGZI
