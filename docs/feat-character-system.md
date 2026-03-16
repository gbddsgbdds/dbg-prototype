# 需求文档：角色系统基础架构

## 背景
目前游戏只有一个硬编码的角色（心素/李火旺），无法选择或解锁其他角色。要实现"更多角色设计"，首先需要建立角色系统的基础架构。

## 目标
1. 定义角色类型系统（CharacterDef）
2. 实现角色选择界面
3. 将现有角色重构为可配置角色
4. 为后续添加新角色（法教/坐忘道）铺平道路

## 范围

### 做什么
- 新增 CharacterDef 类型定义
- 新增 CharacterSelect 组件（角色选择界面）
- 重构 PlayerState 和 newGame 支持角色配置
- 创建默认角色"心素"配置
- 更新开始界面，先选角色再进入地图

### 不做什么
- 不添加新角色（法教/坐忘道等）
- 不实现角色解锁系统
- 不修改卡牌系统
- 不添加角色专属机制

## 验收标准
- [x] 启动游戏后，显示角色选择界面
- [x] 选择角色后，正确应用角色属性（HP、理智、初始卡组）
- [x] 游戏中角色属性与选择的角色一致
- [x] 通过 `tsc --noEmit && vite build`
- [x] 游戏可正常运行

---

# 开发计划

## 涉及文件
- `src/game/types.ts` - 新增 CharacterDef 类型
- `src/game/store.ts` - 重构 newGame 支持角色参数
- `src/data/characters.ts` - 新建角色定义文件
- `src/components/CharacterSelect.tsx` - 新建角色选择组件
- `src/App.tsx` - 集成角色选择流程
- `src/App.css` - 角色选择样式

## 实现步骤

### Step 1: 定义角色类型
在 types.ts 中添加：
```typescript
export interface CharacterDef {
  id: string
  name: string
  title: string  // 称号/描述
  maxHp: number
  maxSan: number
  maxShaqi: number
  maxEnergy: number
  startingDeck: string[]  // 卡牌ID列表
  icon?: string
}
```

### Step 2: 创建角色定义文件
创建 `src/data/characters.ts`：
- 定义 DEFAULT_CHARACTER（心素）
- 导出 ALL_CHARACTERS 数组

### Step 3: 重构 store
- 修改 newGame 接受 characterId 参数
- mkPlayer 根据 CharacterDef 初始化
- 抽取初始卡组生成逻辑

### Step 4: 创建角色选择组件
- 显示可用角色列表
- 显示角色属性预览
- 确认选择后调用 newGame

### Step 5: 集成到 App
- 添加 'character_select' 阶段
- 开始界面点击后进入角色选择
- 选择角色后开始游戏

### Step 6: 验证
- tsc --noEmit
- vite build
- 运行测试

## 预期改动量
- 新增约 150 行代码
- 修改约 50 行代码