# Hatcher Game Architecture

## Direction

Hatcher Markets is a browser economy game. The first playable loop is:

1. Extract resources from map sites.
2. Watch exchange prices move through market ticks.
3. Sell inventory for credits.
4. Upgrade rigs and complete contracts.
5. Use completed contracts to install Brain Cores and unlock stronger demand.

## Boundaries

- Simulation state owns inventory, credits, rigs, Brain Cores, market prices, ticks, and news.
- Phaser owns the canvas map, camera, visual refresh, and sprite/shape rendering.
- DOM owns market tables, inventory, actions, and readable text.
- Future backend services should expose market snapshots, saves, wallet ownership, and anti-abuse checks.

## Near-term modules

- `src/game/state.ts`: saveable state and reducers.
- `src/game/economy.ts`: price ticks, volatility, news, contract generation.
- `src/game/scenes/MarketScene.ts`: Phaser map renderer.
- `src/ui/hud.ts`: DOM binding for market/inventory/actions.
- `src/assets/manifest.ts`: stable asset keys.

The first commit keeps this in `src/main.ts` to establish the baseline quickly. Split modules once the first loop is validated.
