import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CardDef, PlayerState, EnemyState, GamePhase, BuffEffect, EnemyDef, GameMap, MapNode, MapNodeType, ShopItem, GameEvent, DamageFloatItem, CharacterDef } from './types'
import { REWARD_CARDS, REWARD_CARDS_LAYER2, REWARD_CARDS_LAYER3, BOSS_ENEMY_LAYER3, ALL_ENEMIES, ALL_ENEMIES_LAYER2, ALL_ENEMIES_LAYER3, ELITE_ENEMY, ELITE_ENEMY_LAYER2, ELITE_ENEMY_LAYER3, ELITE_ENEMY_LAYER3_ALT, getCardsByIds } from '../data/cards'
import { getCharacterById, CHARACTER_XINSU } from '../data/characters'
import { getRandomEvent } from '../data/events'
import { playSound } from '../utils/soundManager'
import { useMetaStore } from './meta'

// ==================== 存档版本 ====================
// 存档版本号 - 用于未来版本迁移
// 当前版本: 0.3.0
const SAVE_KEY = 'dbg-save'

// 检查是否有存档
export function hasSaveData(): boolean {
  try {
    const data = localStorage.getItem(SAVE_KEY)
    if (!data) return false
    const parsed = JSON.parse(data)
    return parsed?.state?.map != null
  } catch {
    return false
  }
}

// ==================== 工具函数 ====================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function tickBuffs(buffs: BuffEffect[]): BuffEffect[] {
  return buffs.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0)
}

// 计算伤害（煞气+力量+入魔）
function calcDamage(base: number, shaqi: number, buffs: BuffEffect[], isMad: boolean): number {
  let dmg = base
  for (const b of buffs) {
    if (b.type === 'strength' || b.type === 'attackBuff') dmg += b.amount
    if (b.type === 'fear') dmg -= b.amount
  }
  dmg = Math.floor(dmg * (1 + shaqi / 100))
  if (isMad) dmg *= 3
  return Math.max(0, Math.floor(dmg))
}

// ==================== 地图生成 ====================

const LAYER_COUNT = 4  // 普通层数
const NODES_PER_LAYER = 4  // 每层节点数

function generateMap(): GameMap {
  const nodes: MapNode[] = []
  let nodeId = 0

  // 创建起始节点
  const startId = `node_${nodeId++}`
  nodes.push({
    id: startId,
    type: 'start',
    layer: 0,
    column: 1,
    completed: true,
    connections: [],
  })

  // 创建普通层节点
  const layerNodes: string[][] = []  // 每层的节点ID列表
  layerNodes[0] = [startId]

  for (let layer = 1; layer <= LAYER_COUNT; layer++) {
    layerNodes[layer] = []
    
    // 第 4 层（最终层）特殊设计：前置战斗 + Boss
    const nodeCount = layer === LAYER_COUNT ? 2 : NODES_PER_LAYER

    for (let col = 0; col < nodeCount; col++) {
      const id = `node_${nodeId++}`
      layerNodes[layer].push(id)

      // 确定节点类型
      let type: MapNodeType = 'battle'
      if (layer === LAYER_COUNT) {
        // 第 4 层：第一个节点是精英战，第二个是 Boss
        type = col === 0 ? 'elite' : 'boss'
      } else {
        const roll = Math.random()
        if (roll < 0.60) type = 'battle'
        else if (roll < 0.75) type = 'rest'
        else if (roll < 0.85) type = 'event'
        else if (roll < 0.92) type = 'shop'
        else type = 'elite'
      }

      // 为战斗节点预分配敌人（根据层数选择敌人池）
      let enemyDef: EnemyDef | undefined
      if (type === 'battle') {
        // 第1-2层使用第1层敌人，第3层使用第2层敌人，第4层使用第3层敌人
        let enemies = ALL_ENEMIES
        if (layer === 3) enemies = ALL_ENEMIES_LAYER2
        else if (layer >= 4) enemies = ALL_ENEMIES_LAYER3
        enemyDef = shuffle([...enemies])[0]
      } else if (type === 'elite') {
        // 第1-2层使用第1层精英，第3层使用第2层精英，第4层使用第3层精英（随机选择）
        if (layer === 3) enemyDef = ELITE_ENEMY_LAYER2
        else if (layer >= 4) enemyDef = Math.random() < 0.5 ? ELITE_ENEMY_LAYER3 : ELITE_ENEMY_LAYER3_ALT
        else enemyDef = ELITE_ENEMY
      } else if (type === 'boss') {
        // 最终Boss使用第3层Boss
        enemyDef = BOSS_ENEMY_LAYER3
      }

      nodes.push({
        id,
        type,
        layer,
        column: col,
        completed: false,
        connections: [],
        enemyDef,
      })
    }
  }

  // 创建连接关系
  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const currentLayer = layerNodes[layer]
    const nextLayer = layerNodes[layer + 1]

    for (const nodeId of currentLayer) {
      const node = nodes.find(n => n.id === nodeId)!
      const nodeCol = node.column

      if (layer === 0) {
        // 起点连接到第一层的所有节点
        node.connections = nextLayer.slice(0, 2)  // 连接到前两个节点
      } else if (layer < LAYER_COUNT) {
        // 每个节点连接下一层的1-2个相邻节点
        const possibleNext: string[] = []

        // 连接到同列和相邻列的节点
        for (const nextId of nextLayer) {
          const nextNode = nodes.find(n => n.id === nextId)!
          const colDiff = Math.abs(nextNode.column - nodeCol)
          if (colDiff <= 1) {
            possibleNext.push(nextId)
          }
        }

        // 随机选择1-2个连接
        const shuffled = shuffle(possibleNext)
        node.connections = shuffled.slice(0, Math.min(2, shuffled.length))
      }
    }
  }

  // Boss节点ID
  const bossNodeId = layerNodes[LAYER_COUNT][0]

  return {
    nodes,
    layers: LAYER_COUNT + 1,
    startNodeId: startId,
    bossNodeId,
  }
}

// ==================== Store ====================

interface GameState {
  phase: GamePhase
  turn: number
  player: PlayerState
  characterId: string  // 当前角色ID
  enemy: EnemyState | null
  enemyQueue: EnemyDef[]
  drawPile: CardDef[]
  hand: CardDef[]
  discardPile: CardDef[]
  exhaustPile: CardDef[]
  battleLog: string[]
  animating: boolean
  rewardCards: CardDef[] | null
  exorcismMode: boolean  // 驱魔符选择模式
  bossPhaseChange: boolean  // Boss阶段切换动画标记
  // 地图系统
  map: GameMap | null
  currentNodeId: string | null
  selectedNodeId: string | null  // 正在进入的节点
  // 战斗后奖励金币
  goldReward: number
  // 商店系统
  shopItems: ShopItem[] | null
  removeCost: number  // 移除卡牌费用
  // 事件系统
  currentEvent: GameEvent | null
  // 伤害飘字
  damageFloats: DamageFloatItem[]
  // 方法
  log: (msg: string) => void
  newGame: (characterId?: string) => void
  selectCharacter: (characterId: string) => void  // 选择角色
  clearSave: () => void  // 清除存档
  playCard: (index: number) => void
  endPlayerTurn: () => void
  nextEnemy: () => void
  addCard: (card: CardDef) => void
  skipReward: () => void
  useExorcismTalisman: (index: number) => void  // 驱魔符翻面
  // 地图相关方法
  selectNode: (nodeId: string) => void
  enterNode: () => void
  returnToMap: () => void
  // 商店方法
  buyCard: (index: number) => void
  removeCard: (cardId: string) => void
  leaveShop: () => void
  // 事件方法
  chooseEventOption: (choiceIndex: number) => void
  confirmAutoEvent: () => void
  // 飘字方法
  showDamageFloat: (value: number, type: DamageFloatItem['type'], target: DamageFloatItem['target']) => void
  clearDamageFloats: () => void
}

function mkPlayer(character: CharacterDef = CHARACTER_XINSU): PlayerState {
  return {
    hp: character.maxHp, 
    maxHp: character.maxHp, 
    energy: character.maxEnergy, 
    maxEnergy: character.maxEnergy, 
    block: 0,
    buffs: [], 
    san: character.maxSan, 
    maxSan: character.maxSan, 
    shaqi: 0, 
    maxShaqi: character.maxShaqi,
    daoxin: 0, 
    maxDaoxin: 10, 
    isMad: false, 
    madTurnCount: 0, 
    gold: 0,
  }
}

// 根据角色获取初始卡组
function getStartingDeck(character: CharacterDef): CardDef[] {
  return getCardsByIds(character.startingDeck)
}

function mkEnemy(def: EnemyDef): EnemyState {
  return {
    def, hp: def.hp, maxHp: def.hp, block: 0, buffs: [],
    intent: def.intents[0],
  }
}

function drawCards(drawPile: CardDef[], discardPile: CardDef[], count: number): { drawn: CardDef[], newDraw: CardDef[], newDiscard: CardDef[] } {
  const drawn: CardDef[] = []
  let dp = [...drawPile]
  let disc = [...discardPile]
  for (let i = 0; i < count; i++) {
    if (dp.length === 0) {
      dp = shuffle(disc)
      disc = []
    }
    if (dp.length > 0) drawn.push(dp.shift()!)
  }
  return { drawn, newDraw: dp, newDiscard: disc }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'character_select',
      turn: 1,
      player: mkPlayer(),
      characterId: CHARACTER_XINSU.id,
      enemy: null,
      enemyQueue: [],
      drawPile: [],
      hand: [],
      discardPile: [],
      exhaustPile: [],
      battleLog: [],
      animating: false,
      rewardCards: null,
      exorcismMode: false,
      bossPhaseChange: false,
      map: null,
      currentNodeId: null,
      selectedNodeId: null,
      goldReward: 0,
      shopItems: null,
      removeCost: 50,
      currentEvent: null,
      damageFloats: [],

  log: (msg: string) => set(s => ({ battleLog: [...s.battleLog.slice(-50), msg] })),

  // 飘字方法
  showDamageFloat: (value: number, type: DamageFloatItem['type'], target: DamageFloatItem['target']) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set(s => ({
      damageFloats: [...s.damageFloats.slice(-10), { id, value, type, target }]
    }))
    // 1.5秒后自动清除
    setTimeout(() => {
      set(s => ({ damageFloats: s.damageFloats.filter(f => f.id !== id) }))
    }, 1500)
  },

  clearDamageFloats: () => set({ damageFloats: [] }),

  // 选择角色后开始新游戏
  selectCharacter: (characterId: string) => {
    const character = getCharacterById(characterId) || CHARACTER_XINSU
    const newMap = generateMap()
    const startingDeck = getStartingDeck(character)
    
    set({
      phase: 'map',
      turn: 1,
      player: mkPlayer(character),
      characterId: character.id,
      enemy: null,
      enemyQueue: [],
      drawPile: shuffle([...startingDeck]),
      hand: [],
      discardPile: [],
      exhaustPile: [],
      battleLog: [],
      animating: false,
      rewardCards: null,
      exorcismMode: false,
      bossPhaseChange: false,
      map: newMap,
      currentNodeId: newMap.startNodeId,
      selectedNodeId: null,
      goldReward: 0,
      shopItems: null,
      currentEvent: null,
      damageFloats: [],
    })
  },

  newGame: (characterId?: string) => {
    const character = characterId ? (getCharacterById(characterId) || CHARACTER_XINSU) : CHARACTER_XINSU
    const newMap = generateMap()
    const startingDeck = getStartingDeck(character)
    
    set({
      phase: 'map',
      turn: 1,
      player: mkPlayer(character),
      characterId: character.id,
      enemy: null,
      enemyQueue: [],
      drawPile: shuffle([...startingDeck]),
      hand: [],
      discardPile: [],
      exhaustPile: [],
      battleLog: [],
      animating: false,
      rewardCards: null,
      exorcismMode: false,
      bossPhaseChange: false,
      map: newMap,
      currentNodeId: newMap.startNodeId,
      selectedNodeId: null,
      goldReward: 0,
      shopItems: null,
      currentEvent: null,
      damageFloats: [],
    })
  },

  clearSave: () => {
    // 清除 localStorage 中的存档
    localStorage.removeItem(SAVE_KEY)
  },

  playCard: (index: number) => {
    const s = get()
    if (s.phase !== 'player_turn' || s.animating) return
    const card = s.hand[index]
    if (!card) return
    if (card.cost > s.player.energy) return
    if (!s.enemy || s.enemy.hp <= 0) return

    const p = { ...s.player, energy: s.player.energy - card.cost }
    const e = { ...s.enemy }
    let dp = [...s.drawPile]
    let disc = [...s.discardPile]
    const hand = [...s.hand]
    hand.splice(index, 1)
    const fx = card.effects
    const log = get().log

    // 条件判断辅助函数
    const checkCondition = (): boolean => {
      if (!fx.conditional) return false
      const cond = fx.conditional.condition
      switch (cond.type) {
        case 'shaqi_gte':
          return p.shaqi >= cond.value
        case 'san_lte':
          return p.san <= cond.value
        case 'enemy_hp_pct_lte':
          return (e.hp / e.maxHp) * 100 <= cond.value
        default:
          return false
      }
    }
    const conditionMet = checkCondition()

    // 幻象机制（坐忘道专属）
    // 50% 正常效果，25% 双倍效果，25% 无效果
    let illusionMultiplier = 1
    let illusionNoEffect = false
    if (card.illusion) {
      // 检查是否有坐忘心经加成
      const illusionBoost = p.buffs.find(b => b.type === 'illusionBoost')
      const bonusChance = illusionBoost ? illusionBoost.amount : 0  // 额外双倍概率
      
      const roll = Math.random() * 100
      if (roll < 25 + bonusChance) {
        // 双倍效果
        illusionMultiplier = 2
        log(`🌟 幻象成真！效果翻倍！`)
      } else if (roll < 50 + bonusChance) {
        // 无效果
        illusionNoEffect = true
        log(`💨 幻象消散...无效果`)
      }
      // else: 50% - bonusChance 正常效果
    }

    // 攻击
    if (fx.damage && fx.damage > 0 && !illusionNoEffect) {
      const isVuln = e.buffs.some(b => b.type === 'vulnerable')
      let dmg = calcDamage(fx.damage, p.shaqi, p.buffs, p.isMad)
      
      // 幻象双倍
      if (illusionMultiplier > 1) {
        dmg *= illusionMultiplier
      }
      
      // 道心加伤
      if (fx.damagePerDaoxin) {
        const extraDmg = p.daoxin * fx.damagePerDaoxin
        dmg += extraDmg
        if (extraDmg > 0) {
          log(`✨ 道心加伤 +${extraDmg}`)
        }
      }
      
      // 条件伤害翻倍
      if (conditionMet && fx.conditional?.damageMultiplier) {
        dmg = Math.floor(dmg * fx.conditional.damageMultiplier)
        log(`⚡ 条件达成！伤害 ×${fx.conditional.damageMultiplier}`)
      }
      
      if (isVuln) dmg = Math.floor(dmg * 1.5)

      // 扣护甲
      if (e.block > 0) {
        if (e.block >= dmg) {
          e.block -= dmg
          dmg = 0
        } else {
          dmg -= e.block
          e.block = 0
        }
      }

      e.hp = Math.max(0, e.hp - dmg)
      log(`⚔️ ${card.name}：${dmg > 0 ? `造成 ${dmg} 伤害` : '被格挡'}（敌HP: ${e.hp}/${e.maxHp}）`)
      
      // 伤害飘字和音效
      if (dmg > 0) {
        get().showDamageFloat(dmg, 'damage', 'enemy')
        playSound('attack')
      }

      // 煞气
      if (fx.shaqiGain) {
        const newShaqi = Math.min(p.maxShaqi, p.shaqi + fx.shaqiGain)
        p.shaqi = newShaqi
        log(`🔥 煞气 → ${newShaqi}`)
        // 检查最高煞气成就
        useMetaStore.getState().checkAchievements({ type: 'shaqi_reached', value: newShaqi })
      }
    }

    // 护甲
    let blockValue = fx.block || 0
    
    // 幻象双倍护甲
    if (illusionMultiplier > 1 && blockValue > 0) {
      blockValue *= illusionMultiplier
    }
    
    // 幻象无效果时护甲为0
    if (illusionNoEffect) {
      blockValue = 0
    }
    
    // 护甲 = 煞气值
    if (fx.blockFromShaqi && !illusionNoEffect) {
      blockValue = p.shaqi
      if (illusionMultiplier > 1) {
        blockValue *= illusionMultiplier
      }
      log(`🔮 煞气护甲：${blockValue}`)
    }
    
    // 条件额外护甲
    if (conditionMet && fx.conditional?.bonusBlock) {
      blockValue += fx.conditional.bonusBlock
      log(`⚡ 条件达成！额外护甲 +${fx.conditional.bonusBlock}`)
    }
    
    if (blockValue > 0) {
      p.block += blockValue
      log(`🛡️ ${card.name}：获得 ${blockValue} 护甲`)
      // 护甲飘字
      get().showDamageFloat(blockValue, 'block', 'player')
      playSound('block')
      if (fx.shaqiGain) {
        const newShaqi = Math.min(p.maxShaqi, p.shaqi + fx.shaqiGain)
        p.shaqi = newShaqi
        // 检查最高煞气成就
        useMetaStore.getState().checkAchievements({ type: 'shaqi_reached', value: newShaqi })
      }
    }

    // 自残
    if (fx.hpCost) {
      p.hp = Math.max(1, p.hp - fx.hpCost)
      log(`🩸 消耗 ${fx.hpCost} HP（剩余: ${p.hp}）`)
      // 自残飘字
      get().showDamageFloat(fx.hpCost, 'damage', 'player')
    }

    // 理智
    let sanCost = fx.sanCost || 0
    // 条件额外理智消耗
    if (conditionMet && fx.conditional?.bonusSanCost) {
      sanCost += fx.conditional.bonusSanCost
      log(`⚡ 条件达成！额外消耗 ${fx.conditional.bonusSanCost} 理智`)
    }
    if (sanCost > 0) {
      p.san = Math.max(0, Math.min(p.maxSan, p.san - sanCost))
      log(`🧠 理智 ${p.san}`)
      // 理智飘字
      get().showDamageFloat(sanCost, 'san', 'player')
    }

    // 抽牌
    let drawCount = fx.draw || 0
    // 条件额外抽牌
    if (conditionMet && fx.conditional?.bonusDraw) {
      drawCount += fx.conditional.bonusDraw
      log(`⚡ 条件达成！额外抽 ${fx.conditional.bonusDraw} 张`)
    }
    if (drawCount > 0) {
      const { drawn, newDraw, newDiscard } = drawCards(dp, disc, drawCount)
      hand.push(...drawn)
      dp = newDraw
      disc = newDiscard
      log(`📥 抽 ${drawCount} 张牌`)
      // 抽牌音效
      playSound('card')
    }

    // 自身 buff（力量/血肉同化/道心等）
    if (fx.selfBuff) {
      for (const b of fx.selfBuff) {
        if (b.type === 'daoxin') {
          p.daoxin = Math.min(p.maxDaoxin, p.daoxin + b.amount)
          log(`✨ 道心 ${p.daoxin}/${p.maxDaoxin}`)
        } else if (b.type === 'blood_merge') {
          p.maxHp = Math.max(1, p.maxHp - b.amount)
          log(`💀 永久 -${b.amount} 最大HP（${p.maxHp}）`)
        } else {
          p.buffs = [...p.buffs, { ...b }]
        }
      }
    }

    // 敌人 debuff
    if (fx.enemyDebuff) {
      for (const b of fx.enemyDebuff) {
        e.buffs = [...e.buffs, { ...b }]
      }
    }

    // 入魔
    if (card.id === 'madness_mantra') {
      p.shaqi = 100
      p.isMad = true
      p.madTurnCount = 0
      p.energy = 5
      log(`🔥🔥🔥 走火入魔！所有伤害 ×3！`)
      // 入魔音效
      playSound('madness')
      // 触发入魔成就
      useMetaStore.getState().checkAchievements({ type: 'madness' })
    }

    // 驱魔符 - 进入选择模式，揭示一张牌的真伪
    if (card.id === 'exorcism_talisman') {
      // 驱魔符进入弃牌堆
      disc.push(card)
      set({
        player: p, hand, drawPile: dp, discardPile: disc, exorcismMode: true,
      })
      log(`🔮 使用驱魔符...请选择一张要揭示的牌`)
      return
    }

    // 幻觉牌打出结算
    if (card.isHallucination) {
      const roll = Math.random()
      if (roll < 0.4) {
        // 0 伤害 - 效果无效，直接弃牌
        log(`👁️ 幻觉！这张牌是假的...效果无效`)
        disc.push(card)
        set({ player: p, enemy: e, hand, drawPile: dp, discardPile: disc })
        return
      } else if (roll < 0.7) {
        // 反伤 50%
        const originalDmg = fx.damage || 0
        const reflectDmg = Math.floor(originalDmg * 0.5)
        p.hp = Math.max(0, p.hp - reflectDmg)
        log(`👁️ 幻觉反噬！反伤 ${reflectDmg}（HP: ${p.hp}/${p.maxHp}）`)
        if (p.hp <= 0) {
          set({ phase: 'game_over', player: p, battleLog: [...s.battleLog, '💀 幻觉反噬致死...'] })
          return
        }
      } else {
        // 恐惧 debuff - 减少伤害
        p.buffs = [...p.buffs, { type: 'fear', amount: 3, duration: 2 }]
        log(`👁️ 幻觉恐惧！你获得「恐惧」debuff（攻击-3，持续2回合）`)
      }
    }

    // 弃牌
    if (card.type !== 'power') {
      disc.push(card)
    }

    // 敌人死亡
    if (e.hp <= 0) {
      log(`🎉 击败 ${e.def.name}！`)
      // 获得金币奖励
      p.gold += s.goldReward
      log(`💰 获得 ${s.goldReward} 金币（共 ${p.gold}）`)
      
      // 元游戏系统：击杀统计和成就
      const metaStore = useMetaStore.getState()
      metaStore.checkAchievements({ type: 'gold_earned', value: s.goldReward })
      if (e.def.type === 'elite') {
        metaStore.checkAchievements({ type: 'elite_kill' })
      } else if (e.def.type === 'boss') {
        metaStore.checkAchievements({ type: 'boss_kill' })
      } else {
        metaStore.checkAchievements({ type: 'kill' })
      }

      // 根据当前层数选择奖励卡池
      const currentLayer = s.map?.nodes.find(n => n.id === s.selectedNodeId)?.layer ?? 1
      let rewardPool = REWARD_CARDS
      if (currentLayer === 3) rewardPool = REWARD_CARDS_LAYER2
      else if (currentLayer >= 4) rewardPool = REWARD_CARDS_LAYER3

      set({
        player: p, enemy: e, hand, drawPile: dp, discardPile: disc,
        phase: 'victory',
        rewardCards: shuffle([...rewardPool]).slice(0, 3),
      })
      return
    }

    set({ player: p, enemy: e, hand, drawPile: dp, discardPile: disc })
  },

  endPlayerTurn: () => {
    const s = get()
    if (s.phase !== 'player_turn' || s.animating) return

    const p = { ...s.player, block: 0, energy: 3, daoxin: 0 }
    const e = s.enemy!
    const log = get().log
    let dp = [...s.drawPile]
    let disc = [...s.discardPile, ...s.hand]

    // 黑莲诅咒效果：每回合-5理智
    const blackLotusCurse = p.buffs.find(b => b.type === 'blackLotusCurse')
    if (blackLotusCurse) {
      p.san = Math.max(0, p.san - blackLotusCurse.amount)
      log(`🖤 黑莲诅咒：理智 -${blackLotusCurse.amount}（${p.san}/${p.maxSan}）`)
    }

    // 煞性扣理智
    if (p.shaqi >= 30 && !p.isMad) {
      const sanLoss = Math.min(10, Math.ceil((p.shaqi - 29) / 10))
      if (sanLoss > 0) {
        p.san = Math.max(0, p.san - sanLoss)
        log(`🧠 煞性侵蚀，理智 -${sanLoss}（${p.san}/${p.maxSan}）`)
      }
    }

    // 幻觉
    if (p.shaqi >= 60 && !p.isMad && Math.random() < 0.2) {
      log(`👁️ 幻觉袭来...有牌变得模糊不清`)
    }

    // 理智归零
    if (p.san <= 0) {
      set({ phase: 'game_over', player: p, battleLog: [...s.battleLog, '💀 理智崩溃，心素消散...'] })
      return
    }

    // 敌人行动
    const intent = e.intent
    log(`👹 ${e.def.name} → ${intent.type === 'attack' ? `攻击 ${intent.value}` : intent.type === 'defend' ? `防御 ${intent.value}` : intent.type === 'buff' ? `施放 ${intent.buffType}` : intent.type === 'heal' ? `恢复 ${intent.value} HP` : intent.type}`)

    if (intent.type === 'attack' && intent.value) {
      let dmg = intent.value
      if (e.block) dmg += e.block
      if (p.block > 0) {
        if (p.block >= dmg) {
          p.block -= dmg
          dmg = 0
        } else {
          dmg -= p.block
          p.block = 0
        }
      }
      if (dmg > 0) {
        p.hp = Math.max(0, p.hp - dmg)
        log(`💥 受到 ${dmg} 伤害（HP: ${p.hp}/${p.maxHp}）`)
        // 伤害飘字和音效
        get().showDamageFloat(dmg, 'damage', 'player')
        playSound('hit')
      } else {
        log(`🛡️ 格挡了所有伤害`)
      }
    }

    if (intent.type === 'defend' && intent.value) {
      e.block += intent.value
      log(`👹 获得 ${intent.value} 护甲`)
    }

    if (intent.type === 'buff' && intent.buffType) {
      if (intent.buffType === 'sanDrain') {
        // 理智攻击
        p.san = Math.max(0, p.san - (intent.buffAmount ?? 0))
        log(`🖤 心素撕裂：理智 -${intent.buffAmount}（${p.san}/${p.maxSan}）`)
        // 理智飘字
        get().showDamageFloat(intent.buffAmount ?? 0, 'san', 'player')
      } else {
        e.buffs = [...e.buffs, { type: intent.buffType!, amount: intent.buffAmount ?? 0, duration: 999 }]
        log(`👹 施放「${intent.buffType}」`)
      }
    }

    if (intent.type === 'heal' && intent.value) {
      e.hp = Math.min(e.maxHp, e.hp + intent.value)
      log(`🩸 黑莲绽放：恢复 ${intent.value} HP（${e.hp}/${e.maxHp}）`)
      // 敌人治疗飘字
      get().showDamageFloat(intent.value, 'heal', 'enemy')
    }

    // 玩家死亡
    if (p.hp <= 0) {
      set({ phase: 'game_over', player: p, battleLog: [...s.battleLog, '💀 你死了...'] })
      return
    }

    // 入魔回合计数
    if (p.isMad) {
      p.madTurnCount += 1
      if (p.madTurnCount >= 8) {
        p.isMad = false
        p.shaqi = 0
        p.madTurnCount = 0
        p.san = Math.max(0, p.san + 20)
        p.energy = 3
        log(`🔄 入魔结束！理智 +20，煞气归零`)
      } else {
        p.energy = 5
        log(`🔥 入魔第 ${p.madTurnCount}/8 回合`)
      }
    }

    // 新回合
    p.buffs = tickBuffs(p.buffs)
    e.buffs = tickBuffs(e.buffs)

    // 切换敌人意图
    const idx = (s.turn) % e.def.intents.length
    e.intent = e.def.intents[idx]

    // Boss 阶段切换
    if (e.def.phaseThreshold && e.hp <= e.def.phaseThreshold && (e.def.phase ?? 1) === 1) {
      log(`⚠️ ${e.def.name} 进入狂暴阶段！`)
      // 更新Boss阶段
      e.def = { ...e.def, phase: 2 }
      
      // 黑莲老祖特殊处理：攻击+50%，使用特殊意图
      if (e.def.id === 'black_lotus_ancestor') {
        // 阶段2使用索引4-5的意图（heal和心素撕裂）
        const phase2Intents = e.def.intents.slice(0, 4).map(i =>
          i.type === 'attack' ? { ...i, value: Math.floor((i.value ?? 0) * 1.5) } : i
        )
        // 加入特殊意图
        const specialIntents = e.def.intents.slice(4)
        e.def = { ...e.def, intents: [...phase2Intents, ...specialIntents] }
        e.intent = e.def.intents[idx % e.def.intents.length]
        log(`🖤 黑莲老祖：黑莲绽放，心素撕裂！`)
      } else {
        // 其他Boss：攻击翻倍
        const newIntents = e.def.intents.map(i =>
          i.type === 'attack' ? { ...i, value: (i.value ?? 0) * 2 } : i
        )
        e.intent = newIntents[idx]
      }
      
      // 设置阶段切换动画标记
      set({ bossPhaseChange: true })
      // 1.5秒后清除动画标记
      setTimeout(() => set({ bossPhaseChange: false }), 1500)
    }

    const { drawn, newDraw, newDiscard } = drawCards(dp, disc, 5)

    // 幻觉牌生成：煞性≥60时20%概率将一张手牌标记为幻觉
    let finalHand = drawn
    if (p.shaqi >= 60 && !p.isMad && drawn.length > 0 && Math.random() < 0.2) {
      const hallIdx = Math.floor(Math.random() * drawn.length)
      finalHand = drawn.map((c, i) =>
        i === hallIdx ? { ...c, isHallucination: true } : c
      )
      log(`👁️ 煞性侵蚀...你的「${drawn[hallIdx].name}」变得模糊不清...`)
    }

    set({
      phase: 'player_turn',
      turn: s.turn + 1,
      player: p,
      enemy: e,
      hand: finalHand,
      drawPile: newDraw,
      discardPile: newDiscard,
      exorcismMode: false,
    })
  },

  nextEnemy: () => {
    const s = get()
    const queue = [...s.enemyQueue]
    if (queue.length === 0) return
    const next = queue.shift()!
    const { drawn, newDraw } = drawCards(shuffle([...s.discardPile, ...s.drawPile, ...s.hand]), [], 5)
    const p = { ...s.player }
    p.block = 0
    p.buffs = tickBuffs(p.buffs)
    set({
      phase: 'player_turn',
      enemy: mkEnemy(next),
      enemyQueue: queue,
      drawPile: newDraw,
      hand: drawn,
      discardPile: [],
      rewardCards: null,
      battleLog: [`⚔️ 遭遇 ${next.name}！HP: ${next.hp}`],
    })
  },

  addCard: (card: CardDef) => {
    const s = get()
    // 标记当前节点完成
    let updatedMap = s.map
    let newNodeId = s.currentNodeId
    if (s.map && s.selectedNodeId) {
      updatedMap = {
        ...s.map,
        nodes: s.map.nodes.map(n =>
          n.id === s.selectedNodeId ? { ...n, completed: true } : n
        )
      }
      newNodeId = s.selectedNodeId
    }

    const player = { ...s.player }
    player.block = 0
    player.buffs = tickBuffs(player.buffs)
    
    // 第 4 层精英战后恢复效果（为 Boss 战做准备）
    const currentNode = s.map?.nodes.find(n => n.id === s.selectedNodeId)
    if (currentNode?.layer === 4 && currentNode?.type === 'elite') {
      player.hp = Math.min(player.maxHp, player.hp + 15)
      player.san = Math.min(player.maxSan, player.san + 10)
      get().log(`🔥 战后恢复：HP +15，理智 +10（为 Boss 战做准备）`)
    }

    set({
      phase: 'map',
      map: updatedMap,
      currentNodeId: newNodeId,
      selectedNodeId: null,
      discardPile: [...s.discardPile, card],
      rewardCards: null,
      enemy: null,
      player,
    })
  },

  skipReward: () => {
    const s = get()
    // 标记当前节点完成
    let updatedMap = s.map
    let newNodeId = s.currentNodeId
    if (s.map && s.selectedNodeId) {
      updatedMap = {
        ...s.map,
        nodes: s.map.nodes.map(n =>
          n.id === s.selectedNodeId ? { ...n, completed: true } : n
        )
      }
      newNodeId = s.selectedNodeId
    }

    const player = { ...s.player }
    player.block = 0
    player.buffs = tickBuffs(player.buffs)
    
    // 第 4 层精英战后恢复效果（为 Boss 战做准备）
    const currentNode = s.map?.nodes.find(n => n.id === s.selectedNodeId)
    if (currentNode?.layer === 4 && currentNode?.type === 'elite') {
      player.hp = Math.min(player.maxHp, player.hp + 15)
      player.san = Math.min(player.maxSan, player.san + 10)
      get().log(`🔥 战后恢复：HP +15，理智 +10（为 Boss 战做准备）`)
    }

    set({
      phase: 'map',
      map: updatedMap,
      currentNodeId: newNodeId,
      selectedNodeId: null,
      rewardCards: null,
      enemy: null,
      player,
    })
  },

  useExorcismTalisman: (index: number) => {
    const s = get()
    if (!s.exorcismMode) return
    const card = s.hand[index]
    if (!card) return
    const hand = [...s.hand]
    const isHall = card.isHallucination || false
    // 揭示：移除幻觉标记，显示真实卡牌
    hand[index] = { ...card, isHallucination: false }
    set({ hand, exorcismMode: false })
    // 日志显示真伪
    if (isHall) {
      get().log(`🔮 驱魔符揭示：「${card.name}」是幻觉！它消失了...`)
      // 幻觉牌被揭示后直接移除（从手牌中删除）
      hand.splice(index, 1)
      set({ hand })
    } else {
      get().log(`🔮 驱魔符揭示：「${card.name}」是真牌，可以正常使用`)
    }
  },

  // ========== 地图系统方法 ==========

  selectNode: (nodeId: string) => {
    const s = get()
    if (!s.map || s.phase !== 'map') return

    const node = s.map.nodes.find(n => n.id === nodeId)
    if (!node || node.completed) return

    // 检查是否是可达节点
    const currentNode = s.map.nodes.find(n => n.id === s.currentNodeId)
    if (currentNode && !currentNode.connections.includes(nodeId)) return

    set({ selectedNodeId: nodeId })
  },

  enterNode: () => {
    const s = get()
    if (!s.map || !s.selectedNodeId || s.phase !== 'map') return

    const node = s.map.nodes.find(n => n.id === s.selectedNodeId)
    if (!node) return

    const log = get().log

    // 根据节点类型进入不同场景
    switch (node.type) {
      case 'battle':
      case 'elite':
        if (!node.enemyDef) return
        // 使用当前抽牌堆作为牌库
        const deck = shuffle([...s.drawPile, ...s.discardPile, ...s.hand])
        const { drawn, newDraw } = drawCards(deck.length > 0 ? deck : s.drawPile, [], 5)
        log(`⚔️ 遭遇 ${node.enemyDef.name}！HP: ${node.enemyDef.hp}`)
        set({
          phase: 'player_turn',
          turn: 1,
          enemy: mkEnemy(node.enemyDef),
          drawPile: newDraw,
          hand: drawn.length > 0 ? drawn : [],
          discardPile: [],
          goldReward: node.type === 'elite' ? 30 : 15,
        })
        break

      case 'rest':
        // 篝火：恢复HP和理智
        const restedPlayer = { ...s.player }
        restedPlayer.hp = Math.min(restedPlayer.maxHp, restedPlayer.hp + 20)
        restedPlayer.san = Math.min(restedPlayer.maxSan, restedPlayer.san + 15)
        log(`🔥 篝火休息：HP +20，理智 +15`)
        // 播放治疗音效
        playSound('heal')
        // 标记节点完成
        const restedMap = { ...s.map, nodes: s.map.nodes.map(n => n.id === node.id ? { ...n, completed: true } : n) }
        set({
          player: restedPlayer,
          map: restedMap,
          currentNodeId: node.id,
          selectedNodeId: null,
          battleLog: [...s.battleLog, '🔥 在篝火旁休息...'],
        })
        break

      case 'shop':
        // 商店：生成商品（根据层数选择卡池）
        const currentLayer = node.layer
        let shopPool = REWARD_CARDS
        if (currentLayer === 3) shopPool = REWARD_CARDS_LAYER2
        else if (currentLayer >= 4) shopPool = REWARD_CARDS_LAYER3
        const shopCards = shuffle([...shopPool]).slice(0, 4)
        const items: ShopItem[] = shopCards.map(card => ({
          card,
          price: card.rarity === 'common' ? 50 : card.rarity === 'uncommon' ? 75 : card.rarity === 'rare' ? 100 : 50,
          sold: false,
        }))
        log(`🏪 进入商店，有 ${items.length} 张卡牌出售`)
        set({
          phase: 'shop',
          shopItems: items,
          removeCost: 50 + Math.floor(Math.random() * 30),
        })
        break

      case 'event':
        // 事件：随机触发
        const event = getRandomEvent()
        log(`❓ 触发事件：${event.title}`)
        set({
          phase: 'event',
          currentEvent: event,
        })
        break

      case 'boss':
        if (!node.enemyDef) return
        // 使用当前抽牌堆作为牌库
        const bossDeck = shuffle([...s.drawPile, ...s.discardPile, ...s.hand])
        const { drawn: bossHand, newDraw: bossDraw } = drawCards(bossDeck.length > 0 ? bossDeck : s.drawPile, [], 5)
        log(`👹 BOSS战：${node.enemyDef.name}！`)
        
        // 黑莲老祖特殊机制：黑莲诅咒
        const bossPlayer = { ...s.player }
        if (node.enemyDef.id === 'black_lotus_ancestor') {
          // 开场施加黑莲诅咒（每回合-5理智）
          bossPlayer.buffs = [...bossPlayer.buffs, { type: 'blackLotusCurse', amount: 5, duration: 999 }]
          log(`🖤 黑莲诅咒：每回合理智 -5！`)
        }
        
        set({
          phase: 'player_turn',
          turn: 1,
          enemy: mkEnemy(node.enemyDef),
          player: bossPlayer,
          drawPile: bossDraw,
          hand: bossHand.length > 0 ? bossHand : [],
          discardPile: [],
          goldReward: 50,
        })
        break
    }
  },

  returnToMap: () => {
    const s = get()
    if (!s.map) return

    // 标记当前节点完成
    const completedNodeId = s.selectedNodeId || s.currentNodeId
    const updatedMap = {
      ...s.map,
      nodes: s.map.nodes.map(n =>
        n.id === completedNodeId ? { ...n, completed: true } : n
      )
    }

    const player = { ...s.player }
    player.block = 0
    player.buffs = tickBuffs(player.buffs)

    set({
      phase: 'map',
      map: updatedMap,
      currentNodeId: completedNodeId,
      selectedNodeId: null,
      enemy: null,
      rewardCards: null,
      player,
      shopItems: null,
      currentEvent: null,
    })
  },

  // ========== 商店系统方法 ==========

  buyCard: (index: number) => {
    const s = get()
    if (!s.shopItems || s.phase !== 'shop') return

    const item = s.shopItems[index]
    if (!item || item.sold || s.player.gold < item.price) {
      get().log(`💰 金币不足！`)
      return
    }

    const player = { ...s.player, gold: s.player.gold - item.price }
    const shopItems = [...s.shopItems]
    shopItems[index] = { ...item, sold: true }

    get().log(`💰 购买了「${item.card.name}」，花费 ${item.price} 金币`)
    set({
      player,
      shopItems,
      discardPile: [...s.discardPile, item.card],
    })
  },

  removeCard: (cardId: string) => {
    const s = get()
    if (s.phase !== 'shop' || s.player.gold < s.removeCost) {
      get().log(`💰 移除卡牌需要 ${s.removeCost} 金币！`)
      return
    }

    // 从弃牌堆、抽牌堆或手牌中移除
    let removed = false
    let newDiscard = [...s.discardPile]
    let newDraw = [...s.drawPile]
    let newHand = [...s.hand]

    // 优先从弃牌堆移除
    const discardIdx = newDiscard.findIndex(c => c.id === cardId)
    if (discardIdx >= 0) {
      newDiscard.splice(discardIdx, 1)
      removed = true
    } else {
      // 从抽牌堆移除
      const drawIdx = newDraw.findIndex(c => c.id === cardId)
      if (drawIdx >= 0) {
        newDraw.splice(drawIdx, 1)
        removed = true
      } else {
        // 从手牌移除
        const handIdx = newHand.findIndex(c => c.id === cardId)
        if (handIdx >= 0) {
          newHand.splice(handIdx, 1)
          removed = true
        }
      }
    }

    if (removed) {
      const player = { ...s.player, gold: s.player.gold - s.removeCost }
      get().log(`🗑️ 移除了一张卡牌，花费 ${s.removeCost} 金币`)
      set({ player, discardPile: newDiscard, drawPile: newDraw, hand: newHand })
    }
  },

  leaveShop: () => {
    const s = get()
    if (!s.map || !s.selectedNodeId) return

    const updatedMap = {
      ...s.map,
      nodes: s.map.nodes.map(n =>
        n.id === s.selectedNodeId ? { ...n, completed: true } : n
      )
    }

    get().log(`🏪 离开商店`)
    set({
      phase: 'map',
      map: updatedMap,
      currentNodeId: s.selectedNodeId,
      selectedNodeId: null,
      shopItems: null,
    })
  },

  // ========== 事件系统方法 ==========

  chooseEventOption: (choiceIndex: number) => {
    const s = get()
    if (!s.currentEvent || s.phase !== 'event') return
    if (!s.currentEvent.choices || choiceIndex >= s.currentEvent.choices.length) return

    const choice = s.currentEvent.choices[choiceIndex]
    const player = { ...s.player }
    const effects = choice.effects
    const log = get().log

    // 应用效果
    if (effects.hp) {
      player.hp = Math.max(1, Math.min(player.maxHp, player.hp + effects.hp))
      log(`❤️ HP ${effects.hp > 0 ? '+' : ''}${effects.hp}（${player.hp}/${player.maxHp}）`)
      // 治疗音效（仅在恢复HP时播放）
      if (effects.hp > 0) {
        playSound('heal')
      }
    }
    if (effects.san) {
      player.san = Math.max(0, Math.min(player.maxSan, player.san + effects.san))
      log(`🧠 理智 ${effects.san > 0 ? '+' : ''}${effects.san}（${player.san}/${player.maxSan}）`)
    }
    if (effects.gold) {
      player.gold = Math.max(0, player.gold + effects.gold)
      log(`💰 金币 ${effects.gold > 0 ? '+' : ''}${effects.gold}（${player.gold}）`)
    }
    if (effects.shaqi) {
      player.shaqi = Math.max(0, Math.min(player.maxShaqi, player.shaqi + effects.shaqi))
      log(`🔥 煞气 ${effects.shaqi > 0 ? '+' : ''}${effects.shaqi}（${player.shaqi}）`)
    }
    if (effects.addCard) {
      log(`🃏 获得卡牌「${effects.addCard.name}」`)
    }

    // 标记节点完成，返回地图
    if (s.map && s.selectedNodeId) {
      const updatedMap = {
        ...s.map,
        nodes: s.map.nodes.map(n =>
          n.id === s.selectedNodeId ? { ...n, completed: true } : n
        )
      }

      set({
        phase: 'map',
        player,
        map: updatedMap,
        currentNodeId: s.selectedNodeId,
        selectedNodeId: null,
        currentEvent: null,
        discardPile: effects.addCard ? [...s.discardPile, effects.addCard] : s.discardPile,
      })
    }
  },

  confirmAutoEvent: () => {
    const s = get()
    if (!s.currentEvent || s.phase !== 'event') return
    if (!s.currentEvent.autoEffects) return

    const effects = s.currentEvent.autoEffects
    const player = { ...s.player }
    const log = get().log

    // 应用自动效果
    if (effects.hp) {
      player.hp = Math.max(1, Math.min(player.maxHp, player.hp + effects.hp))
      log(`❤️ HP ${effects.hp > 0 ? '+' : ''}${effects.hp}（${player.hp}/${player.maxHp}）`)
    }
    if (effects.san) {
      player.san = Math.max(0, Math.min(player.maxSan, player.san + effects.san))
      log(`🧠 理智 ${effects.san > 0 ? '+' : ''}${effects.san}（${player.san}/${player.maxSan}）`)
    }
    if (effects.gold) {
      player.gold = Math.max(0, player.gold + effects.gold)
      log(`💰 金币 ${effects.gold > 0 ? '+' : ''}${effects.gold}（${player.gold}）`)
    }
    if (effects.shaqi) {
      player.shaqi = Math.max(0, Math.min(player.maxShaqi, player.shaqi + effects.shaqi))
      log(`🔥 煞气 ${effects.shaqi > 0 ? '+' : ''}${effects.shaqi}（${player.shaqi}）`)
    }

    // 标记节点完成，返回地图
    if (s.map && s.selectedNodeId) {
      const updatedMap = {
        ...s.map,
        nodes: s.map.nodes.map(n =>
          n.id === s.selectedNodeId ? { ...n, completed: true } : n
        )
      }

      set({
        phase: 'map',
        player,
        map: updatedMap,
        currentNodeId: s.selectedNodeId,
        selectedNodeId: null,
        currentEvent: null,
      })
    }
  },
}),
    {
      name: SAVE_KEY,
      version: 1,
      partialize: (state) => ({
        phase: state.phase,
        turn: state.turn,
        player: state.player,
        characterId: state.characterId,
        enemy: state.enemy,
        enemyQueue: state.enemyQueue,
        drawPile: state.drawPile,
        hand: state.hand,
        discardPile: state.discardPile,
        exhaustPile: state.exhaustPile,
        battleLog: state.battleLog,
        map: state.map,
        currentNodeId: state.currentNodeId,
        selectedNodeId: state.selectedNodeId,
        goldReward: state.goldReward,
      }),
    }
  )
)
