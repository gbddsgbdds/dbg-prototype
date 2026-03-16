import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { soundManager } from '../utils/soundManager'
import './SoundSettings.css'

// 音效设置的持久化 key
const SOUND_SETTINGS_KEY = 'dbg-sound-settings'

interface SoundSettingsData {
  enabled: boolean
  volume: number
}

// 获取保存的设置
function getSavedSettings(): SoundSettingsData {
  try {
    const data = localStorage.getItem(SOUND_SETTINGS_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch {}
  return { enabled: true, volume: 30 }
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
  const [enabled, setEnabled] = useState(soundManager.isEnabled())
  const [volume, setVolume] = useState(Math.round(soundManager.getVolume() * 100))

  // 从 localStorage 恢复设置
  useEffect(() => {
    const saved = getSavedSettings()
    setEnabled(saved.enabled)
    setVolume(Math.round(saved.volume * 100))
    soundManager.toggle(saved.enabled)
    soundManager.setVolume(saved.volume)
  }, [])

  // 处理开关
  const handleToggle = () => {
    const newState = !enabled
    setEnabled(newState)
    soundManager.toggle(newState)
    saveSettings({ enabled: newState, volume: volume / 100 })
    
    // 播放测试音
    if (newState) {
      soundManager.playSound('click')
    }
  }

  // 处理音量变化
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    soundManager.setVolume(newVolume / 100)
    saveSettings({ enabled, volume: newVolume / 100 })
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
          {/* 音效开关 */}
          <div className="setting-row">
            <span className="setting-label">音效</span>
            <button 
              className={`toggle-btn ${enabled ? 'on' : 'off'}`}
              onClick={handleToggle}
            >
              {enabled ? '开启' : '关闭'}
            </button>
          </div>

          {/* 音量滑块 */}
          <div className="setting-row volume-row">
            <span className="setting-label">音量</span>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                disabled={!enabled}
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="setting-row">
            <span className="setting-label">测试</span>
            <button 
              className="test-btn"
              onClick={handleTestSound}
              disabled={!enabled}
            >
              🔔 播放测试音
            </button>
          </div>
        </div>

        <div className="sound-settings-footer">
          <p className="hint">💡 音效使用 Web Audio API 合成</p>
        </div>
      </motion.div>
    </motion.div>
  )
}