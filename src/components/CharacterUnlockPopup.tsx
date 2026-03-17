import { motion, AnimatePresence } from 'framer-motion'
import { useMetaStore } from '../game/meta'

export function CharacterUnlockPopup() {
  const pendingCharacterUnlocks = useMetaStore(s => s.pendingCharacterUnlocks)
  const dismissCharacterUnlock = useMetaStore(s => s.dismissCharacterUnlock)
  
  const currentUnlock = pendingCharacterUnlocks[0]
  
  const handleDismiss = () => {
    dismissCharacterUnlock()
  }
  
  return (
    <AnimatePresence>
      {currentUnlock && (
        <motion.div
          className="character-unlock-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          <motion.div
            className="character-unlock-content"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              className="unlock-icon"
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.5 }}
            >
              {currentUnlock.icon}
            </motion.div>
            
            <h2 className="unlock-title">🎭 角色解锁！</h2>
            
            <div className="unlock-character-info">
              <div className="unlock-name">{currentUnlock.characterName}</div>
              <div className="unlock-title-sub">{currentUnlock.characterTitle}</div>
            </div>
            
            <p className="unlock-hint">
              新角色已在角色选择界面解锁
            </p>
            
            <button className="unlock-close-btn" onClick={handleDismiss}>
              继续修仙
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}