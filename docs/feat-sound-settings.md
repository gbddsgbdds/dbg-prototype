# 需求：音效设置界面

## 背景
- 当前游戏有音效占位实现（Web Audio API 合成音）
- 用户无法控制音效开关和音量
- 这是 v0.6 里程碑的一部分

## 目标
- 在开始界面添加音效设置入口
- 用户可以开关音效
- 用户可以调节音量

## 范围
- 音效开关按钮
- 音量滑块
- 设置状态持久化（localStorage）

## 验收标准
- [x] 开始界面显示音效设置按钮
- [x] 点击可开关音效
- [x] 音量可调节（0-100%）
- [x] 设置刷新后保持
- [x] tsc + vite build 通过

## 开发计划
### 涉及文件
- `src/utils/soundManager.ts` - 添加 getVolume 方法
- `src/components/SoundSettings.tsx` - 新增音效设置组件
- `src/components/SoundSettings.css` - 新增样式
- `src/App.tsx` - 添加音效设置入口

### 实现步骤
1. 修改 soundManager 添加 getVolume 方法
2. 创建 SoundSettings 组件
3. 在 App.tsx 开始界面添加音效设置按钮
4. 添加 CSS 样式
5. 验证编译和构建