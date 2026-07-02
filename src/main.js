// ═══════════════════════════════════════════════════════════════
//  HATCHER MARKETS — Agent economy tycoon
//  Entry point: imports, init, game loop
// ═══════════════════════════════════════════════════════════════

import { ECONOMY, COMPANY_TYPES, OFFICE_TYPES, COMMON_ROOMS, TILE_W, TILE_H } from './config.js';
import { initEngine, setClickHandler, setBuildDragCallbacks, smoothZoom, toScreen, toTile, getZoom, setCam } from './engine.js';
import { placeRoom, addCorridor, refreshDoors, getRoomInstances, loadMapState, serializeMapState } from './map.js';
import {
  initFloorPlan, pickRandomPlan, getActivePlan,
  getAllExpansions, isExpansionAvailable, isExpansionPurchased, purchaseExpansion,
} from './floorplan.js';
import { G, trackEvent } from './game.js';
import { applyGameStateSnapshot, createHubSnapshot, serializeGameState } from './hub-save.js';
import { createHubStorage } from './hub-storage.js';
import { Agent } from './agent.js';
import { simulationTick } from './simulation.js';
import { render, updateHover } from './renderer/index.js';
import { initMinimap, drawMinimap } from './renderer/minimap.js';
import { initPanels, selectAgent, deselectAgent, updateUI } from './ui/panels.js';
import { initSpeedControls, initKeyboard, setSpeed } from './ui/speed.js';
import { initBuildPanel, toggleBuildPanel, renderBuildPanel, setBuildPanelMode } from './ui/build-panel.js';
import { showEquipmentPanel, hideEquipmentPanel } from './ui/equipment-panel.js';
import { initCashflowGraph, updateCashflowGraph } from './ui/cashflow-graph.js';
import { initFloatingChartPanel } from './ui/floating-chart.js';
import { initStrategyPanel, updateStrategyPanel } from './ui/strategy-panel.js';
import { initIntro, showLevelIntro, hideIntro } from './ui/intro.js';
import { handleBuildClick, handleBuildMouseDown, handleBuildMouseMove, handleBuildMouseUp, setSelectedRoomType, setCorridorMode, isCorridorMode, cycleRotation, resetRotation } from './build-mode.js';
import { initAudio, toggleMusic } from './audio.js';
import { resumeAudioCtx, sfxClick } from './sfx.js';
import { showToast } from './ui/toast.js';
import { initHudPopovers } from './ui/hud-popover.js';
import { aiCeoTick, toggleAiCeo, enableAiCeo } from './ai-ceo.js';
import { initMultiplayerShell } from './ui/multiplayer-shell.js';

// roundRect polyfill
const ctx = document.getElementById('game').getContext('2d');
if (!ctx.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = [r,r,r,r];
    this.moveTo(x + r[0], y);
    this.lineTo(x + w - r[1], y);
    this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
    this.lineTo(x + w, y + h - r[2]);
    this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
    this.lineTo(x + r[3], y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
    this.lineTo(x, y + r[0]);
    this.quadraticCurveTo(x, y, x + r[0], y);
    this.closePath();
  };
}

// ─── Initialize ────────────────────────────────────────────
initEngine();
initMinimap();
initPanels();
initSpeedControls();
initBuildPanel();
initCashflowGraph();
initFloatingChartPanel();
initStrategyPanel();
initIntro();
initAudio();
initHudPopovers();

// ─── Corridor drag painting callbacks ───────────────────────
setBuildDragCallbacks({
  shouldCapture: () => G.buildMode && isCorridorMode(),
  onDown: (sx, sy) => handleBuildMouseDown(sx, sy),
  onMove: (sx, sy) => handleBuildMouseMove(sx, sy),
  onUp: () => handleBuildMouseUp(),
});

// ─── Floor Plan + Starting Layout ────────────────────────────
const planKey = pickRandomPlan();
const plan = initFloorPlan(planKey);
console.log(`Floor plan: ${plan.name}`);

// Place lobby at plan-specified position
const lp = plan.lobbyPos;
placeRoom('lobby', lp.x, lp.y, 5, 3);

const focusLobbyCamera = () => {
  const lobby = getRoomInstances().find(room => room.typeKey === 'lobby');
  const panelWidth = window.innerWidth >= 900 ? 360 : 0;
  const targetX = (window.innerWidth - panelWidth) * 0.54;
  const targetY = window.innerHeight * 0.46;
  const tx = lobby ? lobby.x + lobby.w / 2 : lp.x + 2.5;
  const ty = lobby ? lobby.y + lobby.h / 2 : lp.y + 1.5;
  setCam(
    targetX - ((tx - ty) * (TILE_W / 2)),
    targetY - ((tx + ty) * (TILE_H / 2))
  );
};
focusLobbyCamera();

// Main horizontal corridor
for (let x = plan.corridorX[0]; x < plan.corridorX[1]; x++) {
  addCorridor(x, plan.corridorY);
  addCorridor(x, plan.corridorY - 1);
}

// Entrance corridor connecting lobby to main corridor
const lobbyMidX = lp.x + 2;
const minY = Math.min(plan.corridorY - 1, lp.y);
const maxY = Math.max(plan.corridorY, lp.y + 3);
for (let y = minY; y <= maxY; y++) {
  addCorridor(lobbyMidX, y);
  addCorridor(lobbyMidX + 1, y);
}

// Extra corridors for plans that need them (e.g. U-shape)
if (plan.extraCorridors) {
  for (const seg of plan.extraCorridors) {
    for (let x = seg.x1; x <= seg.x2; x++) {
      addCorridor(x, seg.y);
      addCorridor(x, seg.y - 1);
    }
  }
}

// ─── Company Picker Modal ─────────────────────────────────
G.gameSpeed = 0; // Pause until company + mission dismissed
let selectedCompanyType = null;
const pickerModal = document.getElementById('company-picker-modal');
const pickerGrid = document.getElementById('company-picker-grid');
const pickerBtn = document.getElementById('company-start-btn');
const localPlayer = { id: 'local-founder', name: 'Founder' };
const hubStorage = createHubStorage({ storage: window.localStorage, ownerId: localPlayer.id });

function getHubLevel() {
  const roomScore = Math.floor(getRoomInstances().length / 3);
  const yieldScore = Math.floor(G.totalRevenue / 50000);
  return Math.max(1, roomScore + yieldScore + 1);
}

function saveCurrentHubSnapshot() {
  if (!G.companyType && !G.missionDismissed) return false;
  try {
    hubStorage.save(createHubSnapshot({
      ownerId: localPlayer.id,
      gameState: serializeGameState(G),
      mapState: serializeMapState(),
    }));
    return true;
  } catch (err) {
    console.warn('Unable to save local hub snapshot', err);
    return false;
  }
}

function loadPrivateHubSnapshot() {
  const snapshot = hubStorage.load();
  if (!snapshot) return false;

  applyGameStateSnapshot(G, snapshot.gameState);
  loadMapState(snapshot.mapState);
  pickerModal.style.display = 'none';
  missionModal.style.display = 'none';
  focusLobbyCamera();
  setSpeed(snapshot.gameState?.gameSpeed || 0.5);
  G.uiDirty = true;
  showToast('Private hub loaded from HQ');
  return true;
}

// Build company picker cards
if (pickerGrid) {
  const allRooms = { ...OFFICE_TYPES, ...COMMON_ROOMS };
  for (const [typeKey, typeDef] of Object.entries(COMPANY_TYPES)) {
    const officeIcons = typeDef.available.map(k => allRooms[k]?.icon || '').filter(Boolean).join('');
    const card = document.createElement('div');
    card.className = 'company-card';
    card.dataset.type = typeKey;
    card.innerHTML = `
      <div class="company-icon">${typeDef.icon}</div>
      <div class="company-name">${typeDef.name}</div>
      <div class="company-tagline">${typeDef.tagline}</div>
      <div class="company-offices">${typeDef.available.map(k => `<span title="${allRooms[k]?.name || k}">${allRooms[k]?.icon || ''}</span>`).join('')}</div>
    `;
    card.addEventListener('click', () => {
      sfxClick();
      pickerGrid.querySelectorAll('.company-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedCompanyType = typeKey;
      pickerBtn.disabled = false;
      pickerBtn.style.opacity = '1';
      pickerBtn.textContent = `Open ${typeDef.name} →`;
    });
    pickerGrid.appendChild(card);
  }
}

// ─── Mission Modal (shown first as welcome) ──────────────────────────────────
const missionModal = document.getElementById('mission-modal');
const missionBtn = document.getElementById('mission-start-btn');
if (missionBtn) {
  missionBtn.addEventListener('click', () => {
    resumeAudioCtx();
    sfxClick();
    // Hide welcome, show company picker
    missionModal.style.display = 'none';
    pickerModal.style.display = 'flex';
  });
}

// ─── Company Picker (shown after welcome) ─────────────────────────────────
if (pickerBtn) {
  pickerBtn.addEventListener('click', () => {
    if (!selectedCompanyType) return;
    resumeAudioCtx();
    sfxClick();

    // Apply company type
    G.companyType = selectedCompanyType;
    const companyDef = COMPANY_TYPES[selectedCompanyType];
    G.unlockedRooms = new Set(companyDef.startUnlocked);

    // Hide picker, start game
    pickerModal.style.display = 'none';
    setSpeed(0.5);
    G.missionDismissed = true;
    trackEvent('game-start', { company: G.companyType });

    // Spawn founder steward
    const ceoLp = getActivePlan()?.lobbyPos || { x: 10, y: 18 };
    const ceo = new Agent('ceo', ceoLp.x + 2, ceoLp.y + 1);
    ceo.name = startWithAiCeo ? 'Auto Steward' : 'You';
    ceo.mood = 0.9;
    ceo.skill = 0.5;
    ceo.alignment = 1.0; // Founder steward always knows the vision
    G.agents.push(ceo);
    G.ceo = ceo;

    if (startWithAiCeo) {
      setSpeed(1);
      enableAiCeo();
      if (aiCeoBtn) {
        aiCeoBtn.style.background = 'linear-gradient(135deg, rgba(60,120,200,0.3), rgba(40,80,160,0.4))';
        aiCeoBtn.style.color = '#80c0ff';
        aiCeoBtn.style.borderColor = 'rgba(100,180,255,0.4)';
      }
    }

    saveCurrentHubSnapshot();
  });
}

// ─── Expansion purchase popup ────────────────────────────────
function showExpansionPopup(exp, sx, sy) {
  // Remove any existing popup
  const old = document.getElementById('expansion-popup');
  if (old) old.remove();

  const canAfford = G.money >= exp.cost;
  const popup = document.createElement('div');
  popup.id = 'expansion-popup';
  popup.style.cssText = `
    position: fixed; left: ${sx}px; top: ${sy - 10}px; transform: translate(-50%, -100%);
    background: rgba(20,17,22,0.97); border: 1px solid rgba(240,160,80,0.4);
    border-radius: 12px; padding: 16px 20px; z-index: 40; text-align: center;
    min-width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    font-family: system-ui; color: #f0d0a0;
  `;
  popup.innerHTML = `
    <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">🗺️ ${exp.name}</div>
    <div style="font-size: 11px; color: #a08870; margin-bottom: 10px;">${exp.w}×${exp.h} tiles of new land</div>
    <div style="font-size: 18px; font-weight: 800; margin-bottom: 12px; color: ${canAfford ? '#50c878' : '#e05050'}">
      $${exp.cost.toLocaleString()}
    </div>
    <div style="display: flex; gap: 8px; justify-content: center;">
      <button id="exp-buy-btn" ${canAfford ? '' : 'disabled'} style="
        padding: 8px 20px; border-radius: 8px; border: none; cursor: ${canAfford ? 'pointer' : 'not-allowed'};
        background: ${canAfford ? 'linear-gradient(135deg, #e07030, #c05020)' : '#333'};
        color: ${canAfford ? 'white' : '#666'}; font-size: 13px; font-weight: 700;
      ">Buy Land</button>
      <button id="exp-cancel-btn" style="
        padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(240,160,80,0.2);
        background: transparent; color: #a08870; font-size: 13px; cursor: pointer;
      ">Cancel</button>
    </div>
    ${!canAfford ? '<div style="font-size: 10px; color: #e05050; margin-top: 8px;">Not enough funds</div>' : ''}
  `;
  document.body.appendChild(popup);

  const buyBtn = document.getElementById('exp-buy-btn');
  const cancelBtn = document.getElementById('exp-cancel-btn');

  if (buyBtn && canAfford) {
    buyBtn.addEventListener('click', () => {
      sfxClick();
      G.money -= exp.cost;
      purchaseExpansion(exp.id);

      // Auto-build corridors through the new land
      const midY = exp.y + Math.floor(exp.h / 2);
      for (let x = exp.x; x < exp.x + exp.w; x++) {
        addCorridor(x, midY);
        addCorridor(x, midY - 1);
      }

      sfxClick();
      showToast(`Expanded: ${exp.name}! -$${exp.cost.toLocaleString()}`);
      G.uiDirty = true;
      popup.remove();
    });
  }

  cancelBtn.addEventListener('click', () => {
    sfxClick();
    popup.remove();
  });

  // Close on click outside
  setTimeout(() => {
    const closer = (e) => {
      if (!popup.contains(e.target)) {
        popup.remove();
        document.removeEventListener('mousedown', closer);
      }
    };
    document.addEventListener('mousedown', closer);
  }, 100);
}

function hitTestExpansion(sx, sy) {
  const { tx, ty } = toTile(sx, sy);
  for (const exp of getAllExpansions()) {
    if (isExpansionPurchased(exp.id)) continue;
    if (!isExpansionAvailable(exp)) continue;
    if (tx >= exp.x && tx < exp.x + exp.w && ty >= exp.y && ty < exp.y + exp.h) {
      return exp;
    }
  }
  return null;
}

// ─── Click handler ─────────────────────────────────────────
setClickHandler((sx, sy) => {
  // Close any open expansion popup
  const existingPopup = document.getElementById('expansion-popup');
  if (existingPopup) { existingPopup.remove(); return; }

  // Build mode takes priority
  if (G.buildMode && handleBuildClick(sx, sy)) {
    renderBuildPanel();
    return;
  }

  // Check expansion zone clicks
  const hitExp = hitTestExpansion(sx, sy);
  if (hitExp) {
    showExpansionPopup(hitExp, sx, sy);
    return;
  }

  // Check interactive furniture clicks
  if (G._hoveredFurniture) {
    const { furniture, room } = G._hoveredFurniture;
    showEquipmentPanel(furniture, room);
    return;
  }

  // Check agent clicks
  const zoom = getZoom();
  for (const agent of G.agents) {
    const s = toScreen(agent.x, agent.y);
    const dx = sx - s.x, dy = sy - (s.y - 10 * zoom);
    if (Math.abs(dx) < 14 * zoom && Math.abs(dy) < 20 * zoom) {
      selectAgent(agent);
      return;
    }
  }

  // Clicked empty space
  deselectAgent();
  hideEquipmentPanel();
});

// ─── Keyboard ──────────────────────────────────────────────
initKeyboard({
  onDeselect: deselectAgent,
  onBuildModeToggle: () => {
    setBuildPanelMode('build');
    toggleBuildPanel(G.buildMode);
    if (!G.buildMode) { setSelectedRoomType(null); setCorridorMode(false); resetRotation(); }
    const hireBtn = document.getElementById('hire-btn');
    if (hireBtn) hireBtn.classList.remove('active');
    const buildButton = document.getElementById('build-btn');
    if (buildButton) buildButton.classList.toggle('active', G.buildMode);
    renderBuildPanel();
  },
  onBuildModeExit: () => {
    toggleBuildPanel(false);
    setSelectedRoomType(null);
    setCorridorMode(false);
    resetRotation();
    setBuildPanelMode('build');
    const buildButton = document.getElementById('build-btn');
    if (buildButton) buildButton.classList.remove('active');
    const hireBtn = document.getElementById('hire-btn');
    if (hireBtn) hireBtn.classList.remove('active');
  },
  onRotate: () => {
    cycleRotation();
  },
  onHireModeToggle: () => {
    const panel = document.getElementById('build-panel');
    const hireButton = document.getElementById('hire-btn');
    const buildButton = document.getElementById('build-btn');
    const alreadyOpenForHire = panel?.classList.contains('visible') && hireButton?.classList.contains('active');
    const willShow = !alreadyOpenForHire;

    setBuildPanelMode('hire');
    G.buildMode = false;
    setSelectedRoomType(null);
    toggleBuildPanel(willShow);

    if (hireButton) hireButton.classList.toggle('active', willShow);
    if (buildButton) buildButton.classList.remove('active');
    renderBuildPanel();
  },
});

// ─── Build button ──────────────────────────────────────────
const buildBtn = document.getElementById('build-btn');
if (buildBtn) {
  buildBtn.addEventListener('click', () => {
    sfxClick();
    setBuildPanelMode('build');
    G.buildMode = !G.buildMode;
    toggleBuildPanel(G.buildMode);
    if (!G.buildMode) { setSelectedRoomType(null); setCorridorMode(false); }
    buildBtn.classList.toggle('active', G.buildMode);
    const hireBtn = document.getElementById('hire-btn');
    if (hireBtn) hireBtn.classList.remove('active');
    renderBuildPanel();
  });
}

const hireBtn = document.getElementById('hire-btn');
if (hireBtn) {
  hireBtn.addEventListener('click', () => {
    sfxClick();
    const panel = document.getElementById('build-panel');
    const alreadyOpenForHire = panel?.classList.contains('visible') && hireBtn.classList.contains('active');
    const willShow = !alreadyOpenForHire;

    setBuildPanelMode('hire');
    G.buildMode = false;
    setSelectedRoomType(null);
    toggleBuildPanel(willShow);

    hireBtn.classList.toggle('active', willShow);
    if (buildBtn) buildBtn.classList.remove('active');
    renderBuildPanel();
  });
}

// Agent panel close
const closeBtn = document.querySelector('#agent-panel .btn-close');
if (closeBtn) closeBtn.addEventListener('click', deselectAgent);

// Music toggle
const musicBtn = document.getElementById('music-btn');
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    resumeAudioCtx();
    const playing = toggleMusic();
    musicBtn.textContent = playing ? '🎵' : '🔇';
  });
}

const levelIntro = document.getElementById('level-intro');
if (levelIntro) levelIntro.addEventListener('click', hideIntro);

// ─── AI CEO button (in-game toggle) ────────────────────
const aiCeoBtn = document.getElementById('ai-ceo-btn');
if (aiCeoBtn) {
  aiCeoBtn.addEventListener('click', () => {
    sfxClick();
    const enabled = toggleAiCeo();
    aiCeoBtn.style.background = enabled ? 'linear-gradient(135deg, rgba(60,120,200,0.3), rgba(40,80,160,0.4))' : 'transparent';
    aiCeoBtn.style.color = enabled ? '#80c0ff' : 'var(--text-dim)';
    aiCeoBtn.style.borderColor = enabled ? 'rgba(100,180,255,0.4)' : 'var(--border)';
  });
}

// ─── AI CEO button in mission modal ────────────────────
let startWithAiCeo = false;
const missionAiBtn = document.getElementById('mission-ai-btn');
if (missionAiBtn) {
  missionAiBtn.addEventListener('click', () => {
    resumeAudioCtx();
    sfxClick();
    startWithAiCeo = true;
    // Hide welcome, show company picker
    missionModal.style.display = 'none';
    pickerModal.style.display = 'flex';
  });
}

const multiplayerShell = initMultiplayerShell({
  root: document.getElementById('multiplayer-shell'),
  player: localPlayer,
  getHubLevel,
  onShowOverlay: () => {
    saveCurrentHubSnapshot();
    setSpeed(0);
  },
  onEnterHub: () => {
    const loaded = loadPrivateHubSnapshot();
    if (!loaded) {
      missionModal.style.display = 'flex';
      pickerModal.style.display = 'none';
      setSpeed(0);
    }
  },
  onResetHub: () => {
    hubStorage.clear();
    showToast('Local hub save cleared');
  },
});

const cityBtn = document.getElementById('city-btn');
if (cityBtn && multiplayerShell) {
  cityBtn.addEventListener('click', () => {
    saveCurrentHubSnapshot();
    multiplayerShell.showHq();
  });
}

// ─── Restart Handler ──────────────────────────────────────
window.addEventListener('studio-tycoon-restart', () => {
  // Reset game state
  G.reset();

  // Re-init map (need to reimport these)
  // For now, just reload the page for a clean restart
  window.location.reload();
});

// ─── Game Loop ─────────────────────────────────────────────
let lastTime = 0;
let uiCounter = 0;

function gameLoop(time) {
  const rawDt = Math.min((time - lastTime) / 16.67, 4);
  lastTime = time;
  const dt = rawDt * G.gameSpeed;
  G.gameTick += dt;
  G.frameCount++;

  // Smooth zoom
  smoothZoom();

  // Simulation
  simulationTick(dt);

  // Auto Steward autonomous play (pass rawDt so it works even when paused for events)
  aiCeoTick(dt || rawDt);

  // Hover detection
  updateHover();

  // Render
  render();

  // UI updates (throttled)
  uiCounter++;
  if (uiCounter % 20 === 0) {
    updateUI();
    updateStrategyPanel();
    updateCashflowGraph();
    if (uiCounter % 600 === 0) saveCurrentHubSnapshot();
    // Refresh build panel affordability
    if (uiCounter % 60 === 0) {
      const panel = document.getElementById('build-panel');
      if (panel?.classList.contains('visible')) renderBuildPanel();
    }
  }
  if (uiCounter % 30 === 0) drawMinimap();

  requestAnimationFrame(gameLoop);
}

// ─── Start ─────────────────────────────────────────────────
updateUI();
updateStrategyPanel();
requestAnimationFrame(gameLoop);

console.log('🥚 Hatcher Markets loaded');
console.log('B = Build mode | C = Corridor tool | R = Rotate | Drag = Pan | Scroll = Zoom');
