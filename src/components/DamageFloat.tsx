import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../game/store'

export interface DamageFloatItem {
  id: string
  value: number
  type: 'damage' | 'heal' | 'block' | 'san' | 'special'
  target: 'player' | 'enemy'
}

export function DamageFloat() {
  const floats = useGameStore(s => s.damageFloats)

  return (
    <div className="damage-float-container">
      <AnimatePresence>
        {floats.map(float => (
          <motion.div
            key={float.id}
            className={`damage-float ${float.type} ${float.target}`}
            initial={{ 
              opacity: 1, 
              y: 0, 
              scale: 0.5,
            }}
            animate={{ 
              opacity: 0, 
              y: -80, 
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: 'easeOut',
            }}
          >
            {float.type === 'heal' && '+'}
            {float.type === 'block' && '🛡️'}
            {float.type === 'san' && '🧠'}
            {float.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// 伤害飘字专用容器 - 敌人位置
export function EnemyDamageFloat() {
  const floats = useGameStore(s => s.damageFloats)
  const enemyFloats = floats.filter(f => f.target === 'enemy')

  return (
    <div className="enemy-damage-float-container">
      <AnimatePresence>
        {enemyFloats.map(float => (
          <motion.div
            key={float.id}
            className={`damage-float ${float.type} enemy-float`}
            initial={{ 
              opacity: 1, 
              y: 0, 
              scale: 0.8,
              x: Math.random() * 40 - 20, // 随机偏移避免重叠
            }}
            animate={{ 
              opacity: 0, 
              y: -60, 
              scale: 1.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1, 
              ease: 'easeOut',
            }}
          >
            {float.type === 'heal' && '+'}
            {float.type === 'block' && '🛡️'}
            <span className="float-value">{float.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// 玩家伤害飘字容器
export function PlayerDamageFloat() {
  const floats = useGameStore(s => s.damageFloats)
  const playerFloats = floats.filter(f => f.target === 'player')

  return (
    <div className="player-damage-float-container">
      <AnimatePresence>
        {playerFloats.map(float => (
          <motion.div
            key={float.id}
            className={`damage-float ${float.type} player-float`}
            initial={{ 
              opacity: 1, 
              y: 0, 
              scale: 0.8,
              x: Math.random() * 30 - 15,
            }}
            animate={{ 
              opacity: 0, 
              y: -50, 
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.9, 
              ease: 'easeOut',
            }}
          >
            {float.type === 'heal' && '+'}
            {float.type === 'block' && '🛡️'}
            {float.type === 'san' && '🧠'}
            <span className="float-value">{float.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}