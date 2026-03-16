/**
 * 音效管理器 - 占位实现
 * 使用 Web Audio API 生成简单提示音
 * 后期可替换为实际音效资源
 */

class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.3

  // 初始化音频上下文
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // 播放占位音效
  playSound(type: SoundType) {
    if (!this.enabled) return

    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // 根据类型设置不同的音效
      switch (type) {
        case 'attack':
          // 攻击音 - 低沉短促
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)
          gainNode.gain.setValueAtTime(this.volume, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.1)
          break

        case 'hit':
          // 受击音 - 尖锐
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(400, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15)
          gainNode.gain.setValueAtTime(this.volume * 0.8, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.15)
          break

        case 'heal':
          // 治愈音 - 柔和上升
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(400, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2)
          gainNode.gain.setValueAtTime(this.volume * 0.5, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.2)
          break

        case 'block':
          // 护甲音 - 金属质感
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(800, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
          gainNode.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.1)
          break

        case 'victory':
          // 胜利音 - 上升和弦
          this.playChord([400, 500, 600], 0.3, 'sine')
          break

        case 'defeat':
          // 失败音 - 下降
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(300, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4)
          gainNode.gain.setValueAtTime(this.volume * 0.6, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.4)
          break

        case 'card':
          // 卡牌音
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(600, ctx.currentTime)
          gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.05)
          break

        case 'click':
          // 点击音
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(500, ctx.currentTime)
          gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.03)
          break

        case 'madness':
          // 入魔音 - 不协和
          this.playChord([200, 250, 320], 0.5, 'sawtooth')
          break

        default:
          // 默认音
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, ctx.currentTime)
          gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.1)
      }
    } catch (e) {
      // 静默失败，不影响游戏运行
      console.warn('Sound playback failed:', e)
    }
  }

  // 播放和弦
  private playChord(frequencies: number[], duration: number, type: OscillatorType) {
    const ctx = this.getContext()
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1)
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime + index * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration + index * 0.1)

      oscillator.start(ctx.currentTime + index * 0.1)
      oscillator.stop(ctx.currentTime + duration + index * 0.1)
    })
  }

  // 设置音量 (0-1)
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  // 开关音效
  toggle(enabled?: boolean) {
    this.enabled = enabled ?? !this.enabled
    return this.enabled
  }

  // 获取当前状态
  isEnabled() {
    return this.enabled
  }

  // 获取当前音量
  getVolume() {
    return this.volume
  }
}

// 音效类型
export type SoundType = 
  | 'attack' 
  | 'hit' 
  | 'heal' 
  | 'block' 
  | 'victory' 
  | 'defeat' 
  | 'card' 
  | 'click'
  | 'madness'

// 单例导出
export const soundManager = new SoundManager()

// 便捷方法
export const playSound = (type: SoundType) => soundManager.playSound(type)