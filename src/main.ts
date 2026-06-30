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
  row: number
  col: number
}

type AuthoredLot = {
  row: number
  col: number
  frame: number
}

const TILE_FRAME_WIDTH = 130
const TILE_FRAME_HEIGHT = 230
const TILE_WIDTH = 128
const TILE_HEIGHT = 64
const TILE_SCALE = 1.06
const TILE_ANCHOR_Y = 130 / 230
const MAP_ROWS = 18
const MAP_COLS = 18
const WORLD_MARGIN = 280
const ISO_TOP = 190

const halfTileW = (TILE_WIDTH * TILE_SCALE) / 2
const halfTileH = (TILE_HEIGHT * TILE_SCALE) / 2
const isoOriginX = (MAP_ROWS - 1) * halfTileW + WORLD_MARGIN

const frames = {
  empty: 0,
  plaza: 1,
  roadA: 2,
  roadB: 3,
  roadCrossA: 4,
  roadCrossB: 5,
  parkA: 7,
  parkB: 8,
  civic: 9,
  compactBlock: 46,
  cornerShop: 47,
  waterA: 48,
  waterB: 49,
  waterC: 50,
  market: 54,
  redMarket: 55,
  greenMarket: 56,
  whiteTower: 57,
  glassTower: 58,
  brickTower: 59,
  redBlock: 60,
  redBlockTall: 61,
  tanBlock: 62,
  tanBlockTall: 63,
  blueBlock: 64,
  redLab: 65,
  smallShop: 66,
  lowHouse: 67,
  redOffice: 68,
  canopy: 69,
  exchangeHouse: 70,
  signalDepot: 71,
}

const authoredLots: AuthoredLot[] = [
  { row: 1, col: 6, frame: frames.parkA },
  { row: 1, col: 13, frame: frames.signalDepot },
  { row: 2, col: 3, frame: frames.compactBlock },
  { row: 2, col: 9, frame: frames.redMarket },
  { row: 2, col: 15, frame: frames.parkB },
  { row: 3, col: 5, frame: frames.civic },
  { row: 3, col: 12, frame: frames.glassTower },
  { row: 4, col: 2, frame: frames.redBlockTall },
  { row: 4, col: 7, frame: frames.cornerShop },
  { row: 4, col: 14, frame: frames.tanBlock },
  { row: 5, col: 4, frame: frames.market },
  { row: 5, col: 11, frame: frames.redLab },
  { row: 6, col: 2, frame: frames.parkA },
  { row: 6, col: 15, frame: frames.blueBlock },
  { row: 7, col: 6, frame: frames.smallShop },
  { row: 7, col: 10, frame: frames.exchangeHouse },
  { row: 8, col: 13, frame: frames.greenMarket },
  { row: 9, col: 3, frame: frames.tanBlockTall },
  { row: 9, col: 8, frame: frames.plaza },
  { row: 9, col: 15, frame: frames.brickTower },
  { row: 10, col: 5, frame: frames.redOffice },
  { row: 10, col: 11, frame: frames.whiteTower },
  { row: 11, col: 2, frame: frames.parkB },
  { row: 11, col: 7, frame: frames.blueBlock },
  { row: 11, col: 13, frame: frames.glassTower },
  { row: 12, col: 4, frame: frames.redBlock },
  { row: 12, col: 9, frame: frames.canopy },
  { row: 12, col: 15, frame: frames.market },
  { row: 13, col: 6, frame: frames.tanBlock },
  { row: 13, col: 11, frame: frames.redBlockTall },
  { row: 14, col: 3, frame: frames.compactBlock },
  { row: 14, col: 14, frame: frames.lowHouse },
  { row: 15, col: 7, frame: frames.signalDepot },
  { row: 15, col: 12, frame: frames.cornerShop },
  { row: 16, col: 4, frame: frames.parkA },
  { row: 16, col: 10, frame: frames.parkB },
]

const commodities: Commodity[] = [
  { id: 'hashOre', name: 'Hash Ore', shortName: 'Ore', icon: 'bronze', color: 0xe7b55b, basePrice: 18, volatility: 0.09 },
  { id: 'signalDust', name: 'Signal Dust', shortName: 'Dust', icon: 'silver', color: 0x82d6ff, basePrice: 42, volatility: 0.13 },
  { id: 'computeAlloy', name: 'Compute Alloy', shortName: 'Alloy', icon: 'gold', color: 0xf6d36f, basePrice: 86, volatility: 0.11 },
  { id: 'liquidityCrystal', name: 'Liquidity Crystal', shortName: 'Crystal', icon: 'gold', color: 0xff7d9d, basePrice: 128, volatility: 0.18 },
]

const sites: Site[] = [
  { id: 'hashOre', label: 'Ore Yard', role: 'Extract Hash Ore', row: 5, col: 4 },
  { id: 'signalDust', label: 'Relay Campus', role: 'Harvest Signal Dust', row: 3, col: 12 },
  { id: 'computeAlloy', label: 'Foundry Row', role: 'Refine Compute Alloy', row: 10, col: 5 },
  { id: 'liquidityCrystal', label: 'Exchange Tower', role: 'Broker Crystal orders', row: 11, col: 13 },
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
      <h1>Iso Exchange</h1>
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
        <span>City Grid</span>
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
    this.load.spritesheet('isoTiles', '/assets/isocity/iso-tiles.png', {
      frameWidth: TILE_FRAME_WIDTH,
      frameHeight: TILE_FRAME_HEIGHT,
    })
    this.load.image('gold', '/assets/items/gold.png')
    this.load.image('silver', '/assets/items/silver.png')
    this.load.image('bronze', '/assets/items/bronze.png')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0f1918')
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
        const nextZoom = Phaser.Math.Clamp(oldZoom + (deltaY > 0 ? -0.08 : 0.08), 0.68, 1.28)

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
    const target = this.tileCenter(site.row, site.col)

    if (smooth) {
      this.cameras.main.pan(target.x, target.y, 520, 'Sine.easeInOut', true)
    } else {
      this.cameras.main.centerOn(target.x, target.y)
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
    this.configureWorld()
    camera.setBounds(0, 0, this.worldWidth, this.worldHeight)

    this.drawBackdrop()
    this.drawIsoCity()
    this.drawSiteLayer()
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

  private configureWorld() {
    this.worldWidth = isoOriginX + (MAP_COLS - 1) * halfTileW + WORLD_MARGIN
    this.worldHeight = ISO_TOP + (MAP_ROWS + MAP_COLS) * halfTileH + TILE_FRAME_HEIGHT * TILE_SCALE + WORLD_MARGIN
  }

  private drawBackdrop() {
    const bg = this.add.graphics().setDepth(-10)
    bg.fillStyle(0x10201f, 1)
    bg.fillRect(0, 0, this.worldWidth, this.worldHeight)
    bg.fillStyle(0x1a302b, 0.72)
    bg.fillEllipse(this.worldWidth / 2, ISO_TOP + 620, this.worldWidth * 0.82, 1040)
    bg.lineStyle(2, 0x29443c, 0.36)
    bg.strokeEllipse(this.worldWidth / 2, ISO_TOP + 620, this.worldWidth * 0.82, 1040)
  }

  private drawIsoCity() {
    for (let row = 0; row < MAP_ROWS; row += 1) {
      for (let col = 0; col < MAP_COLS; col += 1) {
        const frame = this.getTileFrame(row, col)
        const point = this.gridToWorld(row, col)
        this.add
          .image(point.x, point.y, 'isoTiles', frame)
          .setOrigin(0.5, TILE_ANCHOR_Y)
          .setScale(TILE_SCALE)
          .setDepth(point.y)
      }
    }
  }

  private getTileFrame(row: number, col: number) {
    const authored = authoredLots.find((lot) => lot.row === row && lot.col === col)

    if (authored) {
      return authored.frame
    }

    const mainRoad = row === 8 || col === 8
    const northRoad = row === 3 && col > 2 && col < 15
    const eastRoad = col === 13 && row > 3 && row < 16
    const southRoad = row === 14 && col > 3 && col < 14
    const westRoad = col === 3 && row > 3 && row < 15
    const isRoad = mainRoad || northRoad || eastRoad || southRoad || westRoad

    if (isRoad && (row + col) % 5 === 0) {
      return frames.roadCrossA
    }

    if (isRoad) {
      return (row + col) % 2 === 0 ? frames.roadA : frames.roadB
    }

    if ((row === 0 || row === 17 || col === 0 || col === 17) && (row + col) % 4 === 0) {
      return frames.parkA
    }

    if ((row + col) % 11 === 0) {
      return frames.parkB
    }

    return frames.empty
  }

  private drawSiteLayer() {
    for (const site of sites) {
      this.addSite(site)
    }
  }

  private drawWorldVignette() {
    const vignette = this.add.graphics()
    vignette.setScrollFactor(0)
    vignette.setDepth(10000)
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.18, 0.04, 0.02, 0.22)
    vignette.fillRect(0, 0, Number(this.scale.width), Number(this.scale.height))
  }

  private addSite(site: Site) {
    const center = this.tileCenter(site.row, site.col)
    const quote = state.market[site.id]
    const isSelected = state.selectedSite === site.id
    const markerDepth = center.y + 180
    const marker = this.add.graphics().setDepth(markerDepth)

    this.drawTileDiamond(marker, center.x, center.y - halfTileH, quote.color, isSelected ? 0.28 : 0.08, quote.color, isSelected ? 0.88 : 0.34)

    const icon = this.add.image(center.x, center.y - 26, quote.icon).setScale(isSelected ? 1.15 : 0.86).setDepth(markerDepth + 2)
    icon.setInteractive({ useHandCursor: true })
    icon.on('pointerdown', () => this.selectSite(site))

    const zone = this.add.zone(center.x, center.y - halfTileH, TILE_WIDTH * TILE_SCALE, TILE_HEIGHT * TILE_SCALE)
    zone.setDepth(markerDepth + 3)
    zone.setInteractive({ useHandCursor: true })
    zone.on('pointerdown', () => this.selectSite(site))

    if (!isSelected) {
      return
    }

    const labelBg = this.add.graphics().setDepth(markerDepth + 4)
    labelBg.fillStyle(0x111711, 0.86)
    labelBg.fillRoundedRect(center.x - 76, center.y - 12, 152, 42, 7)
    labelBg.lineStyle(1, quote.color, 0.78)
    labelBg.strokeRoundedRect(center.x - 76, center.y - 12, 152, 42, 7)

    this.add
      .text(center.x, center.y - 1, site.label, {
        color: '#fff4cf',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px',
        fontStyle: '700',
      })
      .setOrigin(0.5)
      .setDepth(markerDepth + 5)

    this.add
      .text(center.x, center.y + 16, `${quote.shortName} ${quote.price.toFixed(0)}c`, {
        color: quote.trend >= 0 ? '#b7e06a' : '#ff8f73',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '12px',
      })
      .setOrigin(0.5)
      .setDepth(markerDepth + 5)
  }

  private selectSite(site: Site) {
    state.selectedSite = site.id
    state.news = `${site.label}: ${site.role}.`
    renderHud()
  }

  private drawTileDiamond(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    topY: number,
    fillColor: number,
    fillAlpha: number,
    lineColor: number,
    lineAlpha: number,
  ) {
    graphics.fillStyle(fillColor, fillAlpha)
    graphics.lineStyle(2, lineColor, lineAlpha)
    graphics.beginPath()
    graphics.moveTo(centerX, topY)
    graphics.lineTo(centerX + halfTileW, topY + halfTileH)
    graphics.lineTo(centerX, topY + halfTileH * 2)
    graphics.lineTo(centerX - halfTileW, topY + halfTileH)
    graphics.closePath()
    graphics.fillPath()
    graphics.strokePath()
  }

  private gridToWorld(row: number, col: number) {
    return {
      x: isoOriginX + (col - row) * halfTileW,
      y: ISO_TOP + (col + row) * halfTileH,
    }
  }

  private tileCenter(row: number, col: number) {
    const point = this.gridToWorld(row, col)
    return {
      x: point.x,
      y: point.y + halfTileH,
    }
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
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0f1918',
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
    'Exchange Tower opened a new liquidity rotation.',
    'Foundry Row is buying Compute Alloy above yesterday close.',
    'Signal Dust rallied after a relay shortage.',
    'Ore Yard output increased, but contracts are absorbing inventory.',
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
