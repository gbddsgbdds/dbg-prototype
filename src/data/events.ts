import type { GameEvent } from '../game/types'

// 随机事件池
export const GAME_EVENTS: GameEvent[] = [
  // ===== 正面事件 =====
  {
    id: 'healing_spring',
    title: '灵泉',
    description: '你发现一处灵泉，泉水清澈见底，散发着淡淡灵气。饮下泉水，身心舒畅。',
    autoEffects: { hp: 15, san: 10 },
  },
  {
    id: 'abandoned_cache',
    title: '遗落宝箱',
    description: '路边草丛中有一个被遗落的宝箱，里面有些许财物。',
    autoEffects: { gold: 30 },
  },
  {
    id: 'cultivation_epiphany',
    title: '顿悟',
    description: '静坐冥想间，你突然有所感悟，煞气运转更加顺畅。',
    autoEffects: { shaqi: -20 },
  },
  {
    id: 'friendly_traveler',
    title: '路遇高人',
    description: '一位白发老者与你攀谈，临别时赠送你一枚护身符。',
    autoEffects: { san: 20, gold: 15 },
  },

  // ===== 负面事件 =====
  {
    id: 'cursed_ground',
    title: '凶地',
    description: '你误入一处凶地，阴气森森，令你心神不宁。',
    autoEffects: { san: -15 },
  },
  {
    id: 'ambush',
    title: '埋伏',
    description: '暗中藏着的歹人突然袭击，你受了些伤但侥幸逃脱。',
    autoEffects: { hp: -10, gold: -10 },
  },
  {
    id: 'miasma',
    title: '瘴气',
    description: '穿过一片瘴气弥漫的区域，煞气侵体。',
    autoEffects: { shaqi: 25 },
  },
  {
    id: 'nightmare',
    title: '梦魇',
    description: '夜间噩梦缠身，醒来后精神恍惚。',
    autoEffects: { san: -20, hp: -5 },
  },

  // ===== 选择事件 =====
  {
    id: 'mysterious_altar',
    title: '神秘祭坛',
    description: '你发现一座古老祭坛，上面供奉着一块血红色的宝石。你可以选择献祭...',
    choices: [
      {
        text: '献祭血液（-10 HP，+30 金币）',
        effects: { hp: -10, gold: 30 },
      },
      {
        text: '献祭理智（-15 理智，+20 煞气）',
        effects: { san: -15, shaqi: 20 },
      },
      {
        text: '转身离开',
        effects: {},
      },
    ],
  },
  {
    id: 'trapped_traveler',
    title: '被困旅人',
    description: '一个旅人被陷阱困住，向你求救。他的包袱看起来很沉...',
    choices: [
      {
        text: '救助他（+10 理智，他送你一些金币）',
        effects: { san: 10, gold: 20 },
      },
      {
        text: '趁火打劫（+25 金币，-15 理智）',
        effects: { gold: 25, san: -15 },
      },
      {
        text: '无视离开',
        effects: { san: -5 },
      },
    ],
  },
  {
    id: 'strange_potion',
    title: '奇药',
    description: '路边小摊上摆着一瓶奇异的药水，摊主说可以让你"更强"。价格不菲...',
    choices: [
      {
        text: '买下喝掉（-20 金币，+25 煞气，-5 理智）',
        effects: { gold: -20, shaqi: 25, san: -5 },
      },
      {
        text: '砸碎药瓶（摊主愤怒，-5 HP）',
        effects: { hp: -5 },
      },
      {
        text: '无视离开',
        effects: {},
      },
    ],
  },
  {
    id: 'ancient_scroll',
    title: '古籍残卷',
    description: '你发现一卷残破的古籍，上面记载着某种秘术。学习它需要付出代价...',
    choices: [
      {
        text: '研习秘术（-8 HP，-10 理智，获得力量）',
        effects: { hp: -8, san: -10, shaqi: 15 },
      },
      {
        text: '焚毁古籍（+5 理智）',
        effects: { san: 5 },
      },
      {
        text: '带走留待后用',
        effects: { gold: 10 },
      },
    ],
  },
  {
    id: 'crossroads_shrine',
    title: '路口神龛',
    description: '岔路口有一座神龛，供奉着不同的神明。你选择向哪位祈祷？',
    choices: [
      {
        text: '祈祷健康（+20 HP）',
        effects: { hp: 20 },
      },
      {
        text: '祈求清明（+25 理智）',
        effects: { san: 25 },
      },
      {
        text: '祈求财富（+20 金币）',
        effects: { gold: 20 },
      },
    ],
  },
]

// 随机获取一个事件
export function getRandomEvent(): GameEvent {
  const idx = Math.floor(Math.random() * GAME_EVENTS.length)
  return GAME_EVENTS[idx]
}