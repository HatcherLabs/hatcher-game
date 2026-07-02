import { createCommonCityState, createHqSnapshot, getPrivateHubRoute } from '../multiplayer.js';
import { createSharedMarketClient } from '../shared-market-client.js';
import {
  createCityCamera,
  createHatcherCityScene,
  drawHatcherCitySurface,
  getCityCameraBounds,
  HATCHER_CITY_ASSETS,
  loadCityAssets,
  panCityCamera,
  resetCityCamera,
} from './isometric-city-surface.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatValue(row, valueKey) {
  const value = row[valueKey] ?? row.trend ?? row.difficulty ?? '';
  if ((valueKey === 'price' || valueKey === 'reward') && typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  }
  return value;
}

function renderRows(rows, valueKey = 'value') {
  return rows.map(row => `
    <div class="mp-row">
      <strong>${escapeHtml(row.name || row.item || row.title)}</strong>
      <span>${escapeHtml(formatValue(row, valueKey))}</span>
    </div>
  `).join('');
}

function formatFounderCount(count = 1) {
  const value = Math.max(1, Number(count) || 1);
  return `${value} ${value === 1 ? 'Founder' : 'Founders'}`;
}

function createBrowserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch (_err) {
    return null;
  }
}

function renderWorldShell({ mode, profile, eyebrow, canvasLabel, status, dock, drawer = '', founderCount = 1 }) {
  return `
    <div class="mp-world" data-world-mode="${escapeHtml(mode)}">
      <div class="mp-city-stage" data-city-mode="${escapeHtml(mode)}">
        <canvas class="mp-city-canvas" aria-label="${escapeHtml(canvasLabel)}" tabindex="0"></canvas>
      </div>
      <header class="mp-hud">
        <div class="mp-hud-brand">Hatcher City <span>${escapeHtml(eyebrow)}</span></div>
        <div class="mp-hud-status">
          <span>${escapeHtml(formatFounderCount(founderCount))}</span>
          <span>${escapeHtml(profile.name)}</span>
        </div>
      </header>
      <div class="mp-map-prompt">${escapeHtml(status)}</div>
      <nav class="mp-action-dock" aria-label="Hatcher City actions">
        ${dock}
      </nav>
      ${drawer}
    </div>
  `;
}

export function renderCityGameSurface({ city, profile }) {
  return renderWorldShell({
    mode: 'city',
    profile,
    founderCount: city.onlineCount,
    eyebrow: 'Shared Map',
    canvasLabel: 'Hatcher City common HQ map',
    status: 'Market Tower Open',
    dock: `
      <button class="mp-action primary" data-action="open-hq">Enter Tower</button>
      <button class="mp-action" data-action="enter-hub">My Hub</button>
      <button class="mp-action" data-action="market-pulse" type="button">Trade Pulse</button>
      <button class="mp-action" data-action="center-city" type="button">Center Map</button>
    `,
    drawer: `
      <div class="mp-world-tag">
        <strong>${escapeHtml(city.buildings[0].name)}</strong>
        <span>${escapeHtml(city.economy?.summary || 'One shared HQ. Private hubs load inside.')}</span>
      </div>
    `,
  });
}

export function renderHqGameSurface({ hq, profile }) {
  return renderWorldShell({
    mode: 'hq',
    profile,
    founderCount: hq.onlineCount,
    eyebrow: 'Market Tower',
    canvasLabel: 'Hatcher Market Tower entrance',
    status: 'HQ Board Open',
    dock: `
      <button class="mp-action primary" data-action="enter-hub">Enter My Hub</button>
      <button class="mp-action" data-action="run-contract" type="button">Run Contract</button>
      <button class="mp-action" data-action="show-city">Back to City</button>
      <button class="mp-action" data-action="reset-hub">Reset Hub</button>
    `,
    drawer: `
      <section class="mp-drawer" aria-label="Market Board">
        <div class="mp-kicker">HQ Terminal</div>
        <div class="mp-title">Market Board</div>
        <div class="mp-copy">${escapeHtml(hq.economy?.summary || 'Shared market online')}</div>
        <div class="mp-drawer-grid">
          <div>
            <div class="mp-section-title">Market</div>
            <div class="mp-feed">${renderRows(hq.market, 'price')}</div>
          </div>
          <div>
            <div class="mp-section-title">Contracts</div>
            <div class="mp-feed">${renderRows(hq.contracts, 'reward')}</div>
          </div>
        </div>
      </section>
    `,
  });
}

export function initMultiplayerShell({
  root,
  player,
  getHubLevel,
  marketClient,
  marketStorage,
  onEnterHub,
  onShowOverlay,
  onResetHub,
}) {
  if (!root) return null;

  const profile = {
    id: player?.id || 'local-player',
    name: player?.name || 'Founder',
  };
  const cityScene = createHatcherCityScene();
  const sharedMarketClient = marketClient || createSharedMarketClient({
    storage: marketStorage ? null : createBrowserStorage(),
    marketStorage,
    player: profile,
  });
  let sharedMarket = sharedMarketClient.getSnapshot();
  let activeCityCleanup = null;
  let cityAssets = null;
  let cityAssetsPromise = null;

  const show = (mode) => {
    if (onShowOverlay) onShowOverlay(mode);
    if (activeCityCleanup) {
      activeCityCleanup();
      activeCityCleanup = null;
    }
    root.className = 'mp-shell';
    root.innerHTML = mode === 'hq' ? renderHq() : renderCity();
    activeCityCleanup = mountCityCanvas(mode);
  };

  const hide = () => {
    if (activeCityCleanup) {
      activeCityCleanup();
      activeCityCleanup = null;
    }
    root.className = 'mp-shell hidden';
  };

  const ensureCityAssets = () => {
    if (cityAssets) return Promise.resolve(cityAssets);
    if (!cityAssetsPromise) {
      cityAssetsPromise = loadCityAssets(HATCHER_CITY_ASSETS).then((assets) => {
        cityAssets = assets;
        return cityAssets;
      });
    }
    return cityAssetsPromise;
  };

  const renderCity = () => {
    const city = createCommonCityState({ playerId: profile.id, playerName: profile.name, sharedMarket });

    return renderCityGameSurface({
      city,
      profile,
    });
  };

  const renderHq = () => {
    const hq = createHqSnapshot({
      playerId: profile.id,
      playerName: profile.name,
      hubLevel: getHubLevel ? getHubLevel() : 1,
      sharedMarket,
    });

    return renderHqGameSurface({
      hq,
      profile,
    });
  };

  const applyMarketIntent = (intent, nextMode) => {
    const result = sharedMarketClient.submitIntent(intent);
    if (result && typeof result.then === 'function') {
      result
        .then((snapshot) => {
          sharedMarket = snapshot;
          show(nextMode);
        })
        .catch(() => show(nextMode));
      return;
    }
    sharedMarket = result;
    show(nextMode);
  };

  const mountCityCanvas = (mode) => {
    const canvas = root.querySelector('.mp-city-canvas');
    if (!canvas) return null;

    let disposed = false;
    let latestHotspots = [];
    let resizeObserver = null;
    let camera = createCityCamera();
    let drag = null;
    let animationFrame = 0;
    let animationStartedAt = 0;
    let lastElapsedMs = 0;
    let activeHotspot = null;

    const updateMapPrompt = (hotspot = null) => {
      const prompt = root.querySelector('.mp-map-prompt');
      if (!prompt) return;
      activeHotspot = hotspot;
      prompt.textContent = hotspot ? `${hotspot.label}: ${hotspot.status}` : (mode === 'hq' ? 'HQ Board Open' : 'Market Tower Open');
      prompt.dataset.hotspot = hotspot?.id || hotspot?.action || '';
    };

    const paint = (assets = cityAssets || {}, elapsedMs = lastElapsedMs) => {
      if (disposed) return;
      lastElapsedMs = elapsedMs;
      const result = drawHatcherCitySurface(canvas, cityScene, assets, {
        mode,
        framing: 'cover',
        camera,
        elapsedMs,
        activeHotspotId: activeHotspot?.id || activeHotspot?.action || '',
      });
      latestHotspots = result.hotspots;
      canvas.dataset.rendered = 'true';
      canvas.dataset.assetState = cityAssets ? 'ready' : 'fallback';
      canvas.dataset.cameraX = String(Math.round(camera.x));
      canvas.dataset.cameraY = String(Math.round(camera.y));
      canvas.dataset.motionTick = String(Math.round(elapsedMs));
      if (activeHotspot) updateMapPrompt(latestHotspots.find(hotspot => hotspot.id === activeHotspot.id || hotspot.action === activeHotspot.action) || null);
    };

    const getBounds = () => getCityCameraBounds(cityScene, {
      width: canvas.clientWidth || canvas.width,
      height: canvas.clientHeight || canvas.height,
    });

    const findHotspot = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return latestHotspots.find((hotspot) => {
        const dx = x - hotspot.center.x;
        const dy = y - hotspot.center.y;
        return Math.sqrt(dx * dx + dy * dy) <= hotspot.radius;
      });
    };

    const panBy = (delta) => {
      camera = panCityCamera(camera, delta, getBounds());
      paint();
    };

    const animate = (timestamp) => {
      if (disposed) return;
      if (!animationStartedAt) animationStartedAt = timestamp;
      paint(cityAssets || {}, timestamp - animationStartedAt);
      animationFrame = requestAnimationFrame(animate);
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      canvas.focus({ preventScroll: true });
      drag = {
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
        distance: 0,
      };
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (event) => {
      if (drag && drag.pointerId === event.pointerId) {
        const dx = event.clientX - drag.lastX;
        const dy = event.clientY - drag.lastY;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.distance += Math.abs(dx) + Math.abs(dy);
        if (dx || dy) panBy({ x: dx, y: dy });
        return;
      }
      const hotspot = findHotspot(event);
      updateMapPrompt(hotspot || null);
      canvas.style.cursor = hotspot ? 'pointer' : 'grab';
    };

    const onPointerUp = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasDrag = drag.distance > 6;
      drag = null;
      canvas.releasePointerCapture?.(event.pointerId);
      const hoverHotspot = findHotspot(event);
      updateMapPrompt(hoverHotspot || null);
      canvas.style.cursor = hoverHotspot ? 'pointer' : 'grab';
      if (wasDrag) return;

      const hotspot = findHotspot(event);
      if (hotspot) {
        updateMapPrompt(hotspot);
        if (hotspot.action !== 'inspect-district') performAction(hotspot.action);
      }
    };

    const onPointerLeave = () => {
      if (!drag) {
        updateMapPrompt(null);
        canvas.style.cursor = 'grab';
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      panBy({
        x: -event.deltaX * 0.75,
        y: -event.deltaY * 0.75,
      });
    };

    const onKeyDown = (event) => {
      const step = event.shiftKey ? 72 : 36;
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        event.preventDefault();
        panBy({ x: step, y: 0 });
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        event.preventDefault();
        panBy({ x: -step, y: 0 });
      } else if (event.key === 'ArrowUp' || event.key === 'w') {
        event.preventDefault();
        panBy({ x: 0, y: step });
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        event.preventDefault();
        panBy({ x: 0, y: -step });
      } else if (event.key === 'Home' || event.key === '0') {
        event.preventDefault();
        camera = resetCityCamera();
        paint();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        performAction(mode === 'hq' ? 'enter-hub' : 'open-hq');
      }
    };

    paint();
    ensureCityAssets().then((assets) => paint(assets));
    animationFrame = requestAnimationFrame(animate);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('keydown', onKeyDown);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => paint());
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', paint);
    }

    return () => {
      disposed = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('keydown', onKeyDown);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', paint);
    };
  };

  const performAction = (action) => {
    if (action === 'show-city') {
      show('city');
      return;
    }
    if (action === 'open-hq') {
      show('hq');
      return;
    }
    if (action === 'center-city') {
      show('city');
      return;
    }
    if (action === 'market-pulse') {
      const hubLevel = getHubLevel ? getHubLevel() : 1;
      applyMarketIntent({
        type: 'market-pulse',
        hubLevel,
      }, 'city');
      return;
    }
    if (action === 'run-contract') {
      const hubLevel = getHubLevel ? getHubLevel() : 1;
      applyMarketIntent({
        type: 'run-contract',
        hubLevel,
      }, 'hq');
      return;
    }
    if (action === 'reset-hub') {
      if (onResetHub) onResetHub();
      show('hq');
      return;
    }
    if (action === 'enter-hub') {
      const route = getPrivateHubRoute(profile);
      hide();
      if (onEnterHub) onEnterHub(route);
    }
  };

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    performAction(button.dataset.action);
  });

  show('city');

  return {
    showCity: () => show('city'),
    showHq: () => show('hq'),
    hide,
  };
}
