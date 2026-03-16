import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHANGELOG = `## v0.3.0 (2026-03-17)

### 新功能
- 🔥 煞气系统：攻击伤害随煞气加成 0-100%
- 💀 入魔机制：煞气满100后触发入魔，伤害×3
- 🧠 理智系统：煞气30+扣理智，归零=死亡
- ✨ 道心系统：同体系牌累计，10层触发连段
- 👁️ 幻觉机制：煞气60+时20%概率幻觉牌

### 卡牌
- 初始牌组：12张
- 奖励卡池：7张
- 特殊卡牌：走火入魔、驱魔符

### 敌人
- 普通：颌虫、画皮
- 精英：尸煞
- Boss：丹阳子

### UI
- 理智条、煞气条
- 入魔视觉特效
- 敌人类型标识

---

## v0.2.0
- GDD文档完善
- 数值方法论

## v0.1.0
- 初始版本
- 基础战斗系统`

export function Changelog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="changelog-btn"
        onClick={() => setOpen(true)}
      >
        📜 更新日志
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="changelog-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>📜 更新日志</h2>
              <div className="changelog-content">
                {CHANGELOG.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h3 key={i} className="changelog-version">{line.slice(3)}</h3>
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={i} className="changelog-section">{line.slice(4)}</h4>
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="changelog-item">{line}</p>
                  }
                  if (line === '---') {
                    return <hr key={i} className="changelog-divider" />
                  }
                  return <p key={i}>{line}</p>
                })}
              </div>
              <button className="close-btn" onClick={() => setOpen(false)}>
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}