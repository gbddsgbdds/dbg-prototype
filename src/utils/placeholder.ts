/**
 * 占位图工具函数
 * 优先使用预生成的静态图片，回退到动态生成
 */

// 卡牌类型颜色（动态生成回退用）
const TYPE_COLORS = {
  attack: { primary: '#e74c3c', secondary: '#c0392b', icon: '⚔️' },
  skill: { primary: '#3498db', secondary: '#2980b9', icon: '🛡️' },
  power: { primary: '#9b59b6', secondary: '#8e44ad', icon: '⚡' },
}

// 稀有度边框颜色
const RARITY_COLORS: Record<string, string> = {
  starter: '#95a5a6',
  common: '#2ecc71',
  uncommon: '#3498db',
  rare: '#9b59b6',
  legendary: '#f39c12',
}

/**
 * 获取卡牌占位图 URL
 * 优先使用预生成的静态 SVG，不存在则动态生成
 */
export function getPlaceholderUrl(keyword: string, _width = 160, _height = 220): string {
  // 尝试使用预生成的静态图片
  const cardId = keyword.toLowerCase().replace(/\s+/g, '_')
  const staticUrl = `/cards/${cardId}.svg`

  // 返回静态图片路径（浏览器会自动处理 404）
  // 如果需要回退到动态生成，可以在这里添加逻辑
  return staticUrl
}

/**
 * 获取敌人占位图 URL
 * 优先使用预生成的静态 SVG
 */
export function getEnemyPlaceholderUrl(keyword: string, _width = 200, _height = 200): string {
  // 尝试使用预生成的静态图片
  const enemyId = keyword.toLowerCase().replace(/\s+/g, '_')
  const staticUrl = `/enemies/${enemyId}.svg`

  return staticUrl
}

/**
 * 动态生成卡牌占位图（回退方案）
 */
export function generateDynamicCardUrl(
  keyword: string, 
  type: 'attack' | 'skill' | 'power' = 'attack',
  rarity: string = 'starter',
  width = 160, 
  height = 220
): string {
  const typeStyle = TYPE_COLORS[type] || TYPE_COLORS.attack
  const borderColor = RARITY_COLORS[rarity] || RARITY_COLORS.starter
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${typeStyle.primary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${typeStyle.secondary};stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="12" fill="url(#g)" stroke="${borderColor}" stroke-width="3"/>
      <rect x="0" y="0" width="${width}" height="40" rx="12" fill="url(#tg)"/>
      <rect x="0" y="30" width="${width}" height="15" fill="url(#tg)"/>
      <text x="50%" y="45%" text-anchor="middle" fill="#ecf0f1" font-family="sans-serif" font-size="14" font-weight="bold">${keyword}</text>
      <text x="50%" y="60%" text-anchor="middle" fill="#bdc3c7" font-family="sans-serif" font-size="10">${typeStyle.icon}</text>
    </svg>
  `
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * 动态生成敌人占位图（回退方案）
 */
export function generateDynamicEnemyUrl(keyword: string, width = 200, height = 200): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="eg">
          <stop offset="0%" style="stop-color:#d63031;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#2d3436;stop-opacity:1" />
        </radialGradient>
      </defs>
      <circle cx="${width/2}" cy="${height/2}" r="${width/2-5}" fill="url(#eg)" stroke="#d63031" stroke-width="3"/>
      <text x="50%" y="45%" text-anchor="middle" fill="#ffeaa7" font-family="sans-serif" font-size="18" font-weight="bold">${keyword}</text>
      <text x="50%" y="62%" text-anchor="middle" fill="#fab1a0" font-family="sans-serif" font-size="11">ENEMY</text>
    </svg>
  `
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}