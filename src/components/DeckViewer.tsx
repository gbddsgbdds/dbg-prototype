import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../game/store'
import { getPlaceholderUrl } from '../utils/placeholder'

const classLabel: Record<string, string> = {
  warrior: '兵家', puppet: '傩戏', sorcerer: '法教', firecraft: '禁术',
}

export function DeckViewer() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'all' | 'draw' | 'discard'>('all')
  const drawPile = useGameStore(s => s.drawPile)
  const hand = useGameStore(s => s.hand)
  const discardPile = useGameStore(s => s.discardPile)
  const exhaustPile = useGameStore(s => s.exhaustPile)

  const allCards = [...drawPile, ...hand, ...discardPile, ...exhaustPile]

  const getCards = () => {
    switch (tab) {
      case 'draw': return drawPile
      case 'discard': return discardPile
      default: return allCards
    }
  }

  const cards = getCards()
  const cardCounts: Record<string, number> = {}
  cards.forEach(c => {
    cardCounts[c.id] = (cardCounts[c.id] || 0) + 1
  })
  const uniqueCards = Object.entries(cardCounts).map(([id, count]) => ({
    card: cards.find(c => c.id === id)!,
    count,
  }))

  return (
    <>
      <button className="deck-btn" onClick={() => setOpen(true)}>
        📋 牌组
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="deck-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>📋 牌组</h2>

              <div className="deck-stats">
                <span>抽牌堆: {drawPile.length}</span>
                <span>手牌: {hand.length}</span>
                <span>弃牌堆: {discardPile.length}</span>
              </div>

              <div className="deck-tabs">
                <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>全部 ({allCards.length})</button>
                <button className={tab === 'draw' ? 'active' : ''} onClick={() => setTab('draw')}>抽牌堆 ({drawPile.length})</button>
                <button className={tab === 'discard' ? 'active' : ''} onClick={() => setTab('discard')}>弃牌堆 ({discardPile.length})</button>
              </div>

              <div className="deck-cards">
                {uniqueCards.length === 0 ? (
                  <p className="empty-deck">暂无卡牌</p>
                ) : (
                  uniqueCards.map(({ card, count }) => (
                    <div key={card.id} className="deck-card-item">
                      <div className="deck-card-icon">
                        <img src={getPlaceholderUrl(card.icon || card.name, 60, 80)} alt={card.name} />
                      </div>
                      <div className="deck-card-info">
                        <span className="deck-card-name">{card.name}</span>
                        <span className="deck-card-desc">{card.description}</span>
                        <span className={`deck-card-class ${card.cardClass}`}>{classLabel[card.cardClass]}</span>
                      </div>
                      <span className="deck-card-count">×{count}</span>
                    </div>
                  ))
                )}
              </div>

              <button className="close-btn" onClick={() => setOpen(false)}>
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}