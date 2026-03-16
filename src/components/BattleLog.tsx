import { useGameStore } from '../game/store'

export function BattleLog() {
  const log = useGameStore(s => s.battleLog)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [log])

  return (
    <div className="battle-log" ref={logRef}>
      {log.map((entry, i) => (
        <div key={i} className="log-entry">{entry}</div>
      ))}
    </div>
  )
}

import { useEffect, useRef } from 'react'
