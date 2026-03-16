import { useGameStore } from '../game/store'
import { getPlaceholderUrl } from '../utils/placeholder'
import { motion } from 'framer-motion'

const classLabel: Record<string, string> = {
  warrior: '兵家', puppet: '傩戏', sorcerer: '法教', firecraft: '禁术',
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
    <div className="hand-area">
      {exorcismMode && <div className="exorcism-hint">🔮 点击一张牌使用驱魔符翻面</div>}
      {hand.map((card, i) => {
        const isHall = card.isHallucination
        return (
          <motion.div
            key={`${card.id}-${i}`}
            className={`card ${card.type} ${isHall ? 'hallucination' : ''} ${canPlay(card.cost) ? 'playable' : 'disabled'} ${exorcismMode ? 'exorcism-target' : ''}`}
            onClick={() => handleCardClick(i)}
            whileHover={exorcismMode ? { y: -20, scale: 1.05 } : canPlay(card.cost) ? { y: -20, scale: 1.05 } : {}}
            whileTap={exorcismMode ? { scale: 0.95 } : canPlay(card.cost) ? { scale: 0.95 } : {}}
            layout
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
                  <img src={getPlaceholderUrl(card.icon || card.name)} alt={card.name} />
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
      {hand.length === 0 && (
        <div className="empty-hand">{player.isMad ? '入魔中...没有牌了' : '手牌已用完'}</div>
      )}
    </div>
  )
}
