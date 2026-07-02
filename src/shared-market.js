export const SHARED_MARKET_VERSION = 1;

const RESOURCE_DEFS = [
  { id: 'signalCredits', name: 'Signal Credits', price: 42, supply: 120, demand: 96, volatility: 0.08 },
  { id: 'computeSlots', name: 'Compute Slots', price: 115, supply: 72, demand: 88, volatility: 0.07 },
  { id: 'agentLeads', name: 'Agent Leads', price: 260, supply: 45, demand: 52, volatility: 0.09 },
];

const CONTRACT_DEFS = [
  { id: 'seed-audit', title: 'Seed Desk Audit', reward: 1400, difficulty: 'Starter', resourceId: 'signalCredits', hoursLeft: 18 },
  { id: 'vault-forecast', title: 'Vault Forecast', reward: 2200, difficulty: 'Growth', resourceId: 'agentLeads', hoursLeft: 26 },
  { id: 'support-sprint', title: 'Protocol Support Sprint', reward: 3100, difficulty: 'Team', resourceId: 'computeSlots', hoursLeft: 34 },
  { id: 'market-maker', title: 'Market Maker Trial', reward: 4200, difficulty: 'Advanced', resourceId: 'signalCredits', hoursLeft: 42 },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundMoney(value) {
  return Math.max(1, Math.round(value));
}

function createTrend(previous, next) {
  const pct = previous > 0 ? ((next - previous) / previous) * 100 : 0;
  if (Math.abs(pct) < 0.5) return 'flat';
  return `${pct > 0 ? '+' : ''}${Math.round(pct)}%`;
}

function normalizePlayer(player, index = 0) {
  const id = player?.id || `player-${index + 1}`;
  return {
    id,
    name: player?.name || `Founder ${index + 1}`,
    hubId: player?.hubId || `hub:${id}`,
    online: player?.online !== false,
    marketScore: player?.marketScore || 0,
    completedContracts: player?.completedContracts || 0,
  };
}

function normalizeResource(resource) {
  return {
    id: resource.id,
    name: resource.name,
    price: roundMoney(resource.price),
    previousPrice: roundMoney(resource.previousPrice || resource.price),
    supply: Math.max(0, resource.supply),
    demand: Math.max(0, resource.demand),
    baselineSupply: Math.max(1, resource.baselineSupply || resource.supply),
    baselineDemand: Math.max(1, resource.baselineDemand || resource.demand),
    volatility: resource.volatility,
    trend: resource.trend || 'flat',
  };
}

function normalizeContract(contract) {
  return {
    id: contract.id,
    title: contract.title,
    reward: roundMoney(contract.reward),
    baseReward: roundMoney(contract.baseReward || contract.reward),
    difficulty: contract.difficulty,
    resourceId: contract.resourceId,
    hoursLeft: Math.max(1, contract.hoursLeft || 24),
    status: contract.status || 'open',
    completedBy: contract.completedBy || null,
  };
}

export function createSharedMarketState({ players = [], resources = RESOURCE_DEFS, contracts = CONTRACT_DEFS } = {}) {
  return {
    version: SHARED_MARKET_VERSION,
    tick: 0,
    players: players.map(normalizePlayer),
    resources: resources.map(normalizeResource),
    contracts: contracts.map(normalizeContract),
    cityPool: {
      liquidity: 25000,
      reputation: 20,
      completedContracts: 0,
    },
    ledger: [],
  };
}

function ensurePlayer(state, playerId) {
  let player = state.players.find(candidate => candidate.id === playerId);
  if (!player) {
    player = normalizePlayer({ id: playerId, name: 'Visiting Founder' }, state.players.length);
    state.players.push(player);
  }
  return player;
}

function applyOrder(state, order) {
  const resource = state.resources.find(candidate => candidate.id === order.resourceId);
  if (!resource) return;

  const amount = Math.max(0, Number(order.amount) || 0);
  if (amount <= 0) return;

  const player = ensurePlayer(state, order.playerId || 'local-player');
  const side = order.side === 'sell' ? 'sell' : 'buy';
  if (side === 'buy') {
    resource.demand += amount;
    state.cityPool.liquidity += Math.round(amount * resource.price * 0.12);
  } else {
    resource.supply += amount;
    state.cityPool.liquidity = Math.max(0, state.cityPool.liquidity - Math.round(amount * resource.price * 0.04));
  }

  const score = Math.round(amount * Math.max(4, resource.price * 0.08));
  player.marketScore += score;
  state.ledger.push({
    tick: state.tick,
    playerId: player.id,
    resourceId: resource.id,
    side,
    amount,
    score,
  });
}

function tickResource(resource, tick, hours) {
  const previousPrice = resource.price;
  const pressure = (resource.demand - resource.supply) / Math.max(1, resource.supply);
  const rhythm = (((tick + resource.id.length) % 5) - 2) * 0.01;
  const move = clamp(pressure * resource.volatility + rhythm, -0.14, 0.14);
  const nextPrice = roundMoney(previousPrice * (1 + move));

  return {
    ...resource,
    previousPrice,
    price: nextPrice,
    supply: Math.max(1, resource.supply + (resource.baselineSupply - resource.supply) * Math.min(1, hours * 0.08)),
    demand: Math.max(1, resource.demand + (resource.baselineDemand - resource.demand) * Math.min(1, hours * 0.1)),
    trend: createTrend(previousPrice, nextPrice),
  };
}

function tickContract(contract, resourcesById, hours) {
  if (contract.status === 'complete') return contract;
  const resource = resourcesById.get(contract.resourceId);
  const pressure = resource ? clamp((resource.demand - resource.supply) / Math.max(1, resource.supply), -0.5, 0.8) : 0;
  return {
    ...contract,
    hoursLeft: Math.max(1, contract.hoursLeft - hours),
    reward: roundMoney(contract.baseReward * (1 + Math.max(0, pressure) * 0.35)),
  };
}

export function advanceSharedMarket(market, { hours = 1, orders = [] } = {}) {
  const next = clone(market || createSharedMarketState());
  next.tick += Math.max(1, Math.round(hours));
  for (const order of orders) applyOrder(next, order);

  next.resources = next.resources.map(resource => tickResource(resource, next.tick, hours));
  const resourcesById = new Map(next.resources.map(resource => [resource.id, resource]));
  next.contracts = next.contracts.map(contract => tickContract(contract, resourcesById, hours));
  next.cityPool.reputation = clamp(next.cityPool.reputation + orders.length * 0.1, 0, 100);
  return next;
}

export function submitContractRun(market, { playerId = 'local-player', contractId, quality = 1 } = {}) {
  const next = clone(market || createSharedMarketState());
  const contract = next.contracts.find(candidate => candidate.id === contractId);
  if (!contract || contract.status === 'complete') return next;

  const player = ensurePlayer(next, playerId);
  const payout = roundMoney(contract.reward * clamp(quality, 0.6, 1.5));
  contract.status = 'complete';
  contract.completedBy = player.id;
  player.marketScore += payout;
  player.completedContracts += 1;
  next.cityPool.completedContracts += 1;
  next.cityPool.reputation = clamp(next.cityPool.reputation + 1.2 * quality, 0, 100);
  next.ledger.push({
    tick: next.tick,
    playerId: player.id,
    contractId: contract.id,
    side: 'contract',
    amount: 1,
    score: payout,
  });
  return next;
}

export function createCityEconomySnapshot(market = createSharedMarketState()) {
  const openContracts = market.contracts.filter(contract => contract.status !== 'complete');
  const leaderboard = [...market.players]
    .sort((a, b) => b.marketScore - a.marketScore || a.name.localeCompare(b.name))
    .map(player => ({
      name: player.name,
      metric: player.online ? 'Online Hub' : 'Async Hub',
      value: `$${Math.round(player.marketScore).toLocaleString()}`,
    }));

  return {
    summary: `Shared market T+${market.tick}h | ${openContracts.length} contracts open`,
    market: market.resources.map(resource => ({
      item: resource.name,
      price: resource.price,
      trend: resource.trend,
    })),
    contracts: openContracts.slice(0, 4).map(contract => ({
      id: contract.id,
      title: contract.title,
      reward: contract.reward,
      difficulty: `${contract.difficulty} | ${contract.hoursLeft}h`,
    })),
    leaderboard: leaderboard.length > 0 ? leaderboard : [
      { name: 'Genesis Desk', metric: 'Shared Hub', value: '$0' },
    ],
  };
}
