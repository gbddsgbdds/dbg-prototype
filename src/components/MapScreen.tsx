import { motion } from 'framer-motion'
import { useGameStore } from '../game/store'
import type { MapNode } from '../game/types'
import './MapScreen.css'

// 节点图标映射
const NODE_ICONS: Record<string, string> = {
  start: '🚪',
  battle: '⚔️',
  elite: '👹',
  rest: '🔥',
  shop: '🏪',
  event: '❓',
  boss: '💀',
}

const NODE_NAMES: Record<string, string> = {
  start: '起点',
  battle: '战斗',
  elite: '精英',
  rest: '篝火',
  shop: '商店',
  event: '事件',
  boss: 'Boss',
}

export function MapScreen() {
  const map = useGameStore(s => s.map)
  const currentNodeId = useGameStore(s => s.currentNodeId)
  const selectedNodeId = useGameStore(s => s.selectedNodeId)
  const selectNode = useGameStore(s => s.selectNode)
  const enterNode = useGameStore(s => s.enterNode)

  if (!map) return null

  // 按层组织节点
  const layers: MapNode[][] = []
  for (let i = 0; i <= map.layers; i++) {
    layers[i] = map.nodes.filter(n => n.layer === i).sort((a, b) => a.column - b.column)
  }

  // 获取可选择的节点
  const currentNode = map.nodes.find(n => n.id === currentNodeId)
  const reachableIds = currentNode ? currentNode.connections : layers[1].map(n => n.id)

  return (
    <div className="map-screen">
      <div className="map-header">
        <h2>🗺️ 地图</h2>
        <div className="map-legend">
          <span>⚔️ 战斗</span>
          <span>👹 精英</span>
          <span>🔥 篝火</span>
          <span>🏪 商店</span>
          <span>❓ 事件</span>
          <span>💀 Boss</span>
        </div>
      </div>

      <div className="map-container">
        {/* 绘制连接线 */}
        <svg className="map-connections">
          {map.nodes.map(node =>
            node.connections.map(targetId => {
              const target = map.nodes.find(n => n.id === targetId)
              if (!target) return null
              const x1 = 150 + node.column * 100
              const y1 = 50 + node.layer * 120
              const x2 = 150 + target.column * 100
              const y2 = 50 + target.layer * 120
              const isReachable = !node.completed && node.id === currentNodeId
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={`map-line ${isReachable ? 'reachable' : ''} ${target.completed ? 'completed' : ''}`}
                />
              )
            })
          )}
        </svg>

        {/* 绘制节点 */}
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="map-layer" style={{ top: layerIdx * 120 }}>
            {layer.map(node => {
              const isCurrent = node.id === currentNodeId
              const isSelected = node.id === selectedNodeId
              const isReachable = reachableIds.includes(node.id) && !node.completed
              const isCompleted = node.completed

              return (
                <motion.button
                  key={node.id}
                  className={`map-node ${node.type} ${isCurrent ? 'current' : ''} ${isSelected ? 'selected' : ''} ${isReachable ? 'reachable' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isReachable && selectNode(node.id)}
                  whileHover={isReachable ? { scale: 1.1 } : {}}
                  whileTap={isReachable ? { scale: 0.95 } : {}}
                  disabled={!isReachable}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: layerIdx * 0.1 }}
                >
                  <span className="node-icon">{NODE_ICONS[node.type]}</span>
                  <span className="node-name">{NODE_NAMES[node.type]}</span>
                  {isCompleted && <span className="node-check">✓</span>}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* 进入按钮 */}
      {selectedNodeId && (
        <motion.div
          className="map-action"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="enter-btn" onClick={enterNode}>
            进入 {NODE_NAMES[map.nodes.find(n => n.id === selectedNodeId)?.type || '']}
          </button>
        </motion.div>
      )}
    </div>
  )
}