import { create } from 'zustand'
import type { CardDef, PlayerState, EnemyState, GamePhase, BuffEffect, EnemyDef } from './types'
import { ALL_CARDS, REWARD_CARDS, JAW_WORM, GHOST, BLOOD_CORPSE } from '../data/cards'

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
  }
  dmg = Math.floor(dmg * (1 + shaqi / 100))
  if (isMad) dmg *= 3
  return Math.floor(dmg)
}

// ==================== Store ====================

interface GameState {
  phase: GamePhase
  turn: number
  player: PlayerState
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
  log: (msg: string) => void
  newGame: () => void
  playCard: (index: number) => void
  endPlayerTurn: () => void
  nextEnemy: () => void
  addCard: (card: CardDef) => void
  skipReward: () => void
  useExorcismTalisman: (index: number) => void  // 驱魔符翻面
}

function mkPlayer(): PlayerState {
  return {
    hp: 80, maxHp: 80, energy: 3, maxEnergy: 3, block: 0,
    buffs: [], san: 100, maxSan: 100, shaqi: 0, maxShaqi: 100,
    daoxin: 0, maxDaoxin: 10, isMad: false, madTurnCount: 0, gold: 0,
  }
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

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'player_turn',
  turn: 1,
  player: mkPlayer(),
  enemy: null,
  enemyQueue: [],
  drawPile: [],
  hand: [],
  discardPile: [],
  exhaustPile: [],
  battleLog: [],
  animating: false,
  rewardCards: null,

  log: (msg: string) => set(s => ({ battleLog: [...s.battleLog.slice(-50), msg] })),

  newGame: () => {
    const enemies = shuffle([JAW_WORM, GHOST, BLOOD_CORPSE])
    const first = enemies[0]
    const deck = shuffle([...ALL_CARDS])
    const { drawn, newDraw } = drawCards(deck, [], 5)
    set({
      phase: 'player_turn', turn: 1, player: mkPlayer(),
      enemy: mkEnemy(first), enemyQueue: enemies.slice(1),
      drawPile: newDraw, hand: drawn, discardPile: [], exhaustPile: [],
      battleLog: [`⚔️ 遭遇 ${first.name}！HP: ${first.hp}`],
      animating: false, rewardCards: null,
    })
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

    // 攻击
    if (fx.damage && fx.damage > 0) {
      const isVuln = e.buffs.some(b => b.type === 'vulnerable')
      let dmg = calcDamage(fx.damage, p.shaqi, p.buffs, p.isMad)
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

      // 煞气
      if (fx.shaqiGain) {
        const newShaqi = Math.min(p.maxShaqi, p.shaqi + fx.shaqiGain)
        p.shaqi = newShaqi
        log(`🔥 煞气 → ${newShaqi}`)
      }
    }

    // 护甲
    if (fx.block) {
      p.block += fx.block
      log(`🛡️ ${card.name}：获得 ${fx.block} 护甲`)
      if (fx.shaqiGain) {
        const newShaqi = Math.min(p.maxShaqi, p.shaqi + fx.shaqiGain)
        p.shaqi = newShaqi
      }
    }

    // 自残
    if (fx.hpCost) {
      p.hp = Math.max(1, p.hp - fx.hpCost)
      log(`🩸 消耗 ${fx.hpCost} HP（剩余: ${p.hp}）`)
    }

    // 理智
    if (fx.sanCost) {
      p.san = Math.max(0, Math.min(p.maxSan, p.san - fx.sanCost))
      log(`🧠 理智 ${p.san}`)
    }

    // 抽牌
    if (fx.draw) {
      const { drawn, newDraw, newDiscard } = drawCards(dp, disc, fx.draw)
      hand.push(...drawn)
      dp = newDraw
      disc = newDiscard
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
    }

    // 驱魔符
    if (card.id === 'exorcism_talisman') {
      log(`🔍 使用驱魔符`)
    }

    // 弃牌
    if (card.type !== 'power') {
      disc.push(card)
    }

    // 敌人死亡
    if (e.hp <= 0) {
      log(`🎉 击败 ${e.def.name}！`)
      set({
        player: p, enemy: e, hand, drawPile: dp, discardPile: disc,
        phase: 'victory',
        rewardCards: shuffle([...REWARD_CARDS]).slice(0, 3),
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
    log(`👹 ${e.def.name} → ${intent.type === 'attack' ? `攻击 ${intent.value}` : intent.type === 'defend' ? `防御 ${intent.value}` : intent.type === 'buff' ? `施放 ${intent.buffType}` : intent.type}`)

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
      } else {
        log(`🛡️ 格挡了所有伤害`)
      }
    }

    if (intent.type === 'defend' && intent.value) {
      e.block += intent.value
      log(`👹 获得 ${intent.value} 护甲`)
    }

    if (intent.type === 'buff' && intent.buffType) {
      e.buffs = [...e.buffs, { type: intent.buffType!, amount: intent.buffAmount ?? 0, duration: 999 }]
      log(`👹 施放「${intent.buffType}」`)
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
    if (e.def.phaseThreshold && e.hp <= e.def.phaseThreshold) {
      log(`⚠️ ${e.def.name} 进入狂暴阶段！攻击翻倍！`)
      // 修改意图中的攻击值为2倍
      const newIntents = e.def.intents.map(i =>
        i.type === 'attack' ? { ...i, value: (i.value ?? 0) * 2 } : i
      )
      e.intent = newIntents[idx]
    }

    const { drawn, newDraw, newDiscard } = drawCards(dp, disc, 5)

    set({
      phase: 'player_turn',
      turn: s.turn + 1,
      player: p,
      enemy: e,
      hand: drawn,
      drawPile: newDraw,
      discardPile: newDiscard,
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
    set({
      discardPile: [...s.discardPile, card],
      rewardCards: null,
    })
  },

  skipReward: () => {
    set({ rewardCards: null })
  },
}))
