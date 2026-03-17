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
  description: '造成 9 点伤害。',
  effects: { damage: 9, shaqiGain: 3 },
  icon: 'sword strike',
}

const WILD_SLASH: CardDef = {
  id: 'wild_slash',
  name: '狂斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'starter',
  description: '造成 7 伤害，获得 5 煞气。',
  effects: { damage: 7, shaqiGain: 5 },
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
  description: '造成 14 伤害，获得 3 煞气。',
  effects: { damage: 14, shaqiGain: 3 },
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
  effects: { blockFromShaqi: true, shaqiGain: 0 },
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

// ==================== 法教初始卡牌 ====================

// 符剑 - 法教基础攻击
const TALISMAN_SWORD: CardDef = {
  id: 'talisman_sword',
  name: '符剑',
  type: 'attack',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '造成 7 伤害。法教基础剑术。',
  effects: { damage: 7, shaqiGain: 2 },
  icon: 'talisman sword',
}

// 护身咒 - 法教基础防御
const PROTECTION_CHARM: CardDef = {
  id: 'protection_charm',
  name: '护身咒',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '获得 6 护甲。',
  effects: { block: 6, shaqiGain: 0 },
  icon: 'protection charm',
}

// 真火咒 - 法教火攻
const TRUE_FIRE_CHARM: CardDef = {
  id: 'true_fire_charm',
  name: '真火咒',
  type: 'attack',
  cardClass: 'firecraft',
  cost: 1,
  rarity: 'starter',
  description: '造成 10 伤害。',
  effects: { damage: 10, shaqiGain: 3 },
  icon: 'true fire',
}

// 金光咒 - 法教强力护盾
const GOLDEN_LIGHT_CHARM: CardDef = {
  id: 'golden_light_charm',
  name: '金光咒',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '获得 10 护甲。',
  effects: { block: 10, shaqiGain: 0 },
  icon: 'golden light',
}

// 驱邪符 - 法教抽牌
const EXORCISM_CHARM: CardDef = {
  id: 'exorcism_charm',
  name: '驱邪符',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '抽 1 张牌，获得 2 煞气。',
  effects: { draw: 1, shaqiGain: 2 },
  icon: 'exorcism charm',
}

// 雷法 - 法教高费攻击
const THUNDER_METHOD: CardDef = {
  id: 'thunder_method',
  name: '雷法',
  type: 'attack',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'starter',
  description: '造成 18 伤害。',
  effects: { damage: 18, shaqiGain: 5 },
  icon: 'thunder method',
}

// ==================== 坐忘道初始卡牌 ====================

// 虚剑 - 坐忘道基础攻击（幻象）
const ILLUSION_SWORD: CardDef = {
  id: 'illusion_sword',
  name: '虚剑',
  type: 'attack',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '【幻象】造成 6 伤害。50%概率双倍效果，25%概率无效果。',
  effects: { damage: 6, shaqiGain: 2 },
  icon: 'illusion sword',
  illusion: true,
}

// 假面 - 坐忘道基础防御（幻象）
const FALSE_MASK: CardDef = {
  id: 'false_mask',
  name: '假面',
  type: 'skill',
  cardClass: 'puppet',
  cost: 1,
  rarity: 'starter',
  description: '【幻象】获得 5 护甲。50%概率双倍效果，25%概率无效果。',
  effects: { block: 5, shaqiGain: 0 },
  icon: 'false mask',
  illusion: true,
}

// 真假难辨 - 坐忘道随机攻击
const TRUTH_OR_DARE: CardDef = {
  id: 'truth_or_dare',
  name: '真假难辨',
  type: 'attack',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '造成 8 伤害，50% 概率再造成 8 伤害。',
  effects: { damage: 8, shaqiGain: 3 },
  icon: 'truth or dare',
}

// 欺天之术 - 坐忘道抽牌
const DECEIVE_HEAVEN: CardDef = {
  id: 'deceive_heaven',
  name: '欺天之术',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'starter',
  description: '抽 2 张牌，25% 概率弃 2 张牌。',
  effects: { draw: 2, shaqiGain: 0 },
  icon: 'deceive heaven',
}

// 坐忘心经 - 坐忘道能力牌
const ZUOWANG_SUTRA: CardDef = {
  id: 'zuowang_sutra',
  name: '坐忘心经',
  type: 'power',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'starter',
  description: '本战斗中，幻象牌双倍效果概率 +25%。',
  effects: { selfBuff: [{ type: 'illusionBoost', amount: 25, duration: 999 }] },
  icon: 'zuowang sutra',
}

// 偷天换日 - 坐忘道高费幻象攻击
const STEAL_HEAVEN: CardDef = {
  id: 'steal_heaven',
  name: '偷天换日',
  type: 'attack',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'starter',
  description: '【幻象】造成 12 伤害。50%概率双倍效果，25%概率无效果。',
  effects: { damage: 12, shaqiGain: 4 },
  icon: 'steal heaven',
  illusion: true,
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

// 鬼面 - 第1层防御型敌人
export const GHOST_FACE: EnemyDef = {
  id: 'ghost_face',
  name: '鬼面',
  hp: 10,
  type: 'normal',
  intents: [
    { type: 'defend', value: 8 },
    { type: 'defend', value: 6 },
    { type: 'attack', value: 5 },
    { type: 'attack', value: 5 },
  ],
  specialMechanics: '低HP高防御，适合新手练习',
  icon: 'ghost face',
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
  effects: { 
    block: 12, 
    shaqiGain: 0,
    conditional: {
      condition: { type: 'shaqi_gte', value: 50 },
      bonusDraw: 1
    }
  },
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
  effects: { 
    damage: 12, 
    shaqiGain: 3,
    conditional: {
      condition: { type: 'enemy_hp_pct_lte', value: 50 },
      damageMultiplier: 2
    }
  },
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
  effects: { 
    draw: 2,
    conditional: {
      condition: { type: 'shaqi_gte', value: 70 },
      bonusSanCost: 2
    }
  },
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

// 阴魂 - 第2层理智攻击型
export const YIN_SOUL: EnemyDef = {
  id: 'yin_soul',
  name: '阴魂',
  hp: 20,
  type: 'normal',
  intents: [
    { type: 'defend', value: 6 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 8 },
    { type: 'attack', value: 9 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 10 },
  ],
  specialMechanics: '持续攻击玩家理智',
  icon: 'yin soul',
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
  effects: { damage: 25, shaqiGain: 5, damagePerDaoxin: 3 },
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
  effects: { 
    block: 20, 
    shaqiGain: 0,
    conditional: {
      condition: { type: 'san_lte', value: 49 },
      bonusBlock: 10
    }
  },
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

// ==================== 新增卡牌（v0.6.1） ====================

// --- 攻击牌 ---

// 噬魂斩 - 消耗理智高伤害
const SOUL_DEVOUR_SLASH: CardDef = {
  id: 'soul_devour_slash',
  name: '噬魂斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 2,
  rarity: 'uncommon',
  description: '造成 20 伤害。失去 10 理智。',
  effects: { damage: 20, shaqiGain: 5, sanCost: 10 },
  icon: 'soul devour slash',
}

// 连环斩 - 低伤害连击（通过打出两次实现）
const CHAIN_SLASH: CardDef = {
  id: 'chain_slash',
  name: '连环斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'common',
  description: '造成 8 伤害。若煞气 >= 30，伤害翻倍。',
  effects: { 
    damage: 8, 
    shaqiGain: 3,
    conditional: {
      condition: { type: 'shaqi_gte', value: 30 },
      damageMultiplier: 2
    }
  },
  icon: 'chain slash',
}

// 血祭斩 - HP换伤害
const BLOOD_SACRIFICE_SLASH: CardDef = {
  id: 'blood_sacrifice_slash',
  name: '血祭斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'uncommon',
  description: '消耗 8 HP，造成 18 伤害。',
  effects: { damage: 18, shaqiGain: 6, hpCost: 8 },
  icon: 'blood sacrifice slash',
}

// --- 技能牌 ---

// 心眼 - 抽牌+护甲
const MINDS_EYE: CardDef = {
  id: 'minds_eye',
  name: '心眼',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'common',
  description: '获得 4 护甲，抽 1 张牌。',
  effects: { block: 4, draw: 1, shaqiGain: 0 },
  icon: 'minds eye',
}

// 驱邪咒 - 移除debuff
const EXORCISM_CURSE: CardDef = {
  id: 'exorcism_curse',
  name: '驱邪咒',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'uncommon',
  description: '清除所有负面状态。获得 5 煞气。',
  effects: { selfBuff: [{ type: 'cleanse', amount: 1, duration: 0 }], shaqiGain: 5 },
  icon: 'exorcism curse',
}

// 血祭仪式 - HP换煞气
const BLOOD_RITUAL: CardDef = {
  id: 'blood_ritual',
  name: '血祭仪式',
  type: 'skill',
  cardClass: 'firecraft',
  cost: 0,
  rarity: 'common',
  description: '消耗 6 HP，获得 15 煞气。',
  effects: { hpCost: 6, shaqiGain: 15 },
  icon: 'blood ritual',
}

// 冥想 - 获得道心
const MEDITATION: CardDef = {
  id: 'meditation',
  name: '冥想',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'common',
  description: '获得 3 层道心。',
  effects: { selfBuff: [{ type: 'daoxin', amount: 3, duration: 999 }] },
  icon: 'meditation',
}

// 破魔眼 - 视幻觉为真
const BREAK_ILLUSION: CardDef = {
  id: 'break_illusion',
  name: '破魔眼',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'rare',
  description: '本回合所有幻觉牌视为真牌。',
  effects: { selfBuff: [{ type: 'trueSight', amount: 1, duration: 1 }] },
  icon: 'break illusion',
}

// 回春术 - 恢复HP（通过自buff实现）
const HEALING_ART: CardDef = {
  id: 'healing_art',
  name: '回春术',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'common',
  description: '恢复 8 HP。',
  effects: { selfBuff: [{ type: 'regen', amount: 8, duration: 0 }] },
  icon: 'healing art',
}

// --- 能力牌 ---

// 煞气护体 - 受伤获得煞气
const SHAQI_ARMOR: CardDef = {
  id: 'shaqi_armor',
  name: '煞气护体',
  type: 'power',
  cardClass: 'warrior',
  cost: 1,
  rarity: 'uncommon',
  description: '每当受到伤害，获得 2 煞气。',
  effects: { selfBuff: [{ type: 'shaqiOnHit', amount: 2, duration: 999 }] },
  icon: 'shaqi armor',
}

// 心魔引 - 入魔恢复理智
const HEART_DEMON_GUIDE: CardDef = {
  id: 'heart_demon_guide',
  name: '心魔引',
  type: 'power',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'rare',
  description: '入魔结束时恢复 30 理智。',
  effects: { selfBuff: [{ type: 'sanRecoveryOnMadnessEnd', amount: 30, duration: 999 }] },
  icon: 'heart demon guide',
}

// 疯狂增幅 - 入魔伤害提升
const MADNESS_AMPLIFY: CardDef = {
  id: 'madness_amplify',
  name: '疯狂增幅',
  type: 'power',
  cardClass: 'firecraft',
  cost: 1,
  rarity: 'uncommon',
  description: '入魔时额外获得 50% 伤害加成。',
  effects: { selfBuff: [{ type: 'madnessDamageBoost', amount: 50, duration: 999 }] },
  icon: 'madness amplify',
}

// 幻觉掌控 - 降低幻觉概率
const ILLUSION_MASTERY: CardDef = {
  id: 'illusion_mastery',
  name: '幻觉掌控',
  type: 'power',
  cardClass: 'sorcerer',
  cost: 1,
  rarity: 'uncommon',
  description: '幻觉牌出现概率降低 50%。',
  effects: { selfBuff: [{ type: 'reduceIllusionChance', amount: 50, duration: 999 }] },
  icon: 'illusion mastery',
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
    { type: 'attack', value: 9 },
    { type: 'attack', value: 9 },
    { type: 'defend', value: 12 },
    { type: 'attack', value: 12 },
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

// 血影 - 第3层精英（备选）
export const BLOOD_SHADOW: EnemyDef = {
  id: 'blood_shadow',
  name: '血影',
  hp: 65,
  type: 'elite',
  intents: [
    { type: 'attack', value: 14 },
    { type: 'attack', value: 14 },
    { type: 'defend', value: 12 },
    { type: 'attack', value: 18 },
    { type: 'heal', value: 15 },
  ],
  specialMechanics: '高伤自愈型，需要速战速决',
  icon: 'blood shadow',
}

// ==================== 第 3 层 Boss ====================

// 黑莲老祖 - 最终Boss
const BLACK_LOTUS_ANCESTOR: EnemyDef = {
  id: 'black_lotus_ancestor',
  name: '黑莲老祖',
  hp: 110,
  type: 'boss',
  phase: 1,
  phaseThreshold: 55,
  specialMechanics: '黑莲化身，修仙界魔头。开场施加黑莲诅咒（每回合-5理智），阶段2可恢复HP。',
  // 阶段1意图
  intents: [
    { type: 'attack', value: 16 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 8 },
    { type: 'defend', value: 15 },
    { type: 'attack', value: 16 },
    // 阶段2额外意图（HP <= 55时）
    { type: 'heal', value: 8 },  // 黑莲绽放：恢复HP
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 12 },  // 心素撕裂
  ],
  icon: 'black lotus ancestor',
}

// ==================== 第 4 层敌人 ====================

// 天煞 - 极高伤害+理智攻击组合
const HEAVENLY_SHA: EnemyDef = {
  id: 'heavenly_sha',
  name: '天煞',
  hp: 45,
  type: 'normal',
  intents: [
    { type: 'attack', value: 18 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 10 },
    { type: 'attack', value: 18 },
    { type: 'attack', value: 22 },
  ],
  specialMechanics: '天降之煞，高伤害+理智攻击组合',
  icon: 'heavenly sha',
}

// 心魔将 - 高血量+力量成长
const HEART_DEMON_GENERAL: EnemyDef = {
  id: 'heart_demon_general',
  name: '心魔将',
  hp: 55,
  type: 'normal',
  intents: [
    { type: 'defend', value: 12 },
    { type: 'attack', value: 16 },
    { type: 'buff', value: 0, buffType: 'strength', buffAmount: 6 },
    { type: 'attack', value: 20 },
    { type: 'attack', value: 24 },
  ],
  specialMechanics: '心魔大军将领，高血量+力量成长',
  icon: 'heart demon general',
}

// 黑莲信徒 - 诅咒型敌人
const BLACK_LOTUS_DISCIPLE: EnemyDef = {
  id: 'black_lotus_disciple',
  name: '黑莲信徒',
  hp: 38,
  type: 'normal',
  intents: [
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 8 },
    { type: 'attack', value: 14 },
    { type: 'defend', value: 10 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 12 },
    { type: 'attack', value: 16 },
  ],
  specialMechanics: '黑莲老祖信徒，诅咒攻击',
  icon: 'black lotus disciple',
}

// 黑莲护法 - 第4层精英
const BLACK_LOTUS_GUARDIAN: EnemyDef = {
  id: 'black_lotus_guardian',
  name: '黑莲护法',
  hp: 95,
  type: 'elite',
  intents: [
    { type: 'attack', value: 18 },
    { type: 'defend', value: 15 },
    { type: 'buff', value: 0, buffType: 'sanDrain', buffAmount: 10 },
    { type: 'attack', value: 22 },
    { type: 'buff', value: 0, buffType: 'strength', buffAmount: 5 },
    { type: 'attack', value: 26 },
  ],
  specialMechanics: '黑莲老祖护法，高血量+理智攻击+力量成长',
  icon: 'black lotus guardian',
}

// ==================== 第 4 层奖励卡牌 ====================

// 天命斩 - 高费高伤，入魔加成
const HEAVENLY_JUDGMENT: CardDef = {
  id: 'heavenly_judgment',
  name: '天命斩',
  type: 'attack',
  cardClass: 'warrior',
  cost: 3,
  rarity: 'rare',
  description: '造成 25 伤害。若已入魔，伤害 +15。',
  effects: {
    damage: 25,
    shaqiGain: 8,
    conditional: {
      condition: { type: 'madness' },
      damageBonus: 15
    }
  },
  icon: 'heavenly judgment',
}

// 最终解脱 - 消耗HP造成大量伤害
const FINAL_RELEASE: CardDef = {
  id: 'final_release',
  name: '最终解脱',
  type: 'attack',
  cardClass: 'firecraft',
  cost: 2,
  rarity: 'rare',
  description: '消耗 15 HP，造成 35 伤害。',
  effects: { damage: 35, shaqiGain: 10, hpCost: 15 },
  icon: 'final release',
}

// 轮回护盾 - 高护甲+自我回复
const REINCARNATION_SHIELD: CardDef = {
  id: 'reincarnation_shield',
  name: '轮回护盾',
  type: 'skill',
  cardClass: 'sorcerer',
  cost: 2,
  rarity: 'rare',
  description: '获得 20 护甲。回合结束时恢复 8 HP。',
  effects: { block: 20, selfBuff: [{ type: 'regen', amount: 8, duration: 1 }], shaqiGain: 0 },
  icon: 'reincarnation shield',
}

// ==================== 第 2 层导出 ====================

export const REWARD_CARDS_LAYER2: CardDef[] = [
  BLOOD_SHA_SLASH, GHOST_STEP, HEARTBREAKER,
  NUO_DANCE, BLOOD_SACRIFICE, MIND_EYE,
]

export const ALL_ENEMIES_LAYER2: EnemyDef[] = [SHA_GHOST, HEART_DEMON, YIN_SOUL]
export const ELITE_ENEMY_LAYER2: EnemyDef = BLOOD_PUPPET

// ==================== 第 3 层导出 ====================

export const REWARD_CARDS_LAYER3: CardDef[] = [
  VOID_STRIKE, SOUL_BURN, PUPPET_MASTER,
  DEMON_POSSESS, BLOOD_FURY, SPIRIT_SHIELD,
  FATAL_BLADE, DAO_MERGE,
  // v0.6.1 新增
  SOUL_DEVOUR_SLASH, CHAIN_SLASH, BLOOD_SACRIFICE_SLASH,
  MINDS_EYE, EXORCISM_CURSE, BLOOD_RITUAL, MEDITATION, BREAK_ILLUSION, HEALING_ART,
  SHAQI_ARMOR, HEART_DEMON_GUIDE, MADNESS_AMPLIFY, ILLUSION_MASTERY,
]

export const ALL_ENEMIES_LAYER3: EnemyDef[] = [SHA_DEMON, HEART_SHA, BLOOD_CORPSE_2]
export const ELITE_ENEMY_LAYER3: EnemyDef = BLOOD_SHA_MASTER
export const ELITE_ENEMY_LAYER3_ALT: EnemyDef = BLOOD_SHADOW
export const BOSS_ENEMY_LAYER3: EnemyDef = BLACK_LOTUS_ANCESTOR

// ==================== 第 4 层导出 ====================

export const REWARD_CARDS_LAYER4: CardDef[] = [
  HEAVENLY_JUDGMENT, FINAL_RELEASE, REINCARNATION_SHIELD,
  // 继承第3层卡牌
  VOID_STRIKE, SOUL_BURN, FATAL_BLADE, DAO_MERGE,
]

export const ALL_ENEMIES_LAYER4: EnemyDef[] = [HEAVENLY_SHA, HEART_DEMON_GENERAL, BLACK_LOTUS_DISCIPLE]
export const ELITE_ENEMY_LAYER4: EnemyDef = BLACK_LOTUS_GUARDIAN

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

export const ALL_ENEMIES: EnemyDef[] = [JAW_WORM, GHOST, GHOST_FACE]
export const ELITE_ENEMY: EnemyDef = BLOOD_CORPSE
export const BOSS_ENEMY: EnemyDef = DAN_YANGZI

// ==================== 卡牌查找 ====================

// 所有卡牌定义的映射表（用于根据ID查找卡牌）
const ALL_CARD_DEFS: CardDef[] = [
  // 心素初始卡牌
  STRIKE, WILD_SLASH, BLOOD_BLADE, GUARD, NUO_MASK, HEAVY_STRIKE,
  BURN_BODY, SHIELD_OF_FAITH, WARRIOR_ROAR, MADNESS_MANTRA, EXORCISM_TALISMAN, CALM_HEART,
  // 法教初始卡牌
  TALISMAN_SWORD, PROTECTION_CHARM, TRUE_FIRE_CHARM, GOLDEN_LIGHT_CHARM, EXORCISM_CHARM, THUNDER_METHOD,
  // 坐忘道初始卡牌
  ILLUSION_SWORD, FALSE_MASK, TRUTH_OR_DARE, DECEIVE_HEAVEN, ZUOWANG_SUTRA, STEAL_HEAVEN,
  // 第1层奖励卡
  SHOCK_SLASH, IRON_WAVE, BLOOD_DRAIN, QUICK_STRIKE, DAOXIN_POWER, BLOOD_MERGE,
  // 第2层奖励卡
  BLOOD_SHA_SLASH, GHOST_STEP, HEARTBREAKER, NUO_DANCE, BLOOD_SACRIFICE, MIND_EYE,
  // 第3层奖励卡
  VOID_STRIKE, SOUL_BURN, PUPPET_MASTER, DEMON_POSSESS, BLOOD_FURY, SPIRIT_SHIELD, FATAL_BLADE, DAO_MERGE,
  // v0.6.1 新增卡牌
  SOUL_DEVOUR_SLASH, CHAIN_SLASH, BLOOD_SACRIFICE_SLASH,
  MINDS_EYE, EXORCISM_CURSE, BLOOD_RITUAL, MEDITATION, BREAK_ILLUSION, HEALING_ART,
  SHAQI_ARMOR, HEART_DEMON_GUIDE, MADNESS_AMPLIFY, ILLUSION_MASTERY,
  // 第4层专属卡牌
  HEAVENLY_JUDGMENT, FINAL_RELEASE, REINCARNATION_SHIELD,
]

// 卡牌ID到定义的映射
const CARD_MAP: Record<string, CardDef> = {}
for (const card of ALL_CARD_DEFS) {
  CARD_MAP[card.id] = card
}

/**
 * 根据卡牌ID获取卡牌定义
 */
export function getCardById(id: string): CardDef | undefined {
  return CARD_MAP[id]
}

/**
 * 根据卡牌ID列表获取卡牌定义数组
 */
export function getCardsByIds(ids: string[]): CardDef[] {
  return ids.map(id => CARD_MAP[id]).filter((c): c is CardDef => c != null)
}
