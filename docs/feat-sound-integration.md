# 音效集成优化

## 背景
游戏已有音效系统（Web Audio API 占位实现），但部分已定义的音效类型未在游戏中使用。

## 目标
完善音效集成，让所有关键游戏事件都有音效反馈。

## 范围
- 在胜利界面播放 victory 音效
- 在失败界面播放 defeat 音效
- 在抽牌时播放 card 音效
- 在治疗时播放 heal 音效

## 验收标准
- [ ] 最终Boss胜利时播放 victory 音效
- [ ] 普通战斗胜利时播放 victory 音效
- [ ] 游戏失败时播放 defeat 音效
- [ ] 抽牌时播放 card 音效
- [ ] 治疗效果触发时播放 heal 音效
- [ ] TypeScript 编译通过
- [ ] Vite build 成功

## 涉及文件
- `src/components/VictoryScreen.tsx` - 添加胜利音效
- `src/components/GameOverScreen.tsx` - 添加失败音效
- `src/game/store.ts` - 添加抽牌和治疗音效

## 实现步骤
1. 在 VictoryScreen 的 useEffect 中添加 victory 音效
2. 在 GameOverScreen 的 useEffect 中添加 defeat 音效
3. 在 store.ts 的抽牌逻辑中添加 card 音效
4. 在 store.ts 的治疗逻辑中添加 heal 音效