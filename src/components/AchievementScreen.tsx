import { useMetaStore } from '../game/meta'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface AchievementScreenProps {
  onClose: () => void
}

export function AchievementScreen({ onClose }: AchievementScreenProps) {
  const achievements = useMetaStore(s => s.achievements)
  const stats = useMetaStore(s => s.stats)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  
  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked
    if (filter === 'locked') return !a.unlocked
    return true
  })
  
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const percentage = Math.round((unlockedCount / achievements.length) * 100)

  return (
    <motion.div
      className="achievement-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="achievement-panel"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* 头部 */}
        <div className="achievement-header">
          <h2>🏆 成就</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        {/* 进度条 */}
        <div className="achievement-progress">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <span className="progress-text">
            {unlockedCount} / {achievements.length} ({percentage}%)
          </span>
        </div>
        
        {/* 筛选器 */}
        <div className="achievement-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            已解锁
          </button>
          <button
            className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
            onClick={() => setFilter('locked')}
          >
            未解锁
          </button>
        </div>
        
        {/* 成就列表 */}
        <div className="achievement-list">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="achievement-info">
                <div className="achievement-name">
                  {achievement.unlocked || !achievement.hidden ? achievement.name : '???'}
                </div>
                <div className="achievement-desc">
                  {achievement.unlocked || !achievement.hidden ? achievement.description : '隐藏成就'}
                </div>
              </div>
              {achievement.unlocked && (
                <div className="achievement-check">✓</div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* 统计信息 */}
        <div className="achievement-stats">
          <h3>📊 统计数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalRuns}</span>
              <span className="stat-label">游戏次数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.victories}</span>
              <span className="stat-label">通关次数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalKills}</span>
              <span className="stat-label">击杀数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.bossKills}</span>
              <span className="stat-label">Boss击杀</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalGoldEarned}</span>
              <span className="stat-label">累计金币</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.maxShaqiReached}</span>
              <span className="stat-label">最高煞气</span>
            </div>
          </div>
          {stats.bestTurnCount && (
            <div className="best-record">
              ⚡ 最快通关: {stats.bestTurnCount} 回合
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}