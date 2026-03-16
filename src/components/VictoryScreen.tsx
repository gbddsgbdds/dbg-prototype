import { useGameStore } from '../game/store'
import { motion } from 'framer-motion'

export function VictoryScreen() {
  const rewardCards = useGameStore(s => s.rewardCards)
  const enemyQueue = useGameStore(s => s.enemyQueue)
  const addCard = useGameStore(s => s.addCard)
  const skipReward = useGameStore(s => s.skipReward)
  const nextEnemy = useGameStore(s => s.nextEnemy)
  const newGame = useGameStore(s => s.newGame)
  const hasMore = enemyQueue.length > 0

  return (
    <div className="overlay">
      <motion.div className="victory-panel" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h2>🎉 胜利！</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          {hasMore ? `还有 ${enemyQueue.length} 个敌人...` : '击败了所有敌人！'}
        </p>

        {rewardCards && rewardCards.length > 0 && (
          <>
            <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '0.5rem' }}>选择一张卡牌（或跳过）</p>
            <div className="reward-cards">
              {rewardCards.map(card => (
                <div key={card.id} className="reward-card" onClick={() => addCard(card)}>
                  <div className="card-name">{card.name}</div>
                  <div className="card-desc">{card.description}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    {card.cardClass === 'warrior' ? '⚔️兵家' : card.cardClass === 'puppet' ? '🎭傩戏' : card.cardClass === 'firecraft' ? '🔥禁术' : card.cardClass}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={skipReward} style={{ fontSize: '0.8rem', padding: '0.3rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              跳过
            </button>
          </>
        )}

        {!rewardCards && (
          <button onClick={hasMore ? nextEnemy : newGame}>
            {hasMore ? '下一个敌人' : '重新开始'}
          </button>
        )}
      </motion.div>
    </div>
  )
}
