import Phaser from 'phaser'
import './style.css'

type CommodityId = 'hashOre' | 'signalDust' | 'computeAlloy' | 'liquidityCrystal'

type Commodity = {
  id: CommodityId
  name: string
  shortName: string
  icon: string
  color: number
  basePrice: number
  volatility: number
}

type MarketQuote = Commodity & {
  price: number
  trend: number
}

type GameState = {
  credits: number
  tick: number
  rigs: number
  brainCores: number
  inventory: Record<CommodityId, number>
  market: Record<CommodityId, MarketQuote>
  news: string
  selectedSite: CommodityId
}

type Site = {
  id: CommodityId
  label: string
  role: string
  x: number
  y: number
}

const commodities: Commodity[] = [
  { id: 'hashOre', name: 'Hash Ore', shortName: 'Ore', icon: 'bronze', color: 0xe7b55b, basePrice: 18, volatility: 0.09 },
  { id: 'signalDust', name: 'Signal Dust', shortName: 'Dust', icon: 'silver', color: 0x82d6ff, basePrice: 42, volatility: 0.13 },
  { id: 'computeAlloy', name: 'Compute Alloy', shortName: 'Alloy', icon: 'gold', color: 0xf6d36f, basePrice: 86, volatility: 0.11 },
  { id: 'liquidityCrystal', name: 'Liquidity Crystal', shortName: 'Crystal', icon: 'gold', color: 0xff7d9d, basePrice: 128, volatility: 0.18 },
]

const sites: Site[] = [
  { id: 'hashOre', label: 'Cliff Mine', role: 'Extract Hash Ore', x: 338, y: 164 },
  { id: 'signalDust', label: 'Relay Hill', role: 'Harvest Signal Dust', x: 662, y: 92 },
  { id: 'computeAlloy', label: 'Foundry Row', role: 'Refine Compute Alloy', x: 706, y: 430 },
  { id: 'liquidityCrystal', label: 'Harbor Exchange', role: 'Broker Crystal orders', x: 1140, y: 438 },
]

const state: GameState = {
  credits: 250,
  tick: 0,
  rigs: 1,
  brainCores: 0,
  inventory: {
    hashOre: 4,
    signalDust: 0,
    computeAlloy: 0,
    liquidityCrystal: 0,
  },
  market: Object.fromEntries(
    commodities.map((commodity) => [
      commodity.id,
      {
        ...commodity,
        price: commodity.basePrice,
        trend: 0,
      },
    ]),
  ) as Record<CommodityId, MarketQuote>,
  news: 'Opening bell: resource desks are quoting the first hatch cycle.',
  selectedSite: 'hashOre',
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app mount node')
}

app.innerHTML = `
  <main class="game-shell">
    <div id="game"></div>

    <section class="hud top-left">
      <p class="eyebrow">Hatcher Markets</p>
      <h1>Island Exchange</h1>
      <p id="siteRole" class="site-role"></p>
    </section>

    <section class="hud top-right">
      <div class="wallet-stat"><strong id="credits">0</strong><span>credits</span></div>
      <div class="wallet-stat"><strong id="rigs">1</strong><span>rigs</span></div>
      <div class="wallet-stat"><strong id="cores">0</strong><span>cores</span></div>
    </section>

    <aside class="exchange-panel collapsed" id="exchangePanel">
      <header>
        <div>
          <p class="eyebrow">Live Board</p>
          <h2>Exchange</h2>
        </div>
        <button id="collapseExchangeBtn" type="button" aria-label="Toggle exchange">x</button>
      </header>
      <div id="marketRows" class="market-rows"></div>
      <div id="inventoryRows" class="inventory-rows"></div>
    </aside>

    <section class="nav-chip">
      <div>
        <span>Map</span>
        <strong id="positionLabel">Drag / WASD</strong>
      </div>
      <button id="focusBtn" type="button">Focus</button>
      <em id="zoomLabel">100%</em>
    </section>

    <section class="hotbar">
      <button id="extractBtn" type="button"><span>1</span>Extract</button>
      <button id="sellBtn" type="button"><span>2</span>Sell</button>
      <button id="upgradeBtn" type="button"><span>3</span>Upgrade</button>
      <button id="contractBtn" type="button"><span>4</span>Contract</button>
      <button id="exchangeBtn" type="button"><span>Tab</span>Board</button>
    </section>

    <section class="event-strip">
      <span>Market event</span>
      <p id="news"></p>
    </section>
  </main>
`

const refs = {
  credits: document.querySelector<HTMLElement>('#credits')!,
  rigs: document.querySelector<HTMLElement>('#rigs')!,
  cores: document.querySelector<HTMLElement>('#cores')!,
  siteRole: document.querySelector<HTMLParagraphElement>('#siteRole')!,
  marketRows: document.querySelector<HTMLDivElement>('#marketRows')!,
  inventoryRows: document.querySelector<HTMLDivElement>('#inventoryRows')!,
  news: document.querySelector<HTMLParagraphElement>('#news')!,
  exchangePanel: document.querySelector<HTMLElement>('#exchangePanel')!,
  positionLabel: document.querySelector<HTMLElement>('#positionLabel')!,
  zoomLabel: document.querySelector<HTMLElement>('#zoomLabel')!,
}

class MarketScene extends Phaser.Scene {
  private lastSnapshot = ''
  private worldScale = 1
  private worldWidth = 0
  private worldHeight = 0
  private dragPoint: Phaser.Math.Vector2 | null = null
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private didInitialFocus = false
  private renderedSelectedSite: CommodityId = state.selectedSite

  constructor() {
    super('market')
  }

  preload() {
    this.load.image('world', '/assets/world/market-island.png')
    this.load.image('agent', '/assets/characters/agent-idle.png')
    this.load.image('gold', '/assets/items/gold.png')
    this.load.image('silver', '/assets/items/silver.png')
    this.load.image('bronze', '/assets/items/bronze.png')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0e1514')
    this.input.setDefaultCursor('grab')
    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D') as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) {
        return
      }

      this.dragPoint = new Phaser.Math.Vector2(pointer.x, pointer.y)
      this.input.setDefaultCursor('grabbing')
      document.body.classList.add('dragging-map')
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragPoint || !pointer.leftButtonDown()) {
        return
      }

      const camera = this.cameras.main
      const dx = pointer.x - this.dragPoint.x
      const dy = pointer.y - this.dragPoint.y
      camera.scrollX -= dx / camera.zoom
      camera.scrollY -= dy / camera.zoom
      this.dragPoint.set(pointer.x, pointer.y)
      this.clampCamera()
      this.updateCameraHud()
    })

    this.input.on('pointerup', () => this.stopDragging())
    this.input.on('pointerupoutside', () => this.stopDragging())
    this.input.on('gameout', () => this.stopDragging())

    this.input.on(
      'wheel',
      (pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
        const camera = this.cameras.main
        const oldZoom = camera.zoom
        const nextZoom = Phaser.Math.Clamp(oldZoom + (deltaY > 0 ? -0.08 : 0.08), 0.72, 1.2)

        if (nextZoom === oldZoom) {
          return
        }

        const worldBefore = camera.getWorldPoint(pointer.x, pointer.y)
        camera.setZoom(nextZoom)
        const worldAfter = camera.getWorldPoint(pointer.x, pointer.y)
        camera.scrollX += worldBefore.x - worldAfter.x
        camera.scrollY += worldBefore.y - worldAfter.y
        this.clampCamera()
        this.updateCameraHud()
      },
    )

    this.drawWorld(false)
    this.scale.on('resize', () => this.drawWorld(true))
  }

  update(_time: number, delta: number) {
    this.handleKeyboardPan(delta)

    const snapshot = this.getStateSnapshot()

    if (snapshot !== this.lastSnapshot) {
      const shouldFocusSelection = state.selectedSite !== this.renderedSelectedSite
      this.lastSnapshot = snapshot
      this.drawWorld(true)

      if (shouldFocusSelection) {
        this.renderedSelectedSite = state.selectedSite
        this.focusSite(state.selectedSite)
      }
    }
  }

  public focusSite(siteId = state.selectedSite, smooth = true) {
    const site = getSite(siteId)
    const targetX = this.worldX(site.x + 56)
    const targetY = this.worldY(site.y + 52)

    if (smooth) {
      this.cameras.main.pan(targetX, targetY, 520, 'Sine.easeInOut', true)
    } else {
      this.cameras.main.centerOn(targetX, targetY)
    }

    this.time.delayedCall(smooth ? 540 : 0, () => {
      this.clampCamera()
      this.updateCameraHud()
    })
  }

  private drawWorld(keepCamera: boolean) {
    const camera = this.cameras.main
    const centerBefore = keepCamera ? camera.midPoint.clone() : null

    this.tweens.killAll()
    this.children.removeAll(true)

    const viewportW = Number(this.scale.width)
    const viewportH = Number(this.scale.height)
    const map = this.textures.get('world').getSourceImage() as HTMLImageElement
    const coverScale = Math.max(viewportW / map.width, viewportH / map.height)
    this.worldScale = Phaser.Math.Clamp(coverScale * 1.52, 1.16, 1.72)
    this.worldWidth = map.width * this.worldScale
    this.worldHeight = map.height * this.worldScale

    camera.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.add.image(0, 0, 'world').setOrigin(0).setScale(this.worldScale).setDepth(0)

    this.drawSiteLayer()
    this.drawAgent()
    this.drawWorldVignette()

    if (!this.didInitialFocus) {
      this.didInitialFocus = true
      this.focusSite(state.selectedSite, false)
    } else if (centerBefore) {
      camera.centerOn(centerBefore.x, centerBefore.y)
      this.clampCamera()
    }

    this.updateCameraHud()
  }

  private drawSiteLayer() {
    for (const site of sites) {
      this.addSite(site)
    }
  }

  private drawAgent() {
    const selected = getSite(state.selectedSite)
    const agentX = this.worldX(selected.x + 78)
    const agentY = this.worldY(selected.y + 28)
    const sprite = this.add.image(agentX, agentY, 'agent').setScale(1.25 * this.worldScale).setDepth(20)
    this.tweens.add({
      targets: sprite,
      y: agentY - 5 * this.worldScale,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    const beam = this.add.graphics().setDepth(19)
    beam.lineStyle(2.2 * this.worldScale, state.market[selected.id].color, 0.78)
    beam.strokeCircle(agentX, agentY + 12 * this.worldScale, 15 * this.worldScale)
  }

  private drawWorldVignette() {
    const vignette = this.add.graphics()
    vignette.setScrollFactor(0)
    vignette.setDepth(30)
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.18, 0.04, 0.02, 0.22)
    vignette.fillRect(0, 0, Number(this.scale.width), Number(this.scale.height))
  }

  private addSite(site: Site) {
    const x = this.worldX(site.x)
    const y = this.worldY(site.y)
    const quote = state.market[site.id]
    const isSelected = state.selectedSite === site.id
    const radius = (isSelected ? 22 : 12) * this.worldScale
    const glow = this.add.graphics().setDepth(14)
    glow.fillStyle(0x090b08, isSelected ? 0.42 : 0.34)
    glow.fillCircle(x + 2 * this.worldScale, y + 4 * this.worldScale, radius * 0.95)
    glow.fillStyle(quote.color, isSelected ? 0.2 : 0.12)
    glow.fillCircle(x, y, radius * 0.86)
    glow.lineStyle((isSelected ? 2 : 1.2) * this.worldScale, quote.color, isSelected ? 0.82 : 0.44)
    glow.strokeCircle(x, y, radius)

    const icon = this.add.image(x, y - 4 * this.worldScale, quote.icon).setScale((isSelected ? 1.35 : 0.95) * this.worldScale).setDepth(17)
    icon.setInteractive({ useHandCursor: true })
    icon.on('pointerdown', () => {
      state.selectedSite = site.id
      state.news = `${site.label}: ${site.role}.`
      renderHud()
    })

    if (!isSelected) {
      return
    }

    const labelBg = this.add.graphics().setDepth(18)
    labelBg.fillStyle(0x111711, 0.84)
    labelBg.fillRoundedRect(x - 69 * this.worldScale, y + 18 * this.worldScale, 138 * this.worldScale, 38 * this.worldScale, 7 * this.worldScale)
    labelBg.lineStyle(1 * this.worldScale, quote.color, 0.8)
    labelBg.strokeRoundedRect(x - 69 * this.worldScale, y + 18 * this.worldScale, 138 * this.worldScale, 38 * this.worldScale, 7 * this.worldScale)

    this.add
      .text(x, y + 27 * this.worldScale, site.label, {
        color: '#fff4cf',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: `${Math.round(11 * this.worldScale)}px`,
        fontStyle: '700',
      })
      .setOrigin(0.5)
      .setDepth(19)

    this.add
      .text(x, y + 42 * this.worldScale, `${quote.shortName} ${quote.price.toFixed(0)}c`, {
        color: quote.trend >= 0 ? '#b7e06a' : '#ff8f73',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: `${Math.round(10 * this.worldScale)}px`,
      })
      .setOrigin(0.5)
      .setDepth(19)
  }

  private handleKeyboardPan(delta: number) {
    const camera = this.cameras.main
    const cursors = this.cursors
    const wasd = this.wasd

    if (!cursors && !wasd) {
      return
    }

    const left = Boolean(cursors?.left.isDown || wasd?.A.isDown)
    const right = Boolean(cursors?.right.isDown || wasd?.D.isDown)
    const up = Boolean(cursors?.up.isDown || wasd?.W.isDown)
    const down = Boolean(cursors?.down.isDown || wasd?.S.isDown)

    if (!left && !right && !up && !down) {
      return
    }

    const speed = (delta / 16.67) * 12 / camera.zoom
    camera.scrollX += (right ? speed : 0) - (left ? speed : 0)
    camera.scrollY += (down ? speed : 0) - (up ? speed : 0)
    this.clampCamera()
    this.updateCameraHud()
  }

  private stopDragging() {
    if (!this.dragPoint) {
      return
    }

    this.dragPoint = null
    this.input.setDefaultCursor('grab')
    document.body.classList.remove('dragging-map')
  }

  private clampCamera() {
    const camera = this.cameras.main
    const maxScrollX = Math.max(0, this.worldWidth - camera.width / camera.zoom)
    const maxScrollY = Math.max(0, this.worldHeight - camera.height / camera.zoom)
    camera.scrollX = Phaser.Math.Clamp(camera.scrollX, 0, maxScrollX)
    camera.scrollY = Phaser.Math.Clamp(camera.scrollY, 0, maxScrollY)
  }

  private updateCameraHud() {
    const camera = this.cameras.main
    refs.zoomLabel.textContent = `${Math.round(camera.zoom * 100)}%`
    refs.positionLabel.textContent = `${getSite(state.selectedSite).label} / drag map`
  }

  private getStateSnapshot() {
    return JSON.stringify({
      tick: state.tick,
      selectedSite: state.selectedSite,
      credits: Math.round(state.credits),
      rigs: state.rigs,
      cores: state.brainCores,
      inventory: state.inventory,
      market: Object.fromEntries(Object.entries(state.market).map(([key, quote]) => [key, Math.round(quote.price)])),
    })
  }

  private worldX(x: number) {
    return x * this.worldScale
  }

  private worldY(y: number) {
    return y * this.worldScale
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0e1514',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [MarketScene],
})

function marketTick() {
  state.tick += 1

  for (const commodity of commodities) {
    const quote = state.market[commodity.id]
    const wave = Math.sin((state.tick + commodity.basePrice) * 0.41) * commodity.volatility
    const shock = (Math.random() - 0.5) * commodity.volatility
    const demand = state.brainCores * 0.014
    const nextPrice = Math.max(6, quote.price * (1 + wave + shock + demand))
    quote.trend = nextPrice - quote.price
    quote.price = Number(nextPrice.toFixed(2))
  }

  const events = [
    'Arena desks opened a new liquidity rotation.',
    'Forge sheds are buying Compute Alloy above yesterday close.',
    'Signal Dust rallied after a relay shortage.',
    'North Mine supply increased, but contracts are absorbing inventory.',
    'Brain Core demand is pulling resources into hatch labs.',
  ]
  state.news = events[state.tick % events.length]
  renderHud()
}

function extractCycle() {
  const selected = state.selectedSite
  const multiplier = state.rigs + state.brainCores * 0.5
  state.inventory[selected] += Math.ceil(2 * multiplier)

  if (selected === 'hashOre') {
    state.inventory.signalDust += Math.floor(multiplier)
  }

  if (state.rigs >= 2) {
    state.inventory.computeAlloy += 1
  }

  state.news = `${getSite(selected).label} delivered ${Math.ceil(2 * multiplier)} ${state.market[selected].name}.`
  marketTick()
}

function sellBasket() {
  let revenue = 0

  for (const commodity of commodities) {
    const quantity = state.inventory[commodity.id]
    revenue += quantity * state.market[commodity.id].price
    state.inventory[commodity.id] = 0
  }

  state.credits += Math.round(revenue)
  state.news = revenue > 0 ? `Basket cleared for ${Math.round(revenue)} credits.` : 'No inventory to sell.'
  marketTick()
}

function upgradeRigs() {
  const cost = 180 + state.rigs * 90

  if (state.credits < cost) {
    state.news = `Need ${cost} credits for the next rig upgrade.`
    renderHud()
    return
  }

  state.credits -= cost
  state.rigs += 1
  state.news = `Field rigs upgraded. Extraction capacity is now ${state.rigs}.`
  marketTick()
}

function runContract() {
  const needs = {
    hashOre: 6,
    signalDust: 3,
    computeAlloy: 1,
    liquidityCrystal: 0,
  } satisfies Record<CommodityId, number>

  const canRun = commodities.every((commodity) => state.inventory[commodity.id] >= needs[commodity.id])

  if (!canRun) {
    state.news = 'Contract needs 6 Hash Ore, 3 Signal Dust, and 1 Compute Alloy.'
    renderHud()
    return
  }

  for (const commodity of commodities) {
    state.inventory[commodity.id] -= needs[commodity.id]
  }

  state.brainCores += 1
  state.credits += 75
  state.news = 'Contract cleared. Brain Core installed and market demand increased.'
  marketTick()
}

function renderHud() {
  const selected = getSite(state.selectedSite)
  refs.credits.textContent = Math.round(state.credits).toLocaleString()
  refs.rigs.textContent = state.rigs.toString()
  refs.cores.textContent = state.brainCores.toString()
  refs.news.textContent = state.news
  refs.siteRole.textContent = `${selected.label}: ${selected.role}`

  refs.marketRows.innerHTML = commodities
    .map((commodity) => {
      const quote = state.market[commodity.id]
      const trend = quote.trend >= 0 ? 'up' : 'down'
      const marker = quote.trend >= 0 ? '+' : ''
      return `
        <button class="market-row ${state.selectedSite === commodity.id ? 'selected' : ''}" data-site="${commodity.id}" type="button">
          <img src="/assets/items/${quote.icon}.png" alt="" />
          <strong>${commodity.name}</strong>
          <span>${quote.price.toFixed(2)}c</span>
          <em class="${trend}">${marker}${quote.trend.toFixed(2)}</em>
        </button>
      `
    })
    .join('')

  refs.inventoryRows.innerHTML = commodities
    .map(
      (commodity) => `
        <div class="inventory-row">
          <img src="/assets/items/${commodity.icon}.png" alt="" />
          <span>${commodity.shortName}</span>
          <strong>${state.inventory[commodity.id]}</strong>
        </div>
      `,
    )
    .join('')

  refs.marketRows.querySelectorAll<HTMLButtonElement>('.market-row').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedSite = button.dataset.site as CommodityId
      state.news = `${getSite(state.selectedSite).label} selected.`
      renderHud()
    })
  })
}

function getSite(id: CommodityId) {
  return sites.find((site) => site.id === id) ?? sites[0]
}

function getMarketScene() {
  const scene = game.scene.getScene('market')
  return scene instanceof MarketScene ? scene : undefined
}

function focusSelectedSite() {
  getMarketScene()?.focusSite(state.selectedSite)
}

function toggleExchange(force?: boolean) {
  const collapsed = force ?? !refs.exchangePanel.classList.contains('collapsed')
  refs.exchangePanel.classList.toggle('collapsed', collapsed)
}

document.querySelector<HTMLButtonElement>('#extractBtn')!.addEventListener('click', extractCycle)
document.querySelector<HTMLButtonElement>('#sellBtn')!.addEventListener('click', sellBasket)
document.querySelector<HTMLButtonElement>('#upgradeBtn')!.addEventListener('click', upgradeRigs)
document.querySelector<HTMLButtonElement>('#contractBtn')!.addEventListener('click', runContract)
document.querySelector<HTMLButtonElement>('#exchangeBtn')!.addEventListener('click', () => toggleExchange())
document.querySelector<HTMLButtonElement>('#collapseExchangeBtn')!.addEventListener('click', () => toggleExchange(true))
document.querySelector<HTMLButtonElement>('#focusBtn')!.addEventListener('click', () => focusSelectedSite())

window.addEventListener('keydown', (event) => {
  const target = event.target
  const isTextInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

  if (isTextInput || event.repeat) {
    return
  }

  if (event.key === '1') {
    extractCycle()
  } else if (event.key === '2') {
    sellBasket()
  } else if (event.key === '3') {
    upgradeRigs()
  } else if (event.key === '4') {
    runContract()
  } else if (event.key === 'Tab') {
    event.preventDefault()
    toggleExchange()
  } else if (event.key.toLowerCase() === 'f') {
    focusSelectedSite()
  }
})

window.addEventListener('beforeunload', () => {
  game.destroy(true)
})

setInterval(marketTick, 8000)
renderHud()
