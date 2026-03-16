import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from './game/store'
import { Hand } from './components/Hand'
import { Enemy } from './components/Enemy'
import { PlayerStatus } from './components/PlayerStatus'
import { BattleLog } from './components/BattleLog'
import { VictoryScreen } from './components/VictoryScreen'
import { GameOverScreen } from './components/GameOverScreen'
import { Changelog } from './components/Changelog'
import { DeckViewer } from './components/DeckViewer'
import './App.css'

// Boss阶段切换提示组件
function BossPhaseAlert() {
  const bossPhaseChange = useGameStore(s => s.bossPhaseChange)
  const enemy = useGameStore(s => s.enemy)
  
  return (
    <AnimatePresence>
      {bossPhaseChange && enemy && (
        <motion.div
          className="boss-phase-alert"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="boss-phase-text"
            animate={{ 
              scale: [1, 1.2, 1],
              textShadow: ['0 0 20px #ff0000', '0 0 40px #ff6600', '0 0 20px #ff0000']
            }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            ⚠️ 狂暴阶段！
          </motion.div>
          <div className="boss-phase-sub">{enemy.def.name} 攻击翻倍！</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const phase = useGameStore(s => s.phase)
  const enemy = useGameStore(s => s.enemy)
  const player = useGameStore(s => s.player)
  const bossPhaseChange = useGameStore(s => s.bossPhaseChange)
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
    <div className={`game-container ${player.isMad ? 'madness-screen' : ''} ${bossPhaseChange ? 'screen-shake' : ''}`}>
      <div className="top-bar">
        <DeckViewer />
      </div>
      <Enemy />
      <PlayerStatus />
      <BattleLog />
      <Hand />
      {phase === 'victory' && <VictoryScreen />}
      {phase === 'game_over' && <GameOverScreen />}
      <BossPhaseAlert />
    </div>
  )
}

export default App
