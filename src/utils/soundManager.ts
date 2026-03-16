/**
 * 增强音效管理器
 * 使用高级 Web Audio API 合成技术生成游戏音效
 * 包含包络、滤波器、噪声、多层叠加等技术
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

  // 创建白噪声缓冲区
  private createNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  // 创建粉红噪声缓冲区（更柔和的噪声）
  private createPinkNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
    return buffer
  }

  // 随机变体（微调参数避免重复感）
  private randomVariation(base: number, range: number): number {
    return base + (Math.random() - 0.5) * 2 * range
  }

  // ========== 音效实现 ==========

  // 攻击音 - 剑击/打击感
  private playAttackSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const variation = Math.random()

    // 基础攻击频率
    const baseFreq = this.randomVariation(180, 30)
    
    // 层1：低频冲击
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(baseFreq, now)
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.15)
    gain1.gain.setValueAtTime(this.volume * 0.6, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    // 层2：高频切削声
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(baseFreq * 3, now)
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.05)
    gain2.gain.setValueAtTime(this.volume * 0.3, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.08)

    // 层3：噪声（金属感）
    if (variation > 0.3) {
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.createNoiseBuffer(0.1)
      const noiseGain = ctx.createGain()
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = 3000
      noiseGain.gain.setValueAtTime(this.volume * 0.15, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noiseSource.start(now)
      noiseSource.stop(now + 0.1)
    }
  }

  // 受击音 - 痛苦/受伤
  private playHitSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 层1：低频冲击
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(150, now)
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.2)
    gain1.gain.setValueAtTime(this.volume * 0.7, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.2)

    // 层2：痛苦的高频
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(this.randomVariation(600, 100), now)
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.15)
    gain2.gain.setValueAtTime(this.volume * 0.4, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.15)

    // 层3：噪声（冲击波）
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = this.createNoiseBuffer(0.15)
    const noiseGain = ctx.createGain()
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 2000
    noiseGain.gain.setValueAtTime(this.volume * 0.2, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseSource.start(now)
    noiseSource.stop(now + 0.15)
  }

  // 治愈音 - 神圣/温暖
  private playHealSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 层1：基础和弦（大三和弦）
    const frequencies = [523.25, 659.25, 783.99] // C5 E5 G5
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.03)
      gain.gain.setValueAtTime(0, now + i * 0.03)
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + i * 0.03 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.03)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.03)
      osc.stop(now + 0.5 + i * 0.03)
    })

    // 层2：高频闪烁
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(this.randomVariation(1200, 100), now)
    osc2.frequency.linearRampToValueAtTime(this.randomVariation(1600, 100), now + 0.3)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.4)
  }

  // 护甲音 - 金属/防御
  private playBlockSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 层1：金属撞击
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    const baseFreq = this.randomVariation(800, 100)
    osc1.frequency.setValueAtTime(baseFreq, now)
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.15)
    gain1.gain.setValueAtTime(this.volume * 0.4, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    // 层2：高频金属共鸣
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(this.randomVariation(2400, 200), now)
    osc2.frequency.linearRampToValueAtTime(this.randomVariation(2200, 200), now + 0.1)
    gain2.gain.setValueAtTime(this.volume * 0.15, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.2)

    // 层3：金属噪声
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = this.createNoiseBuffer(0.08)
    const noiseGain = ctx.createGain()
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 4000
    noiseFilter.Q.value = 2
    noiseGain.gain.setValueAtTime(this.volume * 0.1, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseSource.start(now)
    noiseSource.stop(now + 0.08)
  }

  // 胜利音 - 凯旋旋律
  private playVictorySound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 胜利旋律：上行大三和弦 + 高音收尾
    const melody = [
      { freq: 523.25, time: 0, dur: 0.15 },     // C5
      { freq: 659.25, time: 0.12, dur: 0.15 },  // E5
      { freq: 783.99, time: 0.24, dur: 0.15 },  // G5
      { freq: 1046.50, time: 0.36, dur: 0.4 },  // C6 (高音收尾)
    ]

    melody.forEach(note => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(note.freq, now + note.time)
      gain.gain.setValueAtTime(0, now + note.time)
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + note.time + 0.02)
      gain.gain.setValueAtTime(this.volume * 0.25, now + note.time + note.dur * 0.7)
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + note.time)
      osc.stop(now + note.time + note.dur + 0.1)
    })

    // 闪烁效果
    const sparkle = ctx.createOscillator()
    const sparkleGain = ctx.createGain()
    sparkle.type = 'sine'
    sparkle.frequency.setValueAtTime(2000, now + 0.36)
    sparkle.frequency.linearRampToValueAtTime(2500, now + 0.7)
    sparkleGain.gain.setValueAtTime(0, now + 0.36)
    sparkleGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.45)
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    sparkle.connect(sparkleGain)
    sparkleGain.connect(ctx.destination)
    sparkle.start(now + 0.36)
    sparkle.stop(now + 0.8)
  }

  // 失败音 - 阴郁/消沉
  private playDefeatSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 下行音阶
    const frequencies = [392, 349.23, 329.63, 261.63] // G4 F4 E4 C4
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.15)
      osc.frequency.linearRampToValueAtTime(freq * 0.95, now + i * 0.15 + 0.2)
      gain.gain.setValueAtTime(0, now + i * 0.15)
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.15 + 0.03)
      gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.15 + 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.3)
    })

    // 低频隆隆
    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(80, now)
    sub.frequency.linearRampToValueAtTime(40, now + 0.8)
    subGain.gain.setValueAtTime(this.volume * 0.3, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    sub.connect(subGain)
    subGain.connect(ctx.destination)
    sub.start(now)
    sub.stop(now + 0.8)
  }

  // 卡牌音 - 清脆/操作感
  private playCardSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const variation = Math.random()
    
    // 层1：基础点击
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    const baseFreq = this.randomVariation(800, 100)
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.05)
    gain.gain.setValueAtTime(this.volume * 0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)

    // 层2：纸质感噪声
    if (variation > 0.5) {
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.createPinkNoiseBuffer(0.04)
      const noiseGain = ctx.createGain()
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = 6000
      noiseGain.gain.setValueAtTime(this.volume * 0.08, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noiseSource.start(now)
      noiseSource.stop(now + 0.04)
    }
  }

  // 点击音 - UI交互
  private playClickSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(this.randomVariation(1200, 100), now)
    osc.frequency.exponentialRampToValueAtTime(this.randomVariation(800, 100), now + 0.03)
    gain.gain.setValueAtTime(this.volume * 0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  // 入魔音 - 扭曲/不安
  private playMadnessSound() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 层1：不协和和弦
    const discordFreqs = [200, 250, 317] // 不协和音程
    discordFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 20, now + i * 0.05)
      osc.frequency.linearRampToValueAtTime(freq * 0.9 + (Math.random() - 0.5) * 30, now + 0.5)
      gain.gain.setValueAtTime(0, now + i * 0.05)
      gain.gain.linearRampToValueAtTime(this.volume * 0.15, now + i * 0.05 + 0.1)
      gain.gain.setValueAtTime(this.volume * 0.15, now + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.05)
      osc.stop(now + 0.6)
    })

    // 层2：低频震动
    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(60, now)
    sub.frequency.linearRampToValueAtTime(40, now + 0.5)
    subGain.gain.setValueAtTime(this.volume * 0.4, now)
    subGain.gain.setValueAtTime(this.volume * 0.4, now + 0.3)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    sub.connect(subGain)
    subGain.connect(ctx.destination)
    sub.start(now)
    sub.stop(now + 0.6)

    // 层3：高频噪声（不安感）
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = this.createNoiseBuffer(0.5)
    const noiseGain = ctx.createGain()
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 3000
    noiseFilter.Q.value = 5
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.15)
    noiseGain.gain.setValueAtTime(this.volume * 0.1, now + 0.35)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseSource.start(now)
    noiseSource.stop(now + 0.5)
  }

  // 播放音效
  playSound(type: SoundType) {
    if (!this.enabled) return

    try {
      // 确保音频上下文处于运行状态
      const ctx = this.getContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      switch (type) {
        case 'attack':
          this.playAttackSound()
          break
        case 'hit':
          this.playHitSound()
          break
        case 'heal':
          this.playHealSound()
          break
        case 'block':
          this.playBlockSound()
          break
        case 'victory':
          this.playVictorySound()
          break
        case 'defeat':
          this.playDefeatSound()
          break
        case 'card':
          this.playCardSound()
          break
        case 'click':
          this.playClickSound()
          break
        case 'madness':
          this.playMadnessSound()
          break
        default:
          this.playClickSound()
      }
    } catch (e) {
      console.warn('Sound playback failed:', e)
    }
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

// 背景音乐场景类型
export type BGMScene = 'menu' | 'battle' | 'boss' | 'rest'

/**
 * 背景音乐管理器
 * 使用 Web Audio API 程序化生成场景音乐
 */
class BackgroundMusic {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.15
  private currentScene: BGMScene | null = null
  private isPlaying: boolean = false
  private stopRequested: boolean = false
  
  // 当前活动的音频节点
  private activeOscillators: OscillatorNode[] = []
  private activeGains: GainNode[] = []
  private activeSources: AudioBufferSourceNode[] = []
  private masterGain: GainNode | null = null
  private animationFrame: number | null = null
  private loopInterval: number | null = null

  // 获取音频上下文
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // 创建白噪声
  private createNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  // 创建粉红噪声
  private createPinkNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
    return buffer
  }

  // 停止所有音频
  private stopAll() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop() } catch {}
    })
    this.activeSources.forEach(src => {
      try { src.stop() } catch {}
    })
    this.activeOscillators = []
    this.activeSources = []
    this.activeGains = []
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    if (this.loopInterval) {
      clearInterval(this.loopInterval)
      this.loopInterval = null
    }
  }

  // 淡入淡出
  private fadeTo(targetVolume: number, duration: number = 1): Promise<void> {
    return new Promise(resolve => {
      if (!this.masterGain) {
        resolve()
        return
      }
      const ctx = this.getContext()
      const now = ctx.currentTime
      const currentGain = this.masterGain.gain.value
      this.masterGain.gain.setValueAtTime(currentGain, now)
      this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + duration)
      setTimeout(resolve, duration * 1000)
    })
  }

  // ========== 场景音乐生成 ==========

  // 主菜单音乐 - 神秘悠远
  private playMenuMusic() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // 主节点
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 2)
    this.masterGain.connect(ctx.destination)

    // 持续的低频氛围
    const drone = ctx.createOscillator()
    const droneGain = ctx.createGain()
    drone.type = 'sine'
    drone.frequency.setValueAtTime(55, now) // A1 低音
    droneGain.gain.setValueAtTime(0.3, now)
    drone.connect(droneGain)
    droneGain.connect(this.masterGain)
    drone.start(now)
    this.activeOscillators.push(drone)
    this.activeGains.push(droneGain)

    // 五声音阶旋律循环
    const pentatonic = [220, 246.94, 293.66, 329.63, 392] // A3, B3, D4, E4, G4
    let noteIndex = 0
    let melodyTime = now + 1

    const playMelodyNote = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const noteNow = ctx.currentTime
      if (noteNow >= melodyTime) {
        const freq = pentatonic[noteIndex % pentatonic.length]
        
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 5, noteNow)
        
        gain.gain.setValueAtTime(0, noteNow)
        gain.gain.linearRampToValueAtTime(0.15, noteNow + 0.1)
        gain.gain.setValueAtTime(0.15, noteNow + 0.8)
        gain.gain.exponentialRampToValueAtTime(0.001, noteNow + 1.5)
        
        osc.connect(gain)
        gain.connect(this.masterGain!)
        osc.start(noteNow)
        osc.stop(noteNow + 1.5)
        
        noteIndex++
        melodyTime = noteNow + 2 + Math.random() * 2 // 随机间隔
      }
      this.animationFrame = requestAnimationFrame(playMelodyNote)
    }
    playMelodyNote()

    // 氛围噪声层
    const noiseBuffer = this.createPinkNoiseBuffer(2)
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer
    noiseSource.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 200
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.05
    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    noiseSource.start(now)
    this.activeSources.push(noiseSource)
  }

  // 战斗音乐 - 紧张有节奏
  private playBattleMusic() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.5)
    this.masterGain.connect(ctx.destination)

    // 节奏脉冲 - 低鼓
    let beatTime = now
    const playBeat = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const beatNow = ctx.currentTime
      if (beatNow >= beatTime) {
        // 底鼓
        const kick = ctx.createOscillator()
        const kickGain = ctx.createGain()
        kick.type = 'sine'
        kick.frequency.setValueAtTime(80, beatNow)
        kick.frequency.exponentialRampToValueAtTime(40, beatNow + 0.1)
        kickGain.gain.setValueAtTime(0.4, beatNow)
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatNow + 0.15)
        kick.connect(kickGain)
        kickGain.connect(this.masterGain!)
        kick.start(beatNow)
        kick.stop(beatNow + 0.15)
        this.activeOscillators.push(kick)

        // 军鼓（第二拍和第四拍）
        const beatIndex = Math.floor((beatNow - now) * 2) % 4
        if (beatIndex === 1 || beatIndex === 3) {
          const snare = ctx.createBufferSource()
          snare.buffer = this.createNoiseBuffer(0.1)
          const snareGain = ctx.createGain()
          const snareFilter = ctx.createBiquadFilter()
          snareFilter.type = 'highpass'
          snareFilter.frequency.value = 1000
          snareGain.gain.setValueAtTime(0.15, beatNow)
          snareGain.gain.exponentialRampToValueAtTime(0.001, beatNow + 0.1)
          snare.connect(snareFilter)
          snareFilter.connect(snareGain)
          snareGain.connect(this.masterGain!)
          snare.start(beatNow)
          this.activeSources.push(snare)
        }

        beatTime = beatNow + 0.5 // 120 BPM
      }
      this.animationFrame = requestAnimationFrame(playBeat)
    }
    playBeat()

    // 战斗和弦层
    const battleChords = [[110, 146.83], [130.81, 164.81]] // A小调和弦进行
    let chordIndex = 0
    let chordTime = now

    const playChord = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const chordNow = ctx.currentTime
      if (chordNow >= chordTime) {
        const chord = battleChords[chordIndex % battleChords.length]
        chord.forEach(freq => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, chordNow)
          gain.gain.setValueAtTime(0.08, chordNow)
          gain.gain.setValueAtTime(0.08, chordNow + 1.8)
          gain.gain.exponentialRampToValueAtTime(0.001, chordNow + 2)
          osc.connect(gain)
          gain.connect(this.masterGain!)
          osc.start(chordNow)
          osc.stop(chordNow + 2)
          this.activeOscillators.push(osc)
        })
        chordIndex++
        chordTime = chordNow + 2
      }
      this.animationFrame = requestAnimationFrame(playChord)
    }
    playChord()
  }

  // Boss音乐 - 压迫感更强
  private playBossMusic() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.3)
    this.masterGain.connect(ctx.destination)

    // 更快的节奏
    let beatTime = now
    const playBeat = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const beatNow = ctx.currentTime
      if (beatNow >= beatTime) {
        // 重底鼓
        const kick = ctx.createOscillator()
        const kickGain = ctx.createGain()
        kick.type = 'sine'
        kick.frequency.setValueAtTime(60, beatNow)
        kick.frequency.exponentialRampToValueAtTime(30, beatNow + 0.1)
        kickGain.gain.setValueAtTime(0.5, beatNow)
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatNow + 0.12)
        kick.connect(kickGain)
        kickGain.connect(this.masterGain!)
        kick.start(beatNow)
        kick.stop(beatNow + 0.12)
        this.activeOscillators.push(kick)

        beatTime = beatNow + 0.375 // 160 BPM
      }
      this.animationFrame = requestAnimationFrame(playBeat)
    }
    playBeat()

    // 不协和低音
    const dissonant = ctx.createOscillator()
    const dissonantGain = ctx.createGain()
    dissonant.type = 'sawtooth'
    dissonant.frequency.setValueAtTime(46.25, now) // 低B
    dissonantGain.gain.setValueAtTime(0.15, now)
    dissonant.connect(dissonantGain)
    dissonantGain.connect(this.masterGain)
    dissonant.start(now)
    this.activeOscillators.push(dissonant)

    // 脉冲音效
    let pulseTime = now + 0.5
    const playPulse = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const pulseNow = ctx.currentTime
      if (pulseNow >= pulseTime) {
        const pulse = ctx.createOscillator()
        const pulseGain = ctx.createGain()
        pulse.type = 'square'
        pulse.frequency.setValueAtTime(200 + Math.random() * 50, pulseNow)
        pulseGain.gain.setValueAtTime(0.05, pulseNow)
        pulseGain.gain.exponentialRampToValueAtTime(0.001, pulseNow + 0.3)
        pulse.connect(pulseGain)
        pulseGain.connect(this.masterGain!)
        pulse.start(pulseNow)
        pulse.stop(pulseNow + 0.3)
        this.activeOscillators.push(pulse)

        pulseTime = pulseNow + 0.75 + Math.random() * 0.5
      }
      this.animationFrame = requestAnimationFrame(playPulse)
    }
    playPulse()
  }

  // 篝火音乐 - 宁静治愈
  private playRestMusic() {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 2)
    this.masterGain.connect(ctx.destination)

    // 柔和的和弦
    const restChords = [
      [130.81, 164.81, 196], // C大三和弦
      [146.83, 185, 220],     // D小三和弦
      [164.81, 196, 246.94], // E小三和弦
    ]
    let chordIndex = 0
    let chordTime = now

    const playChord = () => {
      if (this.stopRequested || !this.isPlaying) return
      
      const chordNow = ctx.currentTime
      if (chordNow >= chordTime) {
        const chord = restChords[chordIndex % restChords.length]
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, chordNow)
          gain.gain.setValueAtTime(0, chordNow + i * 0.05)
          gain.gain.linearRampToValueAtTime(0.1, chordNow + 0.5)
          gain.gain.setValueAtTime(0.1, chordNow + 3)
          gain.gain.exponentialRampToValueAtTime(0.001, chordNow + 4)
          osc.connect(gain)
          gain.connect(this.masterGain!)
          osc.start(chordNow + i * 0.05)
          osc.stop(chordNow + 4)
          this.activeOscillators.push(osc)
        })
        chordIndex++
        chordTime = chordNow + 4
      }
      this.animationFrame = requestAnimationFrame(playChord)
    }
    playChord()

    // 柔和的氛围噪声（篝火声）
    const fireBuffer = this.createPinkNoiseBuffer(3)
    const fireSource = ctx.createBufferSource()
    fireSource.buffer = fireBuffer
    fireSource.loop = true
    const fireFilter = ctx.createBiquadFilter()
    fireFilter.type = 'bandpass'
    fireFilter.frequency.value = 500
    fireFilter.Q.value = 0.5
    const fireGain = ctx.createGain()
    fireGain.gain.value = 0.03
    fireSource.connect(fireFilter)
    fireFilter.connect(fireGain)
    fireGain.connect(this.masterGain)
    fireSource.start(now)
    this.activeSources.push(fireSource)
  }

  // ========== 公共方法 ==========

  // 播放指定场景的音乐
  play(scene: BGMScene) {
    if (!this.enabled) return

    const ctx = this.getContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // 如果是同一场景，不做任何事
    if (this.currentScene === scene && this.isPlaying) {
      return
    }

    // 停止当前音乐
    this.stopRequested = true
    this.stopAll()
    this.stopRequested = false
    this.isPlaying = true
    this.currentScene = scene

    // 播放新音乐
    switch (scene) {
      case 'menu':
        this.playMenuMusic()
        break
      case 'battle':
        this.playBattleMusic()
        break
      case 'boss':
        this.playBossMusic()
        break
      case 'rest':
        this.playRestMusic()
        break
    }
  }

  // 停止音乐
  stop() {
    if (!this.isPlaying) return
    this.stopRequested = true
    this.fadeTo(0, 0.5).then(() => {
      this.stopAll()
      this.isPlaying = false
      this.currentScene = null
      this.stopRequested = false
    })
  }

  // 暂停（淡出但不重置状态）
  pause() {
    if (!this.isPlaying) return
    this.fadeTo(0, 0.3)
  }

  // 恢复
  resume() {
    if (!this.masterGain || !this.isPlaying) return
    const ctx = this.getContext()
    const now = ctx.currentTime
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.5)
  }

  // 设置音量
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.masterGain && this.isPlaying) {
      const ctx = this.getContext()
      this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime)
    }
  }

  // 开关
  toggle(enabled?: boolean) {
    const newState = enabled ?? !this.enabled
    this.enabled = newState
    if (!newState && this.isPlaying) {
      this.stop()
    }
    return this.enabled
  }

  // 获取状态
  isEnabled() {
    return this.enabled
  }

  getVolume() {
    return this.volume
  }

  getCurrentScene() {
    return this.currentScene
  }

  getIsPlaying() {
    return this.isPlaying
  }
}

// 单例导出
export const soundManager = new SoundManager()
export const bgmManager = new BackgroundMusic()

// 便捷方法
export const playSound = (type: SoundType) => soundManager.playSound(type)
export const playBGM = (scene: BGMScene) => bgmManager.play(scene)
export const stopBGM = () => bgmManager.stop()