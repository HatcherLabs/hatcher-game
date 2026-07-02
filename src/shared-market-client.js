import { advanceSharedMarket, createSharedMarketState, submitContractRun } from './shared-market.js';
import { createSharedMarketStorage } from './shared-market-storage.js';

export const MARKET_API_PATHS = {
  snapshot: '/v1/market/snapshot',
  intents: '/v1/market/intents',
};

function normalizePlayer(player = {}) {
  return {
    id: player.id || 'local-player',
    name: player.name || 'Founder',
  };
}

function createMarketStorage({ storage, marketStorage }) {
  if (marketStorage) return marketStorage;
  if (!storage) return null;
  return createSharedMarketStorage({ storage });
}

function saveSnapshot(marketStorage, snapshot) {
  try {
    marketStorage?.save(snapshot);
  } catch (_err) {
    // Local preview should continue even when storage writes are unavailable.
  }
}

function runLocalIntent(snapshot, player, intent = {}) {
  if (intent.type === 'market-pulse') {
    const hubLevel = Math.max(1, Number(intent.hubLevel) || 1);
    return advanceSharedMarket(snapshot, {
      hours: 4,
      orders: [{
        playerId: player.id,
        resourceId: 'signalCredits',
        side: 'buy',
        amount: 32 + hubLevel * 4,
      }],
    });
  }

  if (intent.type === 'run-contract') {
    const contract = snapshot.contracts.find(candidate => candidate.status !== 'complete');
    if (!contract) return snapshot;
    const hubLevel = Math.max(1, Number(intent.hubLevel) || 1);
    return submitContractRun(snapshot, {
      playerId: player.id,
      contractId: intent.contractId || contract.id,
      quality: 1 + Math.min(0.35, hubLevel * 0.04),
    });
  }

  throw new Error(`Unsupported shared market intent: ${intent.type}`);
}

export function createLocalSharedMarketClient({ storage, marketStorage, player, initialMarket } = {}) {
  const profile = normalizePlayer(player);
  const store = createMarketStorage({ storage, marketStorage });
  let snapshot = store?.load() || initialMarket || createSharedMarketState({ players: [profile] });

  return {
    mode: 'local',
    getSnapshot() {
      return snapshot;
    },
    submitIntent(intent) {
      snapshot = runLocalIntent(snapshot, profile, intent);
      saveSnapshot(store, snapshot);
      return snapshot;
    },
  };
}

function normalizeEndpoint(endpoint = '') {
  return String(endpoint).replace(/\/+$/, '');
}

async function parseMarketResponse(response) {
  if (!response.ok) {
    throw new Error(`Shared market request failed with status ${response.status}`);
  }
  const payload = await response.json();
  return payload.market || payload;
}

export function createRemoteSharedMarketClient({ endpoint, fetchImpl = globalThis.fetch, player, initialMarket } = {}) {
  const profile = normalizePlayer(player);
  const baseUrl = normalizeEndpoint(endpoint);
  if (!baseUrl) throw new Error('Remote shared market client requires an endpoint');
  if (!fetchImpl) throw new Error('Remote shared market client requires fetch');
  let snapshot = initialMarket || createSharedMarketState({ players: [profile] });

  return {
    mode: 'remote',
    getSnapshot() {
      return snapshot;
    },
    async fetchSnapshot() {
      const url = `${baseUrl}${MARKET_API_PATHS.snapshot}?playerId=${encodeURIComponent(profile.id)}`;
      snapshot = await parseMarketResponse(await fetchImpl(url, {
        headers: { accept: 'application/json' },
      }));
      return snapshot;
    },
    async submitIntent(intent) {
      const url = `${baseUrl}${MARKET_API_PATHS.intents}`;
      snapshot = await parseMarketResponse(await fetchImpl(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          playerId: profile.id,
          intent,
        }),
      }));
      return snapshot;
    },
  };
}

export function createSharedMarketClient({ mode = 'local', endpoint, fetchImpl, storage, marketStorage, player, initialMarket } = {}) {
  if (mode === 'remote') {
    return createRemoteSharedMarketClient({ endpoint, fetchImpl, player, initialMarket });
  }
  return createLocalSharedMarketClient({ storage, marketStorage, player, initialMarket });
}
