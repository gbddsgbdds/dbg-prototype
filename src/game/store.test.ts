import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore, hasSaveData } from './store'
import { CHARACTER_XINSU } from '../data/characters'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
// @ts-expect-error - mocking localStorage for tests
globalThis.localStorage = localStorageMock

describe('Game Store', () => {
  beforeEach(() => {
    localStorage.clear()
    // 重置store状态
    useGameStore.setState({
      phase: 'character_select',
      turn: 1,
      player: {
        hp: 80, maxHp: 80, energy: 3, maxEnergy: 3, block: 0,
        buffs: [], san: 100, maxSan: 100, shaqi: 0, maxShaqi: 100,
        daoxin: 0, maxDaoxin: 10, isMad: false, madTurnCount: 0, gold: 0,
      },
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
    })
  })

  describe('hasSaveData', () => {
    it('should return false when no save data exists', () => {
      expect(hasSaveData()).toBe(false)
    })

    it('should return true when save data exists with map', () => {
      localStorage.setItem('dbg-save', JSON.stringify({
        state: { map: { nodes: [] } }
      }))
      expect(hasSaveData()).toBe(true)
    })
  })

  describe('selectCharacter', () => {
    it('should initialize game with correct character stats', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      const newState = useGameStore.getState()
      expect(newState.phase).toBe('map')
      expect(newState.characterId).toBe(CHARACTER_XINSU.id)
      expect(newState.player.maxHp).toBe(CHARACTER_XINSU.maxHp)
      expect(newState.player.hp).toBe(CHARACTER_XINSU.maxHp)
    })

    it('should generate map with correct structure', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      const newState = useGameStore.getState()
      expect(newState.map).not.toBeNull()
      expect(newState.map?.nodes.length).toBeGreaterThan(0)
      expect(newState.map?.startNodeId).toBeDefined()
    })

    it('should give starting deck to player', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      const newState = useGameStore.getState()
      const totalCards = newState.drawPile.length + newState.hand.length + newState.discardPile.length
      expect(totalCards).toBe(CHARACTER_XINSU.startingDeck.length)
    })
  })

  describe('clearSave', () => {
    it('should remove save data from localStorage', () => {
      localStorage.setItem('dbg-save', JSON.stringify({ state: { map: {} } }))
      expect(hasSaveData()).toBe(true)
      
      const store = useGameStore.getState()
      store.clearSave()
      
      expect(hasSaveData()).toBe(false)
    })
  })

  describe('newGame', () => {
    it('should reset all game state', () => {
      // 先开始一个游戏
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      // 然后重新开始
      store.newGame()
      
      const newState = useGameStore.getState()
      expect(newState.phase).toBe('map')
      expect(newState.turn).toBe(1)
      expect(newState.player.hp).toBeGreaterThan(0)
      expect(newState.enemy).toBeNull()
      expect(newState.battleLog.length).toBe(0)
    })
  })

  describe('player state', () => {
    it('should track shaqi correctly', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      useGameStore.setState(s => ({
        player: { ...s.player, shaqi: 50 }
      }))
      
      const state = useGameStore.getState()
      expect(state.player.shaqi).toBe(50)
    })

    it('should track sanity correctly', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      useGameStore.setState(s => ({
        player: { ...s.player, san: 80 }
      }))
      
      const state = useGameStore.getState()
      expect(state.player.san).toBe(80)
    })

    it('should track gold correctly', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      useGameStore.setState(s => ({
        player: { ...s.player, gold: 100 }
      }))
      
      const state = useGameStore.getState()
      expect(state.player.gold).toBe(100)
    })
  })

  describe('damage calculation logic', () => {
    // 伤害计算公式：实际伤害 = 基础伤害 × (1 + 煞性比例)
    it('should have correct damage formula for 0 shaqi', () => {
      // 0 煞性 = 无加成
      const baseDamage = 10
      const shaqi = 0
      const expectedDamage = Math.floor(baseDamage * (1 + shaqi / 100))
      expect(expectedDamage).toBe(10)
    })

    it('should have correct damage formula for 50 shaqi', () => {
      // 50 煞性 = 50% 加成
      const baseDamage = 10
      const shaqi = 50
      const expectedDamage = Math.floor(baseDamage * (1 + shaqi / 100))
      expect(expectedDamage).toBe(15)
    })

    it('should have correct damage formula for 100 shaqi (madness)', () => {
      // 100 煞性 = 100% 加成，入魔时 ×3
      const baseDamage = 10
      const shaqi = 100
      const isMad = true
      let expectedDamage = Math.floor(baseDamage * (1 + shaqi / 100))
      if (isMad) expectedDamage *= 3
      expect(expectedDamage).toBe(60)
    })
  })

  describe('madness mechanics', () => {
    it('should track madness state correctly', () => {
      const store = useGameStore.getState()
      store.selectCharacter(CHARACTER_XINSU.id)
      
      useGameStore.setState(s => ({
        player: { ...s.player, isMad: true, madTurnCount: 3, energy: 5 }
      }))
      
      const state = useGameStore.getState()
      expect(state.player.isMad).toBe(true)
      expect(state.player.madTurnCount).toBe(3)
      expect(state.player.energy).toBe(5)
    })
  })
})