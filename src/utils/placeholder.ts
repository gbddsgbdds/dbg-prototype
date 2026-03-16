export function getPlaceholderUrl(keyword: string, width = 160, height = 220): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2d3436;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#636e72;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="12" fill="url(#g)" stroke="#dfe6e9" stroke-width="2"/>
      <text x="50%" y="45%" text-anchor="middle" fill="#dfe6e9" font-family="sans-serif" font-size="14" font-weight="bold">${keyword}</text>
      <text x="50%" y="60%" text-anchor="middle" fill="#b2bec3" font-family="sans-serif" font-size="10">PLACEHOLDER</text>
    </svg>
  `
  return `data:image/svg+xml,${svg.replace(/\n/g, '').replace(/  +/g, ' ')}`
}

export function getEnemyPlaceholderUrl(keyword: string, width = 200, height = 200): string {
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
  return `data:image/svg+xml,${svg.replace(/\n/g, '').replace(/  +/g, ' ')}`
}