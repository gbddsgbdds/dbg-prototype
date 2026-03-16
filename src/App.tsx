import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, Suspense, lazy } from 'react'
import { useGameStore, hasSaveData } from './game/store'
import { useMetaStore } from './game/meta'
import { Hand } from './components/Hand'
import { Enemy } from './components/Enemy'
import { PlayerStatus } from './components/PlayerStatus'
import { BattleLog } from './components/BattleLog'
import { EnemyDamageFloat, PlayerDamageFloat } from './components/DamageFloat'
import { SoundSettings } from './components/SoundSettings'
import './App.css'

// 懒加载非首屏组件
const VictoryScreen = lazy(() => import('./components/VictoryScreen').then(m => ({ default: m.VictoryScreen })))
const GameOverScreen = lazy(() => import('./components/GameOverScreen').then(m => ({ default: m.GameOverScreen })))
const Changelog = lazy(() => import('./components/Changelog').then(m => ({ default: m.Changelog })))
const DeckViewer = lazy(() => import('./components/DeckViewer').then(m => ({ default: m.DeckViewer })))
const MapScreen = lazy(() => import('./components/MapScreen').then(m => ({ default: m.MapScreen })))
const ShopScreen = lazy(() => import('./components/ShopScreen').then(m => ({ default: m.ShopScreen })))
const EventScreen = lazy(() => import('./components/EventScreen').then(m => ({ default: m.EventScreen })))
const CharacterSelect = lazy(() => import('./components/CharacterSelect').then(m => ({ default: m.CharacterSelect })))
const AchievementScreen = lazy(() => import('./components/AchievementScreen').then(m => ({ default: m.AchievementScreen })))
const AchievementPopup = lazy(() => import('./components/AchievementPopup').then(m => ({ default: m.AchievementPopup })))

// 加载状态组件
function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ fontSize: '2rem' }}
      >
        ⚙️
      </motion.div>
    </div>
  )
}

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

// 入魔氛围层组件
function MadnessOverlay() {
  const isMad = useGameStore(s => s.player.isMad)
  
  return (
    <AnimatePresence>
      {isMad && (
        <motion.div
          className="madness-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="madness-lines" />
          <motion.div 
            className="madness-center-text"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔥 入魔中 🔥
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const phase = useGameStore(s => s.phase)
  const player = useGameStore(s => s.player)
  const map = useGameStore(s => s.map)
  const bossPhaseChange = useGameStore(s => s.bossPhaseChange)
  const newGame = useGameStore(s => s.newGame)
  const clearSave = useGameStore(s => s.clearSave)
  const [hasSave, setHasSave] = useState(false)

  // 检查存档
  useEffect(() => {
    setHasSave(hasSaveData())
  }, [map])

  // 开始新游戏（进入角色选择）
  const handleNewGame = () => {
    clearSave()
    // 设置阶段为角色选择
    useGameStore.setState({ phase: 'character_select', map: null })
  }

  // 继续游戏（使用存档中的角色）
  const handleContinue = () => {
    newGame()  // 这会从存档恢复
  }

  // 角色选择界面
  if (phase === 'character_select' && !map) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CharacterSelect />
      </Suspense>
    )
  }

  // 开始界面
  if (!map) {
    // 成就界面状态
    const [showAchievements, setShowAchievements] = useState(false)
    const [showSoundSettings, setShowSoundSettings] = useState(false)
    const achievements = useMetaStore(s => s.achievements)
    const unlockedCount = achievements.filter(a => a.unlocked).length
    
    return (
      <>
        {/* 成就弹窗 */}
        <Suspense fallback={null}>
          <AchievementPopup />
        </Suspense>
        
        {/* 成就界面 */}
        <AnimatePresence>
          {showAchievements && (
            <Suspense fallback={<LoadingFallback />}>
              <AchievementScreen onClose={() => setShowAchievements(false)} />
            </Suspense>
          )}
        </AnimatePresence>

        {/* 音效设置界面 */}
        <AnimatePresence>
          {showSoundSettings && (
            <SoundSettings onClose={() => setShowSoundSettings(false)} />
          )}
        </AnimatePresence>
      
        <div className="start-screen">
          {/* 背景粒子效果 */}
          <div className="particles-bg">
            <div className="particle p1"></div>
            <div className="particle p2"></div>
            <div className="particle p3"></div>
            <div className="particle p4"></div>
            <div className="particle p5"></div>
            <div className="particle p6"></div>
            <div className="particle p7"></div>
            <div className="particle p8"></div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔮 道诡修仙录
          </motion.h1>
          <p className="subtitle">越疯越强 · 越强越疯</p>
          <p className="subtitle small">Roguelike Deck-Building Game</p>

          {/* 存档按钮区域 */}
          <div className="start-buttons">
            {hasSave && (
              <motion.button
                className="start-btn continue"
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                继续修仙
              </motion.button>
            )}
            <motion.button
              className="start-btn"
              onClick={handleNewGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hasSave ? 0.2 : 0.1 }}
            >
              {hasSave ? '重新开始' : '开始修仙'}
            </motion.button>
            
            {/* 成就按钮 */}
            <motion.button
              className="start-btn achievement-btn"
              onClick={() => setShowAchievements(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hasSave ? 0.3 : 0.2 }}
            >
              🏆 成就 ({unlockedCount}/{achievements.length})
            </motion.button>

            {/* 音效设置按钮 */}
            <motion.button
              className="start-btn sound-btn"
              onClick={() => setShowSoundSettings(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hasSave ? 0.4 : 0.3 }}
            >
              🔊 音效设置
            </motion.button>
          </div>

          <div className="start-footer">
            <Suspense fallback={<span>...</span>}>
              <Changelog />
            </Suspense>
            <span className="version-tag">v0.5.5</span>
          </div>
        </div>
      </>
    )
  }

  // 地图界面
  if (phase === 'map') {
    return (
      <div className="game-wrapper">
        <Suspense fallback={<LoadingFallback />}>
          <MapScreen />
        </Suspense>
        {/* 玩家状态栏（显示在地图界面底部） */}
        <div className="map-player-status">
          <div className="status-item hp">
            <span className="status-label">❤️ HP</span>
            <span className="status-value">{player.hp}/{player.maxHp}</span>
          </div>
          <div className="status-item san">
            <span className="status-label">🧠 理智</span>
            <span className="status-value">{player.san}/{player.maxSan}</span>
          </div>
          <div className="status-item gold">
            <span className="status-label">💰 金币</span>
            <span className="status-value">{player.gold}</span>
          </div>
        </div>
      </div>
    )
  }

  // 商店界面
  if (phase === 'shop') {
    return (
      <div className="game-wrapper shop-wrapper">
        <Suspense fallback={<LoadingFallback />}>
          <ShopScreen />
        </Suspense>
      </div>
    )
  }

  // 事件界面
  if (phase === 'event') {
    return (
      <div className="game-wrapper event-wrapper">
        <Suspense fallback={<LoadingFallback />}>
          <EventScreen />
        </Suspense>
      </div>
    )
  }

  // 战斗界面
  return (
    <div className={`game-container ${player.isMad ? 'madness-screen' : ''} ${bossPhaseChange ? 'screen-shake' : ''}`}>
      <div className="top-bar">
        <Suspense fallback={null}>
          <DeckViewer />
        </Suspense>
      </div>
      <div className="battle-area">
        <Enemy />
        <EnemyDamageFloat />
      </div>
      <div className="player-area">
        <PlayerStatus />
        <PlayerDamageFloat />
      </div>
      <BattleLog />
      <Hand />
      {phase === 'victory' && (
        <Suspense fallback={<LoadingFallback />}>
          <VictoryScreen />
        </Suspense>
      )}
      {phase === 'game_over' && (
        <Suspense fallback={<LoadingFallback />}>
          <GameOverScreen />
        </Suspense>
      )}
      <BossPhaseAlert />
      <MadnessOverlay />
      {/* 成就弹窗 */}
      <Suspense fallback={null}>
        <AchievementPopup />
      </Suspense>
    </div>
  )
}

export default App