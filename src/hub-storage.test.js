import test from 'node:test';
import assert from 'node:assert/strict';

import { createHubSnapshot } from './hub-save.js';
import { createHubStorage, createMemoryStorage } from './hub-storage.js';

test('hub storage saves private hub snapshots by owner id', () => {
  const storage = createMemoryStorage();
  const playerStore = createHubStorage({ storage, ownerId: 'player-a' });
  const otherStore = createHubStorage({ storage, ownerId: 'player-b' });
  const snapshot = createHubSnapshot({
    ownerId: 'player-a',
    gameState: { money: 5000 },
    mapState: { rooms: [] },
  });

  playerStore.save(snapshot);

  assert.equal(playerStore.load().ownerId, 'player-a');
  assert.equal(playerStore.load().gameState.money, 5000);
  assert.equal(otherStore.load(), null);

  playerStore.clear();
  assert.equal(playerStore.load(), null);
});
