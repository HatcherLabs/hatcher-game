const ASSET_ROOT = '/assets/isometric-city/buildings';

export const HATCHER_CITY_ASSETS = {
  tower: `${ASSET_ROOT}/commercial.webp`,
  commercial: `${ASSET_ROOT}/commercial.webp`,
  university: `${ASSET_ROOT}/university.webp`,
  exchange: `${ASSET_ROOT}/shop_medium.webp`,
  park: `${ASSET_ROOT}/park_large.webp`,
  clinic: `${ASSET_ROOT}/hospital.webp`,
  residences: `${ASSET_ROOT}/residential.webp`,
  stadium: `${ASSET_ROOT}/stadium.webp`,
  trees: `${ASSET_ROOT}/trees.webp`,
  waterTower: `${ASSET_ROOT}/watertower.webp`,
  police: `${ASSET_ROOT}/police_station.webp`,
  fire: `${ASSET_ROOT}/fire_station.webp`,
};

const GRID_WIDTH = 34;
const GRID_HEIGHT = 24;
const TILE_WIDTH = 92;
const TILE_HEIGHT = 46;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createCityCamera({ x = 0, y = 0 } = {}) {
  return { x, y };
}

export function resetCityCamera() {
  return createCityCamera();
}

export function getCityCameraBounds(scene = createHatcherCityScene(), viewport = { width: 960, height: 560 }) {
  const extraColumns = Math.max(0, scene.grid.width - 15);
  const extraRows = Math.max(0, scene.grid.height - 12);
  const roomX = Math.max(160, viewport.width * 0.22 + extraColumns * 18);
  const roomY = Math.max(120, viewport.height * 0.16 + extraRows * 14);

  return {
    minX: -roomX,
    maxX: roomX,
    minY: -roomY,
    maxY: roomY,
  };
}

export function panCityCamera(camera = createCityCamera(), delta = { x: 0, y: 0 }, bounds = getCityCameraBounds()) {
  return {
    x: clamp((camera.x || 0) + (delta.x || 0), bounds.minX, bounds.maxX),
    y: clamp((camera.y || 0) + (delta.y || 0), bounds.minY, bounds.maxY),
  };
}

const BUILDINGS = [
  {
    id: 'hatcher-market-tower',
    role: 'common-hq',
    route: 'hq',
    name: 'Hatcher Market Tower',
    district: 'Common HQ',
    assetKey: 'tower',
    tile: { x: 8, y: 4 },
    footprintSize: { w: 1.8, h: 1.6 },
    drawWidth: 340,
    lift: 16,
    label: true,
  },
  {
    id: 'exchange-walk',
    role: 'district',
    name: 'Exchange Walk',
    district: 'Market',
    assetKey: 'exchange',
    tile: { x: 3, y: 4 },
    drawWidth: 236,
    label: true,
  },
  {
    id: 'signal-academy',
    role: 'district',
    name: 'Signal Academy',
    district: 'Research',
    assetKey: 'university',
    tile: { x: 11, y: 4 },
    drawWidth: 244,
  },
  {
    id: 'vault-gardens',
    role: 'district',
    name: 'Vault Gardens',
    district: 'Park',
    assetKey: 'park',
    tile: { x: 5, y: 8 },
    footprintSize: { w: 1.7, h: 1.4 },
    drawWidth: 250,
  },
  {
    id: 'risk-clinic',
    role: 'district',
    name: 'Risk Clinic',
    district: 'Care',
    assetKey: 'clinic',
    tile: { x: 11, y: 7 },
    footprintSize: { w: 1.2, h: 1.2 },
    drawWidth: 214,
  },
  {
    id: 'founder-residences',
    role: 'district',
    name: 'Founder Residences',
    district: 'Housing',
    assetKey: 'residences',
    tile: { x: 8, y: 11 },
    drawWidth: 210,
  },
  {
    id: 'arena-desk',
    role: 'district',
    name: 'Arena Desk',
    district: 'Events',
    assetKey: 'stadium',
    tile: { x: 12, y: 10 },
    footprintSize: { w: 1.35, h: 1.25 },
    drawWidth: 242,
  },
  {
    id: 'ops-watch',
    role: 'district',
    name: 'Ops Watch',
    district: 'Safety',
    assetKey: 'police',
    tile: { x: 9, y: 8 },
    drawWidth: 184,
  },
  {
    id: 'response-yard',
    role: 'district',
    name: 'Response Yard',
    district: 'Infra',
    assetKey: 'fire',
    tile: { x: 4, y: 2 },
    drawWidth: 178,
  },
  {
    id: 'liquidity-tower',
    role: 'district',
    name: 'Liquidity Tower',
    district: 'Storage',
    assetKey: 'waterTower',
    tile: { x: 13, y: 5 },
    drawWidth: 154,
  },
  {
    id: 'north-grove',
    role: 'landscape',
    name: 'North Grove',
    district: 'Green',
    assetKey: 'trees',
    tile: { x: 2, y: 2 },
    drawWidth: 174,
  },
  {
    id: 'east-market-annex',
    role: 'district',
    name: 'Market Annex',
    district: 'Market',
    assetKey: 'exchange',
    tile: { x: 17, y: 5 },
    drawWidth: 208,
  },
  {
    id: 'east-residences',
    role: 'district',
    name: 'East Residences',
    district: 'Housing',
    assetKey: 'residences',
    tile: { x: 18, y: 10 },
    drawWidth: 196,
  },
  {
    id: 'south-grove',
    role: 'landscape',
    name: 'South Grove',
    district: 'Green',
    assetKey: 'trees',
    tile: { x: 10, y: 15 },
    drawWidth: 168,
  },
  {
    id: 'market-yard',
    role: 'district',
    name: 'Market Yard',
    district: 'Infra',
    assetKey: 'fire',
    tile: { x: 15, y: 12 },
    drawWidth: 172,
  },
  {
    id: 'harbor-watch',
    role: 'district',
    name: 'Harbor Watch',
    district: 'Safety',
    assetKey: 'police',
    tile: { x: 6, y: 15 },
    drawWidth: 176,
  },
  {
    id: 'compute-tower',
    role: 'district',
    name: 'Compute Tower',
    district: 'Compute',
    assetKey: 'commercial',
    tile: { x: 20, y: 11 },
    footprintSize: { w: 1.3, h: 1.3 },
    drawWidth: 236,
  },
  {
    id: 'eastern-campus',
    role: 'district',
    name: 'Eastern Campus',
    district: 'Research',
    assetKey: 'university',
    tile: { x: 25, y: 7 },
    drawWidth: 226,
  },
  {
    id: 'east-clinic',
    role: 'district',
    name: 'East Clinic',
    district: 'Care',
    assetKey: 'clinic',
    tile: { x: 27, y: 10 },
    drawWidth: 198,
  },
  {
    id: 'market-arena',
    role: 'district',
    name: 'Market Arena',
    district: 'Events',
    assetKey: 'stadium',
    tile: { x: 24, y: 14 },
    footprintSize: { w: 1.35, h: 1.25 },
    drawWidth: 236,
  },
  {
    id: 'founder-villas',
    role: 'district',
    name: 'Founder Villas',
    district: 'Housing',
    assetKey: 'residences',
    tile: { x: 9, y: 17 },
    drawWidth: 190,
  },
  {
    id: 'south-market',
    role: 'district',
    name: 'South Market',
    district: 'Market',
    assetKey: 'exchange',
    tile: { x: 18, y: 17 },
    drawWidth: 206,
  },
  {
    id: 'harbor-campus',
    role: 'district',
    name: 'Harbor Campus',
    district: 'Research',
    assetKey: 'university',
    tile: { x: 11, y: 21 },
    drawWidth: 214,
  },
  {
    id: 'east-grove',
    role: 'landscape',
    name: 'East Grove',
    district: 'Green',
    assetKey: 'trees',
    tile: { x: 26, y: 19 },
    drawWidth: 168,
  },
  {
    id: 'deep-storage',
    role: 'district',
    name: 'Deep Storage',
    district: 'Infra',
    assetKey: 'waterTower',
    tile: { x: 30, y: 19 },
    drawWidth: 150,
  },
  {
    id: 'waterfront-watch',
    role: 'district',
    name: 'Waterfront Watch',
    district: 'Safety',
    assetKey: 'police',
    tile: { x: 8, y: 20 },
    drawWidth: 176,
  },
  {
    id: 'logistics-yard',
    role: 'district',
    name: 'Logistics Yard',
    district: 'Infra',
    assetKey: 'fire',
    tile: { x: 23, y: 20 },
    drawWidth: 174,
  },
];

const ACTORS = [
  {
    id: 'founder-local',
    label: 'Founder',
    tile: { x: 6.8, y: 6.3 },
    color: '#f0bd4f',
    routeMs: 8200,
    path: [{ x: 6.3, y: 6.1 }, { x: 7.2, y: 6.2 }, { x: 8.0, y: 6.45 }, { x: 7.1, y: 7.05 }],
  },
  {
    id: 'mara',
    label: 'Mara',
    tile: { x: 4.2, y: 5.7 },
    color: '#6ed39d',
    routeMs: 7600,
    path: [{ x: 4.2, y: 5.7 }, { x: 5.1, y: 5.9 }, { x: 6.1, y: 6.0 }, { x: 5.5, y: 6.8 }],
  },
  {
    id: 'alex',
    label: 'Alex',
    tile: { x: 9.4, y: 5.8 },
    color: '#7ab8ff',
    routeMs: 7000,
    path: [{ x: 9.4, y: 5.8 }, { x: 10.4, y: 5.9 }, { x: 11.8, y: 6.0 }, { x: 13.0, y: 6.1 }],
  },
  {
    id: 'vault-runner',
    label: 'Vault',
    tile: { x: 7.2, y: 8.9 },
    color: '#ef7d42',
    routeMs: 9000,
    path: [{ x: 7.2, y: 9.2 }, { x: 8.4, y: 9.2 }, { x: 9.8, y: 9.2 }, { x: 10.8, y: 9.15 }],
  },
  {
    id: 'signal-scout',
    label: 'Scout',
    tile: { x: 10.6, y: 3.8 },
    color: '#d98cff',
    routeMs: 8400,
    path: [{ x: 14.3, y: 5.6 }, { x: 15.8, y: 6.0 }, { x: 16.5, y: 7.0 }, { x: 14.4, y: 7.2 }],
  },
  {
    id: 'harbor-trader',
    label: 'Trader',
    tile: { x: 25.4, y: 15.2 },
    color: '#50d2b0',
    routeMs: 9600,
    path: [{ x: 25.2, y: 15.4 }, { x: 26.4, y: 15.2 }, { x: 27.1, y: 16.1 }, { x: 25.8, y: 16.4 }],
  },
  {
    id: 'south-builder',
    label: 'Builder',
    tile: { x: 18.6, y: 19.4 },
    color: '#f0bd4f',
    routeMs: 10400,
    path: [{ x: 18.6, y: 19.2 }, { x: 20.2, y: 19.2 }, { x: 21.2, y: 20.4 }, { x: 19.2, y: 20.8 }],
  },
];

const VEHICLES = [
  {
    id: 'signal-van',
    color: '#e05038',
    routeMs: 9800,
    path: [{ x: 4.1, y: 6.0 }, { x: 7.0, y: 6.0 }, { x: 10.5, y: 6.0 }, { x: 13.8, y: 6.0 }],
  },
  {
    id: 'vault-cart',
    color: '#f0bd4f',
    routeMs: 11200,
    path: [{ x: 8.0, y: 13.0 }, { x: 11.5, y: 13.0 }, { x: 15.0, y: 13.0 }, { x: 18.5, y: 13.0 }],
  },
  {
    id: 'compute-cab',
    color: '#6ed39d',
    routeMs: 10400,
    path: [{ x: 14.0, y: 4.2 }, { x: 14.0, y: 6.6 }, { x: 16.5, y: 7.0 }, { x: 18.5, y: 8.2 }],
  },
  {
    id: 'arena-shuttle',
    color: '#d98cff',
    routeMs: 12200,
    path: [{ x: 22.0, y: 8.2 }, { x: 22.0, y: 12.0 }, { x: 22.0, y: 16.2 }, { x: 22.0, y: 18.0 }],
  },
  {
    id: 'harbor-cart',
    color: '#7ab8ff',
    routeMs: 11800,
    path: [{ x: 8.0, y: 18.0 }, { x: 11.0, y: 18.0 }, { x: 14.0, y: 18.0 }, { x: 17.0, y: 18.0 }],
  },
];

const WATER_TRAFFIC = [
  {
    id: 'basin-skiff',
    color: '#f0bd4f',
    routeMs: 13200,
    path: [{ x: 1.2, y: 11.2 }, { x: 3.4, y: 11.4 }, { x: 5.8, y: 12.4 }, { x: 3.2, y: 14.0 }],
  },
  {
    id: 'harbor-ferry',
    color: '#6ed39d',
    routeMs: 14800,
    path: [{ x: 2.0, y: 18.6 }, { x: 5.6, y: 18.6 }, { x: 5.5, y: 21.5 }, { x: 2.0, y: 21.2 }],
  },
  {
    id: 'south-quay-runner',
    color: '#7ab8ff',
    routeMs: 11600,
    path: [{ x: 8.0, y: 23.0 }, { x: 10.5, y: 23.0 }, { x: 13.0, y: 23.0 }, { x: 10.2, y: 23.0 }],
  },
];

const DECORATIONS = [
  {
    id: 'north-quay',
    group: 'waterfront',
    kind: 'dock',
    tile: { x: 8, y: 11 },
    angle: -0.16,
  },
  {
    id: 'basin-buoy-a',
    group: 'waterfront',
    kind: 'buoy',
    tile: { x: 6, y: 12 },
  },
  {
    id: 'basin-buoy-b',
    group: 'waterfront',
    kind: 'buoy',
    tile: { x: 2, y: 14 },
  },
  {
    id: 'harbor-pier',
    group: 'waterfront',
    kind: 'dock',
    tile: { x: 6, y: 17 },
    angle: 0.18,
  },
  {
    id: 'south-pier',
    group: 'waterfront',
    kind: 'dock',
    tile: { x: 10, y: 23 },
    angle: -0.18,
  },
  {
    id: 'hq-signal-post',
    group: 'district',
    kind: 'beacon',
    tile: { x: 6, y: 5 },
    color: '#6ed39d',
  },
  {
    id: 'exchange-market-stall',
    group: 'district',
    kind: 'stall',
    tile: { x: 5, y: 5 },
    color: '#f0bd4f',
  },
  {
    id: 'vault-crates',
    group: 'district',
    kind: 'crate-stack',
    tile: { x: 15, y: 8 },
    color: '#a8733f',
  },
  {
    id: 'risk-terminal',
    group: 'district',
    kind: 'terminal',
    tile: { x: 15, y: 10 },
    color: '#7ab8ff',
  },
  {
    id: 'arena-banner',
    group: 'district',
    kind: 'banner',
    tile: { x: 23, y: 10 },
    color: '#d98cff',
  },
  {
    id: 'market-crates',
    group: 'district',
    kind: 'crate-stack',
    tile: { x: 21, y: 14 },
    color: '#c98d4b',
  },
  {
    id: 'founder-bench',
    group: 'district',
    kind: 'bench',
    tile: { x: 10, y: 17 },
    color: '#b77d4d',
  },
  {
    id: 'south-signal-post',
    group: 'district',
    kind: 'beacon',
    tile: { x: 17, y: 17 },
    color: '#50d2b0',
  },
  {
    id: 'research-streetlight',
    group: 'district',
    kind: 'streetlight',
    tile: { x: 16, y: 8 },
    color: '#7ab8ff',
  },
  {
    id: 'market-planter',
    group: 'district',
    kind: 'planter',
    tile: { x: 19, y: 11 },
    color: '#6ed39d',
  },
  {
    id: 'care-billboard',
    group: 'district',
    kind: 'billboard',
    tile: { x: 26, y: 10 },
    color: '#f4f0df',
  },
  {
    id: 'compute-streetlight',
    group: 'district',
    kind: 'streetlight',
    tile: { x: 23, y: 11 },
    color: '#50d2b0',
  },
  {
    id: 'harbor-planter',
    group: 'district',
    kind: 'planter',
    tile: { x: 12, y: 20 },
    color: '#f0bd4f',
  },
  {
    id: 'event-billboard',
    group: 'district',
    kind: 'billboard',
    tile: { x: 24, y: 15 },
    color: '#d98cff',
  },
];

const DISTRICT_BADGES = [
  { id: 'badge-hq', code: 'HQ', label: 'Market Tower', tile: { x: 8, y: 7 }, color: '#f0bd4f' },
  { id: 'badge-market', code: 'MKT', label: 'Market', tile: { x: 6, y: 4 }, color: '#6ed39d' },
  { id: 'badge-research', code: 'R&D', label: 'Research', tile: { x: 15, y: 5 }, color: '#7ab8ff' },
  { id: 'badge-care', code: 'CARE', label: 'Care', tile: { x: 29, y: 10 }, color: '#f4f0df' },
  { id: 'badge-events', code: 'EVT', label: 'Events', tile: { x: 23, y: 14 }, color: '#d98cff' },
  { id: 'badge-compute', code: 'CMP', label: 'Compute', tile: { x: 21, y: 11 }, color: '#50d2b0' },
  { id: 'badge-housing', code: 'HOME', label: 'Housing', tile: { x: 10, y: 16 }, color: '#f0bd4f' },
  { id: 'badge-infra', code: 'INF', label: 'Infra', tile: { x: 21, y: 19 }, color: '#ef7d42' },
  { id: 'badge-safety', code: 'SAFE', label: 'Safety', tile: { x: 8, y: 19 }, color: '#7ab8ff' },
  { id: 'badge-storage', code: 'STRG', label: 'Storage', tile: { x: 18, y: 5 }, color: '#c98d4b' },
];

const ACTIVITY_SIGNALS = [
  { id: 'signal-market-orders', buildingId: 'exchange-walk', kind: 'trade', code: '$', label: 'Orders ready', color: '#6ed39d', offset: { x: 0.42, y: -0.45 } },
  { id: 'signal-research-mission', buildingId: 'signal-academy', kind: 'mission', code: '!', label: 'Signal mission', color: '#7ab8ff', offset: { x: 0.48, y: -0.38 } },
  { id: 'signal-care-alert', buildingId: 'risk-clinic', kind: 'care', code: '+', label: 'Care slot', color: '#f4f0df', offset: { x: 0.44, y: -0.35 } },
  { id: 'signal-events-contract', buildingId: 'arena-desk', kind: 'mission', code: '!', label: 'Arena contract', color: '#d98cff', offset: { x: -0.46, y: -0.28 } },
  { id: 'signal-compute-queue', buildingId: 'compute-tower', kind: 'compute', code: '>', label: 'Compute queue', color: '#50d2b0', offset: { x: 0.42, y: -0.38 } },
  { id: 'signal-housing-founder', buildingId: 'founder-villas', kind: 'housing', code: '*', label: 'Founder ready', color: '#f0bd4f', offset: { x: -0.42, y: -0.32 } },
  { id: 'signal-infra-build', buildingId: 'logistics-yard', kind: 'build', code: '^', label: 'Upgrade ready', color: '#ef7d42', offset: { x: 0.42, y: -0.36 } },
  { id: 'signal-storage-trade', buildingId: 'liquidity-tower', kind: 'trade', code: '$', label: 'Vault trade', color: '#c98d4b', offset: { x: 0.36, y: -0.42 } },
];

const DISTRICT_STATUSES = {
  Care: 'Care slots and recovery ready',
  Compute: 'Compute queue online',
  Events: 'Contracts ready for runs',
  Housing: 'Founder rooms active',
  Infra: 'Upgrade crews moving',
  Market: 'Live orders and trade stalls',
  Park: 'Morale route and rest bonus',
  Research: 'Signals ready for missions',
  Safety: 'Risk patrols active',
  Storage: 'Vault trades open',
};

const ROAD_CROSSINGS = [
  { id: 'crossing-hq-west', tile: { x: 7, y: 6 }, orientation: 'nw-se' },
  { id: 'crossing-hq-east', tile: { x: 14, y: 6 }, orientation: 'ne-sw' },
  { id: 'crossing-research-north', tile: { x: 14, y: 3 }, orientation: 'nw-se' },
  { id: 'crossing-research-south', tile: { x: 14, y: 9 }, orientation: 'nw-se' },
  { id: 'crossing-market-yard', tile: { x: 22, y: 9 }, orientation: 'ne-sw' },
  { id: 'crossing-care-east', tile: { x: 28, y: 9 }, orientation: 'nw-se' },
  { id: 'crossing-arena-west', tile: { x: 14, y: 13 }, orientation: 'ne-sw' },
  { id: 'crossing-arena-east', tile: { x: 22, y: 13 }, orientation: 'nw-se' },
  { id: 'crossing-campus-east', tile: { x: 28, y: 13 }, orientation: 'ne-sw' },
  { id: 'crossing-harbor-west', tile: { x: 7, y: 18 }, orientation: 'ne-sw' },
  { id: 'crossing-harbor-mid', tile: { x: 14, y: 18 }, orientation: 'nw-se' },
  { id: 'crossing-south-market', tile: { x: 22, y: 18 }, orientation: 'ne-sw' },
  { id: 'crossing-storage', tile: { x: 28, y: 18 }, orientation: 'nw-se' },
];

const WAYFINDING_SIGNS = [
  { id: 'sign-hq', targetId: 'hatcher-market-tower', code: 'HQ', label: 'Market Tower', tile: { x: 7, y: 6 }, color: '#f0bd4f', side: -1 },
  { id: 'sign-rnd', targetId: 'signal-academy', code: 'R&D', label: 'Signal Academy', tile: { x: 14, y: 6 }, color: '#7ab8ff', side: 1 },
  { id: 'sign-ops', targetId: 'ops-watch', code: 'OPS', label: 'Ops Watch', tile: { x: 7, y: 9 }, color: '#6ed39d', side: -1 },
  { id: 'sign-care', targetId: 'east-clinic', code: 'CARE', label: 'Care', tile: { x: 28, y: 12 }, color: '#f4f0df', side: 1 },
  { id: 'sign-arena', targetId: 'market-arena', code: 'EVT', label: 'Arena', tile: { x: 22, y: 13 }, color: '#d98cff', side: -1 },
  { id: 'sign-harbor', targetId: 'harbor-watch', code: 'PORT', label: 'Harbor', tile: { x: 7, y: 18 }, color: '#7ab8ff', side: 1 },
  { id: 'sign-market', targetId: 'south-market', code: 'MKT', label: 'South Market', tile: { x: 14, y: 18 }, color: '#6ed39d', side: -1 },
  { id: 'sign-infra', targetId: 'logistics-yard', code: 'INF', label: 'Logistics', tile: { x: 22, y: 18 }, color: '#ef7d42', side: 1 },
  { id: 'sign-vault', targetId: 'deep-storage', code: 'VLT', label: 'Storage', tile: { x: 28, y: 18 }, color: '#c98d4b', side: -1 },
];

const EXPANSION_PLOTS = [
  { id: 'plot-lab-east', kind: 'lab', code: 'LAB', label: 'Research plot', visual: 'outline', tile: { x: 16, y: 12 }, color: '#7ab8ff' },
  { id: 'plot-market-east', kind: 'market', code: 'MKT', label: 'Market plot', visual: 'outline', tile: { x: 23, y: 16 }, color: '#6ed39d' },
  { id: 'plot-arena-annex', kind: 'event', code: 'EVT', label: 'Events plot', visual: 'outline', tile: { x: 25, y: 16 }, color: '#d98cff' },
  { id: 'plot-founder-block', kind: 'housing', code: 'HOME', label: 'Founder plot', visual: 'outline', tile: { x: 12, y: 17 }, color: '#f0bd4f' },
  { id: 'plot-infra-south', kind: 'infra', code: 'INF', label: 'Infra plot', visual: 'outline', tile: { x: 15, y: 21 }, color: '#ef7d42' },
  { id: 'plot-compute-south', kind: 'lab', code: 'CPU', label: 'Compute plot', visual: 'outline', tile: { x: 17, y: 21 }, color: '#50d2b0' },
  { id: 'plot-safety-east', kind: 'safety', code: 'OPS', label: 'Safety plot', visual: 'outline', tile: { x: 29, y: 15 }, color: '#7ab8ff' },
];

function tileKey(x, y) {
  return `${x}:${y}`;
}

function isAdjacentToWater(x, y, water) {
  return water.has(tileKey(x + 1, y))
    || water.has(tileKey(x - 1, y))
    || water.has(tileKey(x, y + 1))
    || water.has(tileKey(x, y - 1));
}

function createRoadConnections(x, y, roads) {
  return {
    northWest: roads.has(tileKey(x - 1, y)),
    northEast: roads.has(tileKey(x, y - 1)),
    southEast: roads.has(tileKey(x + 1, y)),
    southWest: roads.has(tileKey(x, y + 1)),
  };
}

function makeTileMap() {
  const tiles = [];
  const water = new Set();
  const roads = new Set();

  for (let y = 7; y <= 18; y += 1) {
    const width = Math.max(3, 8 - Math.abs(y - 12));
    for (let x = 0; x <= width; x += 1) water.add(tileKey(x, y));
  }
  for (let y = 18; y <= 23; y += 1) {
    for (let x = 0; x <= 6; x += 1) water.add(tileKey(x, y));
  }
  for (let x = 7; x <= 13; x += 1) water.add(tileKey(x, 23));

  for (let x = 1; x <= 31; x += 1) roads.add(tileKey(x, 6));
  for (let x = 3; x <= 30; x += 1) roads.add(tileKey(x, 3));
  for (let x = 4; x <= 31; x += 1) roads.add(tileKey(x, 9));
  for (let x = 8; x <= 30; x += 1) roads.add(tileKey(x, 13));
  for (let x = 7; x <= 31; x += 1) roads.add(tileKey(x, 18));
  for (let y = 2; y <= 21; y += 1) roads.add(tileKey(7, y));
  for (let y = 4; y <= 21; y += 1) roads.add(tileKey(14, y));
  for (let y = 5; y <= 22; y += 1) roads.add(tileKey(22, y));
  for (let y = 8; y <= 22; y += 1) roads.add(tileKey(28, y));
  roads.add(tileKey(3, 5));
  roads.add(tileKey(4, 5));
  roads.add(tileKey(10, 5));
  roads.add(tileKey(11, 5));
  roads.add(tileKey(12, 6));
  roads.add(tileKey(15, 7));
  roads.add(tileKey(16, 7));
  roads.add(tileKey(18, 8));
  roads.add(tileKey(20, 10));
  roads.add(tileKey(21, 10));
  roads.add(tileKey(24, 12));
  roads.add(tileKey(25, 12));
  roads.add(tileKey(26, 12));
  roads.add(tileKey(29, 17));
  roads.add(tileKey(30, 17));
  roads.add(tileKey(31, 17));

  for (let y = 0; y < GRID_HEIGHT; y += 1) {
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      const key = tileKey(x, y);
      let kind = 'grass';
      if (water.has(key)) kind = 'water';
      else if (roads.has(key)) kind = 'road';
      else if (isAdjacentToWater(x, y, water)) kind = 'shore';
      else if ((x === 6 || x === 8) && (y === 5 || y === 7)) kind = 'plaza';
      else if (
        (x >= 5 && x <= 9 && y >= 4 && y <= 8)
        || (x >= 14 && x <= 19 && y >= 5 && y <= 12)
        || (x >= 21 && x <= 30 && y >= 8 && y <= 20)
        || (x >= 8 && x <= 18 && y >= 16 && y <= 22)
      ) kind = 'district-lot';
      else if ((x + y) % 7 === 0) kind = 'trees';

      const tile = { x, y, kind };
      if (kind === 'road') tile.roadConnections = createRoadConnections(x, y, roads);
      tiles.push(tile);
    }
  }

  return tiles;
}

export function createHatcherCityScene() {
  return {
    id: 'hatcher-common-city',
    grid: { width: GRID_WIDTH, height: GRID_HEIGHT },
    tile: { width: TILE_WIDTH, height: TILE_HEIGHT },
    tiles: makeTileMap(),
    buildings: BUILDINGS.map(building => ({
      ...building,
      tile: { ...building.tile },
      footprint: createBuildingFootprint(building),
      pad: createBuildingPad(building),
    })),
    actors: ACTORS.map(actor => ({
      ...actor,
      tile: { ...actor.tile },
      path: actor.path?.map(point => ({ ...point })),
    })),
    vehicles: VEHICLES.map(vehicle => ({
      ...vehicle,
      path: vehicle.path.map(point => ({ ...point })),
      tile: { ...vehicle.path[0] },
    })),
    waterTraffic: WATER_TRAFFIC.map(boat => ({
      ...boat,
      path: boat.path.map(point => ({ ...point })),
      tile: { ...boat.path[0] },
    })),
    decorations: DECORATIONS.map(decoration => ({
      ...decoration,
      tile: { ...decoration.tile },
    })),
    badges: DISTRICT_BADGES.map(badge => ({
      ...badge,
      tile: { ...badge.tile },
    })),
  };
}

function createBuildingFootprint(building) {
  const size = building.footprintSize || { w: 1, h: 1 };
  return {
    x: building.tile.x - size.w * 0.5,
    y: building.tile.y - size.h * 0.5,
    w: size.w,
    h: size.h,
  };
}

function createBuildingPad(building) {
  const footprint = createBuildingFootprint(building);
  const padding = 0;
  return {
    x: footprint.x - padding,
    y: footprint.y - padding,
    w: footprint.w + padding * 2,
    h: footprint.h + padding * 2,
    kind: building.role === 'landscape'
      ? 'green'
      : building.role === 'common-hq'
        ? 'hq'
        : 'district',
  };
}

function interpolatePoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function getAnimatedCityActors(scene = createHatcherCityScene(), elapsedMs = 0) {
  return (scene.actors || []).map((actor, index) => {
    const path = actor.path?.length >= 2 ? actor.path : [actor.tile];
    if (path.length < 2) {
      return {
        ...actor,
        tile: { ...actor.tile },
      };
    }

    const routeMs = actor.routeMs || 7200;
    const offsetMs = (index * 1200) % routeMs;
    const progress = ((elapsedMs + offsetMs) % routeMs) / routeMs;
    const segmentProgress = progress * path.length;
    const segmentIndex = Math.floor(segmentProgress) % path.length;
    const nextIndex = (segmentIndex + 1) % path.length;
    const localT = segmentProgress - Math.floor(segmentProgress);
    const tile = interpolatePoint(path[segmentIndex], path[nextIndex], localT);

    return {
      ...actor,
      tile,
      walkFrame: localT,
    };
  });
}

export function getAnimatedCityVehicles(scene = createHatcherCityScene(), elapsedMs = 0) {
  return (scene.vehicles || []).map((vehicle, index) => {
    const path = vehicle.path?.length >= 2 ? vehicle.path : [vehicle.tile];
    if (path.length < 2) {
      return {
        ...vehicle,
        tile: { ...vehicle.tile },
      };
    }

    const routeMs = vehicle.routeMs || 9600;
    const offsetMs = (index * 1700) % routeMs;
    const progress = ((elapsedMs + offsetMs) % routeMs) / routeMs;
    const segmentProgress = progress * path.length;
    const segmentIndex = Math.floor(segmentProgress) % path.length;
    const nextIndex = (segmentIndex + 1) % path.length;
    const localT = segmentProgress - Math.floor(segmentProgress);
    const tile = interpolatePoint(path[segmentIndex], path[nextIndex], localT);
    const direction = {
      x: path[nextIndex].x - path[segmentIndex].x,
      y: path[nextIndex].y - path[segmentIndex].y,
    };

    return {
      ...vehicle,
      path: vehicle.path?.map(point => ({ ...point })),
      tile,
      direction,
    };
  });
}

export function getAnimatedCityBoats(scene = createHatcherCityScene(), elapsedMs = 0) {
  return (scene.waterTraffic || []).map((boat, index) => {
    const path = boat.path?.length >= 2 ? boat.path : [boat.tile];
    if (path.length < 2) {
      return {
        ...boat,
        tile: { ...boat.tile },
      };
    }

    const routeMs = boat.routeMs || 12800;
    const offsetMs = (index * 2200) % routeMs;
    const progress = ((elapsedMs + offsetMs) % routeMs) / routeMs;
    const segmentProgress = progress * path.length;
    const segmentIndex = Math.floor(segmentProgress) % path.length;
    const nextIndex = (segmentIndex + 1) % path.length;
    const localT = segmentProgress - Math.floor(segmentProgress);
    const tile = interpolatePoint(path[segmentIndex], path[nextIndex], localT);

    return {
      ...boat,
      path: boat.path?.map(point => ({ ...point })),
      tile,
      direction: {
        x: path[nextIndex].x - path[segmentIndex].x,
        y: path[nextIndex].y - path[segmentIndex].y,
      },
      wakeFrame: localT,
    };
  });
}

function buildingDepth(building) {
  const footprint = building.footprint || createBuildingFootprint(building);
  return footprint.x + footprint.w + footprint.y + footprint.h;
}

function tileDepth(item) {
  return (item.tile?.x || 0) + (item.tile?.y || 0);
}

function stableDepthSort(a, b) {
  return a.depth - b.depth || a.order - b.order;
}

export function getCityRenderQueue(scene = createHatcherCityScene(), options = {}) {
  const waterTraffic = options.mode === 'hq'
    ? []
    : getAnimatedCityBoats(scene, options.elapsedMs || 0).map((boat, order) => ({
      type: 'boat',
      layer: 'water-traffic',
      item: boat,
      depth: tileDepth(boat) - 0.2,
      order,
    })).sort(stableDepthSort);

  const decorations = [...(scene.decorations || [])]
    .map((decoration, order) => ({
      type: 'decoration',
      layer: 'decoration',
      item: decoration,
      depth: tileDepth(decoration),
      order,
    }))
    .sort(stableDepthSort);

  const pads = [...(scene.buildings || [])]
    .map((building, order) => ({
      type: 'pad',
      layer: 'pad',
      item: building,
      depth: buildingDepth(building) - 0.35,
      order,
    }))
    .sort(stableDepthSort);

  const badges = getCityDistrictBadges(scene)
    .map((badge, order) => ({
      type: 'badge',
      layer: 'badge',
      item: badge,
      depth: tileDepth(badge) + 0.04,
      order,
    }))
    .sort(stableDepthSort);

  const activity = getCityActivitySignals(scene)
    .map((signal, order) => ({
      type: 'activity',
      layer: 'activity',
      item: signal,
      depth: tileDepth(signal) + 0.08,
      order,
    }))
    .sort(stableDepthSort);

  const buildings = [...(scene.buildings || [])].map((building, order) => ({
    type: 'building',
    layer: 'building',
    item: building,
    depth: buildingDepth(building),
    order,
  }));

  const vehicles = options.mode === 'hq'
    ? []
    : getAnimatedCityVehicles(scene, options.elapsedMs || 0).map((vehicle, order) => ({
      type: 'vehicle',
      layer: 'vehicle',
      item: vehicle,
      depth: tileDepth(vehicle) + 0.1,
      order,
    }));

  const actors = options.mode === 'hq'
    ? []
    : getAnimatedCityActors(scene, options.elapsedMs || 0).map((actor, order) => ({
      type: 'actor',
      layer: 'actor',
      item: actor,
      depth: tileDepth(actor) + 0.2,
      order,
    }));

  return [
    ...waterTraffic,
    ...decorations,
    ...pads,
    ...badges,
    ...activity,
    ...[...buildings, ...vehicles, ...actors].sort(stableDepthSort),
  ];
}

export function loadCityAssets(assetPaths = HATCHER_CITY_ASSETS) {
  if (typeof Image === 'undefined') {
    return Promise.resolve({});
  }

  const entries = Object.entries(assetPaths);
  return Promise.all(entries.map(([key, src]) => new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve([key, image]);
    image.onerror = () => resolve([key, null]);
    image.src = src;
  }))).then(loaded => Object.fromEntries(loaded));
}

function createMetrics(canvas, scene, options = {}) {
  const dpr = options.dpr || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const cssWidth = Math.max(320, options.width || canvas.clientWidth || canvas.width || 960);
  const cssHeight = Math.max(300, options.height || canvas.clientHeight || canvas.height || 560);
  const worldWidth = (scene.grid.width + scene.grid.height) * scene.tile.width * 0.5;
  const worldHeight = (scene.grid.width + scene.grid.height) * scene.tile.height * 0.5 + 150;
  const fitScale = Math.min((cssWidth - 72) / worldWidth, (cssHeight - 56) / worldHeight);
  const coverScale = Math.max((cssWidth + 220) / worldWidth, (cssHeight + 90) / worldHeight);
  const scale = options.framing === 'cover'
    ? Math.max(0.72, Math.min(1.06, coverScale))
    : Math.max(0.46, Math.min(0.82, fitScale));
  const footprintHeight = (scene.grid.width + scene.grid.height) * scene.tile.height * 0.5 * scale;

  return {
    dpr,
    cssWidth,
    cssHeight,
    scale,
    originX: cssWidth * (options.framing === 'cover' ? 0.56 : 0.5) + (options.camera?.x || 0),
    originY: (options.framing === 'cover'
      ? Math.max(34, cssHeight * 0.08)
      : Math.max(28, (cssHeight - footprintHeight) * (options.mode === 'hq' ? 0.24 : 0.22))) + (options.camera?.y || 0),
    tileWidth: scene.tile.width,
    tileHeight: scene.tile.height,
  };
}

function ensureCanvasSize(canvas, metrics) {
  const targetWidth = Math.round(metrics.cssWidth * metrics.dpr);
  const targetHeight = Math.round(metrics.cssHeight * metrics.dpr);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

function toScreen(tile, metrics) {
  const x = (tile.x - tile.y) * metrics.tileWidth * 0.5 * metrics.scale + metrics.originX;
  const y = (tile.x + tile.y) * metrics.tileHeight * 0.5 * metrics.scale + metrics.originY;
  return { x, y };
}

function drawDiamond(ctx, point, metrics, fill, stroke) {
  const halfW = metrics.tileWidth * 0.5 * metrics.scale;
  const halfH = metrics.tileHeight * 0.5 * metrics.scale;

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x + halfW, point.y + halfH);
  ctx.lineTo(point.x, point.y + halfH * 2);
  ctx.lineTo(point.x - halfW, point.y + halfH);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, metrics.scale);
  ctx.stroke();
}

function tileStyle(kind) {
  if (kind === 'water') return ['#1f6f7d', 'rgba(175,231,235,0.22)'];
  if (kind === 'road') return ['#30383b', 'rgba(255,255,255,0.13)'];
  if (kind === 'shore') return ['#365746', 'rgba(217,229,178,0.18)'];
  if (kind === 'plaza') return ['#536159', 'rgba(240,189,79,0.24)'];
  if (kind === 'district-lot') return ['#36543f', 'rgba(160,220,178,0.16)'];
  if (kind === 'trees') return ['#2c5a3f', 'rgba(128,205,133,0.15)'];
  return ['#284735', 'rgba(255,255,255,0.06)'];
}

function drawRoadMark(ctx, point, metrics, tile) {
  const roadLength = metrics.tileWidth * 0.34 * metrics.scale;
  const roadOffset = metrics.tileHeight * 0.5 * metrics.scale;
  const center = { x: point.x, y: point.y + roadOffset };
  const connections = tile.roadConnections || {};
  const endpoints = {
    northWest: { x: center.x - roadLength * 0.7, y: center.y - roadLength * 0.34 },
    northEast: { x: center.x + roadLength * 0.7, y: center.y - roadLength * 0.34 },
    southEast: { x: center.x + roadLength * 0.7, y: center.y + roadLength * 0.34 },
    southWest: { x: center.x - roadLength * 0.7, y: center.y + roadLength * 0.34 },
  };

  ctx.save();
  ctx.strokeStyle = 'rgba(234,230,198,0.15)';
  ctx.lineWidth = Math.max(1, metrics.scale);
  ctx.setLineDash([roadLength * 0.08, roadLength * 0.2]);
  ctx.beginPath();
  for (const [direction, connected] of Object.entries(connections)) {
    if (!connected) continue;
    const endpoint = endpoints[direction];
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(endpoint.x, endpoint.y);
  }
  if (!Object.values(connections).some(Boolean)) {
    ctx.moveTo(center.x - roadLength * 0.5, center.y);
    ctx.lineTo(center.x + roadLength * 0.5, center.y);
  }
  ctx.stroke();

  const connectedCount = Object.values(connections).filter(Boolean).length;
  if (connectedCount >= 3) {
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(245,232,180,0.13)';
    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.max(1.5, 2.8 * metrics.scale), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRoadCrossing(ctx, crossing, metrics) {
  const point = toScreen(crossing.tile, metrics);
  const scale = metrics.scale;
  const center = {
    x: point.x,
    y: point.y + metrics.tileHeight * 0.5 * scale,
  };
  const stripeLength = metrics.tileWidth * 0.18 * scale;
  const gap = metrics.tileWidth * 0.055 * scale;
  const angle = crossing.orientation === 'ne-sw' ? -0.48 : 0.48;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(238,231,190,0.36)';
  ctx.lineWidth = Math.max(1, 2.2 * scale);
  ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i += 1) {
    const y = i * gap;
    ctx.beginPath();
    ctx.moveTo(-stripeLength * 0.5, y);
    ctx.lineTo(stripeLength * 0.5, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWayfindingSign(ctx, sign, metrics) {
  const point = toScreen(sign.tile, metrics);
  const scale = metrics.scale;
  const side = sign.side || 1;
  const x = point.x + side * metrics.tileWidth * 0.22 * scale;
  const y = point.y + metrics.tileHeight * 0.34 * scale;
  const width = Math.max(28 * scale, (sign.code || '').length * 8 * scale);
  const height = 17 * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 15 * scale, 13 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(8,14,14,0.86)';
  ctx.lineWidth = Math.max(1, 1.3 * scale);
  ctx.beginPath();
  ctx.moveTo(0, 14 * scale);
  ctx.lineTo(0, -7 * scale);
  ctx.stroke();

  ctx.fillStyle = 'rgba(10,22,23,0.9)';
  ctx.strokeStyle = sign.color || '#f0bd4f';
  roundRect(ctx, -width * 0.5, -21 * scale, width, height, 3 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.font = `800 ${Math.max(7, 9 * scale)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = sign.color || '#f0bd4f';
  ctx.fillText(sign.code || '', 0, -12.5 * scale);
  ctx.restore();
}

function drawExpansionPlot(ctx, plot, metrics) {
  const point = toScreen(plot.tile, metrics);
  const scale = metrics.scale;
  const centerY = point.y + metrics.tileHeight * 0.5 * scale;
  const halfW = metrics.tileWidth * 0.28 * scale;
  const halfH = metrics.tileHeight * 0.22 * scale;

  ctx.save();
  ctx.translate(point.x, centerY);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'rgba(8,20,20,0.12)';
  ctx.strokeStyle = plot.color || '#6ed39d';
  ctx.lineWidth = Math.max(1, 1.1 * scale);
  ctx.setLineDash([5 * scale, 5 * scale]);
  ctx.beginPath();
  ctx.moveTo(0, -halfH);
  ctx.lineTo(halfW, 0);
  ctx.lineTo(0, halfH);
  ctx.lineTo(-halfW, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  if (scale >= 0.9) {
    ctx.globalAlpha = 0.42;
    ctx.font = `800 ${Math.max(7, 8 * scale)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = plot.color || '#6ed39d';
    ctx.fillText(plot.code || '+', 0, 0.5 * scale);
  }
  ctx.restore();
}

function drawWaterDetail(ctx, point, metrics) {
  const halfW = metrics.tileWidth * 0.34 * metrics.scale;
  const y = point.y + metrics.tileHeight * 0.56 * metrics.scale;

  ctx.save();
  ctx.strokeStyle = 'rgba(202,246,248,0.18)';
  ctx.lineWidth = Math.max(1, metrics.scale);
  ctx.beginPath();
  ctx.moveTo(point.x - halfW, y);
  ctx.quadraticCurveTo(point.x - halfW * 0.35, y - 4 * metrics.scale, point.x, y);
  ctx.quadraticCurveTo(point.x + halfW * 0.35, y + 4 * metrics.scale, point.x + halfW, y);
  ctx.stroke();
  ctx.restore();
}

function drawShoreDetail(ctx, point, metrics) {
  const halfW = metrics.tileWidth * 0.43 * metrics.scale;
  const halfH = metrics.tileHeight * 0.43 * metrics.scale;
  const y = point.y + metrics.tileHeight * 0.5 * metrics.scale;

  ctx.save();
  ctx.strokeStyle = 'rgba(235,214,151,0.34)';
  ctx.lineWidth = Math.max(1, metrics.scale * 1.5);
  ctx.beginPath();
  ctx.moveTo(point.x - halfW * 0.72, y + halfH * 0.28);
  ctx.lineTo(point.x, y + halfH * 0.8);
  ctx.lineTo(point.x + halfW * 0.72, y + halfH * 0.28);
  ctx.stroke();
  ctx.restore();
}

function drawBuildingPad(ctx, building, metrics) {
  if (!building.pad) return;

  const center = {
    x: building.pad.x + building.pad.w * 0.5,
    y: building.pad.y + building.pad.h * 0.5,
  };
  const point = toScreen(center, metrics);
  const halfW = metrics.tileWidth * metrics.scale * Math.max(0.52, building.pad.w * 0.52);
  const halfH = metrics.tileHeight * metrics.scale * Math.max(0.48, building.pad.h * 0.48);
  const fill = building.pad.kind === 'green'
    ? 'rgba(74,128,79,0.72)'
    : building.pad.kind === 'hq'
      ? 'rgba(96,113,100,0.82)'
      : 'rgba(87,103,92,0.74)';
  const stroke = building.pad.kind === 'hq'
    ? 'rgba(240,189,79,0.36)'
    : 'rgba(226,232,194,0.22)';

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, metrics.scale * 1.4);
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - halfH);
  ctx.lineTo(point.x + halfW, point.y);
  ctx.lineTo(point.x, point.y + halfH);
  ctx.lineTo(point.x - halfW, point.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDistrictBadge(ctx, badge, metrics) {
  const screen = toScreen(badge.tile, metrics);
  const scale = metrics.scale;
  const y = screen.y + metrics.tileHeight * scale * 0.56;
  const code = badge.code || '';
  const color = badge.color || '#6ed39d';
  const fontSize = Math.max(8, 10.5 * scale);

  ctx.save();
  ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = Math.max(34 * scale, ctx.measureText(code).width + 15 * scale);
  const height = 20 * scale;
  if (
    screen.x < width * 0.62
    || screen.x > metrics.cssWidth - width * 0.62
    || y < height
    || y > metrics.cssHeight - height
  ) {
    ctx.restore();
    return;
  }

  ctx.translate(screen.x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.26)';
  ctx.beginPath();
  ctx.ellipse(0, 9 * scale, 23 * scale, 6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(10,22,23,0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 1.4 * scale);
  roundRect(ctx, -width * 0.5, -height * 0.5, width, height, 4 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(code, 0, 0.5 * scale);
  ctx.restore();
}

function drawActivitySignal(ctx, signal, metrics) {
  const screen = toScreen(signal.tile, metrics);
  const scale = metrics.scale;
  const y = screen.y + metrics.tileHeight * scale * 0.28;
  const pulse = 1 + Math.sin((signal.elapsedMs || 0) / 420) * 0.08;

  ctx.save();
  ctx.translate(screen.x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath();
  ctx.ellipse(0, 17 * scale, 12 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(pulse, pulse);
  ctx.fillStyle = 'rgba(8,18,19,0.92)';
  ctx.strokeStyle = signal.color || '#6ed39d';
  ctx.lineWidth = Math.max(1, 1.4 * scale);
  ctx.beginPath();
  ctx.arc(0, 0, 11 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = `800 ${Math.max(8, 11 * scale)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = signal.color || '#6ed39d';
  ctx.fillText(signal.code || '!', 0, 0.5 * scale);
  ctx.restore();
}

function drawDecoration(ctx, decoration, metrics) {
  const screen = toScreen(decoration.tile, metrics);
  const scale = metrics.scale;
  const y = screen.y + metrics.tileHeight * scale * 0.56;

  ctx.save();
  ctx.translate(screen.x, y);
  if (decoration.kind === 'dock') {
    const width = 64 * scale;
    const height = 20 * scale;
    ctx.rotate(decoration.angle || 0);
    ctx.fillStyle = 'rgba(158,113,62,0.76)';
    ctx.strokeStyle = 'rgba(255,229,166,0.28)';
    ctx.lineWidth = Math.max(1, scale * 1.2);
    roundRect(ctx, -width * 0.5, -height * 0.5, width, height, 3 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(86,52,31,0.42)';
    ctx.beginPath();
    for (let i = -2; i <= 2; i += 1) {
      const x = i * width * 0.18;
      ctx.moveTo(x, -height * 0.42);
      ctx.lineTo(x, height * 0.42);
    }
    ctx.stroke();
  } else if (decoration.kind === 'buoy') {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 8 * scale, 9 * scale, 3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0bd4f';
    ctx.strokeStyle = 'rgba(19,28,28,0.84)';
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (decoration.kind === 'beacon') {
    ctx.strokeStyle = 'rgba(8,14,14,0.78)';
    ctx.lineWidth = Math.max(1, scale * 1.4);
    ctx.beginPath();
    ctx.moveTo(0, 6 * scale);
    ctx.lineTo(0, -14 * scale);
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#6ed39d';
    ctx.beginPath();
    ctx.arc(0, -16 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(110,211,157,0.28)';
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.arc(0, -16 * scale, 9 * scale, 0, Math.PI * 2);
    ctx.stroke();
  } else if (decoration.kind === 'stall') {
    const width = 34 * scale;
    const height = 20 * scale;
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 8 * scale, 22 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(75,105,83,0.88)';
    ctx.strokeStyle = 'rgba(255,239,190,0.3)';
    ctx.lineWidth = Math.max(1, scale);
    roundRect(ctx, -width * 0.5, -height * 0.2, width, height, 4 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#f0bd4f';
    ctx.fillRect(-width * 0.55, -height * 0.55, width * 1.1, height * 0.32);
  } else if (decoration.kind === 'crate-stack') {
    const color = decoration.color || '#a8733f';
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 10 * scale, 20 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(35,24,16,0.72)';
    ctx.lineWidth = Math.max(1, scale);
    for (const box of [
      { x: -15, y: -4, w: 16, h: 13 },
      { x: 1, y: -4, w: 16, h: 13 },
      { x: -7, y: -17, w: 16, h: 13 },
    ]) {
      ctx.fillRect(box.x * scale, box.y * scale, box.w * scale, box.h * scale);
      ctx.strokeRect(box.x * scale, box.y * scale, box.w * scale, box.h * scale);
    }
  } else if (decoration.kind === 'terminal') {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 8 * scale, 15 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(18,31,36,0.92)';
    ctx.strokeStyle = decoration.color || '#7ab8ff';
    ctx.lineWidth = Math.max(1, scale);
    roundRect(ctx, -10 * scale, -15 * scale, 20 * scale, 18 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(122,184,255,0.85)';
    ctx.fillRect(-6 * scale, -11 * scale, 12 * scale, 5 * scale);
  } else if (decoration.kind === 'banner') {
    ctx.strokeStyle = 'rgba(8,14,14,0.78)';
    ctx.lineWidth = Math.max(1, scale * 1.4);
    ctx.beginPath();
    ctx.moveTo(-7 * scale, 8 * scale);
    ctx.lineTo(-7 * scale, -18 * scale);
    ctx.moveTo(9 * scale, 8 * scale);
    ctx.lineTo(9 * scale, -18 * scale);
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#d98cff';
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.moveTo(-8 * scale, -17 * scale);
    ctx.lineTo(11 * scale, -13 * scale);
    ctx.lineTo(8 * scale, -5 * scale);
    ctx.lineTo(-11 * scale, -9 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (decoration.kind === 'bench') {
    ctx.rotate(-0.14);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 9 * scale, 22 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = decoration.color || '#b77d4d';
    ctx.strokeStyle = 'rgba(41,27,16,0.65)';
    ctx.lineWidth = Math.max(1, scale);
    roundRect(ctx, -18 * scale, -6 * scale, 36 * scale, 8 * scale, 2 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-15 * scale, 4 * scale, 4 * scale, 8 * scale);
    ctx.fillRect(11 * scale, 4 * scale, 4 * scale, 8 * scale);
  } else if (decoration.kind === 'streetlight') {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 8 * scale, 13 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(9,15,15,0.82)';
    ctx.lineWidth = Math.max(1, scale * 1.4);
    ctx.beginPath();
    ctx.moveTo(0, 7 * scale);
    ctx.lineTo(0, -22 * scale);
    ctx.lineTo(9 * scale, -26 * scale);
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#f0bd4f';
    ctx.beginPath();
    ctx.arc(12 * scale, -26 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (decoration.kind === 'planter') {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 9 * scale, 20 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(95,68,42,0.92)';
    ctx.strokeStyle = 'rgba(38,25,17,0.68)';
    ctx.lineWidth = Math.max(1, scale);
    roundRect(ctx, -16 * scale, -2 * scale, 32 * scale, 12 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#6ed39d';
    for (const leaf of [-9, 0, 9]) {
      ctx.beginPath();
      ctx.arc(leaf * scale, -5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (decoration.kind === 'billboard') {
    const width = 34 * scale;
    const height = 18 * scale;
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 9 * scale, 20 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(8,14,14,0.8)';
    ctx.lineWidth = Math.max(1, scale * 1.2);
    ctx.beginPath();
    ctx.moveTo(-10 * scale, 8 * scale);
    ctx.lineTo(-10 * scale, -12 * scale);
    ctx.moveTo(10 * scale, 8 * scale);
    ctx.lineTo(10 * scale, -12 * scale);
    ctx.stroke();
    ctx.fillStyle = 'rgba(12,26,27,0.9)';
    ctx.strokeStyle = decoration.color || '#f0bd4f';
    roundRect(ctx, -width * 0.5, -28 * scale, width, height, 3 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = decoration.color || '#f0bd4f';
    ctx.fillRect(-width * 0.32, -22 * scale, width * 0.64, 3 * scale);
  }
  ctx.restore();
}

function drawBoat(ctx, boat, metrics) {
  const screen = toScreen(boat.tile, metrics);
  const scale = metrics.scale;
  const baseY = screen.y + metrics.tileHeight * scale * 0.62;
  const angled = Math.abs(boat.direction?.x || 0) > Math.abs(boat.direction?.y || 0);
  const width = (angled ? 36 : 26) * scale;
  const height = (angled ? 15 : 24) * scale;

  ctx.save();
  ctx.translate(screen.x, baseY);
  ctx.rotate(angled ? -0.1 : 0.22);
  ctx.strokeStyle = 'rgba(202,246,248,0.28)';
  ctx.lineWidth = Math.max(1, scale);
  ctx.beginPath();
  ctx.moveTo(-width * 0.62, height * 0.34);
  ctx.quadraticCurveTo(-width * 0.95, height * 0.7, -width * 1.25, height * 0.24);
  ctx.moveTo(-width * 0.62, -height * 0.08);
  ctx.quadraticCurveTo(-width * 0.95, -height * 0.42, -width * 1.22, -height * 0.05);
  ctx.stroke();

  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.beginPath();
  ctx.ellipse(0, height * 0.44, width * 0.62, height * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = boat.color || '#f0bd4f';
  ctx.strokeStyle = 'rgba(7,12,12,0.84)';
  ctx.lineWidth = Math.max(1, 1.4 * scale);
  ctx.beginPath();
  ctx.moveTo(-width * 0.52, 0);
  ctx.lineTo(0, -height * 0.62);
  ctx.lineTo(width * 0.52, 0);
  ctx.lineTo(width * 0.26, height * 0.46);
  ctx.lineTo(-width * 0.26, height * 0.46);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(-width * 0.08, -height * 0.18, width * 0.18, height * 0.2);
  ctx.restore();
}

function drawFallbackBuilding(ctx, screen, building, metrics) {
  const width = building.drawWidth * metrics.scale;
  const height = width * (building.role === 'common-hq' ? 0.82 : 0.58);
  const x = screen.x - width * 0.5;
  const y = screen.y - height + metrics.tileHeight * metrics.scale;

  ctx.save();
  ctx.fillStyle = building.role === 'common-hq' ? '#1f6b57' : '#456755';
  ctx.strokeStyle = 'rgba(255,255,255,0.24)';
  ctx.lineWidth = Math.max(1, metrics.scale * 2);
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = 'rgba(240,189,79,0.72)';
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      ctx.fillRect(x + width * 0.18 + col * width * 0.22, y + height * 0.18 + row * height * 0.16, width * 0.08, height * 0.05);
    }
  }
  ctx.restore();
}

function drawBuilding(ctx, building, assets, metrics, options = {}) {
  const screen = toScreen(building.tile, metrics);
  const baseY = screen.y + metrics.tileHeight * metrics.scale;
  const shadowWidth = building.drawWidth * metrics.scale * 0.58;
  const image = assets[building.assetKey];
  const focus = options.mode === 'hq' && building.role !== 'common-hq';

  ctx.save();
  ctx.globalAlpha = focus ? 0.58 : 1;
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.beginPath();
  ctx.ellipse(screen.x, baseY - 7 * metrics.scale, shadowWidth, shadowWidth * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  if (image && image.naturalWidth) {
    const width = building.drawWidth * metrics.scale;
    const height = width * (image.naturalHeight / image.naturalWidth);
    ctx.drawImage(image, screen.x - width * 0.5, baseY - height - (building.lift || 0) * metrics.scale, width, height);
  } else {
    drawFallbackBuilding(ctx, screen, building, metrics);
  }
  ctx.restore();

  if (building.role === 'common-hq' && options.mode === 'hq') {
    drawHqFocus(ctx, screen, metrics);
  }
}

function drawBuildingLabel(ctx, building, screen, metrics) {
  const text = building.name;
  const y = screen.y + metrics.tileHeight * metrics.scale + 20 * metrics.scale;
  const paddingX = 12 * metrics.scale;
  const paddingY = 7 * metrics.scale;

  ctx.save();
  ctx.font = `${Math.max(10, 12 * metrics.scale)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = ctx.measureText(text).width + paddingX * 2;
  const height = 24 * metrics.scale + paddingY;
  const x = screen.x - width * 0.5;

  ctx.fillStyle = 'rgba(7,14,15,0.84)';
  ctx.strokeStyle = 'rgba(240,189,79,0.42)';
  roundRect(ctx, x, y - height * 0.5, width, height, 6 * metrics.scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8e7b8';
  ctx.fillText(text, screen.x, y);
  ctx.restore();
}

function drawHqFocus(ctx, screen, metrics) {
  const radius = 82 * metrics.scale;
  const y = screen.y + metrics.tileHeight * metrics.scale * 0.7;

  ctx.save();
  ctx.strokeStyle = 'rgba(240,189,79,0.72)';
  ctx.lineWidth = Math.max(2, 3 * metrics.scale);
  ctx.setLineDash([10 * metrics.scale, 8 * metrics.scale]);
  ctx.beginPath();
  ctx.ellipse(screen.x, y, radius, radius * 0.32, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawHotspotFocus(ctx, hotspot, metrics) {
  if (!hotspot?.center) return;
  const radius = Math.max(22, hotspot.radius * 0.72);

  ctx.save();
  ctx.strokeStyle = hotspot.action === 'open-hq' ? 'rgba(240,189,79,0.68)' : 'rgba(110,211,157,0.58)';
  ctx.lineWidth = Math.max(2, 2.4 * metrics.scale);
  ctx.setLineDash([7 * metrics.scale, 6 * metrics.scale]);
  ctx.beginPath();
  ctx.ellipse(hotspot.center.x, hotspot.center.y + 16 * metrics.scale, radius, radius * 0.34, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawActor(ctx, actor, metrics) {
  const screen = toScreen(actor.tile, metrics);
  const baseY = screen.y + metrics.tileHeight * metrics.scale * 0.82;
  const scale = metrics.scale * 0.9;
  const bob = Math.sin((actor.walkFrame || 0) * Math.PI * 2) * 1.4 * scale;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.beginPath();
  ctx.ellipse(screen.x, baseY + 4 * scale, 10 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = actor.color;
  ctx.strokeStyle = 'rgba(7,12,12,0.86)';
  ctx.lineWidth = Math.max(1, 1.5 * scale);
  roundRect(ctx, screen.x - 5.5 * scale, baseY - 18 * scale + bob, 11 * scale, 15 * scale, 3 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f2d4b4';
  ctx.beginPath();
  ctx.arc(screen.x, baseY - 23 * scale + bob, 5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawVehicle(ctx, vehicle, metrics) {
  const screen = toScreen(vehicle.tile, metrics);
  const baseY = screen.y + metrics.tileHeight * metrics.scale * 0.58;
  const scale = metrics.scale;
  const angled = Math.abs(vehicle.direction?.x || 0) > Math.abs(vehicle.direction?.y || 0);
  const width = (angled ? 30 : 22) * scale;
  const height = (angled ? 15 : 24) * scale;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.beginPath();
  ctx.ellipse(screen.x, baseY + 5 * scale, width * 0.62, height * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(screen.x, baseY - height * 0.5);
  ctx.rotate(angled ? -0.08 : 0.18);
  ctx.fillStyle = vehicle.color;
  ctx.strokeStyle = 'rgba(6,10,10,0.86)';
  ctx.lineWidth = Math.max(1, 1.5 * scale);
  roundRect(ctx, -width * 0.5, -height * 0.5, width, height, 3 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(225,251,255,0.8)';
  ctx.fillRect(-width * 0.18, -height * 0.32, width * 0.28, height * 0.26);
  ctx.fillStyle = 'rgba(255,244,184,0.9)';
  ctx.fillRect(width * 0.3, -height * 0.18, width * 0.1, height * 0.18);
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBackground(ctx, metrics) {
  const gradient = ctx.createLinearGradient(0, 0, metrics.cssWidth, metrics.cssHeight);
  gradient.addColorStop(0, '#0f2020');
  gradient.addColorStop(0.45, '#18312b');
  gradient.addColorStop(1, '#071010');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, metrics.cssWidth, metrics.cssHeight);
}

function drawModeChip(ctx, metrics, mode) {
  const text = mode === 'hq' ? 'Common HQ Entrance' : 'Shared Hatcher City';
  const width = mode === 'hq' ? 172 : 170;

  ctx.save();
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(5,11,12,0.78)';
  ctx.strokeStyle = 'rgba(108,220,178,0.26)';
  roundRect(ctx, 18, 18, width, 32, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#d8f6e6';
  ctx.fillText(text, 34, 38);
  ctx.restore();
}

export function getHqHotspot(scene = createHatcherCityScene(), metrics = null) {
  const hq = scene.buildings.find(building => building.role === 'common-hq');
  if (!hq) return null;

  const center = metrics
    ? toScreen({ x: hq.tile.x, y: hq.tile.y + 0.6 }, metrics)
    : { x: hq.tile.x, y: hq.tile.y };

  return {
    action: 'open-hq',
    label: hq.name,
    status: 'Enter the shared Market Tower. Private hubs load inside.',
    center,
    radius: metrics ? 88 * metrics.scale : 46,
  };
}

export function getCityHotspots(scene = createHatcherCityScene(), metrics = null) {
  const hqHotspot = getHqHotspot(scene, metrics);
  const districtHotspots = (scene.buildings || [])
    .filter(building => building.role !== 'common-hq' && building.role !== 'landscape')
    .map(building => {
      const center = metrics
        ? toScreen({ x: building.tile.x, y: building.tile.y + 0.45 }, metrics)
        : { x: building.tile.x, y: building.tile.y };
      return {
        action: 'inspect-district',
        id: building.id,
        label: building.name,
        status: DISTRICT_STATUSES[building.district] || `${building.name} active`,
        center,
        radius: metrics ? Math.max(28, 34 * metrics.scale) : 28,
      };
    });

  return [hqHotspot, ...districtHotspots].filter(Boolean);
}

export function getCityFocusHotspot(scene = createHatcherCityScene(), hotspotId = '', metrics = null) {
  if (!hotspotId) return null;
  return getCityHotspots(scene, metrics).find(hotspot => hotspot.id === hotspotId || hotspot.action === hotspotId) || null;
}

export function getCityDistrictBadges(scene = createHatcherCityScene()) {
  return (scene.badges || []).map(badge => ({
    ...badge,
    tile: { ...badge.tile },
  }));
}

export function getCityRoadCrossings() {
  return ROAD_CROSSINGS.map(crossing => ({
    ...crossing,
    tile: { ...crossing.tile },
  }));
}

export function getCityWayfindingSigns(scene = createHatcherCityScene()) {
  const buildingIds = new Set((scene.buildings || []).map(building => building.id));
  return WAYFINDING_SIGNS.filter(sign => buildingIds.has(sign.targetId)).map(sign => ({
    ...sign,
    tile: { ...sign.tile },
  }));
}

export function getCityExpansionPlots() {
  return EXPANSION_PLOTS.map(plot => ({
    ...plot,
    tile: { ...plot.tile },
  }));
}

export function getCityActivitySignals(scene = createHatcherCityScene()) {
  const buildingsById = new Map((scene.buildings || []).map(building => [building.id, building]));
  return ACTIVITY_SIGNALS.map(signal => {
    const building = buildingsById.get(signal.buildingId);
    if (!building) return null;
    return {
      ...signal,
      tile: {
        x: building.tile.x + (signal.offset?.x || 0),
        y: building.tile.y + (signal.offset?.y || 0),
      },
    };
  }).filter(Boolean);
}

export function drawHatcherCitySurface(canvas, scene = createHatcherCityScene(), assets = {}, options = {}) {
  const ctx = canvas.getContext('2d');
  const metrics = createMetrics(canvas, scene, options);
  ensureCanvasSize(canvas, metrics);

  ctx.save();
  ctx.setTransform(metrics.dpr, 0, 0, metrics.dpr, 0, 0);
  ctx.clearRect(0, 0, metrics.cssWidth, metrics.cssHeight);
  drawBackground(ctx, metrics);

  const orderedTiles = [...scene.tiles].sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.x - b.x);
  const roadCrossings = getCityRoadCrossings(scene);
  for (const tile of orderedTiles) {
    const point = toScreen(tile, metrics);
    const [fill, stroke] = tileStyle(tile.kind);
    drawDiamond(ctx, point, metrics, fill, stroke);
    if (tile.kind === 'road') drawRoadMark(ctx, point, metrics, tile);
    if (tile.kind === 'water') drawWaterDetail(ctx, point, metrics);
    if (tile.kind === 'shore') drawShoreDetail(ctx, point, metrics);
  }
  for (const crossing of roadCrossings) drawRoadCrossing(ctx, crossing, metrics);
  for (const sign of getCityWayfindingSigns(scene)) drawWayfindingSign(ctx, sign, metrics);
  for (const plot of getCityExpansionPlots(scene)) drawExpansionPlot(ctx, plot, metrics);

  const renderQueue = getCityRenderQueue(scene, options);
  for (const drawable of renderQueue) {
    if (drawable.type === 'boat') drawBoat(ctx, drawable.item, metrics);
    else if (drawable.type === 'decoration') drawDecoration(ctx, drawable.item, metrics);
    else if (drawable.type === 'pad') drawBuildingPad(ctx, drawable.item, metrics);
    else if (drawable.type === 'badge') drawDistrictBadge(ctx, drawable.item, metrics);
    else if (drawable.type === 'activity') drawActivitySignal(ctx, { ...drawable.item, elapsedMs: options.elapsedMs || 0 }, metrics);
    else if (drawable.type === 'building') drawBuilding(ctx, drawable.item, assets, metrics, options);
    else if (drawable.type === 'vehicle') drawVehicle(ctx, drawable.item, metrics);
    else if (drawable.type === 'actor') drawActor(ctx, drawable.item, metrics);
  }
  for (const building of scene.buildings || []) {
    const dimmed = options.mode === 'hq' && building.role !== 'common-hq';
    if (building.label && !dimmed && options.framing !== 'cover') {
      drawBuildingLabel(ctx, building, toScreen(building.tile, metrics), metrics);
    }
  }

  drawHotspotFocus(ctx, getCityFocusHotspot(scene, options.activeHotspotId, metrics), metrics);
  drawModeChip(ctx, metrics, options.mode);
  ctx.restore();

  return {
    metrics,
    hotspots: getCityHotspots(scene, metrics),
  };
}
