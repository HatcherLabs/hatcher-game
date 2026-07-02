import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommonCityState, createHqSnapshot } from '../multiplayer.js';
import { renderCityGameSurface, renderHqGameSurface } from './multiplayer-shell.js';

test('city entry renders as a game map with HUD and no dashboard sidebar', () => {
  const city = createCommonCityState({ playerId: 'player-a', playerName: 'Cristian' });
  const html = renderCityGameSurface({
    city,
    profile: { id: 'player-a', name: 'Cristian' },
  });

  assert.match(html, /mp-world/);
  assert.match(html, /mp-city-canvas/);
  assert.match(html, /mp-hud/);
  assert.match(html, /mp-action-dock/);
  assert.match(html, /data-action="center-city"/);
  assert.match(html, /data-action="market-pulse"/);
  assert.match(html, /Shared market/);
  assert.match(html, /1 Founder/);
  assert.doesNotMatch(html, /Market Live/);
  assert.doesNotMatch(html, /mp-side/);
  assert.doesNotMatch(html, /District Signals/);
});

test('HQ board is contextual overlay content instead of a persistent right panel', () => {
  const hq = createHqSnapshot({ playerId: 'player-a', playerName: 'Cristian', hubLevel: 3 });
  const html = renderHqGameSurface({
    hq,
    profile: { id: 'player-a', name: 'Cristian' },
  });

  assert.match(html, /mp-world/);
  assert.match(html, /mp-drawer/);
  assert.match(html, /Market Board/);
  assert.match(html, /data-action="run-contract"/);
  assert.match(html, /Run Contract/);
  assert.match(html, /Shared market/);
  assert.match(html, /Signal Credits/);
  assert.doesNotMatch(html, /mp-side/);
});
