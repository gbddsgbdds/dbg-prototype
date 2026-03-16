import { useGameStore } from '../game/store'
import { getEnemyPlaceholderUrl } from '../utils/placeholder'
import { motion } from 'framer-motion'

export function Enemy() {
  const enemy = useGameStore(s => s.enemy)
  const player = useGameStore(s => s.player)
  if (!enemy) return null

  const hpPct = (enemy.hp / enemy.maxHp) * 100
  const isMad = player?.isMad ?? false

  const intentLabel = () => {
    const i = enemy.intent
    switch (i.type) {
      case 'attack': return `⚔️ 攻击 ${i.value}`
      case 'defend': return `🛡️ 防御 ${i.value}`
      case 'buff': return `💪 ${i.buffType || '增益'}`
      case 'debuff': return `💫 ${i.buffType || '减益'}`
      case 'transform': return `🎭 变装为「${i.transform}」`
      default: return i.type
    }
  }

  const buffLabel = (type: string) => {
    const map: Record<string, string> = {
      vulnerable: '易伤', weak: '虚弱', frail: '脆弱', strength: '力量',
      ritual: '仪式', poison: '丹毒', attackBuff: '攻击+',
    }
    return map[type] || type
  }

  const enemyTypeLabel = () => {
    switch (enemy.def.type) {
      case 'elite': return ' ⭐精英'
      case 'boss': return ' 👹Boss'
      default: return ''
    }
  }

  return (
    <div className="enemy-area">
      <motion.div
        className="enemy-intent"
        animate={isMad ? { scale: [1, 1.2, 1], color: '#ff0000' } : { scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: isMad ? 0.5 : 2 }}
      >
        {intentLabel()}
      </motion.div>
      <motion.div
        className={`enemy ${enemy.hp <= 0 ? 'dead' : ''}`}
        animate={enemy.hp <= 0 ? { scale: 0, rotate: 180, opacity: 0 } : isMad ? { x: [0, -2, 2, 0] } : {}}
        transition={isMad ? { repeat: Infinity, duration: 0.1 } : {}}
      >
        <img src={getEnemyPlaceholderUrl(enemy.def.icon || enemy.def.name)} alt={enemy.def.name} />
      </motion.div>
      <div className="enemy-name">{enemy.def.name}{enemyTypeLabel()}</div>
      <div className="hp-bar enemy-hp">
        <div className="hp-fill enemy-hp-fill" style={{ width: `${hpPct}%` }} />
        <span className="hp-text">{enemy.hp} / {enemy.maxHp}</span>
      </div>
      {enemy.block > 0 && <div className="block-indicator">🛡️ {enemy.block}</div>}
      {enemy.buffs.length > 0 && (
        <div className="buffs">
          {enemy.buffs.filter(b => b.duration > 0 || b.duration === 999).map((b, i) => (
            <div key={i} className="buff enemy-buff">
              {buffLabel(b.type)} {b.amount > 0 ? b.amount : ''} {b.duration < 100 ? `(${b.duration})` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
