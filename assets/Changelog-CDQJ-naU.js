import{f as e,l as t,t as n,u as r}from"./proxy-BrNTpP-s.js";import{a as i}from"./index-DNloENzY.js";var a=e(r(),1),o=t(),s=`## v0.3.0 (2026-03-17)

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
- 基础战斗系统`;function c(){let[e,t]=(0,a.useState)(!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{className:`changelog-btn`,onClick:()=>t(!0),children:`📜 更新日志`}),(0,o.jsx)(i,{children:e&&(0,o.jsx)(n.div,{className:`overlay`,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>t(!1),children:(0,o.jsxs)(n.div,{className:`changelog-panel`,initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:e=>e.stopPropagation(),children:[(0,o.jsx)(`h2`,{children:`📜 更新日志`}),(0,o.jsx)(`div`,{className:`changelog-content`,children:s.split(`
`).map((e,t)=>e.startsWith(`## `)?(0,o.jsx)(`h3`,{className:`changelog-version`,children:e.slice(3)},t):e.startsWith(`### `)?(0,o.jsx)(`h4`,{className:`changelog-section`,children:e.slice(4)},t):e.startsWith(`- `)?(0,o.jsx)(`p`,{className:`changelog-item`,children:e},t):e===`---`?(0,o.jsx)(`hr`,{className:`changelog-divider`},t):(0,o.jsx)(`p`,{children:e},t))}),(0,o.jsx)(`button`,{className:`close-btn`,onClick:()=>t(!1),children:`关闭`})]})})})]})}export{c as Changelog};