import { useGameStore } from '../game/store'
import { getPlaceholderUrl } from '../utils/placeholder'
import { motion, AnimatePresence } from 'framer-motion'

const classLabel: Record<string, string> = {
  warrior: '兵家', puppet: '傩戏', sorcerer: '法教', firecraft: '禁术',
}

// 卡牌动画变体
const cardVariants = {
  // 初始状态（抽牌动画：从左侧飞入）
  initial: {
    x: -200,
    opacity: 0,
    scale: 0.8,
    rotate: -10,
  },
  // 正常显示状态
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
  // 打出动画：向上飞出
  play: {
    y: -150,
    opacity: 0,
    scale: 0.6,
    rotate: 10,
    transition: {
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  },
  // 弃牌动画：向右下飞出
  discard: {
    x: 200,
    y: 50,
    opacity: 0,
    scale: 0.7,
    rotate: 15,
    transition: {
      duration: 0.4,
      ease: 'easeIn' as const,
    },
  },
}

// 卡牌容器动画（交错进入效果）
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export function Hand() {
  const hand = useGameStore(s => s.hand)
  const player = useGameStore(s => s.player)
  const phase = useGameStore(s => s.phase)
  const animating = useGameStore(s => s.animating)
  const playCard = useGameStore(s => s.playCard)
  const exorcismMode = useGameStore(s => s.exorcismMode)
  const useExorcismTalisman = useGameStore(s => s.useExorcismTalisman)

  if (phase !== 'player_turn') return null

  const canPlay = (cost: number) => !animating && player.energy >= cost

  const handleCardClick = (i: number) => {
    const card = hand[i]
    if (exorcismMode) {
      useExorcismTalisman(i)
      return
    }
    if (canPlay(card.cost)) playCard(i)
  }

  return (
    <motion.div 
      className="hand-area"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {exorcismMode && <div className="exorcism-hint">🔮 点击一张牌使用驱魔符翻面</div>}
      <AnimatePresence mode="popLayout">
        {hand.map((card, i) => {
          const isHall = card.isHallucination
          return (
            <motion.div
              key={`${card.id}-${i}`}
              className={`card ${card.type} ${isHall ? 'hallucination' : ''} ${canPlay(card.cost) ? 'playable' : 'disabled'} ${exorcismMode ? 'exorcism-target' : ''}`}
              onClick={() => handleCardClick(i)}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="play"
              whileHover={exorcismMode ? { y: -20, scale: 1.05, boxShadow: '0 0 20px rgba(155, 89, 182, 0.5)' } : canPlay(card.cost) ? { y: -20, scale: 1.05, boxShadow: '0 0 20px rgba(88, 166, 255, 0.3)' } : {}}
              whileTap={exorcismMode ? { scale: 0.95 } : canPlay(card.cost) ? { scale: 0.95 } : {}}
              layout
              style={{ 
                zIndex: i,
                transformOrigin: 'bottom center',
              }}
            >
              <div className="card-cost">{card.cost}</div>
              {isHall ? (
                <>
                  <div className="card-image hallucination-back">
                    <span className="hallucination-icon">👁️</span>
                  </div>
                  <div className="card-name">???</div>
                  <div className="card-desc">这张牌看起来很模糊...</div>
                  <div className="card-class">幻觉</div>
                  <div className="card-type">❓未知</div>
                </>
              ) : (
                <>
                  <div className="card-image">
                    <img src={getPlaceholderUrl(card.id)} alt={card.name} />
                  </div>
                  <div className="card-name">{card.name}</div>
                  <div className="card-desc">{card.description}</div>
                  <div className={`card-class ${card.cardClass}`}>{classLabel[card.cardClass] || ''}</div>
                  <div className="card-type">
                    {card.type === 'attack' ? '⚔️攻击' : card.type === 'skill' ? '🛡️技能' : '✨能力'}
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
      {hand.length === 0 && (
        <div className="empty-hand">{player.isMad ? '入魔中...没有牌了' : '手牌已用完'}</div>
      )}
    </motion.div>
  )
}
