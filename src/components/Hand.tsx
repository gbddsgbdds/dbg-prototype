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

  if (phase !== 'player_turn') return null

  const canPlay = (cost: number) => !animating && player.energy >= cost

  return (
    <div className="hand-area">
      {hand.map((card, i) => (
        <motion.div
          key={`${card.id}-${i}`}
          className={`card ${card.type} ${canPlay(card.cost) ? 'playable' : 'disabled'}`}
          onClick={() => canPlay(card.cost) && playCard(i)}
          whileHover={canPlay(card.cost) ? { y: -20, scale: 1.05 } : {}}
          whileTap={canPlay(card.cost) ? { scale: 0.95 } : {}}
          layout
        >
          <div className="card-cost">{card.cost}</div>
          <div className="card-image">
            <img src={getPlaceholderUrl(card.icon || card.name)} alt={card.name} />
          </div>
          <div className="card-name">{card.name}</div>
          <div className="card-desc">{card.description}</div>
          <div className={`card-class ${card.cardClass}`}>{classLabel[card.cardClass] || ''}</div>
          <div className="card-type">
            {card.type === 'attack' ? '⚔️攻击' : card.type === 'skill' ? '🛡️技能' : '✨能力'}
          </div>
        </motion.div>
      ))}
      {hand.length === 0 && (
        <div className="empty-hand">{player.isMad ? '入魔中...没有牌了' : '手牌已用完'}</div>
      )}
    </div>
  )
}
