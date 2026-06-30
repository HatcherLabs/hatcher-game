import Phaser from 'phaser'
import './style.css'

type CommodityId = 'hashOre' | 'signalDust' | 'computeAlloy' | 'liquidityCrystal'

type Commodity = {
  id: CommodityId
  name: string
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
  day: number
  tick: number
  rigs: number
  brainCores: number
  inventory: Record<CommodityId, number>
  market: Record<CommodityId, MarketQuote>
  news: string
}

const commodities: Commodity[] = [
  { id: 'hashOre', name: 'Hash Ore', color: 0xb7e06a, basePrice: 18, volatility: 0.09 },
  { id: 'signalDust', name: 'Signal Dust', color: 0x62c4ff, basePrice: 42, volatility: 0.13 },
  { id: 'computeAlloy', name: 'Compute Alloy', color: 0xf4b85a, basePrice: 86, volatility: 0.11 },
  { id: 'liquidityCrystal', name: 'Liquidity Crystal', color: 0xe66a7f, basePrice: 128, volatility: 0.18 },
]

const state: GameState = {
  credits: 250,
  day: 1,
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
  news: 'Opening bell: labs need raw resources before the first agent hatch.',
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app mount node')
}

app.innerHTML = `
  <main class="game-shell">
    <section class="hud hud-top">
      <div>
        <p class="eyebrow">Hatcher Markets</p>
        <h1>Resource floor</h1>
      </div>
      <div class="stats">
        <span><strong id="credits">0</strong> credits</span>
        <span><strong id="day">1</strong> day</span>
        <span><strong id="rigs">1</strong> rigs</span>
      </div>
    </section>

    <section class="playfield">
      <div id="game"></div>
      <aside class="panel">
        <div class="panel-section">
          <h2>Exchange</h2>
          <div id="marketRows" class="market-rows"></div>
        </div>
        <div class="panel-section">
          <h2>Inventory</h2>
          <div id="inventoryRows" class="inventory-rows"></div>
        </div>
        <div class="panel-section">
          <h2>Actions</h2>
          <div class="actions">
            <button id="extractBtn" type="button">Extract cycle</button>
            <button id="sellBtn" type="button">Sell basket</button>
            <button id="upgradeBtn" type="button">Upgrade rigs</button>
            <button id="contractBtn" type="button">Run contract</button>
          </div>
        </div>
      </aside>
    </section>

    <section class="ticker">
      <span>Market event</span>
      <p id="news"></p>
    </section>
  </main>
`

const refs = {
  credits: document.querySelector<HTMLElement>('#credits')!,
  day: document.querySelector<HTMLElement>('#day')!,
  rigs: document.querySelector<HTMLElement>('#rigs')!,
  marketRows: document.querySelector<HTMLDivElement>('#marketRows')!,
  inventoryRows: document.querySelector<HTMLDivElement>('#inventoryRows')!,
  news: document.querySelector<HTMLParagraphElement>('#news')!,
}

class MarketScene extends Phaser.Scene {
  private lastSnapshot = ''

  constructor() {
    super('market')
  }

  create() {
    this.cameras.main.setBackgroundColor('#151712')
    this.drawWorld()
  }

  update() {
    const snapshot = JSON.stringify({
      tick: state.tick,
      credits: Math.round(state.credits),
      rigs: state.rigs,
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
    const graphics = this.add.graphics()
    const width = Number(this.scale.width)
    const centerX = width * 0.48
    const startY = 92
    const tileW = 86
    const tileH = 43

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const x = centerX + (col - row) * (tileW / 2)
        const y = startY + (col + row) * (tileH / 2)
        const isRoad = row === 3 || col === 4
        const fill = isRoad ? 0x2d3326 : (row + col) % 2 === 0 ? 0x23311f : 0x1c291d
        drawIsoTile(graphics, x, y, tileW, tileH, fill, 0x526046)
      }
    }

    const sites = [
      { label: 'Mine', id: 'hashOre' as CommodityId, row: 1, col: 1 },
      { label: 'Relay', id: 'signalDust' as CommodityId, row: 2, col: 6 },
      { label: 'Forge', id: 'computeAlloy' as CommodityId, row: 6, col: 2 },
      { label: 'Vault', id: 'liquidityCrystal' as CommodityId, row: 6, col: 6 },
    ]

    for (const site of sites) {
      const quote = state.market[site.id]
      const x = centerX + (site.col - site.row) * (tileW / 2)
      const y = startY + (site.col + site.row) * (tileH / 2)
      drawIsoTile(graphics, x, y, tileW, tileH, quote.color, 0xf2f0d8)
      graphics.fillStyle(0x11140f, 0.82)
      graphics.fillRoundedRect(x - 28, y - 42, 56, 34, 5)
      this.add
        .text(x, y - 32, site.label, {
          color: '#f4f0d0',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '11px',
          fontStyle: '700',
        })
        .setOrigin(0.5)
      this.add
        .text(x, y - 17, `${Math.round(quote.price)}c`, {
          color: quote.trend >= 0 ? '#b7e06a' : '#ff8f73',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '10px',
        })
        .setOrigin(0.5)
    }

    const exchangeX = centerX + 32
    const exchangeY = startY + 186
    graphics.fillStyle(0x10130e, 0.94)
    graphics.fillRoundedRect(exchangeX - 98, exchangeY - 64, 196, 98, 8)
    graphics.lineStyle(2, 0xf4b85a, 0.65)
    graphics.strokeRoundedRect(exchangeX - 98, exchangeY - 64, 196, 98, 8)
    this.add
      .text(exchangeX, exchangeY - 38, 'HATCHER EXCHANGE', {
        color: '#f4f0d0',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '15px',
        fontStyle: '800',
      })
      .setOrigin(0.5)
    this.add
      .text(exchangeX, exchangeY - 12, `Brain Cores ${state.brainCores} | Rigs ${state.rigs}`, {
        color: '#b7e06a',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '12px',
      })
      .setOrigin(0.5)
  }
}

function drawIsoTile(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number,
  stroke: number,
) {
  graphics.fillStyle(fill, 0.86)
  graphics.lineStyle(1, stroke, 0.42)
  graphics.beginPath()
  graphics.moveTo(x, y - height / 2)
  graphics.lineTo(x + width / 2, y)
  graphics.lineTo(x, y + height / 2)
  graphics.lineTo(x - width / 2, y)
  graphics.closePath()
  graphics.fillPath()
  graphics.strokePath()
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#151712',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 900,
    height: 560,
  },
  scene: [MarketScene],
})

function marketTick() {
  state.tick += 1

  if (state.tick % 4 === 0) {
    state.day += 1
  }

  for (const commodity of commodities) {
    const quote = state.market[commodity.id]
    const wave = Math.sin((state.tick + commodity.basePrice) * 0.41) * commodity.volatility
    const shock = (Math.random() - 0.5) * commodity.volatility
    const demand = state.brainCores * 0.015
    const nextPrice = Math.max(6, quote.price * (1 + wave + shock + demand))
    quote.trend = nextPrice - quote.price
    quote.price = Number(nextPrice.toFixed(2))
  }

  const events = [
    'A relay outage pushed Signal Dust bids higher.',
    'Forge guilds are absorbing Compute Alloy inventory.',
    'Liquidity desks are rotating into Crystal reserves.',
    'New rigs entered the field; Hash Ore supply is climbing.',
    'Agent hatch labs posted fresh resource orders.',
  ]
  state.news = events[state.tick % events.length]
  renderHud()
}

function extractCycle() {
  const multiplier = state.rigs + state.brainCores * 0.5
  state.inventory.hashOre += Math.ceil(2 * multiplier)
  state.inventory.signalDust += Math.floor(1 * multiplier)

  if (state.rigs >= 2) {
    state.inventory.computeAlloy += 1
  }

  if (state.brainCores >= 2) {
    state.inventory.liquidityCrystal += 1
  }

  state.news = `Extraction cycle complete. ${state.rigs} rigs returned inventory.`
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
  state.news = revenue > 0 ? `Basket sold for ${Math.round(revenue)} credits.` : 'No inventory to sell.'
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
  state.news = `Rig capacity upgraded to ${state.rigs}.`
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
    state.news = 'Contract requires 6 Hash Ore, 3 Signal Dust, and 1 Compute Alloy.'
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
  refs.credits.textContent = Math.round(state.credits).toLocaleString()
  refs.day.textContent = state.day.toString()
  refs.rigs.textContent = state.rigs.toString()
  refs.news.textContent = state.news

  refs.marketRows.innerHTML = commodities
    .map((commodity) => {
      const quote = state.market[commodity.id]
      const trend = quote.trend >= 0 ? 'up' : 'down'
      const marker = quote.trend >= 0 ? '+' : ''
      return `
        <div class="market-row">
          <span class="swatch" style="--swatch: #${quote.color.toString(16).padStart(6, '0')}"></span>
          <strong>${commodity.name}</strong>
          <span>${quote.price.toFixed(2)}c</span>
          <em class="${trend}">${marker}${quote.trend.toFixed(2)}</em>
        </div>
      `
    })
    .join('')

  refs.inventoryRows.innerHTML = commodities
    .map(
      (commodity) => `
        <div class="inventory-row">
          <span>${commodity.name}</span>
          <strong>${state.inventory[commodity.id]}</strong>
        </div>
      `,
    )
    .join('')
}

document.querySelector<HTMLButtonElement>('#extractBtn')!.addEventListener('click', extractCycle)
document.querySelector<HTMLButtonElement>('#sellBtn')!.addEventListener('click', sellBasket)
document.querySelector<HTMLButtonElement>('#upgradeBtn')!.addEventListener('click', upgradeRigs)
document.querySelector<HTMLButtonElement>('#contractBtn')!.addEventListener('click', runContract)

window.addEventListener('beforeunload', () => {
  game.destroy(true)
})

setInterval(marketTick, 8000)
renderHud()
