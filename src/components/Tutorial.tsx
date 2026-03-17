import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../game/store'
import './Tutorial.css'

// 教程步骤定义
const TUTORIAL_STEPS = [
  {
    id: 'shaqi',
    title: '🔥 煞气系统',
    content: '煞气是你的力量源泉。每次攻击都会累积煞气，煞气越高伤害越强！\n\n煞气加成：每点煞气增加1%伤害。\n满煞气(100)时伤害翻倍！',
    highlight: 'shaqi',
  },
  {
    id: 'sanity',
    title: '🧠 理智系统',
    content: '理智是你的精神防线。煞气过高会侵蚀理智，理智归零将导致心素崩溃！\n\n煞气30+时每回合-2理智\n煞气60+时每回合-5理智\n煞气90+时每回合-10理智',
    highlight: 'sanity',
  },
  {
    id: 'madness',
    title: '💀 入魔机制',
    content: '入魔是双刃剑！使用「走火入魔」卡牌或煞气达到100时触发：\n\n✅ 真气变为5点\n✅ 伤害×3倍！\n❌ 8回合后理智归零风险\n\n入魔是翻盘的关键，但也可能是绝路！',
    highlight: 'madness',
  },
  {
    id: 'hallucination',
    title: '👁️ 幻觉牌',
    content: '心素体质的你，在煞气侵蚀下会看到幻觉...\n\n煞气60+时，手牌有20%概率变成幻觉牌：\n• 翻开前无法分辨真假\n• 可能是假牌（无效/反伤）\n• 使用「驱魔符」可翻面查看',
    highlight: 'hand',
  },
]

// 教程完成状态的持久化 key
const TUTORIAL_KEY = 'dbg-tutorial-completed'

// 检查教程是否已完成
export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true'
  } catch {
    return false
  }
}

// 标记教程已完成
function markTutorialCompleted() {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true')
  } catch {}
}

// 重置教程（用于重播）
export function resetTutorial() {
  try {
    localStorage.removeItem(TUTORIAL_KEY)
  } catch {}
}

export function Tutorial() {
  const tutorialStep = useGameStore(s => s.tutorialStep)
  const setTutorialStep = useGameStore(s => s.setTutorialStep)
  const skipTutorial = useGameStore(s => s.skipTutorial)

  // 当前步骤数据
  const currentStep = TUTORIAL_STEPS[tutorialStep]
  const isLastStep = tutorialStep >= TUTORIAL_STEPS.length - 1

  // 下一步
  const handleNext = () => {
    if (isLastStep) {
      // 完成教程
      markTutorialCompleted()
      skipTutorial()
    } else {
      setTutorialStep(tutorialStep + 1)
    }
  }

  // 跳过
  const handleSkip = () => {
    markTutorialCompleted()
    skipTutorial()
  }

  return (
    <AnimatePresence>
      {tutorialStep >= 0 && tutorialStep < TUTORIAL_STEPS.length && (
        <motion.div
          className="tutorial-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 半透明遮罩 */}
          <div className="tutorial-backdrop" onClick={handleSkip} />
          
          {/* 教程卡片 */}
          <motion.div
            className="tutorial-card"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* 标题 */}
            <div className="tutorial-header">
              <h3>{currentStep.title}</h3>
              <span className="tutorial-progress">
                {tutorialStep + 1} / {TUTORIAL_STEPS.length}
              </span>
            </div>

            {/* 内容 */}
            <div className="tutorial-content">
              {currentStep.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {/* 按钮 */}
            <div className="tutorial-actions">
              <button className="tutorial-btn skip" onClick={handleSkip}>
                跳过
              </button>
              <button className="tutorial-btn next" onClick={handleNext}>
                {isLastStep ? '开始游戏' : '下一步'}
              </button>
            </div>

            {/* 步骤指示器 */}
            <div className="tutorial-indicators">
              {TUTORIAL_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`indicator ${i === tutorialStep ? 'active' : ''} ${i < tutorialStep ? 'done' : ''}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}