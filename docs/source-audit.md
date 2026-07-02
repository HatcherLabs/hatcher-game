# Source Audit

This repository starts as original Hatcher Markets code, with selected ideas taken from open-source references rather than a wholesale fork.

## Candidate repos checked

- `zippy-ux/pixel-farm-valley`
  - License: MIT.
  - Stack: Phaser 3, TypeScript, Vite, Solana wallet packages.
  - Result: builds with pnpm when dependency build scripts are allowed.
  - Useful parts: mine -> inventory -> market -> wallet flow and Solana-oriented product framing.
  - Risk: wallet/appkit dependencies create a large bundle. Reuse selectively.

- `goncalojbsousa/Farming-Simulator-Cabacos`
  - License: MIT.
  - Stack: Phaser 3, TypeScript, Vite, Tiled.
  - Result: `npm ci` and `npm run build-nolog` pass.
  - Useful parts: clean game module layout, inventory, shops, crop market, save/time/services pattern.

- `amilich/isometric-city`
  - License: MIT.
  - Stack: Next.js, TypeScript, HTML5 canvas.
  - Result: `npm ci` and `npm run build` pass.
  - Useful parts: isometric city composition, traffic/resource simulation ideas, mobile toolbar approach.
  - Risk: React/Next architecture is heavier than the Phaser game client.

- `victorqribeiro/isocity`
  - License: MIT.
  - Stack: plain JavaScript.
  - Result: adapted into the Phaser prototype as runtime-built isometric city tiles.
  - Useful parts: simple isometric city builder concept, grid projection, and Kenney texture attribution.

- `Jackson-Wozniak/Stock-Market-Simulation`
  - License: MIT.
  - Stack: Java Spring service plus Vite frontend.
  - Result: static audit only.
  - Useful parts: market ticks, price volatility, bull/bear sentiment, news events, index/fund concepts.

- `cxong/PepperTown`
  - Code license: MIT.
  - Asset licenses: mixed Creative Commons, including share-alike and non-commercial audio.
  - Result: reference only; do not copy assets.
  - Useful parts: idle/RPG loop inspiration.

## Current reuse decision

The active baseline is now a Hatcher-themed adaptation of `TeamDay-AI/business-tycoon`.

- License: MIT.
- Local audit copy: `/home/cristian/Projects/research/hatcher-game-source-audit-2/business-tycoon`.
- License text retained at `docs/business-tycoon-MIT-LICENSE.txt`.
- Stack: Vite plus plain JavaScript canvas renderer and DOM HUD panels.
- Useful parts: playable business tycoon loop, room building, agent hiring, mission pipeline, events, analytics, floating cashflow chart, minimap, and auto-manager behavior.
- Hatcher changes: player-facing copy now uses Hatcher Markets language: vault, agents, hatch cycles, market rooms, missions, yield, signal flow, Brain Cores, Treasury, Compliance Desk, and Auto Steward.
- Current map is the Business Tycoon floor-plan/corridor canvas. Treat it as the playable tycoon base; map art/layout can be replaced in the next iteration.
- City/HQ update: the multiplayer common-city entry surface now uses selected MIT building assets from `amilich/isometric-city` with a local canvas renderer. The Next/React app architecture was not copied.
