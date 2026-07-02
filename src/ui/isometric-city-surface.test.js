import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCityCamera,
  createHatcherCityScene,
  getAnimatedCityBoats,
  getCityRenderQueue,
  getCityCameraBounds,
  getCityActivitySignals,
  getCityDistrictBadges,
  getCityExpansionPlots,
  getCityFocusHotspot,
  getAnimatedCityActors,
  getAnimatedCityVehicles,
  getCityHotspots,
  getCityRoadCrossings,
  getHqHotspot,
  getCityWayfindingSigns,
  HATCHER_CITY_ASSETS,
  panCityCamera,
  resetCityCamera,
} from './isometric-city-surface.js';

test('authored city scene keeps one common HQ and no player-owned city buildings', () => {
  const scene = createHatcherCityScene();
  const hq = scene.buildings.find(building => building.role === 'common-hq');

  assert.ok(hq);
  assert.equal(hq.name, 'Hatcher Market Tower');
  assert.equal(hq.route, 'hq');
  assert.equal(hq.ownerId, undefined);
  assert.equal(scene.buildings.filter(building => building.ownerId).length, 0);
});

test('authored city scene uses licensed building assets and continuous infrastructure', () => {
  const scene = createHatcherCityScene();
  const assetBackedBuildings = scene.buildings.filter(building => building.assetKey);
  const roadTiles = scene.tiles.filter(tile => tile.kind === 'road');
  const waterTiles = scene.tiles.filter(tile => tile.kind === 'water');

  assert.ok(scene.grid.width >= 32);
  assert.ok(scene.grid.height >= 22);
  assert.ok(Object.keys(HATCHER_CITY_ASSETS).length >= 8);
  assert.ok(assetBackedBuildings.length >= 22);
  assert.ok(roadTiles.length >= 90);
  assert.ok(waterTiles.length >= 36);

  const mainRoadRows = new Set(roadTiles.filter(tile => tile.y === 6).map(tile => tile.x));
  for (let x = 1; x <= 13; x += 1) {
    assert.ok(mainRoadRows.has(x), `missing main road tile at x=${x}`);
  }
});

test('authored road tiles expose adjacency metadata for connected rendering', () => {
  const scene = createHatcherCityScene();
  const roadTiles = scene.tiles.filter(tile => tile.kind === 'road');
  const intersections = roadTiles.filter(tile => Object.values(tile.roadConnections || {}).filter(Boolean).length >= 3);

  assert.ok(roadTiles.every(tile => tile.roadConnections), 'missing roadConnections metadata');
  assert.ok(intersections.length >= 6);
  assert.ok(
    roadTiles.some(tile => tile.roadConnections.northEast && tile.roadConnections.southWest),
    'missing north-east/south-west road axis',
  );
  assert.ok(
    roadTiles.some(tile => tile.roadConnections.northWest && tile.roadConnections.southEast),
    'missing north-west/south-east road axis',
  );
});

test('authored road crossings organize key intersections', () => {
  const scene = createHatcherCityScene();
  const crossings = getCityRoadCrossings(scene);
  const footprints = scene.buildings.map(building => building.footprint);

  assert.ok(crossings.length >= 12);
  assert.ok(crossings.every(crossing => crossing.orientation === 'ne-sw' || crossing.orientation === 'nw-se'));

  for (const crossing of crossings) {
    const tile = tileAt(scene, crossing.tile);
    assert.ok(tile, `${crossing.id} is outside the city grid`);
    assert.equal(tile.kind, 'road', `${crossing.id} is on ${tile.kind} instead of road`);
    assert.equal(
      pointInsideAnyFootprint(crossing.tile, footprints, 0.1),
      false,
      `${crossing.id} overlaps a building footprint`,
    );
  }
});

test('authored wayfinding signs point to real playable destinations from roads', () => {
  const scene = createHatcherCityScene();
  const signs = getCityWayfindingSigns(scene);
  const buildingIds = new Set(scene.buildings.filter(building => building.role !== 'landscape').map(building => building.id));

  assert.ok(signs.length >= 8);
  assert.ok(signs.some(sign => sign.code === 'HQ' && sign.targetId === 'hatcher-market-tower'));
  assert.ok(signs.every(sign => sign.code.length <= 4));

  for (const sign of signs) {
    const tile = tileAt(scene, sign.tile);
    assert.ok(tile, `${sign.id} is outside the city grid`);
    assert.equal(tile.kind, 'road', `${sign.id} is on ${tile.kind} instead of road`);
    assert.ok(buildingIds.has(sign.targetId), `${sign.id} targets missing building ${sign.targetId}`);
  }
});

test('authored building footprints do not overlap each other', () => {
  const scene = createHatcherCityScene();
  const buildings = scene.buildings.filter(building => building.footprint);

  assert.equal(buildings.length, scene.buildings.length);

  for (let i = 0; i < buildings.length; i += 1) {
    for (let j = i + 1; j < buildings.length; j += 1) {
      assert.equal(
        footprintsOverlap(buildings[i].footprint, buildings[j].footprint),
        false,
        `${buildings[i].id} overlaps ${buildings[j].id}`,
      );
    }
  }
});

test('authored building footprints stay off water and roads', () => {
  const scene = createHatcherCityScene();
  const invalidKinds = new Set(['water', 'road']);

  for (const building of scene.buildings) {
    for (const tile of occupiedTilesForFootprint(scene, building.footprint)) {
      assert.equal(
        invalidKinds.has(tile.kind),
        false,
        `${building.id} occupies ${tile.kind} tile ${tile.x}:${tile.y}`,
      );
    }
  }
});

test('authored city shoreline frames water with land edge tiles', () => {
  const scene = createHatcherCityScene();
  const shorelineTiles = scene.tiles.filter(tile => tile.kind === 'shore');

  assert.ok(shorelineTiles.length >= 18);

  for (const tile of shorelineTiles) {
    assert.equal(
      adjacentTiles(scene, tile).some(candidate => candidate.kind === 'water'),
      true,
      `shore tile ${tile.x}:${tile.y} is not adjacent to water`,
    );
  }
});

test('authored buildings have grounded pads on valid terrain', () => {
  const scene = createHatcherCityScene();
  const invalidKinds = new Set(['water', 'road']);

  for (const building of scene.buildings) {
    assert.ok(building.pad, `${building.id} is missing a ground pad`);
    assert.ok(building.pad.w >= building.footprint.w, `${building.id} pad is narrower than footprint`);
    assert.ok(building.pad.h >= building.footprint.h, `${building.id} pad is shorter than footprint`);

    for (const tile of occupiedTilesForFootprint(scene, building.pad)) {
      assert.equal(
        invalidKinds.has(tile.kind),
        false,
        `${building.id} pad occupies ${tile.kind} tile ${tile.x}:${tile.y}`,
      );
    }
  }
});

test('authored waterfront props are anchored to water or shoreline', () => {
  const scene = createHatcherCityScene();
  const waterfrontProps = scene.decorations.filter(decoration => decoration.group === 'waterfront');

  assert.ok(waterfrontProps.length >= 5);

  for (const decoration of waterfrontProps) {
    const tile = tileAt(scene, decoration.tile);
    assert.ok(tile, `${decoration.id} is outside the city grid`);
    assert.ok(
      tile.kind === 'water' || tile.kind === 'shore',
      `${decoration.id} is on ${tile.kind} instead of water or shore`,
    );
    assert.equal(
      adjacentTiles(scene, tile).some(candidate => candidate.kind === 'water' || candidate.kind === 'shore'),
      true,
      `${decoration.id} is not connected to the waterfront`,
    );
  }
});

test('authored district props add readable map anchors without blocking routes', () => {
  const scene = createHatcherCityScene();
  const districtProps = scene.decorations.filter(decoration => decoration.group === 'district');
  const invalidKinds = new Set(['water', 'road']);
  const footprints = scene.buildings.map(building => building.footprint);

  assert.ok(districtProps.length >= 14);
  assert.ok(districtProps.some(prop => prop.kind === 'streetlight'));
  assert.ok(districtProps.some(prop => prop.kind === 'planter'));
  assert.ok(districtProps.some(prop => prop.kind === 'billboard'));

  for (const decoration of districtProps) {
    const tile = tileAt(scene, decoration.tile);
    assert.ok(tile, `${decoration.id} is outside the city grid`);
    assert.equal(invalidKinds.has(tile.kind), false, `${decoration.id} is on ${tile.kind}`);
    assert.equal(
      pointInsideAnyFootprint(decoration.tile, footprints, 0.25),
      false,
      `${decoration.id} overlaps a building footprint`,
    );
  }
});

test('authored harbor traffic moves on water without touching buildings', () => {
  const scene = createHatcherCityScene();
  const start = getAnimatedCityBoats(scene, 0);
  const later = getAnimatedCityBoats(scene, 2800);
  const footprints = scene.buildings.map(building => building.footprint);

  assert.ok(scene.waterTraffic.length >= 3);
  assert.ok(start.every(boat => boat.path?.length >= 2));
  assert.ok(later.some(boat => {
    const before = start.find(startBoat => startBoat.id === boat.id);
    return before && (before.tile.x !== boat.tile.x || before.tile.y !== boat.tile.y);
  }));

  for (const boat of scene.waterTraffic) {
    for (const point of sampleRoute(boat.path || [boat.tile], 16)) {
      assert.ok(['water', 'shore'].includes(tileKindAt(scene, point)), `${boat.id} leaves the harbor at ${point.x.toFixed(2)}:${point.y.toFixed(2)}`);
      assert.equal(
        pointInsideAnyFootprint(point, footprints, 0.2),
        false,
        `${boat.id} crosses a building near ${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      );
    }
  }
});

test('authored activity signals attach to real playable districts', () => {
  const scene = createHatcherCityScene();
  const signals = getCityActivitySignals(scene);
  const buildingIds = new Set(scene.buildings.filter(building => building.role !== 'landscape').map(building => building.id));

  assert.ok(signals.length >= 8);
  assert.ok(signals.some(signal => signal.kind === 'mission'));
  assert.ok(signals.some(signal => signal.kind === 'trade'));
  assert.ok(signals.every(signal => buildingIds.has(signal.buildingId)));
  assert.ok(signals.every(signal => signal.label && signal.code.length <= 2));
});

test('authored district badges identify play areas without blocking the map', () => {
  const scene = createHatcherCityScene();
  const badges = getCityDistrictBadges(scene);
  const invalidKinds = new Set(['water', 'road']);
  const footprints = scene.buildings.map(building => building.footprint);

  assert.ok(badges.length >= 10);
  assert.ok(badges.some(badge => badge.code === 'MKT' && badge.label === 'Market'));
  assert.ok(badges.some(badge => badge.code === 'R&D' && badge.label === 'Research'));
  assert.ok(badges.every(badge => badge.code.length <= 4));

  for (const badge of badges) {
    const tile = tileAt(scene, badge.tile);
    assert.ok(tile, `${badge.id} is outside the city grid`);
    assert.equal(invalidKinds.has(tile.kind), false, `${badge.id} is on ${tile.kind}`);
    assert.equal(
      pointInsideAnyFootprint(badge.tile, footprints, 0.1),
      false,
      `${badge.id} overlaps a building footprint`,
    );
  }
});

test('authored expansion plots reserve future buildable city lots', () => {
  const scene = createHatcherCityScene();
  const plots = getCityExpansionPlots(scene);
  const invalidKinds = new Set(['water', 'road']);
  const footprints = scene.buildings.map(building => building.footprint);

  assert.ok(plots.length >= 6);
  assert.ok(plots.every(plot => plot.code.length <= 4));
  assert.ok(plots.every(plot => plot.visual === 'outline'));
  assert.ok(plots.some(plot => plot.kind === 'lab'));
  assert.ok(plots.some(plot => plot.kind === 'market'));

  for (const plot of plots) {
    const tile = tileAt(scene, plot.tile);
    assert.ok(tile, `${plot.id} is outside the city grid`);
    assert.equal(invalidKinds.has(tile.kind), false, `${plot.id} is on ${tile.kind}`);
    assert.equal(
      pointInsideAnyFootprint(plot.tile, footprints, 0.3),
      false,
      `${plot.id} overlaps a building footprint`,
    );
  }
});

test('city render queue uses explicit layers and footprint front-edge depth', () => {
  const scene = createHatcherCityScene();
  const queue = getCityRenderQueue(scene, { elapsedMs: 2400 });

  const firstPadIndex = queue.findIndex(item => item.layer === 'pad');
  const firstDrawableIndex = queue.findIndex(item => item.layer === 'building' || item.layer === 'vehicle' || item.layer === 'actor');

  assert.ok(firstPadIndex > 0);
  assert.ok(firstDrawableIndex > firstPadIndex);
  assert.ok(queue.slice(0, firstPadIndex).every(item => item.layer === 'water-traffic' || item.layer === 'decoration'));
  assert.ok(queue.slice(firstPadIndex, firstDrawableIndex).every(item => item.layer === 'pad' || item.layer === 'badge' || item.layer === 'activity'));
  assert.ok(queue.find(item => item.layer === 'water-traffic'));
  assert.ok(queue.find(item => item.layer === 'badge'));
  assert.ok(queue.find(item => item.layer === 'activity'));

  const hq = scene.buildings.find(building => building.id === 'hatcher-market-tower');
  const hqDrawable = queue.find(item => item.type === 'building' && item.item.id === hq.id);
  const expectedDepth = hq.footprint.x + hq.footprint.w + hq.footprint.y + hq.footprint.h;

  assert.ok(hqDrawable);
  assert.equal(hqDrawable.depth, expectedDepth);
  assert.ok(queue.find(item => item.layer === 'actor'));
  assert.ok(queue.find(item => item.layer === 'vehicle'));

  const dynamicItems = queue.slice(firstDrawableIndex);
  assert.deepEqual(
    dynamicItems.map(item => item.depth),
    [...dynamicItems].map(item => item.depth).sort((a, b) => a - b),
  );
});

test('authored city scene includes player-like actors on the map', () => {
  const scene = createHatcherCityScene();

  assert.ok(scene.actors.length >= 4);
  assert.ok(scene.actors.every(actor => actor.label && actor.tile));
  assert.ok(scene.actors.some(actor => actor.path?.length >= 2));
});

test('authored city scene keeps the outer districts alive with routes', () => {
  const scene = createHatcherCityScene();

  assert.ok(scene.actors.length >= 7);
  assert.ok(scene.vehicles.length >= 5);
  assert.ok(scene.actors.some(actor => actor.id === 'harbor-trader'));
  assert.ok(scene.vehicles.some(vehicle => vehicle.id === 'arena-shuttle'));
});

test('animated city actors move along authored routes over time', () => {
  const scene = createHatcherCityScene();
  const start = getAnimatedCityActors(scene, 0);
  const later = getAnimatedCityActors(scene, 3200);
  const movedActor = later.find(actor => {
    const before = start.find(startActor => startActor.id === actor.id);
    return before && (before.tile.x !== actor.tile.x || before.tile.y !== actor.tile.y);
  });

  assert.ok(movedActor);
  assert.equal(movedActor.label, scene.actors.find(actor => actor.id === movedActor.id).label);
  assert.equal(typeof movedActor.tile.x, 'number');
  assert.equal(typeof movedActor.tile.y, 'number');
});

test('animated city vehicles move on authored road routes', () => {
  const scene = createHatcherCityScene();
  const start = getAnimatedCityVehicles(scene, 0);
  const later = getAnimatedCityVehicles(scene, 2400);

  assert.ok(scene.vehicles.length >= 3);
  assert.ok(start.every(vehicle => vehicle.path?.length >= 2));
  assert.ok(later.some(vehicle => {
    const before = start.find(startVehicle => startVehicle.id === vehicle.id);
    return before && (before.tile.x !== vehicle.tile.x || before.tile.y !== vehicle.tile.y);
  }));
});

test('moving actors and vehicles do not route through building footprints', () => {
  const scene = createHatcherCityScene();
  const footprints = scene.buildings.map(building => building.footprint);

  for (let elapsedMs = 0; elapsedMs <= 12000; elapsedMs += 800) {
    for (const actor of getAnimatedCityActors(scene, elapsedMs)) {
      assert.equal(
        pointInsideAnyFootprint(actor.tile, footprints),
        false,
        `${actor.id} intersects a building footprint at ${elapsedMs}ms`,
      );
    }
    for (const vehicle of getAnimatedCityVehicles(scene, elapsedMs)) {
      assert.equal(
        pointInsideAnyFootprint(vehicle.tile, footprints),
        false,
        `${vehicle.id} intersects a building footprint at ${elapsedMs}ms`,
      );
    }
  }
});

test('authored route segments stay outside buildings and water', () => {
  const scene = createHatcherCityScene();
  const footprints = scene.buildings.map(building => building.footprint);

  for (const actor of scene.actors) {
    for (const point of sampleRoute(actor.path || [actor.tile], 24)) {
      assert.equal(
        pointInsideAnyFootprint(point, footprints, 0.35),
        false,
        `${actor.id} route crosses a building near ${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      );
      assert.notEqual(
        tileKindAt(scene, point),
        'water',
        `${actor.id} route crosses water near ${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      );
    }
  }

  for (const vehicle of scene.vehicles) {
    for (const point of sampleRoute(vehicle.path || [vehicle.tile], 24)) {
      assert.equal(
        pointInsideAnyFootprint(point, footprints, 0.25),
        false,
        `${vehicle.id} route crosses a building near ${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      );
      assert.notEqual(
        tileKindAt(scene, point),
        'water',
        `${vehicle.id} route crosses water near ${point.x.toFixed(2)}:${point.y.toFixed(2)}`,
      );
    }
  }
});

test('city camera pans within viewport bounds', () => {
  const scene = createHatcherCityScene();
  const camera = createCityCamera();
  const bounds = getCityCameraBounds(scene, { width: 1440, height: 900 });

  const moved = panCityCamera(camera, { x: 120, y: -80 }, bounds);
  assert.equal(moved.x, 120);
  assert.equal(moved.y, -80);

  const clamped = panCityCamera(moved, { x: 10000, y: -10000 }, bounds);
  assert.equal(clamped.x, bounds.maxX);
  assert.equal(clamped.y, bounds.minY);

  assert.deepEqual(resetCityCamera(clamped), { x: 0, y: 0 });
});

test('common HQ exposes a canvas hotspot for entering the shared tower', () => {
  const scene = createHatcherCityScene();
  const hotspot = getHqHotspot(scene);

  assert.equal(hotspot.action, 'open-hq');
  assert.equal(hotspot.label, 'Hatcher Market Tower');
  assert.equal(typeof hotspot.center.x, 'number');
  assert.equal(typeof hotspot.center.y, 'number');
  assert.ok(hotspot.radius > 20);
});

test('city map exposes inspect hotspots for authored districts', () => {
  const scene = createHatcherCityScene();
  const hotspots = getCityHotspots(scene);
  const hq = hotspots.find(hotspot => hotspot.action === 'open-hq');
  const districtHotspots = hotspots.filter(hotspot => hotspot.action === 'inspect-district');

  assert.ok(hq);
  assert.ok(districtHotspots.length >= 12);
  assert.ok(districtHotspots.every(hotspot => hotspot.label && hotspot.status));
  assert.ok(districtHotspots.every(hotspot => !hotspot.status.endsWith(' district')));
  assert.ok(districtHotspots.some(hotspot => hotspot.label === 'Signal Academy'));
  assert.ok(districtHotspots.some(hotspot => /contracts|orders|signals/i.test(hotspot.status)));
});

test('city focus resolver can target HQ and authored district hotspots', () => {
  const scene = createHatcherCityScene();

  assert.equal(getCityFocusHotspot(scene, 'open-hq').label, 'Hatcher Market Tower');
  assert.equal(getCityFocusHotspot(scene, 'signal-academy').label, 'Signal Academy');
  assert.equal(getCityFocusHotspot(scene, 'missing-district'), null);
});

function footprintsOverlap(a, b) {
  return a.x < b.x + b.w
    && a.x + a.w > b.x
    && a.y < b.y + b.h
    && a.y + a.h > b.y;
}

function pointInsideAnyFootprint(point, footprints, padding = 0) {
  return footprints.some(footprint => (
    point.x >= footprint.x - padding
    && point.x <= footprint.x + footprint.w + padding
    && point.y >= footprint.y - padding
    && point.y <= footprint.y + footprint.h + padding
  ));
}

function occupiedTilesForFootprint(scene, footprint) {
  return scene.tiles.filter(tile => (
    tile.x >= Math.floor(footprint.x)
    && tile.x <= Math.ceil(footprint.x + footprint.w)
    && tile.y >= Math.floor(footprint.y)
    && tile.y <= Math.ceil(footprint.y + footprint.h)
    && tile.x >= footprint.x
    && tile.x <= footprint.x + footprint.w
    && tile.y >= footprint.y
    && tile.y <= footprint.y + footprint.h
  ));
}

function adjacentTiles(scene, tile) {
  const offsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  return offsets
    .map(offset => scene.tiles.find(candidate => candidate.x === tile.x + offset.x && candidate.y === tile.y + offset.y))
    .filter(Boolean);
}

function sampleRoute(path, stepsPerSegment) {
  const points = [];
  for (let i = 0; i < path.length; i += 1) {
    const from = path[i];
    const to = path[(i + 1) % path.length];
    for (let step = 0; step <= stepsPerSegment; step += 1) {
      const t = step / stepsPerSegment;
      points.push({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      });
    }
  }
  return points;
}

function tileKindAt(scene, point) {
  return tileAt(scene, point)?.kind;
}

function tileAt(scene, point) {
  const tile = scene.tiles.find(candidate => (
    candidate.x === Math.round(point.x)
    && candidate.y === Math.round(point.y)
  ));
  return tile;
}
