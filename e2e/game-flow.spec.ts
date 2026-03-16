import { test, expect } from '@playwright/test'

test.describe('游戏核心流程', () => {
  test.beforeEach(async ({ page, context }) => {
    // 清除所有 cookies
    await context.clearCookies()
    
    // 加载页面
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // 清理存储
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // 刷新页面
    await page.reload()
    await page.waitForLoadState('networkidle')
    // 额外等待 React 渲染
    await page.waitForTimeout(500)
  })

  test('开始界面显示正常', async ({ page }) => {
    // 检查标题
    await expect(page.locator('h1')).toContainText('道诡修仙录')
    
    // 检查开始按钮存在（等待出现）
    await expect(page.getByRole('button', { name: '开始修仙' })).toBeVisible({ timeout: 5000 })
    
    // 检查成就按钮
    await expect(page.getByRole('button', { name: /成就/ })).toBeVisible()
  })

  test('开始游戏 → 角色选择', async ({ page }) => {
    // 等待开始按钮出现并点击
    const startBtn = page.getByRole('button', { name: '开始修仙' })
    await expect(startBtn).toBeVisible({ timeout: 5000 })
    await startBtn.click()
    
    // 等待角色选择界面加载
    await page.waitForTimeout(1000)
    
    // 检查角色选择界面
    await expect(page.locator('.character-select-screen')).toBeVisible({ timeout: 5000 })
    
    // 检查有可选角色
    const characterCards = page.locator('.character-card')
    const count = await characterCards.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('角色选择 → 进入游戏', async ({ page }) => {
    // 点击开始
    const startBtn = page.getByRole('button', { name: '开始修仙' })
    await expect(startBtn).toBeVisible({ timeout: 5000 })
    await startBtn.click()
    
    // 等待角色选择
    await page.waitForTimeout(1000)
    await expect(page.locator('.character-select-screen')).toBeVisible({ timeout: 5000 })
    
    // 选择第一个角色
    const firstCharacter = page.locator('.character-card').first()
    await expect(firstCharacter).toBeVisible({ timeout: 3000 })
    await firstCharacter.click()
    await page.waitForTimeout(500)
    
    // 点击确认按钮
    const confirmBtn = page.locator('.character-select-btn')
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click()
    }
    
    // 等待进入游戏
    await page.waitForTimeout(1500)
    
    // 检查进入游戏（地图或战斗）
    const isMapVisible = await page.locator('.map-screen').first().isVisible()
    const isBattleVisible = await page.locator('.game-container').first().isVisible()
    
    expect(isMapVisible || isBattleVisible).toBeTruthy()
  })
})

test.describe('UI 交互测试', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  })

  test('成就界面可以打开和关闭', async ({ page }) => {
    // 打开成就界面
    const achievementBtn = page.getByRole('button', { name: /成就/ })
    await expect(achievementBtn).toBeVisible({ timeout: 5000 })
    await achievementBtn.click()
    await page.waitForTimeout(500)
    
    // 检查成就界面
    await expect(page.locator('.achievement-screen')).toBeVisible({ timeout: 5000 })
    
    // 关闭成就界面（点击关闭按钮 ✕）
    const closeBtn = page.locator('.close-btn')
    await closeBtn.click()
    await page.waitForTimeout(300)
    
    // 检查已关闭
    await expect(page.locator('.achievement-screen')).not.toBeVisible()
  })

  test('音效设置界面可以打开和关闭', async ({ page }) => {
    // 打开音效设置
    const soundBtn = page.getByRole('button', { name: /音效设置/ })
    await expect(soundBtn).toBeVisible({ timeout: 5000 })
    await soundBtn.click()
    await page.waitForTimeout(500)
    
    // 检查设置界面
    await expect(page.locator('.sound-settings-overlay')).toBeVisible({ timeout: 5000 })
    
    // 关闭设置（点击关闭按钮或点击遮罩）
    const closeBtn = page.getByRole('button', { name: /关闭|取消/ }).first()
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
    } else {
      // 点击遮罩关闭
      await page.locator('.sound-settings-overlay').click({ position: { x: 10, y: 10 } })
    }
    await page.waitForTimeout(300)
  })
})

test.describe('响应式布局测试', () => {
  test('移动端显示正常', async ({ page, context }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 清理并加载
    await context.clearCookies()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // 检查标题
    await expect(page.locator('h1')).toBeVisible()
    
    // 点击开始
    const startBtn = page.getByRole('button', { name: '开始修仙' })
    await expect(startBtn).toBeVisible({ timeout: 5000 })
    await startBtn.click()
    
    // 进入角色选择
    await page.waitForTimeout(1000)
    await expect(page.locator('.character-select-screen')).toBeVisible({ timeout: 5000 })
  })
})