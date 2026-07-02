import test from 'node:test';
import assert from 'node:assert/strict';

import { G } from './game.js';
import { Agent } from './agent.js';
import { serializeGameState, applyGameStateSnapshot, createHubSnapshot } from './hub-save.js';
import { addCorridor, clearMap, getRoomInstances, getTileMap, loadMapState, placeRoom, serializeMapState } from './map.js';

test('hub snapshots preserve game and map state for the private hub', () => {
  G.reset();
  clearMap();

  G.companyType = 'agency';
  G.money = 12345;
  G.totalRevenue = 67890;
  G.reputation = 42;
  G.day = 9;
  G.unlockedRooms = new Set(['lobby', 'seo', 'content', 'support', 'sales']);

  addCorridor(10, 10);
  addCorridor(11, 10);
  const room = placeRoom('lobby', 10, 11, 5, 3);
  assert.ok(room);

  const snapshot = createHubSnapshot({
    ownerId: 'player-local',
    gameState: serializeGameState(G),
    mapState: serializeMapState(),
  });

  G.reset();
  clearMap();
  assert.equal(getRoomInstances().length, 0);

  applyGameStateSnapshot(G, snapshot.gameState);
  loadMapState(snapshot.mapState);

  assert.equal(snapshot.ownerId, 'player-local');
  assert.equal(G.companyType, 'agency');
  assert.equal(G.money, 12345);
  assert.equal(G.totalRevenue, 67890);
  assert.equal(G.reputation, 42);
  assert.equal(G.day, 9);
  assert.deepEqual([...G.unlockedRooms].sort(), ['content', 'lobby', 'sales', 'seo', 'support']);
  assert.equal(getRoomInstances().length, 1);
  assert.equal(getRoomInstances()[0].typeKey, 'lobby');
  assert.equal(getTileMap()[10][10], 1);
});

test('game snapshots hydrate saved agents back into playable Agent instances', () => {
  G.reset();
  const founder = new Agent('ceo', 12, 13, { name: 'Founder Steward', skill: 0.8 });
  const operator = new Agent('seo', 15, 16, { name: 'Signal Runner', mood: 0.75 });
  operator.tasksCompleted = 3;
  operator.totalRevenue = 4200;
  G.agents = [founder, operator];
  G.ceo = founder;

  const snapshot = serializeGameState(G);
  G.reset();
  applyGameStateSnapshot(G, snapshot);

  assert.equal(G.agents.length, 2);
  assert.equal(G.ceo.name, 'Founder Steward');
  assert.equal(G.agents[1].name, 'Signal Runner');
  assert.equal(G.agents[1].tasksCompleted, 3);
  assert.equal(G.agents[1].totalRevenue, 4200);
  assert.equal(typeof G.agents[1].update, 'function');
});
