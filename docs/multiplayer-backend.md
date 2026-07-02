# Hatcher Multiplayer Backend Contract

## Goal

Move shared economy authority out of the browser while keeping the current local preview path intact. The frontend should continue to work through `createLocalSharedMarketClient`; production can swap to `createRemoteSharedMarketClient` once the private API exists.

## Recommended Stack

- Node.js and TypeScript
- Postgres for durable saves, market events, snapshots, and alpha epochs
- Socket.IO for city presence, market updates, and leaderboard broadcasts
- HTTP for authenticated commands and initial snapshot fetches

## Authority Model

The backend owns credits, inventory, market prices, contracts, score, cosmetics, and reset epochs. The browser sends intents:

```json
{
  "playerId": "player-a",
  "intent": {
    "type": "run-contract",
    "contractId": "seed-audit"
  }
}
```

The server validates the player, current alpha epoch, contract status, resource costs, cooldowns, and anti-abuse limits. If valid, it appends a market event and emits a new snapshot.

## HTTP Endpoints

### `GET /v1/market/snapshot?playerId=:id`

Returns the latest shared market snapshot visible to the player.

```json
{
  "market": {
    "version": 1,
    "tick": 12,
    "players": [],
    "resources": [],
    "contracts": [],
    "cityPool": {},
    "ledger": []
  }
}
```

### `POST /v1/market/intents`

Accepts a server-authoritative market intent and returns the updated snapshot.

Supported alpha intents:

- `market-pulse`
- `run-contract`
- `place-order`
- `craft-core`
- `buy-cosmetic`

### `GET /v1/hubs/:ownerId`

Returns the active private hub save for the current alpha epoch.

### `PUT /v1/hubs/:ownerId`

Stores a validated private hub snapshot. The server rejects saves from another owner or another alpha epoch.

### `GET /v1/alpha/status`

Returns the current alpha epoch, reset notice, and preservation policy.

## Socket.IO Events

Client emits:

- `city:join` with `playerId`
- `city:leave`
- `market:intent` with the same body as `POST /v1/market/intents`

Server emits:

- `city:presence` with online counts and nearby player summaries
- `market:snapshot` after accepted market events
- `leaderboard:snapshot` after score changes
- `alpha:status` when reset policy or epoch changes

## Persistence

Use `docs/multiplayer-schema.sql` as the first schema draft. Keep the event log append-only. Snapshots can be rebuilt from events if market rules change during alpha, but old snapshot rows should keep their rule version for audit.

## Client Migration Path

1. Keep `createLocalSharedMarketClient` as the local preview fallback.
2. Add an environment flag for the API endpoint.
3. Instantiate `createRemoteSharedMarketClient` only when the endpoint is present and the user has a session.
4. Keep city/HQ rendering driven by the same market snapshot shape.
5. Add reconnect behavior: fetch latest snapshot, then resubscribe to Socket.IO events.

## Alpha Reset Policy

Progress is treated as permanent during alpha. If the economy is reset before final launch, the backend increments `alpha_epochs.id` and creates fresh hub/market state. Cosmetic entitlements and founder identity remain outside resettable state.
