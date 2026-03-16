import { motion } from 'framer-motion'
import { useGameStore } from '../game/store'
import { useMetaStore } from '../game/meta'
import { ALL_CHARACTERS } from '../data/characters'
import './CharacterSelect.css'

export function CharacterSelect() {
  const selectCharacter = useGameStore(s => s.selectCharacter)
  const clearSave = useGameStore(s => s.clearSave)

  const handleSelect = (characterId: string) => {
    clearSave()  // 清除旧存档
    selectCharacter(characterId)
    // 触发游戏开始统计
    useMetaStore.getState().checkAchievements({ type: 'run_start', characterId })
  }

  return (
    <div className="character-select-screen">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🔮 选择角色
      </motion.h1>
      <p className="subtitle">选择你的修仙之路</p>

      <div className="character-list">
        {ALL_CHARACTERS.map((char, index) => (
          <motion.div
            key={char.id}
            className="character-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(139, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(char.id)}
          >
            <div className="character-header">
              <span className="character-icon">
                {char.icon === 'heart' ? '❤️' : char.icon === 'scroll' ? '📜' : char.icon === 'mask' ? '🎭' : '👤'}
              </span>
              <div className="character-titles">
                <h2 className="character-name">{char.name}</h2>
                <span className="character-title">{char.title}</span>
              </div>
            </div>
            
            <p className="character-description">{char.description}</p>
            
            <div className="character-stats">
              <div className="stat">
                <span className="stat-label">❤️ HP</span>
                <span className="stat-value">{char.maxHp}</span>
              </div>
              <div className="stat">
                <span className="stat-label">🧠 理智</span>
                <span className="stat-value">{char.maxSan}</span>
              </div>
              <div className="stat">
                <span className="stat-label">⚡ 能量</span>
                <span className="stat-value">{char.maxEnergy}</span>
              </div>
              <div className="stat">
                <span className="stat-label">🃏 卡牌</span>
                <span className="stat-value">{char.startingDeck.length}</span>
              </div>
            </div>

            <div className="character-select-btn">
              选择角色
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}