import { Agent } from './agent.js';

export const HUB_SAVE_VERSION = 1;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function serializeSet(value) {
  return [...(value || [])];
}

function serializeAgent(agent) {
  return {
    id: agent.id,
    roleKey: agent.roleKey,
    name: agent.name,
    avatar: agent.avatar,
    x: agent.x,
    y: agent.y,
    mood: agent.mood,
    skill: agent.skill,
    energy: agent.energy,
    salary: agent.salary,
    seniority: agent.seniority,
    iq: agent.iq,
    motivation: agent.motivation,
    alignment: agent.alignment,
    tasksCompleted: agent.tasksCompleted,
    totalRevenue: agent.totalRevenue,
    workHistory: asArray(agent.workHistory).map(entry => ({ ...entry })),
    skinTone: agent.skinTone,
    hairColor: agent.hairColor,
    hairStyle: agent.hairStyle,
  };
}

function hydrateAgent(savedAgent) {
  const agent = new Agent(
    savedAgent.roleKey || 'seo',
    savedAgent.x ?? 0,
    savedAgent.y ?? 0,
    savedAgent,
  );
  agent.id = savedAgent.id;
  agent.tasksCompleted = savedAgent.tasksCompleted ?? 0;
  agent.totalRevenue = savedAgent.totalRevenue ?? 0;
  agent.workHistory = asArray(savedAgent.workHistory).map(entry => ({ ...entry }));
  agent.state = 'idle';
  agent.task = null;
  agent.path = [];
  agent.pathIdx = 0;
  agent.speech = null;
  agent.speechTimer = 0;
  return agent;
}

export function serializeGameState(game) {
  return {
    version: HUB_SAVE_VERSION,
    companyType: game.companyType,
    unlockedRooms: serializeSet(game.unlockedRooms),
    money: game.money,
    totalRevenue: game.totalRevenue,
    reputation: game.reputation,
    day: game.day,
    week: game.week,
    marketingBudget: game.marketingBudget,
    gameSpeed: game.gameSpeed,
    analyticsLevel: game.analyticsLevel,
    debt: game.debt,
    loanCount: game.loanCount,
    agents: asArray(game.agents).map(serializeAgent),
    ceoAgentId: game.ceo?.id ?? null,
    dailyHistory: asArray(game.dailyHistory).map(entry => ({ ...entry })),
    completedLog: asArray(game.completedLog).map(entry => ({ ...entry })),
    metrics: { ...(game.metrics || {}) },
  };
}

export function applyGameStateSnapshot(game, snapshot) {
  if (!snapshot) return;

  game.reset();
  game.companyType = snapshot.companyType ?? null;
  game.unlockedRooms = new Set(snapshot.unlockedRooms || ['lobby', 'seo', 'content', 'support']);
  game.money = snapshot.money ?? game.money;
  game.totalRevenue = snapshot.totalRevenue ?? game.totalRevenue;
  game.reputation = snapshot.reputation ?? game.reputation;
  game.day = snapshot.day ?? game.day;
  game.week = snapshot.week ?? game.week;
  game.marketingBudget = snapshot.marketingBudget ?? game.marketingBudget;
  game.gameSpeed = snapshot.gameSpeed ?? game.gameSpeed;
  game.analyticsLevel = snapshot.analyticsLevel ?? game.analyticsLevel;
  game.debt = snapshot.debt ?? game.debt;
  game.loanCount = snapshot.loanCount ?? game.loanCount;
  game.agents = asArray(snapshot.agents).map(hydrateAgent);
  game.ceo = game.agents.find(agent => agent.id === snapshot.ceoAgentId) || game.agents.find(agent => agent.roleKey === 'ceo') || null;
  game.dailyHistory = asArray(snapshot.dailyHistory).map(entry => ({ ...entry }));
  game.completedLog = asArray(snapshot.completedLog).map(entry => ({ ...entry }));
  game.metrics = { ...game.metrics, ...(snapshot.metrics || {}) };
  game.missionDismissed = Boolean(snapshot.companyType);
  game.uiDirty = true;
}

export function createHubSnapshot({ ownerId, gameState, mapState }) {
  return {
    version: HUB_SAVE_VERSION,
    ownerId,
    savedAt: new Date().toISOString(),
    gameState,
    mapState,
  };
}
