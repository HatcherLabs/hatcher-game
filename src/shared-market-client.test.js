import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStorage } from './hub-storage.js';
import { createSharedMarketState } from './shared-market.js';
import { createSharedMarketStorage } from './shared-market-storage.js';
import {
  createLocalSharedMarketClient,
  createRemoteSharedMarketClient,
  MARKET_API_PATHS,
} from './shared-market-client.js';

test('local shared market client persists market pulse intents for preview play', () => {
  const storage = createMemoryStorage();
  const player = { id: 'player-a', name: 'Cristian' };
  const client = createLocalSharedMarketClient({ storage, player });

  const next = client.submitIntent({ type: 'market-pulse', hubLevel: 3 });

  assert.equal(next.tick, 4);
  assert.equal(next.players[0].id, 'player-a');
  assert.equal(createSharedMarketStorage({ storage }).load().tick, 4);
  assert.equal(createLocalSharedMarketClient({ storage, player }).getSnapshot().tick, 4);
});

test('local shared market client completes contracts and persists the shared board', () => {
  const storage = createMemoryStorage();
  const player = { id: 'player-a', name: 'Cristian' };
  const client = createLocalSharedMarketClient({ storage, player });

  const next = client.submitIntent({ type: 'run-contract', hubLevel: 5 });

  assert.equal(next.contracts.filter(contract => contract.status !== 'complete').length, 3);
  assert.equal(next.players.find(candidate => candidate.id === 'player-a').completedContracts, 1);
  assert.equal(createLocalSharedMarketClient({ storage, player }).getSnapshot().cityPool.completedContracts, 1);
});

test('remote shared market client sends server-authoritative intents', async () => {
  const requests = [];
  const market = createSharedMarketState({
    players: [{ id: 'player-a', name: 'Cristian' }],
  });
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, options });
    return {
      ok: true,
      json: async () => ({ market }),
    };
  };
  const client = createRemoteSharedMarketClient({
    endpoint: 'https://api.example.test/',
    fetchImpl,
    player: { id: 'player-a', name: 'Cristian' },
  });

  const snapshot = await client.fetchSnapshot();
  const next = await client.submitIntent({ type: 'run-contract', contractId: 'seed-audit' });

  assert.equal(client.getSnapshot().players[0].id, 'player-a');
  assert.equal(snapshot.players[0].id, 'player-a');
  assert.equal(next.players[0].id, 'player-a');
  assert.equal(requests[0].url, `https://api.example.test${MARKET_API_PATHS.snapshot}?playerId=player-a`);
  assert.equal(requests[1].url, `https://api.example.test${MARKET_API_PATHS.intents}`);
  assert.equal(requests[1].options.method, 'POST');
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    playerId: 'player-a',
    intent: { type: 'run-contract', contractId: 'seed-audit' },
  });
});
