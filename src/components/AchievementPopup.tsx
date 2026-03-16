import { useMetaStore } from '../game/meta'
import { motion, AnimatePresence } from 'framer-motion'

export function AchievementPopup() {
  const pendingPopups = useMetaStore(s => s.pendingPopups)
  const dismissPopup = useMetaStore(s => s.dismissPopup)
  
  const currentPopup = pendingPopups[0]
  
  // 3秒后自动消失
  if (currentPopup) {
    setTimeout(() => {
      dismissPopup()
    }, 3000)
  }

  return (
    <AnimatePresence>
      {currentPopup && (
        <motion.div
          className="achievement-popup"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={dismissPopup}
        >
          <motion.div
            className="popup-content"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.5)',
                '0 0 40px rgba(255, 215, 0, 0.8)',
                '0 0 20px rgba(255, 215, 0, 0.5)'
              ]
            }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <div className="popup-icon">{currentPopup.icon}</div>
            <div className="popup-info">
              <div className="popup-title">🏆 成就解锁!</div>
              <div className="popup-name">{currentPopup.name}</div>
              <div className="popup-desc">{currentPopup.description}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}