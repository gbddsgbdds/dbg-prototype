import { useGameStore } from '../game/store'
import { motion } from 'framer-motion'

export function GameOverScreen() {
  const player = useGameStore(s => s.player)
  const cause = player.san <= 0 ? '💀 心素崩溃 — 理智归零' : '💀 你死了...'

  return (
    <div className="overlay">
      <motion.div className="gameover-panel" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h2>{cause}</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          HP: {player.hp}/{player.maxHp} · 理智: {player.san}/{player.maxSan} · 煞性: {player.shaqi}
        </p>
        <button onClick={() => useGameStore.getState().newGame()}>重新开始</button>
      </motion.div>
    </div>
  )
}
