import { motion } from 'framer-motion'
import { useGameStore } from '../game/store'
import type { GameEvent, EventChoice } from '../game/types'
import './EventScreen.css'

function EventCard({ event }: { event: GameEvent }) {
  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="event-title">{event.title}</h2>
      <p className="event-description">{event.description}</p>
    </motion.div>
  )
}

function ChoiceButton({ choice, index, onClick }: { choice: EventChoice; index: number; onClick: () => void }) {
  // 解析效果文本
  const effectParts: string[] = []
  const fx = choice.effects

  if (fx.hp) effectParts.push(`HP ${fx.hp > 0 ? '+' : ''}${fx.hp}`)
  if (fx.san) effectParts.push(`理智 ${fx.san > 0 ? '+' : ''}${fx.san}`)
  if (fx.gold) effectParts.push(`金币 ${fx.gold > 0 ? '+' : ''}${fx.gold}`)
  if (fx.shaqi) effectParts.push(`煞气 ${fx.shaqi > 0 ? '+' : ''}${fx.shaqi}`)
  if (fx.addCard) effectParts.push(`获得「${fx.addCard.name}」`)

  const effectText = effectParts.length > 0 ? effectParts.join('，') : null

  return (
    <motion.button
      className="event-choice-btn"
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="choice-text">{choice.text}</span>
      {effectText && <span className="choice-effects">{effectText}</span>}
    </motion.button>
  )
}

function AutoEventEffects({ event }: { event: GameEvent }) {
  const fx = event.autoEffects
  if (!fx) return null

  const effects: { icon: string; label: string; value: number }[] = []

  if (fx.hp) {
    effects.push({
      icon: fx.hp > 0 ? '❤️' : '💔',
      label: 'HP',
      value: fx.hp,
    })
  }
  if (fx.san) {
    effects.push({
      icon: fx.san > 0 ? '🧠' : '🌀',
      label: '理智',
      value: fx.san,
    })
  }
  if (fx.gold) {
    effects.push({
      icon: '💰',
      label: '金币',
      value: fx.gold,
    })
  }
  if (fx.shaqi) {
    effects.push({
      icon: fx.shaqi > 0 ? '🔥' : '❄️',
      label: '煞气',
      value: fx.shaqi,
    })
  }

  return (
    <div className="auto-effects">
      {effects.map((e, i) => (
        <motion.div
          key={i}
          className={`effect-item ${e.value > 0 ? 'positive' : 'negative'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <span className="effect-icon">{e.icon}</span>
          <span className="effect-label">{e.label}</span>
          <span className="effect-value">{e.value > 0 ? '+' : ''}{e.value}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function EventScreen() {
  const currentEvent = useGameStore(s => s.currentEvent)
  const chooseEventOption = useGameStore(s => s.chooseEventOption)
  const confirmAutoEvent = useGameStore(s => s.confirmAutoEvent)

  if (!currentEvent) return null

  const hasChoices = currentEvent.choices && currentEvent.choices.length > 0

  return (
    <div className="event-screen">
      <div className="event-background" />

      <div className="event-container">
        <EventCard event={currentEvent} />

        {hasChoices ? (
          <div className="event-choices">
            <h3 className="choices-title">你的选择...</h3>
            {currentEvent.choices!.map((choice, index) => (
              <ChoiceButton
                key={index}
                choice={choice}
                index={index}
                onClick={() => chooseEventOption(index)}
              />
            ))}
          </div>
        ) : (
          <div className="event-auto">
            <AutoEventEffects event={currentEvent} />
            <motion.button
              className="confirm-btn"
              onClick={confirmAutoEvent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              继续
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}