import { useGameStore } from '../game/store'

export function PlayerStatus() {
  const player = useGameStore(s => s.player)
  const phase = useGameStore(s => s.phase)

  const hpPct = (player.hp / player.maxHp) * 100
  const sanPct = (player.san / player.maxSan) * 100
  const shaqiPct = (player.shaqi / player.maxShaqi) * 100
  const lowHp = player.hp < player.maxHp * 0.25
  const lowSan = player.san < player.maxSan * 0.25

  const buffLabel = (type: string) => {
    const map: Record<string, string> = {
      strength: '力量', dexterity: '灵巧', vulnerable: '易伤', weak: '虚弱',
      frail: '脆弱', ritual: '仪式', poison: '丹毒', attackBuff: '攻击+', blood_merge: '血肉同化',
    }
    return map[type] || type
  }

  const shaqiStage = player.shaqi >= 100 ? '入魔' : player.shaqi >= 90 ? '暴走' : player.shaqi >= 60 ? '狂躁' : player.shaqi >= 30 ? '躁动' : '平静'

  return (
    <div className={`player-status ${player.isMad ? 'madness' : ''}`}>
      <div className="player-info">
        {/* HP */}
        <div className="hp-bar player-hp">
          <div className={`hp-fill player-hp-fill ${lowHp ? 'low-hp' : ''}`} style={{ width: `${hpPct}%` }} />
          <span className="hp-text">❤️ {player.hp} / {player.maxHp}</span>
        </div>

        {/* 理智 */}
        <div className="san-bar">
          <div className={`san-fill ${lowSan ? 'low-san' : ''}`} style={{ width: `${sanPct}%` }} />
          <span className="san-text">🧠 {player.san} / {player.maxSan}</span>
        </div>

        {/* 煞性 */}
        <div className="shaqi-bar">
          <div className={`shaqi-fill ${player.isMad ? 'mad' : ''}`} style={{ width: `${shaqiPct}%` }} />
          <span className="shaqi-text">🔥 煞性 {player.shaqi} [{shaqiStage}]</span>
        </div>

        {/* 能量 */}
        <div className="energy">
          {Array.from({ length: player.isMad ? 5 : player.maxEnergy }, (_, i) => (
            <span key={i} className={`energy-orb ${i < player.energy ? 'active' : ''}`}>⚡</span>
          ))}
          {player.isMad && <span className="mad-label">入魔中</span>}
        </div>

        {/* 道心 */}
        {player.daoxin > 0 && (
          <div className="daoxin-bar">
            ✨ 道心: {player.daoxin}/{player.maxDaoxin}
            {player.daoxin >= 10 && <span className="daoxin-ready"> 🔥禁忌连段就绪！</span>}
          </div>
        )}

        {/* 护甲 */}
        {player.block > 0 && <div className="block-indicator player-block">🛡️ {player.block}</div>}

        {/* Buffs */}
        {player.buffs.length > 0 && (
          <div className="buffs">
            {player.buffs.filter(b => b.duration > 0 || b.duration === 999).map((b, i) => (
              <div key={i} className={`buff ${b.type === 'vulnerable' || b.type === 'weak' || b.type === 'poison' ? 'debuff' : 'player-buff'}`}>
                {buffLabel(b.type)} {b.amount > 0 ? b.amount : ''} {b.duration < 100 ? `(${b.duration})` : ''}
              </div>
            ))}
          </div>
        )}
      </div>

      {phase === 'player_turn' && (
        <button className={`end-turn-btn ${player.isMad ? 'mad-btn' : ''}`} onClick={() => useGameStore.getState().endPlayerTurn()}>
          {player.isMad ? '🔴 强制出牌中...' : '结束回合'}
        </button>
      )}
    </div>
  )
}
