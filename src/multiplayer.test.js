import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COMMON_HQ_ID,
  createCityMultiplayerSession,
  createCommonCityState,
  createHqSnapshot,
  getPrivateHubRoute,
  joinCitySession,
} from './multiplayer.js';
import { advanceSharedMarket, createSharedMarketState } from './shared-market.js';

test('common city exposes one shared HQ instead of per-player buildings', () => {
  const city = createCommonCityState({ playerId: 'player-a', playerName: 'Cristian' });

  assert.equal(city.mode, 'city');
  assert.equal(city.buildings.length, 1);
  assert.equal(city.buildings[0].id, COMMON_HQ_ID);
  assert.equal(city.buildings[0].scope, 'common');
  assert.equal(city.playerBuildings.length, 0);
});

test('common city carries shared economy state without creating player-owned city buildings', () => {
  const sharedMarket = advanceSharedMarket(createSharedMarketState({
    players: [{ id: 'player-a', name: 'Cristian' }],
  }), {
    hours: 2,
    orders: [{ playerId: 'player-a', resourceId: 'signalCredits', side: 'buy', amount: 60 }],
  });
  const city = createCommonCityState({ playerId: 'player-a', playerName: 'Cristian', sharedMarket });

  assert.equal(city.onlineCount, 1);
  assert.match(city.economy.summary, /Shared market T\+2h/);
  assert.equal(city.economy.market[0].item, 'Signal Credits');
  assert.ok(city.economy.market[0].trend);
  assert.equal(city.playerBuildings.length, 0);
});

test('HQ routes every player into their own private hub instance', () => {
  const hq = createHqSnapshot({ playerId: 'player-a', playerName: 'Cristian', hubLevel: 3 });
  const route = getPrivateHubRoute(hq.player);

  assert.equal(hq.buildingId, COMMON_HQ_ID);
  assert.equal(route.route, 'hub');
  assert.equal(route.ownerId, 'player-a');
  assert.equal(route.hubId, 'hub:player-a');
});

test('HQ market board is driven by the shared multiplayer economy', () => {
  const sharedMarket = createSharedMarketState({
    players: [{ id: 'player-a', name: 'Cristian' }],
  });
  const hq = createHqSnapshot({ playerId: 'player-a', playerName: 'Cristian', hubLevel: 3, sharedMarket });

  assert.equal(hq.market[0].item, 'Signal Credits');
  assert.equal(hq.contracts[0].title, 'Seed Desk Audit');
  assert.match(hq.economy.summary, /Shared market/);
  assert.equal(hq.leaderboard[0].name, 'Cristian');
});

test('multiplayer city session tracks online presence while private hubs remain isolated', () => {
  const session = createCityMultiplayerSession({
    players: [{ id: 'player-a', name: 'Cristian' }],
  });
  const joined = joinCitySession(session, { id: 'player-b', name: 'Mara' });

  assert.equal(joined.players.length, 2);
  assert.equal(joined.players.every(player => player.hubId === `hub:${player.id}`), true);
  assert.equal(joined.sharedBuildings.length, 1);
  assert.equal(joined.privateHubIds.length, 2);
  assert.notEqual(joined.privateHubIds[0], joined.privateHubIds[1]);
});
