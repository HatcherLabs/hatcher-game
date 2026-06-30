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
  - Result: static reference only.
  - Useful parts: simple isometric city builder concept and Kenney texture attribution.

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

## Initial reuse decision

Use a clean Phaser 3 + TypeScript + Vite frontend. Keep simulation state outside the renderer and use DOM panels for dense HUD/market text.

Start with:

- Phaser/Vite runtime shape inspired by the farming/mining candidates.
- Hatcher-specific resource names and market verbs.
- Original lightweight market tick simulation in TypeScript.
- No copied third-party assets in the first baseline.

