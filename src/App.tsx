import { motion } from 'framer-motion'
import { useGameStore } from './game/store'
import { Hand } from './components/Hand'
import { Enemy } from './components/Enemy'
import { PlayerStatus } from './components/PlayerStatus'
import { BattleLog } from './components/BattleLog'
import { VictoryScreen } from './components/VictoryScreen'
import { GameOverScreen } from './components/GameOverScreen'
import { Changelog } from './components/Changelog'
import './App.css'

function App() {
  const phase = useGameStore(s => s.phase)
  const enemy = useGameStore(s => s.enemy)
  const player = useGameStore(s => s.player)
  const newGame = useGameStore(s => s.newGame)

  if (!enemy) {
    return (
      <div className="start-screen">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🔮 道诡修仙录
        </motion.h1>
        <p className="subtitle">越疯越强 · 越强越疯</p>
        <p className="subtitle small">Roguelike Deck-Building Game</p>
        <motion.button
          className="start-btn"
          onClick={newGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          开始修仙
        </motion.button>
        <div className="start-footer">
          <Changelog />
          <span className="version-tag">v0.3.0</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-container ${player.isMad ? 'madness-screen' : ''}`}>
      <Enemy />
      <PlayerStatus />
      <BattleLog />
      <Hand />
      {phase === 'victory' && <VictoryScreen />}
      {phase === 'game_over' && <GameOverScreen />}
    </div>
  )
}

export default App
