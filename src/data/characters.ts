import type { CharacterDef } from '../game/types'

/**
 * 默认角色：心素（李火旺）
 * 
 * 心素是道诡修仙录的主角，拥有强大的精神力量。
 * 特点：均衡的属性，适合新手
 */
export const CHARACTER_XINSU: CharacterDef = {
  id: 'xinsu',
  name: '李火旺',
  title: '心素',
  maxHp: 80,
  maxSan: 100,
  maxShaqi: 100,
  maxEnergy: 3,
  startingDeck: [
    'strike', 'strike', 'strike', 'strike',  // 4x 挥刀
    'guard', 'guard', 'guard', 'guard',      // 4x 防御
    'wild_slash',                             // 1x 狂斩
    'nuo_mask',                               // 1x 傩面
    'heavy_strike',                           // 1x 重击
    'exorcism_talisman',                      // 1x 驱魔符
  ],
  icon: 'heart',
  description: '心素体质，精神力量强大。均衡型角色，适合新手。',
}

/**
 * 法教角色：张道陵
 * 
 * 法教弟子，正统修仙者。以法术护盾为核心。
 * 特点：稳定输出，护盾续航，低风险
 */
export const CHARACTER_FAJIAO: CharacterDef = {
  id: 'fajiao',
  name: '张道陵',
  title: '法教弟子',
  maxHp: 75,
  maxSan: 100,
  maxShaqi: 100,
  maxEnergy: 3,
  startingDeck: [
    'talisman_sword', 'talisman_sword', 'talisman_sword', 'talisman_sword',  // 4x 符剑
    'protection_charm', 'protection_charm', 'protection_charm', 'protection_charm',  // 4x 护身咒
    'true_fire_charm',    // 1x 真火咒
    'golden_light_charm', // 1x 金光咒
    'exorcism_charm',     // 1x 驱邪符
    'thunder_method',     // 1x 雷法
  ],
  icon: 'scroll',
  description: '正统修仙，法术护盾。稳定型角色，低风险持续输出。',
}

/**
 * 坐忘道角色：骰子
 * 
 * 坐忘道人，以假乱真。以幻象诡道为核心。
 * 特点：高风险赌博，随机效果，运气为王
 */
export const CHARACTER_ZUOWANG: CharacterDef = {
  id: 'zuowang',
  name: '骰子',
  title: '坐忘道人',
  maxHp: 70,
  maxSan: 100,
  maxShaqi: 100,
  maxEnergy: 3,
  startingDeck: [
    'illusion_sword', 'illusion_sword', 'illusion_sword', 'illusion_sword',  // 4x 虚剑
    'false_mask', 'false_mask', 'false_mask', 'false_mask',  // 4x 假面
    'truth_or_dare',      // 1x 真假难辨
    'deceive_heaven',     // 1x 欺天之术
    'zuowang_sutra',      // 1x 坐忘心经
    'steal_heaven',       // 1x 偷天换日
  ],
  icon: 'mask',
  description: '以假乱真，幻象诡道。赌博型角色，高风险高回报。',
}

/**
 * 所有可用角色
 */
export const ALL_CHARACTERS: CharacterDef[] = [
  CHARACTER_XINSU,
  CHARACTER_FAJIAO,
  CHARACTER_ZUOWANG,
]

/**
 * 根据ID获取角色定义
 */
export function getCharacterById(id: string): CharacterDef | undefined {
  return ALL_CHARACTERS.find(c => c.id === id)
}