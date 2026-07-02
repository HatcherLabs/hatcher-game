const HUB_STORAGE_PREFIX = 'hatcher-game:private-hub';

function storageKey(ownerId) {
  return `${HUB_STORAGE_PREFIX}:${ownerId}`;
}

export function createHubStorage({ storage, ownerId }) {
  return {
    load() {
      const raw = storage.getItem(storageKey(ownerId));
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (_err) {
        return null;
      }
    },
    save(snapshot) {
      if (!snapshot || snapshot.ownerId !== ownerId) {
        throw new Error(`Cannot save hub snapshot for a different owner`);
      }
      storage.setItem(storageKey(ownerId), JSON.stringify(snapshot));
    },
    clear() {
      storage.removeItem(storageKey(ownerId));
    },
  };
}

export function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}
