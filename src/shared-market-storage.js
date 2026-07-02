import { SHARED_MARKET_VERSION } from './shared-market.js';

const SHARED_MARKET_STORAGE_PREFIX = 'hatcher-game:shared-market';

function storageKey(scope = 'common-city') {
  return `${SHARED_MARKET_STORAGE_PREFIX}:${scope || 'common-city'}`;
}

function isSupportedSnapshot(snapshot) {
  return snapshot && snapshot.version === SHARED_MARKET_VERSION && Array.isArray(snapshot.resources);
}

export function createSharedMarketStorage({ storage, scope = 'common-city' } = {}) {
  const key = storageKey(scope);

  return {
    load() {
      if (!storage) return null;
      const raw = storage.getItem(key);
      if (!raw) return null;
      try {
        const snapshot = JSON.parse(raw);
        return isSupportedSnapshot(snapshot) ? snapshot : null;
      } catch (_err) {
        return null;
      }
    },
    save(snapshot) {
      if (!storage || !snapshot) return;
      if (!isSupportedSnapshot(snapshot)) {
        throw new Error('Cannot save unsupported shared market snapshot');
      }
      storage.setItem(key, JSON.stringify(snapshot));
    },
    clear() {
      if (!storage) return;
      storage.removeItem(key);
    },
  };
}
