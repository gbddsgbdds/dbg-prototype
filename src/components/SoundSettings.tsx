import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { soundManager, bgmManager } from '../utils/soundManager'
import { resetTutorial } from './Tutorial'
import type { BGMScene } from '../utils/soundManager'
import './SoundSettings.css'

// 音效设置的持久化 key
const SOUND_SETTINGS_KEY = 'dbg-sound-settings'

interface SoundSettingsData {
  soundEnabled: boolean
  soundVolume: number
  bgmEnabled: boolean
  bgmVolume: number
}

// 获取保存的设置
function getSavedSettings(): SoundSettingsData {
  try {
    const data = localStorage.getItem(SOUND_SETTINGS_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch {}
  return { soundEnabled: true, soundVolume: 30, bgmEnabled: true, bgmVolume: 15 }
}

// 保存设置
function saveSettings(settings: SoundSettingsData) {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

interface SoundSettingsProps {
  onClose: () => void
}

export function SoundSettings({ onClose }: SoundSettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled())
  const [soundVolume, setSoundVolume] = useState(Math.round(soundManager.getVolume() * 100))
  const [bgmEnabled, setBgmEnabled] = useState(bgmManager.isEnabled())
  const [bgmVolume, setBgmVolume] = useState(Math.round(bgmManager.getVolume() * 100))

  // 从 localStorage 恢复设置
  useEffect(() => {
    const saved = getSavedSettings()
    setSoundEnabled(saved.soundEnabled)
    setSoundVolume(Math.round(saved.soundVolume * 100))
    setBgmEnabled(saved.bgmEnabled)
    setBgmVolume(Math.round(saved.bgmVolume * 100))
    
    soundManager.toggle(saved.soundEnabled)
    soundManager.setVolume(saved.soundVolume)
    bgmManager.toggle(saved.bgmEnabled)
    bgmManager.setVolume(saved.bgmVolume)
  }, [])

  // 处理音效开关
  const handleSoundToggle = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    soundManager.toggle(newState)
    saveSettings({ 
      soundEnabled: newState, 
      soundVolume: soundVolume / 100, 
      bgmEnabled, 
      bgmVolume: bgmVolume / 100 
    })
    
    // 播放测试音
    if (newState) {
      soundManager.playSound('click')
    }
  }

  // 处理音效音量变化
  const handleSoundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setSoundVolume(newVolume)
    soundManager.setVolume(newVolume / 100)
    saveSettings({ 
      soundEnabled, 
      soundVolume: newVolume / 100, 
      bgmEnabled, 
      bgmVolume: bgmVolume / 100 
    })
  }

  // 处理BGM开关
  const handleBgmToggle = () => {
    const newState = !bgmEnabled
    setBgmEnabled(newState)
    bgmManager.toggle(newState)
    saveSettings({ 
      soundEnabled, 
      soundVolume: soundVolume / 100, 
      bgmEnabled: newState, 
      bgmVolume: bgmVolume / 100 
    })
    
    // 如果开启，播放菜单音乐作为测试
    if (newState) {
      bgmManager.play('menu' as BGMScene)
    }
  }

  // 处理BGM音量变化
  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setBgmVolume(newVolume)
    bgmManager.setVolume(newVolume / 100)
    saveSettings({ 
      soundEnabled, 
      soundVolume: soundVolume / 100, 
      bgmEnabled, 
      bgmVolume: newVolume / 100 
    })
  }

  // 测试音效
  const handleTestSound = () => {
    soundManager.playSound('card')
  }

  return (
    <motion.div
      className="sound-settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sound-settings-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sound-settings-header">
          <h2>🔊 音效设置</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sound-settings-content">
          {/* 分隔：音效 */}
          <div className="setting-section">
            <div className="section-title">🎵 音效</div>
            
            {/* 音效开关 */}
            <div className="setting-row">
              <span className="setting-label">音效</span>
              <button 
                className={`toggle-btn ${soundEnabled ? 'on' : 'off'}`}
                onClick={handleSoundToggle}
              >
                {soundEnabled ? '开启' : '关闭'}
              </button>
            </div>

            {/* 音效音量滑块 */}
            <div className="setting-row volume-row">
              <span className="setting-label">音效音量</span>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={handleSoundVolumeChange}
                  className="volume-slider"
                  disabled={!soundEnabled}
                />
                <span className="volume-value">{soundVolume}%</span>
              </div>
            </div>

            {/* 测试按钮 */}
            <div className="setting-row">
              <span className="setting-label">测试音效</span>
              <button 
                className="test-btn"
                onClick={handleTestSound}
                disabled={!soundEnabled}
              >
                🔔 播放
              </button>
            </div>
          </div>

          {/* 分隔：背景音乐 */}
          <div className="setting-section">
            <div className="section-title">🎶 背景音乐</div>
            
            {/* BGM开关 */}
            <div className="setting-row">
              <span className="setting-label">背景音乐</span>
              <button 
                className={`toggle-btn ${bgmEnabled ? 'on' : 'off'}`}
                onClick={handleBgmToggle}
              >
                {bgmEnabled ? '开启' : '关闭'}
              </button>
            </div>

            {/* BGM音量滑块 */}
            <div className="setting-row volume-row">
              <span className="setting-label">音乐音量</span>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgmVolume}
                  onChange={handleBgmVolumeChange}
                  className="volume-slider"
                  disabled={!bgmEnabled}
                />
                <span className="volume-value">{bgmVolume}%</span>
              </div>
            </div>
          </div>

          {/* 分隔：游戏设置 */}
          <div className="setting-section">
            <div className="section-title">🎮 游戏设置</div>
            
            {/* 重播教程按钮 */}
            <div className="setting-row">
              <span className="setting-label">新手引导</span>
              <button 
                className="test-btn"
                onClick={() => {
                  resetTutorial()
                  onClose()
                }}
              >
                📖 重播教程
              </button>
            </div>
          </div>
        </div>

        <div className="sound-settings-footer">
          <p className="hint">💡 音效和音乐使用 Web Audio API 合成</p>
        </div>
      </motion.div>
    </motion.div>
  )
}