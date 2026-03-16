import { useGameStore } from '../game/store'
import { motion } from 'framer-motion'

export function VictoryScreen() {
  const rewardCards = useGameStore(s => s.rewardCards)
  const enemyQueue = useGameStore(s => s.enemyQueue)
  const addCard = useGameStore(s => s.addCard)
  const skipReward = useGameStore(s => s.skipReward)
  const nextEnemy = useGameStore(s => s.nextEnemy)
  const newGame = useGameStore(s => s.newGame)
  const clearSave = useGameStore(s => s.clearSave)
  const map = useGameStore(s => s.map)
  const selectedNodeId = useGameStore(s => s.selectedNodeId)
  const hasMore = enemyQueue.length > 0
  
  // 检测是否是最终Boss（黑莲老祖）战胜利
  const currentNode = map?.nodes.find(n => n.id === selectedNodeId)
  const isFinalBossVictory = currentNode?.type === 'boss' && currentNode?.enemyDef?.id === 'black_lotus_ancestor'

  // 最终Boss胜利结算
  if (isFinalBossVictory && !rewardCards) {
    return (
      <div className="overlay">
        <motion.div 
          className="victory-panel final-victory" 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)' }}
        >
          <motion.h2
            animate={{ 
              textShadow: ['0 0 20px #ffd700', '0 0 40px #ff6600', '0 0 20px #ffd700']
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: '#ffd700', fontSize: '2rem' }}
          >
            🏆 渡劫成功！
          </motion.h2>
          <p style={{ color: '#e0c0ff', fontSize: '1.1rem', marginTop: '1rem' }}>
            你击败了黑莲老祖，修成正果！
          </p>
          <p style={{ color: '#a080c0', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            心素之力终于觉醒，天道不再迷茫...
          </p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <p style={{ color: '#c0a0e0', fontSize: '0.85rem' }}>
              🎮 感谢游玩《道诡修仙录》！
            </p>
            <p style={{ color: '#8060a0', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              更多内容正在开发中...
            </p>
          </div>
          <button 
            onClick={() => { clearSave(); newGame(); }} 
            style={{ 
              marginTop: '1.5rem', 
              padding: '0.6rem 2rem', 
              background: 'linear-gradient(135deg, #6b21a8 0%, #9333ea 100%)',
              border: '2px solid #c084fc',
              color: '#fff',
              fontSize: '1rem',
              borderRadius: '8px'
            }}
          >
            重新开始
          </button>
        </motion.div>
      </div>
    )
  }

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
          <button onClick={hasMore ? nextEnemy : () => newGame()}>
            {hasMore ? '下一个敌人' : '重新开始'}
          </button>
        )}
      </motion.div>
    </div>
  )
}
