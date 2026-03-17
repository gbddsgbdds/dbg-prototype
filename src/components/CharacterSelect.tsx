import { motion } from 'framer-motion'
import { useGameStore } from '../game/store'
import { useMetaStore } from '../game/meta'
import { ALL_CHARACTERS } from '../data/characters'
import './CharacterSelect.css'

// 角色解锁条件
const CHARACTER_UNLOCK_CONDITIONS: Record<string, string> = {
  fajiao: '使用心素通关一次',
  zuowang: '在入魔状态下击败Boss',
}

export function CharacterSelect() {
  const selectCharacter = useGameStore(s => s.selectCharacter)
  const clearSave = useGameStore(s => s.clearSave)
  const unlockedCharacters = useMetaStore(s => s.unlockedCharacters)

  const handleSelect = (characterId: string, isUnlocked: boolean) => {
    if (!isUnlocked) return  // 锁定角色不可选
    
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
        {ALL_CHARACTERS.map((char, index) => {
          const isUnlocked = unlockedCharacters.includes(char.id)
          const unlockCondition = CHARACTER_UNLOCK_CONDITIONS[char.id]
          
          return (
            <motion.div
              key={char.id}
              className={`character-card ${!isUnlocked ? 'locked' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
              whileHover={isUnlocked ? { scale: 1.02, boxShadow: '0 8px 30px rgba(139, 0, 0, 0.3)' } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(char.id, isUnlocked)}
            >
              {/* 锁定遮罩 */}
              {!isUnlocked && (
                <div className="character-lock-overlay">
                  <div className="lock-icon">🔒</div>
                  <div className="unlock-hint">{unlockCondition}</div>
                </div>
              )}
              
              <div className="character-header">
                <span className="character-icon">
                  {char.icon === 'heart' ? '❤️' : char.icon === 'scroll' ? '📜' : char.icon === 'mask' ? '🎭' : '👤'}
                </span>
                <div className="character-titles">
                  <h2 className="character-name">
                    {isUnlocked ? char.name : '???'}
                  </h2>
                  <span className="character-title">
                    {isUnlocked ? char.title : '未解锁'}
                  </span>
                </div>
              </div>
              
              <p className="character-description">
                {isUnlocked ? char.description : '完成特定条件解锁此角色。'}
              </p>
              
              {isUnlocked && (
                <>
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
                </>
              )}
              
              {!isUnlocked && (
                <div className="character-locked-btn">
                  🔒 未解锁
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}