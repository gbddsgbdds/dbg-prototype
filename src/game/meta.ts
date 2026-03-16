// 元游戏系统 - 成就、解锁、统计
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ==================== 类型定义 ====================

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number  // 解锁时间戳
  hidden?: boolean     // 隐藏成就（未解锁前不显示详情）
}

export interface GameStats {
  // 游戏次数
  totalRuns: number
  victories: number
  defeats: number
  
  // 战斗统计
  totalKills: number
  eliteKills: number
  bossKills: number
  
  // 资源统计
  totalGoldEarned: number
  maxShaqiReached: number
  
  // 角色统计
  characterRuns: Record<string, number>
  characterVictories: Record<string, number>
  
  // 最佳记录
  bestTurnCount: number | null  // 最快通关回合数
  totalPlayTime: number  // 总游戏时间（分钟）
}

export interface MetaState {
  achievements: Achievement[]
  stats: GameStats
  unlockedCharacters: string[]  // 已解锁角色ID
  pendingPopups: Achievement[]  // 待显示的成就弹窗
  
  // 方法
  unlockAchievement: (id: string) => void
  checkAchievements: (event: AchievementCheckEvent) => void
  dismissPopup: () => void
  resetProgress: () => void
}

// 成就检查事件
export interface AchievementCheckEvent {
  type: 'victory' | 'defeat' | 'kill' | 'elite_kill' | 'boss_kill' | 'madness' | 'gold_earned' | 'run_start' | 'shaqi_reached'
  value?: number
  characterId?: string
  turnCount?: number
  playerHp?: number
}

// ==================== 成就定义 ====================

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // 首次成就
  { id: 'first_victory', name: '初窥门径', description: '首次通关游戏', icon: '🏆' },
  { id: 'first_boss', name: '斩妖除魔', description: '首次击败任意Boss', icon: '👹' },
  { id: 'first_elite', name: '精英猎手', description: '首次击败精英怪', icon: '⚔️' },
  { id: 'first_madness', name: '走火入魔', description: '首次进入入魔状态', icon: '🔥' },
  { id: 'first_character_xinsu', name: '心素觉醒', description: '使用心素角色通关', icon: '👁️' },
  { id: 'first_character_fajiao', name: '道法自然', description: '使用法教角色通关', icon: '☯️' },
  { id: 'first_character_zuowang', name: '幻世迷离', description: '使用坐忘道角色通关', icon: '🎲' },
  
  // 累计成就
  { id: 'kill_50', name: '杀敌如麻', description: '累计击败50个敌人', icon: '💀' },
  { id: 'kill_100', name: '屠戮众生', description: '累计击败100个敌人', icon: '☠️' },
  { id: 'kill_500', name: '修罗降世', description: '累计击败500个敌人', icon: '😈' },
  { id: 'gold_500', name: '小有积蓄', description: '累计获得500金币', icon: '💰' },
  { id: 'gold_1000', name: '富甲一方', description: '累计获得1000金币', icon: '🤑' },
  { id: 'run_5', name: '轮回五世', description: '完成5次游戏流程', icon: '🔄' },
  { id: 'run_10', name: '轮回十世', description: '完成10次游戏流程', icon: '♾️' },
  { id: 'victory_3', name: '三度飞升', description: '通关3次', icon: '⭐' },
  { id: 'victory_5', name: '五气朝元', description: '通关5次', icon: '🌟' },
  
  // 挑战成就
  { id: 'speedrun_30', name: '速通达人', description: '30回合内通关', icon: '⚡' },
  { id: 'speedrun_20', name: '速通大师', description: '20回合内通关', icon: '🚀' },
  { id: 'low_hp_victory', name: '绝境逢生', description: 'HP≤10时击败最终Boss', icon: '❤️‍🔥' },
  { id: 'shaqi_master', name: '煞气掌控', description: '单局达到90煞气', icon: '🌀' },
  
  // 隐藏成就
  { id: 'madness_victory', name: '以疯证道', description: '在入魔状态下击败最终Boss', icon: '🌀', hidden: true },
  { id: 'no_card_skip', name: '从不放弃', description: '一局游戏中从不跳过奖励卡牌', icon: '🃏', hidden: true },
]

// ==================== 初始状态 ====================

const initialStats: GameStats = {
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
}

// ==================== Store ====================

export const useMetaStore = create<MetaState>()(
  persist(
    (set, get) => ({
      achievements: ACHIEVEMENT_DEFS.map(def => ({ ...def, unlocked: false })),
      stats: initialStats,
      unlockedCharacters: ['xinsu'],  // 心素默认解锁
      pendingPopups: [],

  unlockAchievement: (id: string) => {
    const s = get()
    const achievement = s.achievements.find(a => a.id === id)
    if (!achievement || achievement.unlocked) return
    
    const updated = s.achievements.map(a => 
      a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
    )
    
    // 添加到待显示弹窗
    const unlockedAchievement = updated.find(a => a.id === id)!
    set({ 
      achievements: updated,
      pendingPopups: [...s.pendingPopups, unlockedAchievement]
    })
    
    console.log(`🏆 成就解锁: ${achievement.name}`)
  },

  checkAchievements: (event: AchievementCheckEvent) => {
    const s = get()
    const stats = { ...s.stats }
    
    // 更新统计数据
    switch (event.type) {
      case 'run_start':
        stats.totalRuns += 1
        if (event.characterId) {
          stats.characterRuns[event.characterId] = (stats.characterRuns[event.characterId] || 0) + 1
        }
        break
      case 'victory':
        stats.victories += 1
        if (event.characterId) {
          stats.characterVictories[event.characterId] = (stats.characterVictories[event.characterId] || 0) + 1
        }
        if (event.turnCount !== undefined) {
          if (stats.bestTurnCount === null || event.turnCount < stats.bestTurnCount) {
            stats.bestTurnCount = event.turnCount
          }
        }
        break
      case 'defeat':
        stats.defeats += 1
        break
      case 'kill':
        stats.totalKills += 1
        break
      case 'elite_kill':
        stats.eliteKills += 1
        stats.totalKills += 1
        break
      case 'boss_kill':
        stats.bossKills += 1
        stats.totalKills += 1
        break
      case 'gold_earned':
        stats.totalGoldEarned += event.value || 0
        break
      case 'shaqi_reached':
        if (event.value !== undefined && event.value > stats.maxShaqiReached) {
          stats.maxShaqiReached = event.value
        }
        break
    }
    
    set({ stats })
    
    // 检查成就解锁条件
    const { unlockAchievement } = get()
    
    // 首次成就
    if (event.type === 'victory') {
      unlockAchievement('first_victory')
      if (event.characterId === 'xinsu') unlockAchievement('first_character_xinsu')
      if (event.characterId === 'fajiao') unlockAchievement('first_character_fajiao')
      if (event.characterId === 'zuowang') unlockAchievement('first_character_zuowang')
      
      // 速通成就
      if (event.turnCount !== undefined) {
        if (event.turnCount <= 30) unlockAchievement('speedrun_30')
        if (event.turnCount <= 20) unlockAchievement('speedrun_20')
      }
      
      // 低血量通关
      if (event.playerHp !== undefined && event.playerHp <= 10) {
        unlockAchievement('low_hp_victory')
      }
      
      // 通关次数成就
      if (stats.victories >= 3) unlockAchievement('victory_3')
      if (stats.victories >= 5) unlockAchievement('victory_5')
    }
    
    if (event.type === 'boss_kill') {
      unlockAchievement('first_boss')
    }
    
    if (event.type === 'elite_kill') {
      unlockAchievement('first_elite')
    }
    
    if (event.type === 'madness') {
      unlockAchievement('first_madness')
    }
    
    if (event.type === 'shaqi_reached' && event.value !== undefined && event.value >= 90) {
      unlockAchievement('shaqi_master')
    }
    
    // 累计成就
    if (stats.totalKills >= 50) unlockAchievement('kill_50')
    if (stats.totalKills >= 100) unlockAchievement('kill_100')
    if (stats.totalKills >= 500) unlockAchievement('kill_500')
    
    if (stats.totalGoldEarned >= 500) unlockAchievement('gold_500')
    if (stats.totalGoldEarned >= 1000) unlockAchievement('gold_1000')
    
    if (stats.totalRuns >= 5) unlockAchievement('run_5')
    if (stats.totalRuns >= 10) unlockAchievement('run_10')
  },

  dismissPopup: () => {
    const s = get()
    const remaining = s.pendingPopups.slice(1)
    set({ pendingPopups: remaining })
  },

  resetProgress: () => {
    set({
      achievements: ACHIEVEMENT_DEFS.map(def => ({ ...def, unlocked: false })),
      stats: initialStats,
      unlockedCharacters: ['xinsu'],
      pendingPopups: [],
    })
  },
}),
    {
      name: 'dbg-meta',
      version: 1,
    }
  )
)

// ==================== 辅助函数 ====================

/** 获取成就完成进度 */
export function getAchievementProgress(): { unlocked: number; total: number } {
  const store = useMetaStore.getState()
  const unlocked = store.achievements.filter(a => a.unlocked).length
  return { unlocked, total: store.achievements.length }
}

/** 计算游戏时长（简化版：每场战斗估算2分钟） */
export function estimatePlayTime(stats: GameStats): number {
  return stats.totalRuns * 15  // 平均每局15分钟
}