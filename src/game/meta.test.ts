import { describe, it, expect, beforeEach } from 'vitest'
import { useMetaStore, getAchievementProgress } from './meta'

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

describe('Meta Store (Achievements & Stats)', () => {
  beforeEach(() => {
    localStorage.clear()
    // 重置store状态
    useMetaStore.setState({
      achievements: useMetaStore.getState().achievements.map(a => ({ ...a, unlocked: false })),
      stats: {
        totalRuns: 0,
        victories: 0,
        defeats: 0,
        totalKills: 0,
        eliteKills: 0,
        bossKills: 0,
        totalGoldEarned: 0,
        maxShaqiReached: 0,
        characterRuns: {},
        characterVictories: {},
        bestTurnCount: null,
        totalPlayTime: 0,
      },
      unlockedCharacters: ['xinsu'],
      pendingPopups: [],
    })
  })

  describe('initial state', () => {
    it('should have default unlocked characters', () => {
      const state = useMetaStore.getState()
      expect(state.unlockedCharacters).toContain('xinsu')
    })

    it('should have all achievements defined', () => {
      const state = useMetaStore.getState()
      expect(state.achievements.length).toBeGreaterThan(10)
    })

    it('should have zero stats initially', () => {
      const state = useMetaStore.getState()
      expect(state.stats.totalRuns).toBe(0)
      expect(state.stats.victories).toBe(0)
      expect(state.stats.totalKills).toBe(0)
    })
  })

  describe('unlockAchievement', () => {
    it('should unlock an achievement', () => {
      const store = useMetaStore.getState()
      store.unlockAchievement('first_victory')
      
      const state = useMetaStore.getState()
      const achievement = state.achievements.find(a => a.id === 'first_victory')
      expect(achievement?.unlocked).toBe(true)
    })

    it('should add unlocked achievement to pending popups', () => {
      const store = useMetaStore.getState()
      store.unlockAchievement('first_boss')
      
      const state = useMetaStore.getState()
      expect(state.pendingPopups.length).toBe(1)
      expect(state.pendingPopups[0].id).toBe('first_boss')
    })

    it('should not unlock same achievement twice', () => {
      const store = useMetaStore.getState()
      store.unlockAchievement('first_victory')
      store.unlockAchievement('first_victory')
      
      const state = useMetaStore.getState()
      expect(state.pendingPopups.length).toBe(1)
    })
  })

  describe('checkAchievements', () => {
    it('should update stats on kill', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'kill' })
      
      const state = useMetaStore.getState()
      expect(state.stats.totalKills).toBe(1)
    })

    it('should update stats on elite kill and unlock achievement', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'elite_kill' })
      
      const state = useMetaStore.getState()
      expect(state.stats.eliteKills).toBe(1)
      expect(state.stats.totalKills).toBe(1)
      
      const achievement = state.achievements.find(a => a.id === 'first_elite')
      expect(achievement?.unlocked).toBe(true)
    })

    it('should update stats on boss kill and unlock achievement', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'boss_kill' })
      
      const state = useMetaStore.getState()
      expect(state.stats.bossKills).toBe(1)
      
      const achievement = state.achievements.find(a => a.id === 'first_boss')
      expect(achievement?.unlocked).toBe(true)
    })

    it('should update gold stats and unlock cumulative achievements', () => {
      const store = useMetaStore.getState()
      
      // 获得500金币
      store.checkAchievements({ type: 'gold_earned', value: 500 })
      
      const state = useMetaStore.getState()
      expect(state.stats.totalGoldEarned).toBe(500)
      
      const gold500Achievement = state.achievements.find(a => a.id === 'gold_500')
      expect(gold500Achievement?.unlocked).toBe(true)
    })

    it('should update shaqi stats', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'shaqi_reached', value: 75 })
      
      const state = useMetaStore.getState()
      expect(state.stats.maxShaqiReached).toBe(75)
    })

    it('should unlock shaqi_master at 90 shaqi', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'shaqi_reached', value: 90 })
      
      const state = useMetaStore.getState()
      const achievement = state.achievements.find(a => a.id === 'shaqi_master')
      expect(achievement?.unlocked).toBe(true)
    })

    it('should unlock madness achievement', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'madness' })
      
      const state = useMetaStore.getState()
      const achievement = state.achievements.find(a => a.id === 'first_madness')
      expect(achievement?.unlocked).toBe(true)
    })

    it('should track victory with character', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'victory', characterId: 'xinsu', turnCount: 25 })
      
      const state = useMetaStore.getState()
      expect(state.stats.victories).toBe(1)
      expect(state.stats.characterVictories['xinsu']).toBe(1)
      expect(state.stats.bestTurnCount).toBe(25)
    })

    it('should unlock speedrun achievements', () => {
      const store = useMetaStore.getState()
      store.checkAchievements({ type: 'victory', turnCount: 20 })
      
      const state = useMetaStore.getState()
      const speedrun30 = state.achievements.find(a => a.id === 'speedrun_30')
      const speedrun20 = state.achievements.find(a => a.id === 'speedrun_20')
      expect(speedrun30?.unlocked).toBe(true)
      expect(speedrun20?.unlocked).toBe(true)
    })

    it('should unlock cumulative kill achievements', () => {
      const store = useMetaStore.getState()
      
      // 击杀50个敌人
      for (let i = 0; i < 50; i++) {
        store.checkAchievements({ type: 'kill' })
      }
      
      const state = useMetaStore.getState()
      expect(state.stats.totalKills).toBe(50)
      
      const kill50 = state.achievements.find(a => a.id === 'kill_50')
      expect(kill50?.unlocked).toBe(true)
    })
  })

  describe('dismissPopup', () => {
    it('should remove first popup from queue', () => {
      const store = useMetaStore.getState()
      store.unlockAchievement('first_victory')
      store.unlockAchievement('first_boss')
      
      expect(useMetaStore.getState().pendingPopups.length).toBe(2)
      
      store.dismissPopup()
      
      expect(useMetaStore.getState().pendingPopups.length).toBe(1)
      expect(useMetaStore.getState().pendingPopups[0].id).toBe('first_boss')
    })
  })

  describe('resetProgress', () => {
    it('should reset all progress', () => {
      const store = useMetaStore.getState()
      
      // 解锁一些成就和获取统计
      store.checkAchievements({ type: 'victory', characterId: 'xinsu' })
      store.checkAchievements({ type: 'kill' })
      store.checkAchievements({ type: 'gold_earned', value: 100 })
      
      // 重置
      store.resetProgress()
      
      const state = useMetaStore.getState()
      expect(state.stats.victories).toBe(0)
      expect(state.stats.totalKills).toBe(0)
      expect(state.stats.totalGoldEarned).toBe(0)
      expect(state.pendingPopups.length).toBe(0)
      
      const allLocked = state.achievements.every(a => !a.unlocked)
      expect(allLocked).toBe(true)
    })
  })

  describe('getAchievementProgress', () => {
    it('should return correct progress', () => {
      const store = useMetaStore.getState()
      store.unlockAchievement('first_victory')
      store.unlockAchievement('first_boss')
      
      const progress = getAchievementProgress()
      expect(progress.unlocked).toBe(2)
      expect(progress.total).toBeGreaterThan(10)
    })
  })
})