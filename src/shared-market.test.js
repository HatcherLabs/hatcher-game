import test from 'node:test';
import assert from 'node:assert/strict';

import {
  advanceSharedMarket,
  createCityEconomySnapshot,
  createSharedMarketState,
  submitContractRun,
} from './shared-market.js';

test('shared market tick applies player orders and updates prices deterministically', () => {
  const market = createSharedMarketState({
    players: [
      { id: 'player-a', name: 'Cristian' },
      { id: 'player-b', name: 'Mara' },
    ],
  });
  const signalBefore = market.resources.find(resource => resource.id === 'signalCredits');

  const next = advanceSharedMarket(market, {
    hours: 4,
    orders: [
      { playerId: 'player-a', resourceId: 'signalCredits', side: 'buy', amount: 60 },
      { playerId: 'player-b', resourceId: 'computeSlots', side: 'sell', amount: 8 },
    ],
  });
  const signalAfter = next.resources.find(resource => resource.id === 'signalCredits');
  const playerA = next.players.find(player => player.id === 'player-a');

  assert.equal(market.tick, 0);
  assert.equal(next.tick, 4);
  assert.notEqual(signalAfter.price, signalBefore.price);
  assert.equal(next.ledger.length, 2);
  assert.ok(playerA.marketScore > market.players.find(player => player.id === 'player-a').marketScore);
});

test('shared contract runs pay players and update the multiplayer leaderboard', () => {
  const market = createSharedMarketState({
    players: [
      { id: 'player-a', name: 'Cristian' },
      { id: 'player-b', name: 'Mara' },
    ],
  });
  const contract = market.contracts[0];

  const next = submitContractRun(market, {
    playerId: 'player-b',
    contractId: contract.id,
    quality: 1.25,
  });
  const completed = next.contracts.find(candidate => candidate.id === contract.id);
  const playerB = next.players.find(player => player.id === 'player-b');
  const snapshot = createCityEconomySnapshot(next);

  assert.equal(completed.status, 'complete');
  assert.equal(next.cityPool.completedContracts, 1);
  assert.ok(playerB.marketScore >= contract.reward);
  assert.equal(snapshot.leaderboard[0].name, 'Mara');
});

test('city economy snapshot exposes market rows and playable contracts for HQ UI', () => {
  const market = createSharedMarketState({
    players: [{ id: 'player-a', name: 'Cristian' }],
  });
  const snapshot = createCityEconomySnapshot(market);

  assert.ok(snapshot.market.length >= 3);
  assert.ok(snapshot.market.every(row => row.item && typeof row.price === 'number' && row.trend));
  assert.ok(snapshot.contracts.length >= 3);
  assert.ok(snapshot.contracts.every(row => row.title && row.reward > 0 && row.difficulty));
  assert.ok(snapshot.summary.includes('Shared market'));
});
