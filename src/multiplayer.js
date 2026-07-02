import { createCityEconomySnapshot, createSharedMarketState } from './shared-market.js';

export const COMMON_HQ_ID = 'hatcher-market-tower';

export const COMMON_HQ_BUILDING = {
  id: COMMON_HQ_ID,
  scope: 'common',
  name: 'Hatcher Market Tower',
  label: 'Common HQ',
  route: 'hq',
};

function normalizeSessionPlayer(player = {}, index = 0) {
  const id = player.id || `player-${index + 1}`;
  return {
    id,
    name: player.name || `Founder ${index + 1}`,
    hubId: player.hubId || `hub:${id}`,
    online: player.online !== false,
  };
}

export function createCityMultiplayerSession({ players = [], sharedMarket = null } = {}) {
  const normalizedPlayers = players.map(normalizeSessionPlayer);
  return {
    mode: 'city-session',
    sharedBuildings: [{ ...COMMON_HQ_BUILDING }],
    players: normalizedPlayers,
    privateHubIds: normalizedPlayers.map(player => player.hubId),
    sharedMarket: sharedMarket || createSharedMarketState({ players: normalizedPlayers }),
  };
}

export function joinCitySession(session = createCityMultiplayerSession(), player = {}) {
  const existing = session.players || [];
  const normalized = normalizeSessionPlayer(player, existing.length);
  const players = existing.some(candidate => candidate.id === normalized.id)
    ? existing.map(candidate => (candidate.id === normalized.id ? { ...candidate, ...normalized, online: true } : candidate))
    : [...existing, normalized];

  return {
    ...session,
    players,
    privateHubIds: players.map(candidate => candidate.hubId),
    sharedMarket: session.sharedMarket || createSharedMarketState({ players }),
  };
}

export function createCommonCityState({ playerId = 'local-player', playerName = 'Founder', sharedMarket = null } = {}) {
  const economy = createCityEconomySnapshot(sharedMarket || createSharedMarketState({
    players: [{ id: playerId, name: playerName }],
  }));
  return {
    mode: 'city',
    player: { id: playerId, name: playerName },
    onlineCount: economy.leaderboard.length,
    buildings: [{ ...COMMON_HQ_BUILDING }],
    playerBuildings: [],
    economy,
    districts: [
      { id: 'exchange', name: 'Exchange Walk', status: 'Open' },
      { id: 'ops', name: 'Ops Yard', status: 'Live contracts' },
      { id: 'vault', name: 'Vault Pier', status: 'Market storage' },
    ],
  };
}

export function createHqSnapshot({ playerId = 'local-player', playerName = 'Founder', hubLevel = 1, sharedMarket = null } = {}) {
  const economy = createCityEconomySnapshot(sharedMarket || createSharedMarketState({
    players: [{ id: playerId, name: playerName }],
  }));
  return {
    mode: 'hq',
    buildingId: COMMON_HQ_ID,
    player: {
      id: playerId,
      name: playerName,
      hubLevel,
    },
    onlineCount: economy.leaderboard.length,
    economy,
    market: economy.market,
    contracts: economy.contracts,
    leaderboard: economy.leaderboard,
  };
}

export function getPrivateHubRoute(player) {
  return {
    route: 'hub',
    ownerId: player.id,
    hubId: `hub:${player.id}`,
  };
}
