# Hatcher Game Architecture

## Direction

Hatcher Markets is a browser-based 2D/isometric economy game. The playable world is a shared Hatcher City surface with one common Market Tower; every player enters that shared tower and loads their own private operating hub inside it.

The game is not a DeFi dashboard and not an AI task marketplace. Player-facing copy should stay game-first: agents, hubs, contracts, Brain Cores, market boards, districts, seasons, cosmetics, and city events.

## Product Rules

- `HATCHER` is utility/cosmetic only for the first public alpha.
- Core progression must work with off-chain game credits and resources.
- No guaranteed-return, staking-yield, or real-investment framing in game UI.
- Progress is permanent during alpha, but alpha economies may be reset before the final launch.
- Cosmetics, founder badges, and account identity can survive an economy reset.

## Core Loop

1. Enter the shared city map.
2. Open the common Hatcher Market Tower.
3. Enter a private hub instance.
4. Hatch and upgrade agents.
5. Assign agents to hub stations and city contracts.
6. Produce resources such as Signal Credits, Compute Slots, Agent Leads, Brain Fragments, and Core Shards.
7. Run contracts and market orders through the shared market.
8. Spend credits and resources on station upgrades, Brain Cores, crafting, cosmetics, and district unlocks.
9. Compete on season and permanent leaderboards.

## Runtime Boundaries

- `src/shared-market.js` owns deterministic market simulation rules.
- `src/shared-market-client.js` owns local-preview and future remote-backend market intents.
- `src/shared-market-storage.js` owns local persistence for preview play.
- `src/multiplayer.js` owns common city/HQ snapshots and private hub routing.
- `src/ui/multiplayer-shell.js` owns the DOM/canvas shell around the city and HQ surfaces.
- `src/ui/isometric-city-surface.js` owns the rendered isometric city scene, camera, hotspots, and motion.
- `src/game.js`, `src/simulation.js`, `src/economy.js`, `src/progression.js`, and adjacent modules own private hub simulation.

The renderer is not the source of truth for gameplay. Simulation state, market state, saves, and future backend snapshots must remain serializable.

## Multiplayer Model

The current repo keeps a local adapter so preview play works without services. The production architecture should use:

- Public frontend: this `hatcher-game` Vite app.
- Private backend: Node/TypeScript API with Postgres and Socket.IO.
- Server-authoritative economy: clients send intents, not direct state mutations.
- Event log: every market-impacting action is append-only and replayable.
- Snapshot table: periodically materialized market and leaderboard state for fast reads.

Client intents:

- `market-pulse`: requests a simulated trading pulse for the player's hub.
- `run-contract`: completes a valid open contract for the player.
- `place-order`: buys or sells a resource against the shared market.
- `craft-core`: consumes resources to create or upgrade a Brain Core.
- `buy-cosmetic`: consumes off-chain credits or optional HATCHER utility to unlock a cosmetic.

## Economy Model

The economy is built as value chains, not as raw number inflation.

- Sources: contract payouts, agent work, city events, district claims, season objectives.
- Transforms: Brain Core crafting, station upgrades, contract quality, resource conversion, market orders.
- Sinks: upgrades, upkeep, market fees, failed contract penalties, crafting costs, insurance, cosmetics, season entry fees.
- Balancers: soft caps, diminishing returns, resource-specific volatility, contract expiry, district events, market taxes.

The shared market should expose readable game metrics: open contracts, resource prices, trends, leaderboard score, and city reputation. It should not expose financial-investment language.

## HATCHER Utility Policy

`HATCHER` can unlock or craft:

- agent skins
- hub decorations
- city profile frames
- founder badges
- cosmetic titles
- optional season vanity passes

`HATCHER` must not be required for:

- basic agent hatching
- core progression
- basic market access
- contract completion
- leaderboard eligibility

On-chain writes should wait until the off-chain game loop is stable. The first wallet integration should be read-only balance/identity plus cosmetic entitlement checks.

## Alpha Reset Model

Alpha progress is permanent from the player's perspective until an explicit reset. The backend should keep an `alpha_reset_epoch` and scope resettable tables by epoch.

Resettable:

- hub saves
- off-chain credits
- resource inventory
- market score
- active contracts
- season leaderboard entries

Preserved:

- account identity
- accepted terms/version
- founder badge flags
- cosmetic entitlements
- wallet binding
- moderation/account safety records

## Validation

- Unit-test deterministic market rules and client adapters with Node test.
- Browser-smoke city, HQ, private hub, contract run, mobile layout, and canvas pixels.
- Replay backend event logs into snapshots and compare deterministic outputs.
- Load-test market ticks and Socket.IO presence before public alpha.
- Run `npm test`, `npm run build`, `git diff --check`, and the local CDP smoke before claiming a playable milestone.
