"""
道诡修仙录 - 卡牌图片生成工具

批量生成卡牌和敌人的占位图片（SVG格式）
"""

import os
import re
import json
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

# 样式配置
STYLES = {
    # 卡牌类型颜色
    'attack': {'primary': '#e74c3c', 'secondary': '#c0392b', 'icon': '⚔️'},
    'skill': {'primary': '#3498db', 'secondary': '#2980b9', 'icon': '🛡️'},
    'power': {'primary': '#9b59b6', 'secondary': '#8e44ad', 'icon': '⚡'},
    
    # 卡牌流派颜色
    'warrior': {'primary': '#e67e22', 'secondary': '#d35400'},
    'puppet': {'primary': '#1abc9c', 'secondary': '#16a085'},
    'sorcerer': {'primary': '#9b59b6', 'secondary': '#8e44ad'},
    'firecraft': {'primary': '#e74c3c', 'secondary': '#c0392b'},
    
    # 稀有度样式
    'starter': {'border': '#95a5a6', 'glow': None},
    'common': {'border': '#2ecc71', 'glow': None},
    'uncommon': {'border': '#3498db', 'glow': '#3498db'},
    'rare': {'border': '#9b59b6', 'glow': '#9b59b6'},
    'legendary': {'border': '#f39c12', 'glow': '#f39c12'},
    
    # 敌人类型颜色
    'normal': {'primary': '#7f8c8d', 'secondary': '#95a5a6'},
    'elite': {'primary': '#e74c3c', 'secondary': '#c0392b'},
    'boss': {'primary': '#8e44ad', 'secondary': '#9b59b6'},
}

# 图标映射（文字 -> SVG路径或符号）
ICON_MAP = {
    'sword strike': '⚔️',
    'wild slash': '🗡️',
    'blood blade': '🩸',
    'shield': '🛡️',
    'puppet mask': '🎭',
    'heavy strike': '💥',
    'burn body': '🔥',
    'coin shield': '🪙',
    'warrior roar': '📢',
    'madness eye': '👁️',
    'talisman': '📜',
    'calm heart': '❤️',
    'shock slash': '⚡',
    'iron wave': '🌊',
    'blood drain': '💉',
    'quick strike': '💨',
    'dao xin': '☯️',
    'blood merge': '🔗',
    'jaw worm': '🐛',
    'ghost': '👻',
    'blood corpse': '💀',
    'dan yangzi': '🧙',
    # 第2层卡牌
    'blood sha slash': '🗡️',
    'ghost step': '👻',
    'heartbreaker': '💔',
    'nuo dance': '💃',
    'blood sacrifice': '🩸',
    'mind eye': '👁️',
    # 第3层卡牌
    'void strike': '🌌',
    'soul burn': '🔥',
    'puppet master': '🎭',
    'demon possess': '👹',
    'blood fury': '😤',
    'spirit shield': '🛡️',
    'fatal blade': '⚔️',
    'dao merge': '☯️',
    # 第2层敌人
    'sha ghost': '👻',
    'heart demon': '😈',
    'blood puppet': '🎭',
    # 第3层敌人
    'sha demon': '👹',
    'heart sha': '😈',
    'blood corpse 2': '💀',
    'blood sha master': '🧛',
    'black lotus ancestor': '🪷',
}


@dataclass
class CardDef:
    """卡牌定义"""
    id: str
    name: str
    type: str
    cardClass: str
    cost: int
    rarity: str
    description: str
    icon: Optional[str] = None


@dataclass  
class EnemyDef:
    """敌人定义"""
    id: str
    name: str
    hp: int
    type: str
    icon: Optional[str] = None


def parse_cards_ts(filepath: str) -> tuple[list[CardDef], list[EnemyDef]]:
    """解析 cards.ts 文件，提取卡牌和敌人数据"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cards = []
    enemies = []
    
    # 提取卡牌定义
    card_pattern = r'const\s+(\w+):\s*CardDef\s*=\s*\{([^}]+)\}'
    for match in re.finditer(card_pattern, content, re.DOTALL):
        var_name = match.group(1)
        card_body = match.group(2)
        
        # 解析字段
        def get_field(name: str) -> str:
            m = re.search(rf"{name}:\s*['\"]?([^,'\"]+)['\"]?", card_body)
            return m.group(1) if m else ''
        
        card = CardDef(
            id=get_field('id') or var_name.lower(),
            name=get_field('name'),
            type=get_field('type'),
            cardClass=get_field('cardClass'),
            cost=int(get_field('cost') or 0),
            rarity=get_field('rarity'),
            description=get_field('description'),
            icon=get_field('icon') or None
        )
        
        if card.name:
            cards.append(card)
    
    # 提取敌人定义
    enemy_pattern = r'const\s+(\w+):\s*EnemyDef\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}'
    for match in re.finditer(enemy_pattern, content, re.DOTALL):
        var_name = match.group(1)
        enemy_body = match.group(2)
        
        def get_field(name: str) -> str:
            m = re.search(rf"{name}:\s*['\"]?([^,'\"]+)['\"]?", enemy_body)
            return m.group(1) if m else ''
        
        hp_match = re.search(r'hp:\s*(\d+)', enemy_body)
        hp = int(hp_match.group(1)) if hp_match else 0
        
        enemy = EnemyDef(
            id=get_field('id') or var_name.lower(),
            name=get_field('name'),
            hp=hp,
            type=get_field('type'),
            icon=get_field('icon') or None
        )
        
        if enemy.name:
            enemies.append(enemy)
    
    return cards, enemies


def generate_card_svg(card: CardDef, width: int = 160, height: int = 220) -> str:
    """生成卡牌 SVG 图片"""
    type_style = STYLES.get(card.type, STYLES['attack'])
    rarity_style = STYLES.get(card.rarity, STYLES['starter'])
    class_style = STYLES.get(card.cardClass, {})
    
    primary_color = type_style['primary']
    secondary_color = type_style['secondary']
    border_color = rarity_style['border']
    glow_color = rarity_style.get('glow')
    
    icon = ICON_MAP.get(card.icon, '🃏') if card.icon else '🃏'
    
    # 卡牌类型标签
    type_labels = {'attack': '攻击', 'skill': '技能', 'power': '能力'}
    type_label = type_labels.get(card.type, card.type)
    
    # 流派标签
    class_labels = {'warrior': '兵家', 'puppet': '傩戏', 'sorcerer': '法教', 'firecraft': '禁术'}
    class_label = class_labels.get(card.cardClass, card.cardClass)
    
    # 光晕效果（稀有度）
    glow_filter = ''
    if glow_color:
        glow_filter = f'''
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feFlood flood-color="{glow_color}" flood-opacity="0.5"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>'''
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="typeBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:{primary_color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:{secondary_color};stop-opacity:0.6" />
    </linearGradient>{glow_filter}
  </defs>
  
  <!-- 卡牌背景 -->
  <rect width="{width}" height="{height}" rx="12" fill="url(#cardBg)" stroke="{border_color}" stroke-width="3"/>
  
  <!-- 类型头部 -->
  <rect x="0" y="0" width="{width}" height="40" rx="12" fill="url(#typeBg)"/>
  <rect x="0" y="30" width="{width}" height="15" fill="url(#typeBg)"/>
  
  <!-- 费用徽章 -->
  <circle cx="25" cy="25" r="18" fill="#2d3436" stroke="{primary_color}" stroke-width="2"/>
  <text x="25" y="31" text-anchor="middle" fill="#ffeaa7" font-family="Arial, sans-serif" font-size="18" font-weight="bold">{card.cost}</text>
  
  <!-- 类型图标 -->
  <text x="{width//2}" y="28" text-anchor="middle" font-size="20">{icon}</text>
  
  <!-- 卡牌名称 -->
  <text x="{width//2}" y="65" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">{card.name}</text>
  
  <!-- 流派和类型 -->
  <text x="{width//2}" y="85" text-anchor="middle" fill="#bdc3c7" font-family="Arial, sans-serif" font-size="10">{class_label} · {type_label}</text>
  
  <!-- 稀有度指示条 -->
  <rect x="10" y="95" width="{width-20}" height="2" fill="{border_color}" opacity="0.6"/>
  
  <!-- 描述区域 -->
  <foreignObject x="10" y="105" width="{width-20}" height="90">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color:#bdc3c7;font-size:11px;font-family:Arial,sans-serif;text-align:center;line-height:1.4;">
      {card.description}
    </div>
  </foreignObject>
  
  <!-- 底部装饰 -->
  <rect x="0" y="{height-25}" width="{width}" height="25" rx="0" fill="url(#typeBg)" opacity="0.4"/>
  <rect x="0" y="{height-12}" width="{width}" height="12" rx="12" fill="url(#typeBg)"/>
  
  <!-- 卡牌ID -->
  <text x="{width-8}" y="{height-8}" text-anchor="end" fill="#7f8c8d" font-family="monospace" font-size="8">{card.id}</text>
</svg>'''
    
    return svg


def generate_enemy_svg(enemy: EnemyDef, width: int = 200, height: int = 200) -> str:
    """生成敌人 SVG 图片"""
    type_style = STYLES.get(enemy.type, STYLES['normal'])
    
    primary_color = type_style['primary']
    secondary_color = type_style['secondary']
    
    icon = ICON_MAP.get(enemy.icon, '👾') if enemy.icon else '👾'
    
    # 敌人类型标签
    type_labels = {'normal': '普通', 'elite': '精英', 'boss': 'Boss'}
    type_label = type_labels.get(enemy.type, enemy.type)
    
    # HP 显示
    hp_text = f"HP: {enemy.hp}"
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <radialGradient id="enemyBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:{secondary_color};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </radialGradient>
    <filter id="enemyGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feFlood flood-color="{primary_color}" flood-opacity="0.4"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 敌人背景圆 -->
  <circle cx="{width//2}" cy="{height//2-10}" r="{width//2-15}" fill="url(#enemyBg)" stroke="{primary_color}" stroke-width="3" filter="url(#enemyGlow)"/>
  
  <!-- 敌人图标 -->
  <text x="{width//2}" y="{height//2-5}" text-anchor="middle" font-size="50">{icon}</text>
  
  <!-- 敌人名称 -->
  <text x="{width//2}" y="{height//2+45}" text-anchor="middle" fill="#ffeaa7" font-family="Arial, sans-serif" font-size="16" font-weight="bold">{enemy.name}</text>
  
  <!-- 敌人类型 -->
  <text x="{width//2}" y="{height//2+62}" text-anchor="middle" fill="#bdc3c7" font-family="Arial, sans-serif" font-size="11">{type_label}</text>
  
  <!-- HP 条 -->
  <rect x="30" y="{height-35}" width="{width-60}" height="12" rx="6" fill="#2d3436"/>
  <rect x="30" y="{height-35}" width="{width-60}" height="12" rx="6" fill="{primary_color}" opacity="0.7"/>
  <text x="{width//2}" y="{height-26}" text-anchor="middle" fill="#ecf0f1" font-family="Arial, sans-serif" font-size="10" font-weight="bold">{hp_text}</text>
  
  <!-- 敌人ID -->
  <text x="{width-8}" y="15" text-anchor="end" fill="#7f8c8d" font-family="monospace" font-size="8">{enemy.id}</text>
</svg>'''
    
    return svg


def main():
    """主函数：批量生成所有图片"""
    # 路径配置
    project_root = Path(__file__).parent.parent
    cards_ts = project_root / 'src' / 'data' / 'cards.ts'
    cards_dir = project_root / 'public' / 'cards'
    enemies_dir = project_root / 'public' / 'enemies'
    
    # 确保输出目录存在
    cards_dir.mkdir(parents=True, exist_ok=True)
    enemies_dir.mkdir(parents=True, exist_ok=True)
    
    # 解析卡牌数据
    print(f"📖 解析卡牌数据: {cards_ts}")
    cards, enemies = parse_cards_ts(str(cards_ts))
    
    print(f"🃏 找到 {len(cards)} 张卡牌")
    print(f"👹 找到 {len(enemies)} 个敌人")
    
    # 生成卡牌图片
    print("\n🎨 生成卡牌图片...")
    for card in cards:
        svg = generate_card_svg(card)
        output_path = cards_dir / f"{card.id}.svg"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg)
        print(f"  ✅ {card.name} -> {output_path.name}")
    
    # 生成敌人图片
    print("\n👹 生成敌人图片...")
    for enemy in enemies:
        svg = generate_enemy_svg(enemy)
        output_path = enemies_dir / f"{enemy.id}.svg"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg)
        print(f"  ✅ {enemy.name} -> {output_path.name}")
    
    print(f"\n✨ 完成！")
    print(f"  📂 卡牌图片: {cards_dir}")
    print(f"  📂 敌人图片: {enemies_dir}")


if __name__ == '__main__':
    main()