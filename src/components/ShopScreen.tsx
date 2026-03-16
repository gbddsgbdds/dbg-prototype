import { motion } from 'framer-motion'
import { useGameStore } from '../game/store'
import type { CardDef } from '../game/types'
import './ShopScreen.css'

// 卡牌稀有度颜色
const RARITY_COLORS: Record<string, string> = {
  starter: '#888',
  common: '#fff',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  legendary: '#fbbf24',
}

const RARITY_NAMES: Record<string, string> = {
  starter: '初始',
  common: '普通',
  uncommon: '稀有',
  rare: '史诗',
  legendary: '传说',
}

// 卡牌类型名称
const TYPE_NAMES: Record<string, string> = {
  attack: '攻击',
  skill: '技能',
  power: '能力',
}

function CardItem({ card, price, sold, onBuy }: { card: CardDef; price: number; sold: boolean; onBuy: () => void }) {
  const playerGold = useGameStore(s => s.player.gold)
  const canBuy = !sold && playerGold >= price

  return (
    <motion.div
      className={`shop-card ${sold ? 'sold' : ''} ${canBuy ? 'affordable' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={canBuy ? { scale: 1.02 } : {}}
    >
      <div className="card-header">
        <span className="card-cost">{card.cost}</span>
        <span className="card-name">{card.name}</span>
        <span className="card-rarity" style={{ color: RARITY_COLORS[card.rarity] }}>
          {RARITY_NAMES[card.rarity]}
        </span>
      </div>
      <div className="card-type">{TYPE_NAMES[card.type]}</div>
      <div className="card-desc">{card.description}</div>
      <div className="card-price">
        {sold ? (
          <span className="sold-text">已售出</span>
        ) : (
          <>
            <span className="price-coin">💰</span>
            <span className="price-value">{price}</span>
          </>
        )}
      </div>
      {!sold && (
        <button
          className="buy-btn"
          onClick={onBuy}
          disabled={!canBuy}
        >
          {canBuy ? '购买' : '金币不足'}
        </button>
      )}
    </motion.div>
  )
}

export function ShopScreen() {
  const shopItems = useGameStore(s => s.shopItems)
  const player = useGameStore(s => s.player)
  const removeCost = useGameStore(s => s.removeCost)
  const buyCard = useGameStore(s => s.buyCard)
  const removeCard = useGameStore(s => s.removeCard)
  const leaveShop = useGameStore(s => s.leaveShop)

  // 获取牌组中的所有卡牌（用于移除）
  const drawPile = useGameStore(s => s.drawPile)
  const discardPile = useGameStore(s => s.discardPile)
  const hand = useGameStore(s => s.hand)
  const allCards = [...drawPile, ...discardPile, ...hand]

  // 统计卡牌数量
  const cardCounts = allCards.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 唯一卡牌列表
  const uniqueCards = Object.entries(cardCounts).map(([id, count]) => ({
    card: allCards.find(c => c.id === id)!,
    count,
  }))

  if (!shopItems) return null

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <h2>🏪 神秘商店</h2>
        <div className="player-gold">
          💰 {player.gold} 金币
        </div>
      </div>

      <div className="shop-section">
        <h3>📦 卡牌出售</h3>
        <div className="shop-cards">
          {shopItems.map((item, index) => (
            <CardItem
              key={index}
              card={item.card}
              price={item.price}
              sold={item.sold}
              onBuy={() => buyCard(index)}
            />
          ))}
        </div>
      </div>

      <div className="shop-section remove-section">
        <h3>🗑️ 移除卡牌 <span className="remove-cost">（{removeCost} 金币/张）</span></h3>
        {player.gold < removeCost && (
          <p className="remove-hint">金币不足，无法移除卡牌</p>
        )}
        {player.gold >= removeCost && uniqueCards.length > 0 && (
          <div className="remove-cards">
            {uniqueCards.map(({ card, count }) => (
              <motion.button
                key={card.id}
                className="remove-card-btn"
                onClick={() => removeCard(card.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="card-name">{card.name}</span>
                <span className="card-count">×{count}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="shop-actions">
        <motion.button
          className="leave-btn"
          onClick={leaveShop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          离开商店
        </motion.button>
      </div>
    </div>
  )
}