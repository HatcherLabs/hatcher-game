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

type District = {
  key: string
  label: string
  role: string
  x: number
  y: number
  width: number
  height: number
  color: number
  asset: string
  assetScale: number
  assetOffsetX: number
  assetOffsetY: number
}

type Route = {
  key: string
  color: number
  duration: number
  phase: number
  points: Array<{ x: number; y: number }>
}

const commodities: Commodity[] = [
  { id: 'hashOre', name: 'Hash Ore', shortName: 'Ore', icon: 'bronze', color: 0xe7b55b, basePrice: 18, volatility: 0.09 },
  { id: 'signalDust', name: 'Signal Dust', shortName: 'Dust', icon: 'silver', color: 0x82d6ff, basePrice: 42, volatility: 0.13 },
  { id: 'computeAlloy', name: 'Compute Alloy', shortName: 'Alloy', icon: 'gold', color: 0xf6d36f, basePrice: 86, volatility: 0.11 },
  { id: 'liquidityCrystal', name: 'Liquidity Crystal', shortName: 'Crystal', icon: 'gold', color: 0xff7d9d, basePrice: 128, volatility: 0.18 },
]

const sites: Site[] = [
  { id: 'hashOre', label: 'North Mine', role: 'Extract Hash Ore', x: 455, y: 172 },
  { id: 'signalDust', label: 'Signal Farm', role: 'Harvest Signal Dust', x: 950, y: 398 },
  { id: 'computeAlloy', label: 'Forge Shed', role: 'Refine Compute Alloy', x: 92, y: 470 },
  { id: 'liquidityCrystal', label: 'Arena Exchange', role: 'Broker Crystal orders', x: 1390, y: 738 },
]

const districts: District[] = [
  {
    key: 'ore-yards',
    label: 'Rig Yards',
    role: 'Build extraction pads',
    x: 382,
    y: 505,
    width: 310,
    height: 138,
    color: 0xe7b55b,
    asset: 'construction-yard',
    assetScale: 0.34,
    assetOffsetX: 18,
    assetOffsetY: -52,
  },
  {
    key: 'relay-plant',
    label: 'Relay Plant',
    role: 'Boost signal harvests',
    x: 1178,
    y: 258,
    width: 320,
    height: 128,
    color: 0x82d6ff,
    asset: 'relay-plant',
    assetScale: 0.32,
    assetOffsetX: 10,
    assetOffsetY: -38,
  },
  {
    key: 'forge-works',
    label: 'Forge Works',
    role: 'Turn ore into alloys',
    x: 760,
    y: 706,
    width: 300,
    height: 128,
    color: 0xf6d36f,
    asset: 'forge-works',
    assetScale: 0.31,
    assetOffsetX: 0,
    assetOffsetY: -42,
  },
  {
    key: 'arena-market',
    label: 'Arena Market',
    role: 'Clear basket orders',
    x: 1330,
    y: 642,
    width: 360,
    height: 150,
    color: 0xff7d9d,
    asset: 'market-stadium',
    assetScale: 0.33,
    assetOffsetX: -8,
    assetOffsetY: -46,
  },
  {
    key: 'vault-plaza',
    label: 'Vault Plaza',
    role: 'Install Brain Cores',
    x: 208,
    y: 206,
    width: 300,
    height: 132,
    color: 0xb7e06a,
    asset: 'vault-hall',
    assetScale: 0.29,
    assetOffsetX: -8,
    assetOffsetY: -56,
  },
  {
    key: 'seed-square',
    label: 'Seed Square',
    role: 'Seed contracts and routes',
    x: 980,
    y: 868,
    width: 280,
    height: 120,
    color: 0x9df06f,
    asset: 'seed-fountain',
    assetScale: 0.27,
    assetOffsetX: -12,
    assetOffsetY: -44,
  },
]

const routes: Route[] = [
  {
    key: 'mine-relay',
    color: 0x82d6ff,
    duration: 9800,
    phase: 0.08,
    points: [
      { x: 455, y: 172 },
      { x: 665, y: 240 },
      { x: 950, y: 398 },
      { x: 1178, y: 258 },
    ],
  },
  {
    key: 'forge-arena',
    color: 0xf6d36f,
    duration: 11800,
    phase: 0.34,
    points: [
      { x: 92, y: 470 },
      { x: 382, y: 505 },
      { x: 760, y: 706 },
      { x: 1330, y: 642 },
      { x: 1390, y: 738 },
    ],
  },
  {
    key: 'vault-seed',
    color: 0xb7e06a,
    duration: 13200,
    phase: 0.62,
    points: [
      { x: 208, y: 206 },
      { x: 455, y: 172 },
      { x: 760, y: 706 },
      { x: 980, y: 868 },
      { x: 1390, y: 738 },
    ],
  },
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
      <h1>Valley Exchange</h1>
      <p id="siteRole" class="site-role"></p>
    </section>

    <section class="hud top-right">
      <div class="wallet-stat"><strong id="credits">0</strong><span>credits</span></div>
      <div class="wallet-stat"><strong id="rigs">1</strong><span>rigs</span></div>
      <div class="wallet-stat"><strong id="cores">0</strong><span>cores</span></div>
    </section>

    <aside class="exchange-panel" id="exchangePanel">
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
    this.load.image('world', '/assets/world/market-valley.png')
    this.load.image('agent', '/assets/characters/agent-idle.png')
    this.load.image('gold', '/assets/items/gold.png')
    this.load.image('silver', '/assets/items/silver.png')
    this.load.image('bronze', '/assets/items/bronze.png')
    this.load.image('construction-yard', '/assets/city-builder/construction-yard.png')
    this.load.image('market-stadium', '/assets/city-builder/market-stadium.png')
    this.load.image('relay-plant', '/assets/city-builder/relay-plant.png')
    this.load.image('forge-works', '/assets/city-builder/forge-works.png')
    this.load.image('vault-hall', '/assets/city-builder/vault-hall.png')
    this.load.image('seed-fountain', '/assets/city-builder/seed-fountain.png')
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

    this.drawRouteLayer()
    this.drawDistrictLayer()
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

  private drawRouteLayer() {
    for (const route of routes) {
      this.drawSegmentedRoute(route)
      this.addCourier(route)
    }
  }

  private drawSegmentedRoute(route: Route) {
    const line = this.add.graphics().setDepth(2)
    const glow = this.add.graphics().setDepth(1)
    line.lineStyle(2.2 * this.worldScale, route.color, 0.58)
    glow.lineStyle(7 * this.worldScale, route.color, 0.12)

    for (let i = 0; i < route.points.length - 1; i += 1) {
      const start = route.points[i]
      const end = route.points[i + 1]
      const segments = Math.max(8, Math.floor(Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y) / 36))

      for (let segment = 0; segment < segments; segment += 2) {
        const t0 = segment / segments
        const t1 = Math.min((segment + 1) / segments, 1)
        const x0 = Phaser.Math.Linear(start.x, end.x, t0)
        const y0 = Phaser.Math.Linear(start.y, end.y, t0)
        const x1 = Phaser.Math.Linear(start.x, end.x, t1)
        const y1 = Phaser.Math.Linear(start.y, end.y, t1)
        line.lineBetween(this.worldX(x0), this.worldY(y0), this.worldX(x1), this.worldY(y1))
        glow.lineBetween(this.worldX(x0), this.worldY(y0), this.worldX(x1), this.worldY(y1))
      }
    }
  }

  private addCourier(route: Route) {
    const dot = this.add.circle(0, 0, 5 * this.worldScale, route.color, 0.9).setDepth(11)
    dot.setStrokeStyle(2 * this.worldScale, 0x1a1209, 0.76)
    const courier = { progress: route.phase }

    this.tweens.add({
      targets: courier,
      progress: route.phase + 1,
      duration: route.duration,
      ease: 'Linear',
      repeat: -1,
      onUpdate: () => {
        const point = this.pointOnRoute(route, courier.progress % 1)
        dot.setPosition(this.worldX(point.x), this.worldY(point.y))
      },
    })
  }

  private drawDistrictLayer() {
    for (const district of districts) {
      const x = this.worldX(district.x)
      const y = this.worldY(district.y)
      const width = district.width * this.worldScale
      const height = district.height * this.worldScale

      const pad = this.add.graphics().setDepth(4)
      pad.fillStyle(0x050807, 0.34)
      pad.fillEllipse(x + 10 * this.worldScale, y + 18 * this.worldScale, width * 1.06, height * 0.92)
      pad.fillStyle(district.color, 0.16)
      pad.fillEllipse(x, y, width, height)
      pad.lineStyle(2 * this.worldScale, district.color, 0.48)
      pad.strokeEllipse(x, y, width, height)

      this.add
        .image(this.worldX(district.x + district.assetOffsetX), this.worldY(district.y + district.assetOffsetY), district.asset)
        .setScale(district.assetScale * this.worldScale)
        .setDepth(6)

      const label = this.add.graphics().setDepth(12)
      label.fillStyle(0x111711, 0.78)
      label.fillRoundedRect(x - 77 * this.worldScale, y + 38 * this.worldScale, 154 * this.worldScale, 39 * this.worldScale, 7 * this.worldScale)
      label.lineStyle(1.4 * this.worldScale, district.color, 0.72)
      label.strokeRoundedRect(x - 77 * this.worldScale, y + 38 * this.worldScale, 154 * this.worldScale, 39 * this.worldScale, 7 * this.worldScale)

      this.add
        .text(x, y + 48 * this.worldScale, district.label, {
          color: '#fff4cf',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: `${Math.round(12 * this.worldScale)}px`,
          fontStyle: '700',
        })
        .setOrigin(0.5)
        .setDepth(13)

      this.add
        .text(x, y + 64 * this.worldScale, district.role, {
          color: '#d7c49b',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: `${Math.round(10 * this.worldScale)}px`,
        })
        .setOrigin(0.5)
        .setDepth(13)
    }
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
    const sprite = this.add.image(agentX, agentY, 'agent').setScale(1.65 * this.worldScale).setDepth(20)
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
    beam.strokeCircle(agentX, agentY + 12 * this.worldScale, 18 * this.worldScale)
  }

  private drawWorldVignette() {
    const vignette = this.add.graphics()
    vignette.setScrollFactor(0)
    vignette.setDepth(30)
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.34, 0.1, 0.05, 0.34)
    vignette.fillRect(0, 0, Number(this.scale.width), Number(this.scale.height))
  }

  private addSite(site: Site) {
    const x = this.worldX(site.x)
    const y = this.worldY(site.y)
    const quote = state.market[site.id]
    const isSelected = state.selectedSite === site.id
    const radius = (isSelected ? 24 : 18) * this.worldScale
    const glow = this.add.graphics().setDepth(14)
    glow.fillStyle(quote.color, isSelected ? 0.42 : 0.2)
    glow.fillCircle(x, y, radius * 0.92)
    glow.lineStyle((isSelected ? 3 : 2) * this.worldScale, quote.color, 0.9)
    glow.strokeCircle(x, y, radius)

    const icon = this.add.image(x, y - 6 * this.worldScale, quote.icon).setScale((isSelected ? 1.65 : 1.35) * this.worldScale).setDepth(17)
    icon.setInteractive({ useHandCursor: true })
    icon.on('pointerdown', () => {
      state.selectedSite = site.id
      state.news = `${site.label}: ${site.role}.`
      renderHud()
    })

    const labelBg = this.add.graphics().setDepth(18)
    labelBg.fillStyle(0x111711, 0.84)
    labelBg.fillRoundedRect(x - 74 * this.worldScale, y + 20 * this.worldScale, 148 * this.worldScale, 42 * this.worldScale, 7 * this.worldScale)
    labelBg.lineStyle(1 * this.worldScale, quote.color, 0.8)
    labelBg.strokeRoundedRect(x - 74 * this.worldScale, y + 20 * this.worldScale, 148 * this.worldScale, 42 * this.worldScale, 7 * this.worldScale)

    this.add
      .text(x, y + 30 * this.worldScale, site.label, {
        color: '#fff4cf',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: `${Math.round(12 * this.worldScale)}px`,
        fontStyle: '700',
      })
      .setOrigin(0.5)
      .setDepth(19)

    this.add
      .text(x, y + 46 * this.worldScale, `${quote.shortName} ${quote.price.toFixed(0)}c`, {
        color: quote.trend >= 0 ? '#b7e06a' : '#ff8f73',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: `${Math.round(11 * this.worldScale)}px`,
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

  private pointOnRoute(route: Route, progress: number) {
    const maxSegment = route.points.length - 1
    const scaledProgress = progress * maxSegment
    const segment = Math.min(maxSegment - 1, Math.floor(scaledProgress))
    const localProgress = scaledProgress - segment
    const start = route.points[segment]
    const end = route.points[segment + 1]

    return {
      x: Phaser.Math.Linear(start.x, end.x, localProgress),
      y: Phaser.Math.Linear(start.y, end.y, localProgress),
    }
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

if (window.matchMedia('(max-width: 700px)').matches) {
  toggleExchange(true)
}
