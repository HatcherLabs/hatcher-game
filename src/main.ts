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
  { id: 'hashOre', label: 'North Mine', role: 'Extract Hash Ore', x: 455, y: 172 },
  { id: 'signalDust', label: 'Signal Farm', role: 'Harvest Signal Dust', x: 950, y: 398 },
  { id: 'computeAlloy', label: 'Forge Shed', role: 'Refine Compute Alloy', x: 92, y: 470 },
  { id: 'liquidityCrystal', label: 'Arena Exchange', role: 'Broker Crystal orders', x: 1390, y: 738 },
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
        <button id="collapseExchangeBtn" type="button" aria-label="Toggle exchange">×</button>
      </header>
      <div id="marketRows" class="market-rows"></div>
      <div id="inventoryRows" class="inventory-rows"></div>
    </aside>

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
}

class MarketScene extends Phaser.Scene {
  private lastSnapshot = ''
  private worldScale = 1
  private offsetX = 0
  private offsetY = 0

  constructor() {
    super('market')
  }

  preload() {
    this.load.image('world', '/assets/world/market-valley.png')
    this.load.image('agent', '/assets/characters/agent-idle.png')
    this.load.image('gold', '/assets/items/gold.png')
    this.load.image('silver', '/assets/items/silver.png')
    this.load.image('bronze', '/assets/items/bronze.png')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0e1514')
    this.drawWorld()
    this.scale.on('resize', () => this.drawWorld())
  }

  update() {
    const snapshot = JSON.stringify({
      tick: state.tick,
      selectedSite: state.selectedSite,
      credits: Math.round(state.credits),
      rigs: state.rigs,
      cores: state.brainCores,
      inventory: state.inventory,
      market: Object.fromEntries(Object.entries(state.market).map(([key, quote]) => [key, Math.round(quote.price)])),
    })

    if (snapshot !== this.lastSnapshot) {
      this.lastSnapshot = snapshot
      this.drawWorld()
    }
  }

  private drawWorld() {
    this.children.removeAll()

    const viewportW = Number(this.scale.width)
    const viewportH = Number(this.scale.height)
    const map = this.textures.get('world').getSourceImage() as HTMLImageElement
    this.worldScale = Math.max(viewportW / map.width, viewportH / map.height)
    this.offsetX = (viewportW - map.width * this.worldScale) / 2
    this.offsetY = (viewportH - map.height * this.worldScale) / 2

    this.add
      .image(this.offsetX, this.offsetY, 'world')
      .setOrigin(0)
      .setScale(this.worldScale)

    const vignette = this.add.graphics()
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.35, 0.15, 0.08, 0.35)
    vignette.fillRect(0, 0, viewportW, viewportH)

    for (const site of sites) {
      this.addSite(site)
    }

    const selected = sites.find((site) => site.id === state.selectedSite) ?? sites[0]
    const agent = this.toScreen(selected.x + 78, selected.y + 28)
    const sprite = this.add.image(agent.x, agent.y, 'agent').setScale(2.7).setDepth(10)
    this.tweens.add({
      targets: sprite,
      y: agent.y - 5,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    const beam = this.add.graphics().setDepth(9)
    beam.lineStyle(2, state.market[selected.id].color, 0.78)
    beam.strokeCircle(agent.x, agent.y + 12, 24)
  }

  private addSite(site: Site) {
    const screen = this.toScreen(site.x, site.y)
    const quote = state.market[site.id]
    const isSelected = state.selectedSite === site.id
    const glow = this.add.graphics().setDepth(4)
    glow.fillStyle(quote.color, isSelected ? 0.42 : 0.2)
    glow.fillCircle(screen.x, screen.y, isSelected ? 28 : 20)
    glow.lineStyle(isSelected ? 3 : 2, quote.color, 0.9)
    glow.strokeCircle(screen.x, screen.y, isSelected ? 30 : 22)

    const icon = this.add.image(screen.x, screen.y - 6, quote.icon).setScale(isSelected ? 2.2 : 1.8).setDepth(7)
    icon.setInteractive({ useHandCursor: true })
    icon.on('pointerdown', () => {
      state.selectedSite = site.id
      state.news = `${site.label}: ${site.role}.`
      renderHud()
      this.drawWorld()
    })

    const labelBg = this.add.graphics().setDepth(8)
    labelBg.fillStyle(0x111711, 0.84)
    labelBg.fillRoundedRect(screen.x - 74, screen.y + 20, 148, 42, 7)
    labelBg.lineStyle(1, quote.color, 0.8)
    labelBg.strokeRoundedRect(screen.x - 74, screen.y + 20, 148, 42, 7)

    this.add
      .text(screen.x, screen.y + 30, site.label, {
        color: '#fff4cf',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '12px',
        fontStyle: '700',
      })
      .setOrigin(0.5)
      .setDepth(9)

    this.add
      .text(screen.x, screen.y + 46, `${quote.shortName} ${quote.price.toFixed(0)}c`, {
        color: quote.trend >= 0 ? '#b7e06a' : '#ff8f73',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '11px',
      })
      .setOrigin(0.5)
      .setDepth(9)
  }

  private toScreen(x: number, y: number) {
    return {
      x: this.offsetX + x * this.worldScale,
      y: this.offsetY + y * this.worldScale,
    }
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

function toggleExchange(force?: boolean) {
  const collapsed = force ?? !refs.exchangePanel.classList.contains('collapsed')
  refs.exchangePanel.classList.toggle('collapsed', collapsed)
}

document.querySelector<HTMLButtonElement>('#extractBtn')!.addEventListener('click', extractCycle)
document.querySelector<HTMLButtonElement>('#sellBtn')!.addEventListener('click', sellBasket)
document.querySelector<HTMLButtonElement>('#upgradeBtn')!.addEventListener('click', upgradeRigs)
document.querySelector<HTMLButtonElement>('#contractBtn')!.addEventListener('click', runContract)
document.querySelector<HTMLButtonElement>('#exchangeBtn')!.addEventListener('click', () => toggleExchange(false))
document.querySelector<HTMLButtonElement>('#collapseExchangeBtn')!.addEventListener('click', () => toggleExchange(true))

window.addEventListener('beforeunload', () => {
  game.destroy(true)
})

setInterval(marketTick, 8000)
renderHud()
