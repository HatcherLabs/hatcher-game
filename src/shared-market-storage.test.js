import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStorage } from './hub-storage.js';
import { advanceSharedMarket, createSharedMarketState } from './shared-market.js';
import { createSharedMarketStorage } from './shared-market-storage.js';

test('shared market storage saves market state by city scope', () => {
  const storage = createMemoryStorage();
  const commonStore = createSharedMarketStorage({ storage, scope: 'common-city' });
  const otherStore = createSharedMarketStorage({ storage, scope: 'side-arena' });
  const market = advanceSharedMarket(createSharedMarketState({
    players: [{ id: 'player-a', name: 'Cristian' }],
  }), {
    hours: 4,
    orders: [{
      playerId: 'player-a',
      resourceId: 'signalCredits',
      side: 'buy',
      amount: 60,
    }],
  });

  commonStore.save(market);

  assert.equal(commonStore.load().tick, 4);
  assert.equal(commonStore.load().players[0].id, 'player-a');
  assert.equal(otherStore.load(), null);

  commonStore.clear();

  assert.equal(commonStore.load(), null);
});

test('shared market storage ignores corrupt or unsupported snapshots', () => {
  const storage = createMemoryStorage();
  const marketStore = createSharedMarketStorage({ storage, scope: 'common-city' });

  storage.setItem('hatcher-game:shared-market:common-city', '{bad json');
  assert.equal(marketStore.load(), null);

  storage.setItem('hatcher-game:shared-market:common-city', JSON.stringify({ version: -1 }));
  assert.equal(marketStore.load(), null);
});
