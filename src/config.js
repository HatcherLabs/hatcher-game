// ═══════════════════════════════════════════════════════════════
//  HATCHER MARKETS — Configuration & Constants
// ═══════════════════════════════════════════════════════════════

export const TILE_W = 64;
export const TILE_H = 32;
export const WALL_H = 44;
export const MAP_W = 50;
export const MAP_H = 44;

// Starting conditions
export const START_MONEY = 10000;
export const WIN_REVENUE = 1000000;
export const BANKRUPTCY_THRESHOLD = -5000;

// ─── Room costs (per day rent) ─────────────────────────────
export const ROOM_COSTS = {
  seo:        25,
  content:    25,
  video:      35,
  design:     30,
  data:       40,
  support:    20,
  sales:      25,
  engineering: 40,
  workshop:   30,
  marketing:  35,
  pr:         25,
  hr:         15,
  finance:    20,
  legal:      25,
  it:         35,
  rd:         45,
  warehouse:  10,
  shopfront:  20,
  breakroom:  10,
  meeting:    15,
  lobby:       0,
};

// ─── Agent salaries (per day) ──────────────────────────────
export const AGENT_SALARY = {
  ceo:            0,
  seo_analyst:    80,
  content_writer: 70,
  video_creator:  90,
  designer:       85,
  data_analyst:   95,
  support_agent:  60,
  sales_rep:      75,
  engineer:      100,
  craftsman:      75,
  marketer:       85,
  pr_specialist:  80,
  hr_manager:     65,
  accountant:     70,
  lawyer:         90,
  it_admin:       80,
  researcher:     95,
  warehouse_mgr:  55,
  shop_assistant: 65,
};

export const HIRE_COST = 800;

// ─── Alignment System ──────────────────────────────────────
export const ALIGNMENT = {
  new_hire_min: 0.10,       // new hires start very low
  new_hire_max: 0.30,       // max starting alignment
  decay_per_day: 0.008,     // daily natural decay (need regular meetings)
  decay_team_size_factor: 0.002, // extra decay per team member (bigger teams drift faster)
  standup_boost: 0.12,      // biweekly standup alignment gain
  team_building_boost: 0.15, // CEO team building alignment gain
  team_building_ticks: 180,  // how long team building takes (game ticks)
  meeting_efficiency_penalty: 0.0, // agents in meetings produce 0 work
  misalignment_waste_threshold: 0.35, // below this, agents waste time
  misalignment_quit_threshold: 0.20,  // below this + low motivation → quit risk
  efficiency_bonus_max: 0.15, // max efficiency bonus at full alignment
  efficiency_penalty_max: 0.30, // max efficiency penalty at 0 alignment
  quality_bonus_max: 0.10,   // max quality bonus at full alignment
};

export const SPEECH_MISALIGNED = [
  'Wait, what are we building again?',
  'I thought we were doing something else...',
  'Are we all on the same page?',
  'This doesn\'t match what I was told...',
  'I\'m confused about priorities...',
  'Working on... something?',
  'Did the plan change?',
];

export const SPEECH_ALIGNED = [
  'Crew is moving in one direction! 🎯',
  'Crew is in sync!',
  'Clear on mission priorities!',
  'Great sync, great results!',
  'Everyone knows the plan!',
];

export const SPEECH_TEAM_BUILDING = [
  'Hub sync time! 🎳',
  'Getting the crew aligned!',
  'Same page, same mission!',
  'Strategy sync session!',
  'Trust exercises! 🤝',
];

export const SPEECH_QUIT_MISALIGNED = [
  'I don\'t even know what we\'re doing anymore. I\'m out.',
  'This crew has no direction. Bye.',
  'I can\'t work like this. Good luck.',
];

// ─── Agent Seniority Tiers ───────────────────────────────
export const SENIORITY_LEVELS = {
  1: { label: 'Junior',     skillRange: [0.20, 0.40], salaryMult: 0.70, spawnWeight: 30, promoteAt: 0.42 },
  2: { label: 'Regular',    skillRange: [0.35, 0.55], salaryMult: 0.85, spawnWeight: 35, promoteAt: 0.57 },
  3: { label: 'Senior',     skillRange: [0.50, 0.70], salaryMult: 1.00, spawnWeight: 20, promoteAt: 0.72 },
  4: { label: 'Lead',       skillRange: [0.65, 0.85], salaryMult: 1.25, spawnWeight: 10, promoteAt: 0.88 },
  5: { label: 'Principal',  skillRange: [0.80, 0.95], salaryMult: 1.50, spawnWeight: 5,  promoteAt: null },
};

export function seniorityStars(level) {
  return '★'.repeat(level) + '☆'.repeat(5 - level);
}

// ─── Economy parameters ────────────────────────────────────
export const ECONOMY = {
  base_cpc: 2.50,
  base_website_cr: 0.03,
  base_close_rate: 0.15,
  sales_capacity_per_eff: 0.5,   // deals/day per 1.0 total sales efficiency
  no_sales_capacity: 0.02,       // background inbound without dedicated sales
  marketing_power_divisor: 220,  // converts budget into GTM power
  delivery_gtm_ratio: 0.5,       // required GTM power vs delivery efficiency
  reputation_organic_factor: 2.0,
  starting_reputation: 35,
  grace_period_days: 14,
  content_organic_factor: 20,
  seo_organic_factor: 15,
  design_quality_cr_boost: 1.5,
  content_quality_cr_boost: 1.0,
  meeting_room_close_boost: 1.2,
  day_ticks: 900,         // ticks per game day
  week_days: 5,           // business days per week
  sales_deal_bonus: 0.15,        // +15% pay for sales-closed deals
  no_sales_flow_rate: 0.30,      // only 30% of clients become projects without Sales
  support_rep_decay: 0.3,        // reputation decay per day without Support
  support_rep_gain: 0.1,         // reputation gain per day with Support
};

// ─── Cross-office synergy definitions ────────────────────────
export const OFFICE_SYNERGIES = {
  content: [
    { requires: 'design', bonus: 0.10, label: 'Design assets' },
    { requires: 'seo',    bonus: 0.10, label: 'SEO optimization' },
  ],
  design: [
    { requires: 'content', bonus: 0.10, label: 'Content brief' },
  ],
  video: [
    { requires: 'design',  bonus: 0.15, label: 'Motion graphics' },
    { requires: 'content', bonus: 0.10, label: 'Script quality' },
  ],
  seo: [
    { requires: 'content', bonus: 0.15, label: 'Content-driven SEO' },
    { requires: 'data',    bonus: 0.10, label: 'Data insights' },
  ],
  sales: [
    { requires: 'design',  bonus: 0.15, label: 'Polished decks' },
  ],
  engineering: [
    { requires: 'design',  bonus: 0.10, label: 'UI/UX design' },
    { requires: 'data',    bonus: 0.10, label: 'Data pipeline' },
  ],
  workshop: [
    { requires: 'design',      bonus: 0.15, label: 'Design specs' },
    { requires: 'engineering',  bonus: 0.10, label: 'CAD models' },
  ],
  marketing: [
    { requires: 'content', bonus: 0.15, label: 'Content assets' },
    { requires: 'design',  bonus: 0.10, label: 'Visual branding' },
  ],
  pr: [
    { requires: 'content', bonus: 0.10, label: 'Story angles' },
  ],
  shopfront: [
    { requires: 'design', bonus: 0.15, label: 'Fashion design' },
    { requires: 'marketing', bonus: 0.10, label: 'Promotions' },
  ],
};

// ─── Room type definitions ─────────────────────────────────
export const OFFICE_TYPES = {
  seo: {
    name: 'Signal Scanner', icon: '📡', accent: '#50b868',
    accentRGB: [80,184,104], floorBase: [62,72,58], wallBase: [75,90,70], floorPattern: 'carpet',
    size: { w: 7, h: 5 }, cost: 1500,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 3 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'monitor', lx: 4, ly: 1, screens: 2, interactive: true, configKey: 'seo_keywords', label: 'Keyword Strategy' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'shelf', lx: 0, ly: 0 },
      { type: 'whiteboard', lx: 5, ly: 0, interactive: true, configKey: 'seo_focus', label: 'SEO Focus' },
      { type: 'plant', lx: 6, ly: 4 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  content: {
    name: 'Broadcast Studio', icon: '📣', accent: '#9068d0',
    accentRGB: [144,104,208], floorBase: [62,56,72], wallBase: [80,70,95], floorPattern: 'carpet',
    size: { w: 7, h: 5 }, cost: 1200,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 1 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'bookshelf', lx: 0, ly: 0, interactive: true, configKey: 'content_research', label: 'Research Depth' },
      { type: 'bookshelf', lx: 0, ly: 3 },
      { type: 'desk', lx: 4, ly: 2 },
      { type: 'monitor', lx: 4, ly: 1, screens: 1, interactive: true, configKey: 'content_style', label: 'Content Style' },
      { type: 'chair', lx: 4, ly: 3 },
      { type: 'whiteboard', lx: 5, ly: 0 },
      { type: 'plant', lx: 6, ly: 4 },
    ],
    workTiles: [[2, 2], [5, 3], [3, 3]],
  },
  video: {
    name: 'Mission Theatre', icon: '🎬', accent: '#e07030',
    accentRGB: [224,112,48], floorBase: [72,60,50], wallBase: [95,78,65], floorPattern: 'lab',
    size: { w: 7, h: 5 }, cost: 2000,
    furniture: [
      { type: 'greenscreen', lx: 5, ly: 1, interactive: true, configKey: 'video_effects', label: 'Visual Effects' },
      { type: 'greenscreen', lx: 5, ly: 2 },
      { type: 'greenscreen', lx: 5, ly: 3 },
      { type: 'camera', lx: 3, ly: 2, interactive: true, configKey: 'video_quality', label: 'Production Quality' },
      { type: 'softbox', lx: 1, ly: 1 },
      { type: 'ringlight', lx: 1, ly: 3 },
      { type: 'plant', lx: 0, ly: 0 },
      { type: 'crate', lx: 6, ly: 4 },
    ],
    workTiles: [[4, 2], [2, 3], [3, 3]],
  },
  design: {
    name: 'Blueprint Studio', icon: '🧩', accent: '#d058a0',
    accentRGB: [208,88,160], floorBase: [72,56,64], wallBase: [95,72,85], floorPattern: 'wood',
    size: { w: 7, h: 5 }, cost: 1800,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'tablet', lx: 4, ly: 1, interactive: true, configKey: 'design_style', label: 'Design Style' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'shelf', lx: 0, ly: 0 },
      { type: 'colorwall', lx: 5, ly: 0, interactive: true, configKey: 'design_palette', label: 'Color Palette' },
      { type: 'plant', lx: 5, ly: 3 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  data: {
    name: 'Signal Lab', icon: '📊', accent: '#4090e0',
    accentRGB: [64,144,224], floorBase: [50,58,72], wallBase: [65,75,95], floorPattern: 'lab',
    size: { w: 7, h: 5 }, cost: 2500,
    furniture: [
      { type: 'server', lx: 0, ly: 0, interactive: true, configKey: 'data_server', label: 'Analytics Dashboard' },
      { type: 'server', lx: 0, ly: 1 },
      { type: 'desk', lx: 2, ly: 1 },
      { type: 'monitor', lx: 3, ly: 1, screens: 3 },
      { type: 'chair', lx: 2, ly: 2 },
      { type: 'desk', lx: 5, ly: 2 },
      { type: 'monitor', lx: 5, ly: 1, screens: 2, interactive: true, configKey: 'data_monitor', label: 'Full Metrics' },
      { type: 'chair', lx: 5, ly: 3 },
      { type: 'plant', lx: 6, ly: 0 },
    ],
    workTiles: [[3, 2], [6, 3], [4, 3]],
  },
  support: {
    name: 'Care Pod', icon: '🛟', accent: '#40b0b0',
    accentRGB: [64,176,176], floorBase: [50,68,68], wallBase: [65,88,88], floorPattern: 'tile',
    size: { w: 7, h: 5 }, cost: 1000,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'desk', lx: 4, ly: 1 },
      { type: 'monitor', lx: 4, ly: 1, screens: 1, interactive: true, configKey: 'support_templates', label: 'Response Templates' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'ticketboard', lx: 0, ly: 0, interactive: true, configKey: 'support_sla', label: 'SLA Target' },
      { type: 'plant', lx: 5, ly: 3 },
      { type: 'plant', lx: 0, ly: 3 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  sales: {
    name: 'Deal Desk', icon: '🤝', accent: '#e0a030',
    accentRGB: [224,160,48], floorBase: [72,64,50], wallBase: [95,85,65], floorPattern: 'carpet',
    size: { w: 7, h: 5 }, cost: 1500,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'desk', lx: 4, ly: 1 },
      { type: 'monitor', lx: 4, ly: 1, screens: 1, interactive: true, configKey: 'sales_followup', label: 'Follow-up Intensity' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'whiteboard', lx: 0, ly: 0, interactive: true, configKey: 'sales_pricing', label: 'Pricing Strategy' },
      { type: 'bigtv', lx: 6, ly: 0, interactive: true, configKey: 'sales_commission', label: 'Commission Rate' },
      { type: 'plant', lx: 6, ly: 4 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  engineering: {
    name: 'Protocol Lab', icon: '⚙️', accent: '#5090c0',
    accentRGB: [80,144,192], floorBase: [52,60,70], wallBase: [68,78,92], floorPattern: 'lab',
    size: { w: 7, h: 5 }, cost: 2800,
    furniture: [
      { type: 'server', lx: 0, ly: 0 },
      { type: 'monitor', lx: 2, ly: 1, screens: 3 },
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'desk', lx: 4, ly: 1 },
      { type: 'monitor', lx: 4, ly: 1, screens: 2, interactive: true, configKey: 'eng_methodology', label: 'Dev Methodology' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'whiteboard', lx: 5, ly: 0, interactive: true, configKey: 'eng_stack', label: 'Tech Stack' },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  workshop: {
    name: 'Fabricator Bay', icon: '🔧', accent: '#8b6c42',
    accentRGB: [139,108,66], floorBase: [66,58,48], wallBase: [86,76,62], floorPattern: 'concrete',
    size: { w: 7, h: 5 }, cost: 1800,
    furniture: [
      { type: 'crate', lx: 0, ly: 0 },
      { type: 'crate', lx: 0, ly: 1 },
      { type: 'table', lx: 2, ly: 1, interactive: true, configKey: 'workshop_quality', label: 'Build Quality' },
      { type: 'shelf', lx: 5, ly: 0, interactive: true, configKey: 'workshop_tools', label: 'Tool Grade' },
      { type: 'desk', lx: 4, ly: 2 },
      { type: 'chair', lx: 4, ly: 3 },
      { type: 'plant', lx: 6, ly: 4 },
    ],
    workTiles: [[3, 2], [5, 3], [2, 3]],
  },
  marketing: {
    name: 'Signal Relay', icon: '📡', accent: '#c05080',
    accentRGB: [192,80,128], floorBase: [70,54,62], wallBase: [92,70,82], floorPattern: 'carpet',
    size: { w: 7, h: 5 }, cost: 2000,
    furniture: [
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'desk', lx: 4, ly: 1 },
      { type: 'monitor', lx: 4, ly: 1, screens: 2, interactive: true, configKey: 'marketing_channel', label: 'Channel Focus' },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'whiteboard', lx: 5, ly: 0 },
      { type: 'bigtv', lx: 6, ly: 0, interactive: true, configKey: 'marketing_spend', label: 'Ad Spend Level' },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  pr: {
    name: 'Herald Desk', icon: '📰', accent: '#70a050',
    accentRGB: [112,160,80], floorBase: [56,66,52], wallBase: [72,86,66], floorPattern: 'carpet',
    size: { w: 7, h: 5 }, cost: 1500,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 1 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'couch', lx: 4, ly: 0, interactive: true, configKey: 'pr_approach', label: 'PR Approach' },
      { type: 'bookshelf', lx: 0, ly: 0 },
      { type: 'plant', lx: 5, ly: 3 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
  hr: {
    name: 'Hatchery', icon: '🥚', accent: '#9080c0',
    accentRGB: [144,128,192], floorBase: [58,56,66], wallBase: [76,72,88], floorPattern: 'carpet',
    size: { w: 7, h: 4 }, cost: 1200,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 1 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'shelf', lx: 0, ly: 0 },
      { type: 'couch', lx: 4, ly: 0 },
      { type: 'plant', lx: 5, ly: 3 },
    ],
    workTiles: [[2, 2], [5, 2]],
  },
  finance: {
    name: 'Treasury', icon: '🏦', accent: '#50a070',
    accentRGB: [80,160,112], floorBase: [52,64,58], wallBase: [68,84,74], floorPattern: 'tile',
    size: { w: 7, h: 4 }, cost: 1500,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'monitor', lx: 4, ly: 1, screens: 2 },
      { type: 'desk', lx: 4, ly: 1 },
      { type: 'server', lx: 0, ly: 0 },
    ],
    workTiles: [[2, 2], [5, 2]],
  },
  legal: {
    name: 'Compliance Desk', icon: '⚖️', accent: '#a08860',
    accentRGB: [160,136,96], floorBase: [64,58,50], wallBase: [84,76,66], floorPattern: 'tile',
    size: { w: 7, h: 4 }, cost: 2500,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'bookshelf', lx: 0, ly: 0 },
      { type: 'bookshelf', lx: 0, ly: 2 },
      { type: 'shelf', lx: 5, ly: 0 },
      { type: 'chair', lx: 1, ly: 2 },
    ],
    workTiles: [[2, 2], [5, 2]],
  },
  it: {
    name: 'Node Room', icon: '🖥️', accent: '#6090b0',
    accentRGB: [96,144,176], floorBase: [50,56,64], wallBase: [66,74,84], floorPattern: 'lab',
    size: { w: 7, h: 4 }, cost: 3000,
    furniture: [
      { type: 'server', lx: 0, ly: 0 },
      { type: 'server', lx: 0, ly: 1 },
      { type: 'server', lx: 0, ly: 2 },
      { type: 'monitor', lx: 3, ly: 1, screens: 1 },
      { type: 'desk', lx: 3, ly: 1 },
    ],
    workTiles: [[4, 2], [2, 2]],
  },
  rd: {
    name: 'Brain Core Lab', icon: '🧠', accent: '#a060c0',
    accentRGB: [160,96,192], floorBase: [62,52,68], wallBase: [82,68,90], floorPattern: 'lab',
    size: { w: 7, h: 5 }, cost: 4000,
    furniture: [
      { type: 'desk', lx: 1, ly: 1 },
      { type: 'monitor', lx: 2, ly: 1, screens: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'desk', lx: 4, ly: 2 },
      { type: 'monitor', lx: 4, ly: 1, screens: 2 },
      { type: 'whiteboard', lx: 5, ly: 0 },
      { type: 'server', lx: 0, ly: 0 },
    ],
    workTiles: [[2, 2], [5, 3], [3, 3]],
  },
  warehouse: {
    name: 'Vault', icon: '🧰', accent: '#8a7a60',
    accentRGB: [138,122,96], floorBase: [62,58,50], wallBase: [82,76,66], floorPattern: 'concrete',
    size: { w: 7, h: 4 }, cost: 1000,
    furniture: [
      { type: 'crate', lx: 0, ly: 0 },
      { type: 'crate', lx: 0, ly: 1 },
      { type: 'crate', lx: 1, ly: 0 },
      { type: 'crate', lx: 1, ly: 1 },
      { type: 'shelf', lx: 4, ly: 0 },
      { type: 'shelf', lx: 5, ly: 0 },
    ],
    workTiles: [[3, 2], [5, 2]],
  },
  shopfront: {
    name: 'Market Stall', icon: '🏪', accent: '#e068a0',
    accentRGB: [224,104,160], floorBase: [72,62,68], wallBase: [92,80,86], floorPattern: 'wood',
    size: { w: 7, h: 5 }, cost: 1200,
    furniture: [
      { type: 'mannequin', lx: 0, ly: 0 },
      { type: 'mannequin', lx: 0, ly: 2 },
      { type: 'clothingrack', lx: 1, ly: 0 },
      { type: 'clothingrack', lx: 1, ly: 2 },
      { type: 'register', lx: 4, ly: 1, interactive: true, configKey: 'pricing_strategy', label: 'Pricing Strategy' },
      { type: 'chair', lx: 3, ly: 3 },
      { type: 'chair', lx: 5, ly: 3 },
      { type: 'plant', lx: 6, ly: 4 },
    ],
    workTiles: [[2, 2], [5, 2], [3, 3]],
  },
};

export const COMMON_ROOMS = {
  breakroom: {
    name: 'Recharge Lounge', icon: '☕', accent: '#c09050',
    accentRGB: [192,144,80], floorBase: [68,60,52], wallBase: [88,78,68], floorPattern: 'wood',
    size: { w: 7, h: 4 }, cost: 800,
    furniture: [
      { type: 'coffeemachine', lx: 0, ly: 0, interactive: true, configKey: 'coffee_quality', label: 'Coffee Quality' },
      { type: 'table', lx: 2, ly: 1 },
      { type: 'chair', lx: 2, ly: 2 },
      { type: 'chair', lx: 3, ly: 2 },
      { type: 'couch', lx: 4, ly: 0, interactive: true, configKey: 'break_duration', label: 'Break Policy' },
      { type: 'plant', lx: 5, ly: 3 },
      { type: 'plant', lx: 6, ly: 1, interactive: true, configKey: 'perks_package', label: 'Perks Package' },
    ],
    workTiles: [[3, 2], [1, 1], [5, 2]],
  },
  meeting: {
    name: 'Strategy Room', icon: '🧭', accent: '#8080a0',
    accentRGB: [128,128,160], floorBase: [58,58,66], wallBase: [78,78,90], floorPattern: 'carpet',
    size: { w: 7, h: 4 }, cost: 1000,
    furniture: [
      { type: 'bigtv', lx: 3, ly: 0, interactive: true, configKey: 'meeting_schedule', label: 'Meeting Frequency' },
      { type: 'table', lx: 2, ly: 2 },
      { type: 'chair', lx: 1, ly: 2 },
      { type: 'chair', lx: 3, ly: 3 },
      { type: 'chair', lx: 4, ly: 2 },
      { type: 'whiteboard', lx: 0, ly: 0, interactive: true, configKey: 'meeting_focus', label: 'Meeting Focus' },
      { type: 'plant', lx: 5, ly: 0 },
    ],
    workTiles: [[2, 3], [4, 3], [3, 2]],
  },
  lobby: {
    name: 'Hatcher Hub', icon: '🥚', accent: '#a08060',
    accentRGB: [160,128,96], floorBase: [60,54,48], wallBase: [80,72,64], floorPattern: 'tile',
    size: { w: 5, h: 3 }, cost: 0,
    furniture: [
      { type: 'couch', lx: 1, ly: 0, interactive: true, configKey: 'lobby_style', label: 'Hub Style' },
      { type: 'plant', lx: 4, ly: 0 },
      { type: 'plant', lx: 0, ly: 2, interactive: true, configKey: 'workspace_quality', label: 'Workspace Quality' },
    ],
    workTiles: [[2, 1], [3, 1]],
  },
};

// ─── Agent roles ───────────────────────────────────────────
export const AGENT_ROLES = {
  ceo:            { title: 'Founder Steward',  office: 'any',         color: '#f0c040', emoji: '🥚', accessory: 'glasses' },
  seo_analyst:    { title: 'Signal Scout',     office: 'seo',         color: '#50b868', emoji: '📡', accessory: 'glasses' },
  content_writer: { title: 'Lore Operator',    office: 'content',     color: '#9068d0', emoji: '📣', accessory: 'pen' },
  video_creator:  { title: 'Mission Producer', office: 'video',       color: '#e07030', emoji: '🎬', accessory: 'cap' },
  designer:       { title: 'Blueprint Maker',  office: 'design',      color: '#d058a0', emoji: '🧩', accessory: 'beret' },
  data_analyst:   { title: 'Signal Analyst',   office: 'data',        color: '#4090e0', emoji: '📊', accessory: 'headphones' },
  support_agent:  { title: 'Care Agent',       office: 'support',     color: '#40b0b0', emoji: '🛟', accessory: 'headset' },
  sales_rep:      { title: 'Deal Runner',      office: 'sales',       color: '#e0a030', emoji: '🤝', accessory: 'glasses' },
  engineer:       { title: 'Protocol Engineer', office: 'engineering', color: '#5090c0', emoji: '⚙️', accessory: 'glasses' },
  craftsman:      { title: 'Fabricator',       office: 'workshop',    color: '#8b6c42', emoji: '🔧', accessory: 'cap' },
  marketer:       { title: 'Relay Planner',    office: 'marketing',   color: '#c05080', emoji: '📡', accessory: 'glasses' },
  pr_specialist:  { title: 'Market Herald',    office: 'pr',          color: '#70a050', emoji: '📰', accessory: 'pen' },
  hr_manager:     { title: 'Hatchery Keeper',  office: 'hr',          color: '#9080c0', emoji: '🥚', accessory: 'glasses' },
  accountant:     { title: 'Treasury Agent',   office: 'finance',     color: '#50a070', emoji: '🏦', accessory: 'glasses' },
  lawyer:         { title: 'Compliance Agent', office: 'legal',       color: '#a08860', emoji: '⚖️', accessory: 'glasses' },
  it_admin:       { title: 'Node Keeper',      office: 'it',          color: '#6090b0', emoji: '🖥️', accessory: 'headphones' },
  researcher:     { title: 'Brain Core Tech',  office: 'rd',          color: '#a060c0', emoji: '🧠', accessory: 'glasses' },
  warehouse_mgr:  { title: 'Vault Keeper',     office: 'warehouse',   color: '#8a7a60', emoji: '🧰', accessory: 'cap' },
  shop_assistant: { title: 'Market Clerk',     office: 'shopfront',   color: '#e068a0', emoji: '🏪', accessory: 'pen' },
};

// ─── Room guide (business identity, money drivers) ─────────
export const OFFICE_GUIDE = {
  seo: {
    role: 'Signal Discovery', impact: 'Raises organic visitors and reputation.',
    guide: 'Signal Scouts track market narratives, scanner keywords, and trader intent. They bring in organic flow without paid signal spend.',
    howItWorks: 'Agents research keywords, map narratives, and publish scanner briefs. Each completed Signal mission boosts organic traffic.',
    tips: 'Pair with Broadcast Studio for a 15% synergy bonus. More organic flow means more mission leads without extra spend.',
    projects: 'Signal Audit, Signal Sweep',
  },
  content: {
    role: 'Lore Engine', impact: 'Boosts traffic and lead quality.',
    guide: 'Lore Operators package market stories, agent drops, and social campaigns. Strong lore warms up leads before they reach the Deal Desk.',
    howItWorks: 'Agents research topics, draft drops, and edit for quality. Finished lore increases traffic and conversion.',
    tips: 'Broadcast Studio synergizes with Signal Scanner, Mission Theatre, Signal Relay, and Herald Office.',
    projects: 'Lore Drop, Relay Campaign',
  },
  design: {
    role: 'Blueprint Conversion', impact: 'Improves conversion rate.',
    guide: 'Blueprint Makers create market visuals, landing pages, and agent skins. Better presentation turns more visitors into active market flow.',
    howItWorks: 'Agents draft concepts, refine layouts, and polish deliverables. Each mission improves conversion.',
    tips: 'Blueprint Studio synergizes with Deal Desk, Protocol Lab, and Fabricator Bay.',
    projects: 'Agent Skin Pack, Market Landing',
  },
  sales: {
    role: 'Deal Flow', impact: 'Improves lead close rate.',
    guide: 'Deal Runners turn leads into paying mission flow. Without a Deal Desk, most leads sit unconverted.',
    howItWorks: 'Agents follow up on leads, negotiate terms, and close mission briefs. Close rate improves as agents gain experience.',
    tips: 'Build Blueprint Studio first for a 15% synergy from polished deal briefs. Deal Desk is essential once flow is steady.',
    projects: 'Deal Brief',
  },
  video: {
    role: 'Premium Missions', impact: 'Unlocks higher-ticket mission work.',
    guide: 'Mission Theatre produces showcase runs, trailers, and agent demos. These missions pay more than routine work.',
    howItWorks: 'Crew scripts, films, and edits mission media. Missions take longer but pay 2-3x more.',
    tips: 'Broadcast Studio synergy improves script quality. Mission Theatre is expensive but has high payouts.',
    projects: 'Mission Trailer, Agent Demo Run',
  },
  support: {
    role: 'Care Engine', impact: 'Stabilizes operations and reliable income.',
    guide: 'Care Agents handle trader tickets, resolve issues, and protect reputation. Happy traders mean steady referrals.',
    howItWorks: 'Agents triage incoming tickets, resolve problems, and follow up. This improves retention and stabilizes income.',
    tips: 'An early Care Pod prevents churn. Low cost, consistent value.',
    projects: 'Care Queue, Care Desk Setup',
  },
  data: {
    role: 'Insight Unlock', impact: 'Unlocks deeper metrics and optimization.',
    guide: 'Signal Analysts crunch flow, pricing, and mission metrics. They help every room work smarter with data-backed decisions.',
    howItWorks: 'Agents query metrics, build visualizations, and deliver insights. Improves efficiency across all rooms.',
    tips: 'Synergizes with Signal Scanner and Protocol Lab. Signal Lab is expensive but improves the whole operation.',
    projects: 'Signal Report, Market Dashboard',
  },
  engineering: {
    role: 'Protocol Builder', impact: 'Develops technical market systems.',
    guide: 'Protocol Engineers build apps, APIs, and market automation. For protocol desks, this is core delivery.',
    howItWorks: 'Agents architect, code, and test systems. Missions are complex and high-paying.',
    tips: 'Blueprint and Signal Lab synergies make protocol work more productive. High upkeep, high payout.',
    projects: 'Protocol Upgrade, Protocol Bridge',
  },
  workshop: {
    role: 'Fabrication', impact: 'Builds gear, cores, and prototypes.',
    guide: 'Fabricators build agent gear, custom cores, and market hardware. Essential for maker and trade desks.',
    howItWorks: 'Agents measure, fabricate, and assemble products. Output fills the Vault for dispatch.',
    tips: 'Blueprint and Protocol Lab synergies make fabrication faster and higher quality.',
    projects: 'Gear Prototype, Core Assembly',
  },
  marketing: {
    role: 'Signal Relay', impact: 'Reduces CPC 25%, boosts signal ROI.',
    guide: 'Relay Planners run campaigns, test creatives, and optimize signal spend.',
    howItWorks: 'Agents plan campaigns, test assets, and analyze ROI. Reduces CPC by 25% and improves spend efficiency.',
    tips: 'Broadcast and Blueprint synergies improve campaign assets. Build this once you use the signal spend slider.',
    projects: 'Market Relay, Signal Pipeline',
  },
  pr: {
    role: 'Reputation Builder', impact: 'Increases reputation gain and organic traffic.',
    guide: 'Market Heralds pitch stories, write dispatches, and build hub reputation.',
    howItWorks: 'Agents draft releases, pitch narratives, and land features. Each successful mission boosts reputation multiplier.',
    tips: 'Broadcast synergy helps craft stronger story angles. Herald Desk is strong mid-game reputation growth.',
    projects: 'Herald Dispatch, Market Feature',
  },
  hr: {
    role: 'Hatch Ops', impact: '-30% hatch cost, better candidates + training missions.',
    guide: 'The Hatchery manages candidate pools. Without it, founder hatching is limited to the first few agents.',
    howItWorks: 'Hatchery Keepers produce candidate pools each hatch cycle. Candidates vary in skill, efficiency, and upkeep. Hatch costs are discounted by 30%.',
    tips: 'Build Hatchery early to unlock unlimited recruiting and training missions.',
    projects: 'Hatch Cycle, Sync Training',
  },
  finance: {
    role: 'Cost Control', impact: 'Lower loan interest, budget forecasting + audits.',
    guide: 'Treasury Agents manage books, forecast budgets, and negotiate better loan terms.',
    howItWorks: 'Agents run audits, build forecasts, and manage payouts. Reduces loan interest rates and provides financial visibility.',
    tips: 'Essential before taking loans. Treasury missions pay well when diversified.',
    projects: 'Treasury Audit, Vault Forecast',
  },
  legal: {
    role: 'Terms Boost', impact: '+15% mission pay on all completions + compliance work.',
    guide: 'Compliance Agents review terms, handle rules, and file IP. Better terms add a flat 15% pay boost.',
    howItWorks: 'Compliance reviews every mission, increasing payout while handling policy and IP work.',
    tips: 'One of the best ROI rooms. The 15% bonus applies to all missions.',
    projects: 'Mission Terms Review, Protocol Compliance',
  },
  it: {
    role: 'Node Backbone', impact: '+8% global agent efficiency + node ops.',
    guide: 'Node Keepers maintain infrastructure, patch security, and keep systems running.',
    howItWorks: 'Node Room provides a global +8% efficiency boost to every agent.',
    tips: 'More valuable as your crew grows. Build Node Room once you have a larger agent base.',
    projects: 'Node Migration, Vault Security Audit',
  },
  rd: {
    role: 'Brain Core Research', impact: 'Periodic breakthroughs boost mission pay.',
    guide: 'Brain Core Techs run experiments and discover breakthroughs. Each breakthrough temporarily boosts mission payouts.',
    howItWorks: 'Brain Core Lab runs trials and upgrade sprints that can boost all payouts for a limited time.',
    tips: 'Late-game investment: expensive upkeep and slow payoff, but strong at scale.',
    projects: 'Brain Core Trial, Core Upgrade Sprint',
  },
  warehouse: {
    role: 'Vault Logistics', impact: '+20% mission capacity, fulfillment + inventory.',
    guide: 'The Vault handles storage, fulfillment, and dispatch. It increases simultaneous mission capacity by 20%.',
    howItWorks: 'Vault Keepers run inventory audits and dispatch runs. More capacity means more missions can run at once.',
    tips: 'Critical for trade and maker desks. Build this when you max out simultaneous missions.',
    projects: 'Vault Inventory, Vault Dispatch',
  },
  shopfront: {
    role: 'Market Floor', impact: 'Direct trader sales and foot traffic.',
    guide: 'Your Market Stall is where traders browse, compare drops, and buy. Clerks arrange displays and process sales.',
    howItWorks: 'Clerks complete showcases, seasonal drops, and flash markets. Walk-in traders generate yield when served.',
    tips: 'Pair with Blueprint Studio for a 15% presentation synergy. More walk-in flow means more sales without heavy signal spend.',
    projects: 'Showcase Run, Seasonal Drop, Flash Market',
  },
  breakroom: {
    role: 'Morale', impact: 'Restores mood and long-term productivity.',
    guide: 'A place for agents to rest and recharge. Tired agents lose efficiency; the lounge restores energy quickly.',
    howItWorks: 'Exhausted agents automatically visit the Recharge Lounge. Recovery rate is 16x faster than passive idle recovery.',
    tips: 'Build this early. One Recharge Lounge serves your whole crew.',
    projects: 'None — passive facility',
  },
  meeting: {
    role: 'Coordination', impact: 'Enables collaboration and close-rate boost.',
    guide: 'Strategy Rooms let agents from different rooms coordinate. Cross-room synergies improve mission quality and close rate.',
    howItWorks: 'Agents periodically meet to share knowledge. Improves collaboration bonuses and gives a close-rate boost.',
    tips: 'Cheap to build and maintain. The collaboration boost helps all rooms work better together.',
    projects: 'None — passive facility',
  },
  lobby: {
    role: 'Foundation', impact: 'Starting area and agent entry point.',
    guide: 'Your Hatcher Hub. This is where newly hatched agents arrive and where the steward reviews strategy.',
    howItWorks: 'New agents spawn in the hub before walking to their assigned room. The steward hangs out here reviewing strategy.',
    tips: 'You cannot remove the Hatcher Hub. It comes free with your starting floor plan.',
    projects: 'None — starting facility',
  },
};

// ─── P&L room categories (static fallback) ──────────────
export const OFFICE_CATEGORIES = {
  delivery:   { label: 'Missions',   icon: '⚡', offices: ['seo','content','video','design','data','engineering','workshop','shopfront'] },
  growth:     { label: 'Signal',     icon: '📈', offices: ['sales','marketing','pr'] },
  operations: { label: 'Operations', icon: '🏗️', offices: ['support','hr','finance','legal','it','rd','warehouse'] },
  common:     { label: 'Core',       icon: '🏠', offices: ['lobby','breakroom','meeting'] },
};

// ─── Per-company-type office role mappings ────────────────
// Each desk type maps rooms into mission / signal / infrastructure roles.
// Mission rooms are the core yield generators. Signal rooms drive pipeline.
// Infrastructure rooms provide passive bonuses.
export const COMPANY_OFFICE_ROLES = {
  digital_agency:   { delivery: ['seo','content','video','design'],              growth: ['sales','marketing','pr'],          infrastructure: ['support','hr','finance','legal','it','data','engineering','workshop','rd'] },
  saas_startup:     { delivery: ['engineering','design'],                        growth: ['sales','content','marketing'],      infrastructure: ['support','hr','finance','legal','it','data','rd'] },
  ecommerce:        { delivery: ['sales','warehouse'],                           growth: ['marketing','content','design','pr'],infrastructure: ['support','hr','finance','it','legal','data'] },
  creative_house:   { delivery: ['design','video','content'],                    growth: ['sales','pr','marketing'],           infrastructure: ['seo','support','hr','finance'] },
  tech_lab:         { delivery: ['engineering','data','rd'],                     growth: ['sales','marketing','design'],        infrastructure: ['support','hr','finance','legal','it'] },
  maker_co:         { delivery: ['workshop','engineering','warehouse'],          growth: ['sales','design'],                    infrastructure: ['support','hr','finance','legal','it','rd'] },
  consulting_firm:  { delivery: ['data','engineering','content'],               growth: ['sales','pr','marketing'],             infrastructure: ['support','hr','finance','legal','it'] },
  staffing_agency:  { delivery: ['hr','support'],                               growth: ['sales','marketing','pr'],             infrastructure: ['finance','legal','it','data','content'] },
  fashion_retail:   { delivery: ['shopfront','design','warehouse'],             growth: ['sales','marketing','pr'],              infrastructure: ['support','hr','finance','legal','it','content'] },
};

// ─── Spawn weight per office role ────────────────────────
// Mission rooms get the most mission flow. Signal rooms get some.
// Infrastructure rooms get very few external missions.
export const OFFICE_ROLE_WEIGHTS = { delivery: 1.0, growth: 0.3, infrastructure: 0.15 };

// ─── Diversification config ──────────────────────────────
// Mid-game mechanic: flip infrastructure/growth offices to delivery role.
export const DIVERSIFICATION_CONFIG = {
  baseCost: 5000,
  premiumCost: 10000,                         // for engineering, rd, legal, finance, it
  premiumOffices: ['engineering','rd','legal','finance','it'],
  remodelingDays: 3,
  passiveBonusReduction: 0.5,                 // diversified offices lose half their passive bonus
};

// ─── Project templates ─────────────────────────────────────
export const PROJECT_TEMPLATES = [
  { name: 'Signal Audit',      icon: '📡', basePay: 900,  office: 'seo',     phases: ['scan','tune','report'], time: 10, color: '#50b868' },
  { name: 'Lore Drop',         icon: '✍️', basePay: 600,  office: 'content', phases: ['research','write','publish'], time: 8, color: '#9068d0' },
  { name: 'Mission Trailer',   icon: '🎬', basePay: 1800, office: 'video',   phases: ['script','capture','edit'], time: 14, color: '#e07030' },
  { name: 'Agent Skin Pack',   icon: '🧩', basePay: 2200, office: 'design',  phases: ['concept','design','refine'], time: 16, color: '#d058a0' },
  { name: 'Signal Report',     icon: '📊', basePay: 1200, office: 'data',    phases: ['query','analyze','visualize'], time: 12, color: '#4090e0' },
  { name: 'Signal Sweep',      icon: '🔑', basePay: 800,  office: 'seo',     phases: ['research','cluster','report'], time: 9, color: '#50b868' },
  { name: 'Relay Campaign',    icon: '📱', basePay: 1000, office: 'content', phases: ['plan','create','schedule'], time: 10, color: '#9068d0' },
  { name: 'Market Landing',    icon: '🧩', basePay: 1500, office: 'design',  phases: ['wireframe','design','polish'], time: 12, color: '#d058a0' },
  { name: 'Market Dashboard',  icon: '📊', basePay: 1800, office: 'data',    phases: ['model','build','test'], time: 14, color: '#4090e0' },
  { name: 'Agent Demo Run',    icon: '🎬', basePay: 2500, office: 'video',   phases: ['storyboard','capture','post'], time: 16, color: '#e07030' },
  { name: 'Deal Brief',        icon: '🤝', basePay: 1100, office: 'sales',   phases: ['research','draft','present'], time: 10, color: '#e0a030' },
  { name: 'Protocol Upgrade',  icon: '⚙️', basePay: 2800, office: 'engineering', phases: ['architect','code','test'], time: 18, color: '#5090c0' },
  { name: 'Protocol Bridge',   icon: '🔌', basePay: 1600, office: 'engineering', phases: ['design','implement','deploy'], time: 12, color: '#5090c0' },
  { name: 'Gear Prototype',    icon: '🔧', basePay: 1400, office: 'workshop',    phases: ['design','build','finish'], time: 14, color: '#8b6c42' },
  { name: 'Core Assembly',     icon: '🛠️', basePay: 2000, office: 'workshop',    phases: ['measure','fabricate','assemble'], time: 16, color: '#8b6c42' },
  { name: 'Market Relay',      icon: '📣', basePay: 1200, office: 'marketing',   phases: ['research','create','launch'], time: 10, color: '#c05080' },
  { name: 'Herald Dispatch',   icon: '📰', basePay: 800,  office: 'pr',          phases: ['draft','pitch','publish'], time: 8,  color: '#70a050' },
  { name: 'Market Feature',    icon: '🌟', basePay: 1500, office: 'pr',          phases: ['research','interview','edit'], time: 12, color: '#70a050' },
  // Operations — cost centers: these cost money but enable passive bonuses
  // support: reputation maintenance, customer satisfaction
  { name: 'Care Queue',        icon: '🛟', basePay: -150, office: 'support', phases: ['triage','resolve','followup'], time: 7,  color: '#40b0b0', cost: true },
  { name: 'Hatch Cycle',       icon: '🥚', basePay: -200, office: 'hr',          phases: ['screen','incubate','offer'], time: 8,  color: '#d0a050', cost: true },
  { name: 'Sync Training',     icon: '📋', basePay: -250, office: 'hr',          phases: ['plan','prepare','sync'], time: 6,  color: '#d0a050', cost: true },
  // finance: +15% pay bonus on all projects, loan rate improvements
  { name: 'Treasury Audit',    icon: '🏦', basePay: -300, office: 'finance',     phases: ['collect','reconcile','report'], time: 10, color: '#508060', cost: true },
  { name: 'Vault Forecast',    icon: '📈', basePay: -200, office: 'finance',     phases: ['model','review','present'], time: 8,  color: '#508060', cost: true },
  // legal: +15% project pay on ALL completions
  { name: 'Mission Terms Review', icon: '⚖️', basePay: -350, office: 'legal',    phases: ['review','redline','finalize'], time: 10, color: '#806090', cost: true },
  { name: 'Protocol Compliance', icon: '📑', basePay: -250, office: 'legal',      phases: ['audit','document','certify'], time: 8,  color: '#806090', cost: true },
  // it: +8% global agent efficiency
  { name: 'Node Migration',    icon: '🖥️', basePay: -400, office: 'it',          phases: ['plan','migrate','verify'], time: 12, color: '#4080a0', cost: true },
  { name: 'Vault Security Audit', icon: '🔒', basePay: -300, office: 'it',       phases: ['scan','patch','harden'], time: 10, color: '#4080a0', cost: true },
  // rd: periodic breakthroughs boost project pay
  { name: 'Brain Core Trial',  icon: '🧠', basePay: -500, office: 'rd',          phases: ['hypothesize','test','analyze'], time: 14, color: '#7060b0', cost: true },
  { name: 'Core Upgrade Sprint', icon: '💡', basePay: -600, office: 'rd',        phases: ['ideate','prototype','validate'], time: 16, color: '#7060b0', cost: true },
  // warehouse: +20% project capacity
  { name: 'Vault Inventory',   icon: '🧰', basePay: -100, office: 'warehouse',   phases: ['count','reconcile','update'], time: 6,  color: '#8b7355', cost: true },
  { name: 'Vault Dispatch',    icon: '🚚', basePay: -200, office: 'warehouse',   phases: ['pick','pack','ship'], time: 8,  color: '#8b7355', cost: true },
  // Client-facing projects — only spawn when office is in delivery role (native or diversified)
  { name: 'Elite Agent Search', icon: '👤', basePay: 3500, office: 'hr',          phases: ['profile','source','place'], time: 14, color: '#9080c0', clientFacing: true },
  { name: 'Agent Placement',    icon: '🤝', basePay: 2500, office: 'hr',          phases: ['assess','match','onboard'], time: 12, color: '#9080c0', clientFacing: true },
  { name: 'Crew Planning',      icon: '📋', basePay: 1800, office: 'hr',          phases: ['audit','forecast','plan'], time: 10, color: '#9080c0', clientFacing: true },
  { name: 'Steward Placement',  icon: '🎯', basePay: 5500, office: 'hr',          phases: ['headhunt','vet','close'], time: 18, color: '#9080c0', clientFacing: true },
  { name: 'Mission Staffing',   icon: '📋', basePay: 1200, office: 'hr',          phases: ['brief','source','deploy'], time: 6,  color: '#9080c0', clientFacing: true },
  { name: 'Market Model',       icon: '📈', basePay: 2500, office: 'finance',     phases: ['model','stress-test','report'], time: 14, color: '#508060', clientFacing: true },
  { name: 'Desk Diligence',     icon: '🔎', basePay: 2000, office: 'finance',     phases: ['collect','analyze','findings'], time: 12, color: '#508060', clientFacing: true },
  { name: 'Core Filing',        icon: '📄', basePay: 2800, office: 'legal',       phases: ['research','draft','file'], time: 16, color: '#806090', clientFacing: true },
  { name: 'Desk Merger Advisory', icon: '🏛️', basePay: 3500, office: 'legal',    phases: ['assess','negotiate','close'], time: 18, color: '#806090', clientFacing: true },
  { name: 'Node Cloud Move',    icon: '☁️', basePay: 2400, office: 'it',          phases: ['assess','migrate','validate'], time: 14, color: '#4080a0', clientFacing: true },
  { name: 'Proof Audit',        icon: '🛡️', basePay: 2000, office: 'it',          phases: ['scope','test','certify'], time: 12, color: '#4080a0', clientFacing: true },
  { name: 'Care Pod Contract',  icon: '📞', basePay: 2000, office: 'support',     phases: ['setup','train','operate'], time: 10, color: '#40b0b0', clientFacing: true },
  { name: 'Care Desk Setup',    icon: '🖥️', basePay: 1600, office: 'support',     phases: ['design','configure','launch'], time: 8,  color: '#40b0b0', clientFacing: true },
  { name: 'Operations Contract', icon: '🏢', basePay: 2800, office: 'support',    phases: ['scope','staff','launch'], time: 14, color: '#40b0b0', clientFacing: true },
  { name: 'Market Launch Plan', icon: '🚀', basePay: 2000, office: 'marketing',   phases: ['research','plan','playbook'], time: 12, color: '#c05080', clientFacing: true },
  { name: 'Reputation Audit',   icon: '🔍', basePay: 1600, office: 'marketing',   phases: ['assess','benchmark','report'], time: 10, color: '#c05080', clientFacing: true },
  { name: 'Signal Pipeline',    icon: '🤖', basePay: 3000, office: 'data',        phases: ['ingest','train','deploy'], time: 16, color: '#4090e0', clientFacing: true },
  { name: 'Signal Strategy',    icon: '📊', basePay: 1800, office: 'data',        phases: ['audit','roadmap','present'], time: 12, color: '#4090e0', clientFacing: true },
  { name: 'Protocol Review',    icon: '🧪', basePay: 2600, office: 'rd',          phases: ['assess','test','report'], time: 14, color: '#7060b0', clientFacing: true },
  { name: 'Core Patent Search', icon: '📜', basePay: 2200, office: 'rd',          phases: ['search','analyze','brief'], time: 12, color: '#7060b0', clientFacing: true },
  { name: 'Stall Layout',       icon: '🪟', basePay: 800,  office: 'shopfront',   phases: ['plan','arrange','display'], time: 8,  color: '#e068a0' },
  { name: 'Seasonal Drop',      icon: '👗', basePay: 1500, office: 'shopfront',   phases: ['curate','price','launch'], time: 12, color: '#e068a0' },
  { name: 'Flash Market',       icon: '⚡', basePay: 600,  office: 'shopfront',   phases: ['plan','promote','execute'], time: 6,  color: '#e068a0' },
  { name: 'Showcase Run',       icon: '📸', basePay: 1800, office: 'design',      phases: ['style','shoot','edit'], time: 14, color: '#d058a0' },
  { name: 'Market Showcase',    icon: '🎭', basePay: 2500, office: 'design',      phases: ['plan','rehearse','show'], time: 16, color: '#d058a0' },
  { name: 'Pop-up Market',      icon: '🎪', basePay: 1200, office: 'shopfront',   phases: ['location','setup','run'], time: 10, color: '#e068a0', clientFacing: true },
  { name: 'Bulk Trade Deal',    icon: '🤝', basePay: 2000, office: 'sales',       phases: ['prospect','negotiate','fulfill'], time: 12, color: '#e0a030', clientFacing: true },
  { name: 'Vault Restock',      icon: '🧰', basePay: -300, office: 'warehouse',   phases: ['order','receive','shelve'], time: 6,  color: '#8a7a60', cost: true },
  // warehouse: client-facing logistics services (revenue when warehouse is delivery)
  { name: 'Vault Fulfillment',    icon: '📬', basePay: 1200, office: 'warehouse', phases: ['setup','process','deliver'], time: 10, color: '#8b7355', clientFacing: true },
  { name: 'Quick Route Order',    icon: '🚛', basePay: 900,  office: 'warehouse', phases: ['source','route','ship'], time: 8,   color: '#8b7355', clientFacing: true },
  { name: 'Route Optimization',   icon: '🗺️', basePay: 1600, office: 'warehouse', phases: ['audit','optimize','report'], time: 12, color: '#8b7355', clientFacing: true },
];

// ─── Speech lines ──────────────────────────────────────────
export const SPEECH_WORKING = {
  ceo:         ['Reviewing market strategy...', 'Checking vault flow...', 'Setting desk priorities...', 'Reading signal reports...', 'Approving agent upgrades...', 'Reviewing mission risk...', 'Rebalancing the hub...', 'Planning the next hatch cycle...'],
  seo:         ['Scanning narratives...', 'Mapping keywords...', 'Running signal audit...', 'Tracking market intent...', 'Finding organic flow...', 'Tuning scanner tags...', 'Watching trend velocity...', 'Cleaning signal noise...'],
  content:     ['Drafting lore drop...', 'Researching market story...', 'Editing dispatch...', 'Adding signal context...', 'Rewriting the brief...', 'Polishing the hook...', 'Preparing social copy...', 'Packaging the narrative...'],
  video:       ['Setting up mission shot...', 'Adjusting lights...', 'Recording agent demo...', 'Color grading run footage...', 'Checking audio levels...', 'One more showcase take...', 'Rendering mission reel...', 'Resetting the stage...'],
  design:      ['Tweaking palette...', 'Aligning pixels...', 'Mocking agent skin...', 'Polishing blueprint...', 'Sharpening the layout...', 'Moving it 1px left...', 'Testing conversion feel...', 'Choosing the right badge...'],
  data:        ['Running flow query...', 'Building yield chart...', 'Crunching market numbers...', 'Joining signal tables...', 'Checking outliers...', 'Cleaning null rows...', 'One more pivot...', 'Forecasting mission value...'],
  support:     ['Reading care ticket...', 'Drafting response...', 'Escalating issue...', 'Closing care loop...', 'Checking trader status...', 'Documenting fix...', 'Queue is moving...', 'Protecting reputation...'],
  sales:       ['Reviewing leads...', 'Drafting deal brief...', 'Following up...', 'Closing mission...', '💰 Deal signed!', 'Market flow onboarded!', 'Negotiating terms...', 'Checking premium route...', 'Looping in Treasury...', 'Preparing offer sheet...'],
  engineering: ['Writing tests...', 'Debugging protocol...', 'Deploying build...', 'Reviewing diff...', 'Refactoring module...', 'Merging upgrade...', 'Stabilizing node path...', 'Fixing edge case...', 'Shipping protocol patch...', 'Hardening the adapter...'],
  workshop:    ['Measuring parts...', 'Cutting material...', 'Assembling gear...', 'Sanding finish...', 'Quality checking...', 'Tuning core shell...', 'Calibrating tool path...', 'Hand-crafting upgrade...'],
  marketing:   ['Planning relay...', 'Testing signal ads...', 'Analyzing ROI...', 'Launching promo...', 'Optimizing funnel...', 'Pushing viral loop...', 'Aligning the brand...', 'Metrics look promising...'],
  pr:          ['Pitching story...', 'Writing dispatch...', 'Running outreach...', 'Scheduling interview...', 'Framing this cleanly...', 'Preparing statement...', 'Landing market feature...', 'Managing narrative...'],
  hr:          ['Screening candidates...', 'Scheduling hatch call...', 'Writing role brief...', 'Reviewing applications...', 'Shortlisting agents...', 'Checking references...', 'Onboarding hatchling...', 'Assessing crew fit...'],
  finance:     ['Reconciling vault...', 'Running payouts...', 'Budget forecast...', 'Tax planning...', 'Tracking tiny variance...', 'Ledger needs balance...', 'Counting credits...', 'Audit trail ready...'],
  legal:       ['Reviewing terms...', 'Filing paperwork...', 'Compliance check...', 'Drafting agreement...', 'Reading clause 12...', 'Tightening mission terms...', 'Redlining risk...', 'Checking policy path...'],
  it:          ['Updating nodes...', 'Patching security...', 'Monitoring uptime...', 'Backup running...', 'Restarting service...', 'Routing traffic...', 'Clearing stale cache...', 'Checking permissions...'],
  rd:          ['Running core trial...', 'Analyzing results...', 'Testing hypothesis...', 'Writing lab note...', 'Results inconclusive...', 'Needs more funding...', 'Breakthrough maybe...', 'Back to the board...'],
  warehouse:   ['Checking vault stock...', 'Packing orders...', 'Receiving shipment...', 'Organizing inventory...', 'Where did box #347 go?', 'Optimizing storage path...', 'Dispatch ready...', 'Counting reserve stock...'],
  shopfront:   ['Helping a trader...', 'Restocking shelves...', 'Arranging display...', 'Processing sale...', 'Folding merch...', 'Great pick!', 'Checking the back...', 'New drop arrived!'],
};
// Per-company-type speech overrides — merged on top of office defaults
export const SPEECH_WORKING_OVERRIDES = {
  tech_lab: {
    data:        ['Training core signal...', 'Tuning risk weights...', 'Compute is warm...', 'Loss is decreasing...', 'Evaluating benchmark...', 'Cleaning dataset again...', 'Reducing noise...', 'Fine-tuning on market runs...', 'Checking core drift...', 'Scoring signal pack...', 'Passed the eval. Ship it.'],
    engineering: ['Shipping v0.1...', 'Writing compute kernel...', 'Optimizing inference...', 'Reviewing large diff...', 'Works on the node cluster...', 'Deploying protocol patch...', 'Rewriting hot path...', 'Core package is heavy...', 'Adding safety filters...', 'Scaling node workers...'],
    rd:          ['Publishing lab note...', 'New core idea...', 'Needs more compute...', 'Ablation study #47...', 'Beat the benchmark maybe...', 'Review is brutal...', 'Need a bigger cluster...', 'Releasing core upgrade...', 'It is just layers...', 'Emergent pattern detected...', 'Wrote a paper, got scooped...'],
  },
};

export const SPEECH_THINKING = ['Hmm...', 'Let me think...', 'Processing...', 'Analyzing...', 'One moment...', '🤔', 'Interesting signal...', 'Checking the brief...'];
export const SPEECH_IDLE = ['☕ Recharge time!', 'Ready to run!', 'What is next?', '💤 Quiet market...', 'Stretching...', 'Checking the board...', 'Anyone need help?', 'Organizing my desk'];
export const SPEECH_DONE = ['✅ Done!', 'Mission shipped!', 'Run complete!', '🎉 Finished!', 'Clean execution!', 'That is a wrap!'];
export const SPEECH_BREAK = ['Needed this...', 'Good coffee ☕', 'Recharging...', 'Back in 5!', 'Snack break!', 'Resetting energy...'];
export const SPEECH_EXHAUSTED = ['So tired...', 'Need recharge...', 'Running on empty...', 'Can barely focus...', 'Must rest...', 'Brain core is cooked...', 'Error 503: agent unavailable'];
export const SPEECH_COLLAB = ['Great sync!', 'Good strategy!', 'Love this crew!', 'Learned something!', 'Run this more often', 'Actually useful!'];
export const SPEECH_RAISE = ['I need a raise...', 'Market rate is calling...', 'Can we talk compensation?', 'I know what agents get paid...', 'My upkeep is too low...'];
export const SPEECH_QUIT = ['I quit. Not valued here.', 'Time to move on.', 'Found a better desk.', 'Good luck without me.', 'My two weeks starts now'];
export const SPEECH_SKILL_CAP = ['I have peaked...', 'Need new challenges', 'Hit my ceiling here', 'Not growing anymore', 'Feeling stagnant...'];
export const SPEECH_PROMOTED = ['Level up!', 'I got promoted!', 'Moving on up!', 'Hard work pays off!', 'New title unlocked!', 'Core upgrade complete!'];

// ─── Visitor Dialogue System ────────────────────────────
export const VISITOR_ARRIVAL_SPEECH = {
  client:    ['Here with a mission brief.', 'We need market support.', 'Let\'s talk flow.', 'Is a Deal Runner available?'],
  candidate: ['Here for hatch screening.', 'I have a hatch appointment.', 'Excited to join the hub.', 'Reporting for evaluation.'],
  walkin:    ['Just passing by.', 'Nice hub.', 'Love the market floor.', 'Mind if I look around?'],
  customer:  ['Just browsing.', 'Love this stall.', 'Any drops today?', 'Looking for a signal pack...'],
};

export const VISITOR_QUEUE_SPEECH = {
  client:    ['I\'ll wait...', 'Room is busy, huh?', 'Guess I am next.'],
  candidate: ['Still waiting...', 'A bit nervous...', 'Hope it is soon.'],
  walkin:    ['I will come back.', 'Seems busy.', 'No rush.'],
  customer:  ['I will keep looking.', 'Busy in here.', 'No worries.'],
};

export const VISITOR_DIALOGUES = {
  client: [
    [
      ['visitor', 'We need help with our market run.', 45],
      ['agent', 'Tell me about the scope.', 40],
      ['visitor', 'It is a 3-week mission.', 40],
      ['agent', 'Budget range?', 35],
      ['visitor', 'We\'re flexible for quality.', 40],
      ['agent', 'We can make that work! 📋', 45],
    ],
    [
      ['visitor', 'A rival desk just launched...', 45],
      ['agent', 'We will help you stay ahead.', 40],
      ['visitor', 'What\'s your timeline?', 35],
      ['agent', 'We can start this week.', 40],
      ['visitor', 'Sounds perfect.', 35],
      ['agent', 'Let me draft a deal brief. ✍️', 45],
    ],
    [
      ['visitor', 'We heard great things!', 40],
      ['agent', 'Thanks! What do you need?', 40],
      ['visitor', 'Full mission package.', 35],
      ['agent', 'Our specialty. 💼', 40],
      ['visitor', 'When can we kick off?', 35],
      ['agent', 'I will get you queued.', 40],
    ],
  ],
  candidate: [
    [
      ['agent', 'Welcome. Tell me about your signal craft.', 45],
      ['visitor', 'I have 5 years of market ops.', 40],
      ['agent', 'What draws you here?', 40],
      ['visitor', 'The hub and growth path.', 40],
      ['agent', 'Great fit! Let me check next steps.', 45],
      ['visitor', 'Thank you! 🤞', 40],
    ],
    [
      ['agent', 'Thanks for coming in.', 40],
      ['visitor', 'Happy to be here.', 35],
      ['agent', 'Walk me through your runs.', 45],
      ['visitor', 'I led a crew of 10 agents...', 45],
      ['agent', 'Strong background.', 40],
      ['visitor', 'When will I hear back?', 35],
      ['agent', 'Within the week. 📞', 40],
    ],
  ],
  walkin: [
    [
      ['visitor', 'Cool hub!', 35],
      ['agent', 'Thanks! Want a tour?', 35],
      ['visitor', 'Sure!', 30],
      ['agent', 'This is where signal turns into yield. ✨', 40],
    ],
    [
      ['visitor', 'Do you have a card?', 35],
      ['agent', 'Here you go! 🪪', 35],
      ['visitor', 'I might have a mission soon.', 40],
      ['agent', 'We would love to help.', 35],
    ],
  ],
  customer: [
    [
      ['visitor', 'Do you have this signal pack?', 40],
      ['agent', 'Let me check. 👗', 35],
      ['visitor', 'I like the setup.', 35],
      ['agent', 'It is from our new drop.', 40],
      ['visitor', 'I will take it.', 35],
      ['agent', 'Great choice. 🛍️', 40],
    ],
    [
      ['visitor', 'What is in the drop today?', 40],
      ['agent', 'This row has the best route packs.', 45],
      ['visitor', 'These look useful.', 35],
      ['agent', 'Want to compare them?', 35],
      ['visitor', 'Yes please.', 30],
      ['agent', 'The showcase is right here. ✨', 40],
    ],
    [
      ['visitor', 'I need a pack for launch day.', 45],
      ['agent', 'I have some solid options.', 40],
      ['visitor', 'Something sharp but not too flashy.', 45],
      ['agent', 'How about this one?', 35],
      ['visitor', 'It\'s perfect!', 30],
      ['agent', 'Let me ring that up. 💳', 40],
    ],
  ],
};

// ─── IQ Labels ──────────────────────────────────────────
export const IQ_LABELS = [
  { min: 0,    max: 0.7,  label: 'Slow',      emoji: '🧠' },
  { min: 0.7,  max: 1.0,  label: 'Average',   emoji: '🧠' },
  { min: 1.0,  max: 1.3,  label: 'Sharp',     emoji: '🧠' },
  { min: 1.3,  max: 2.0,  label: 'Brilliant',  emoji: '🧠' },
];

export function getIQLabel(iq) {
  const tier = IQ_LABELS.find(t => iq >= t.min && iq < t.max) || IQ_LABELS[IQ_LABELS.length - 1];
  return tier;
}

// ─── Energy drain coefficients per role (per ms while working) ───
// Higher = drains faster. Intense roles burn energy quicker.
export const ENERGY_DRAIN = {
  ceo:            0.00012,
  seo_analyst:    0.00010,
  content_writer: 0.00009,
  video_creator:  0.00014,
  designer:       0.00011,
  data_analyst:   0.00013,
  support_agent:  0.00008,
  sales_rep:      0.00011,
  engineer:       0.00015,
  craftsman:      0.00013,
  marketer:       0.00010,
  pr_specialist:  0.00009,
  hr_manager:     0.00007,
  accountant:     0.00008,
  lawyer:         0.00010,
  it_admin:       0.00012,
  researcher:     0.00014,
  warehouse_mgr:  0.00009,
  shop_assistant: 0.00009,
};

// Energy recovery rate per ms during break (in break room)
export const ENERGY_RECOVERY_RATE = 0.0008;
// Passive recovery rate when idle (no break room) — very slow
export const ENERGY_PASSIVE_RECOVERY = 0.00005;
// Energy threshold below which agent is forced to break
export const ENERGY_EXHAUSTION_THRESHOLD = 0.12;
// Energy threshold below which efficiency starts dropping
export const ENERGY_LOW_THRESHOLD = 0.35;

export const CHARACTER_NAMES = [
  'Alex','Sam','Jordan','Riley','Casey','Morgan','Quinn','Avery','Blake','Drew',
  'Sage','Reese','Kai','River','Rowan','Harper','Ellis','Finley','Dakota','Emery',
];

// ─── TeamDay character avatars per role ──────────────────
export const TEAMDAY_CHARACTERS = {
  ceo:            [],
  seo_analyst:    [{ name: 'Sarah', image: 'assets/team/sarah-seo.webp' }, { name: 'Nina', image: 'assets/team/nina-research.webp' }],
  content_writer: [{ name: 'Maya', image: 'assets/team/maya-content.webp' }, { name: 'Sage', image: 'assets/team/sage-content-strategist.webp' }, { name: 'Casey', image: 'assets/team/casey-technical-writer.webp' }],
  video_creator:  [{ name: 'Reel', image: 'assets/team/reel-video-creator.webp' }, { name: 'Vince', image: 'assets/team/vince-video-producer.webp' }, { name: 'Story', image: 'assets/team/story-scriptwriter.webp' }],
  designer:       [{ name: 'Pixel', image: 'assets/team/pixel-image-creator.webp' }, { name: 'Morgan', image: 'assets/team/morgan-cmo.webp' }],
  data_analyst:   [{ name: 'James', image: 'assets/team/james-data.webp' }, { name: 'Parker', image: 'assets/team/parker-business-analyst.webp' }],
  support_agent:  [{ name: 'Echo', image: 'assets/team/social-media.webp' }, { name: 'Robin', image: 'assets/team/roleplay-coach.webp' }],
  sales_rep:      [{ name: 'Blake', image: 'assets/team/sales-agent.webp' }, { name: 'Riley', image: 'assets/team/riley-bdr.webp' }],
  engineer:       [{ name: 'Alex', image: 'assets/team/alex-engineer.webp' }, { name: 'Lena', image: 'assets/team/lena-devops.webp' }],
  craftsman:      [{ name: 'Dev', image: 'assets/team/wordpress-manager.webp' }, { name: 'Max', image: 'assets/team/gaming-ua.webp' }],
  marketer:       [{ name: 'Mara', image: 'assets/team/mara-email-marketer.webp' }, { name: 'Dana', image: 'assets/team/morgan-chief-of-staff.webp' }],
  pr_specialist:  [{ name: 'Claire', image: 'assets/team/competitive-intel.webp' }, { name: 'Sage', image: 'assets/team/sage-content-strategist.webp' }],
  hr_manager:     [{ name: 'Jordan', image: 'assets/team/jordan-hr-assistant.webp' }, { name: 'Ava', image: 'assets/team/interview-coach.webp' }],
  accountant:     [{ name: 'Parker', image: 'assets/team/parker-business-analyst.webp' }, { name: 'Leo', image: 'assets/team/gaming-ua.webp' }],
  lawyer:         [{ name: 'Quinn', image: 'assets/team/competitive-intel.webp' }, { name: 'Dana', image: 'assets/team/morgan-chief-of-staff.webp' }],
  it_admin:       [{ name: 'Lena', image: 'assets/team/lena-devops.webp' }, { name: 'Alex', image: 'assets/team/alex-engineer.webp' }],
  researcher:     [{ name: 'Nina', image: 'assets/team/nina-research.webp' }, { name: 'Iris', image: 'assets/team/roleplay-coach.webp' }],
  warehouse_mgr:  [{ name: 'Owen', image: 'assets/team/wordpress-manager.webp' }, { name: 'Kai', image: 'assets/team/gaming-ua.webp' }],
};

// ─── Analytics visibility levels ───────────────────────────
export const ANALYTICS_LEVELS = {
  0: { name: 'No Data',       description: 'You have no visibility into your business metrics.' },
  1: { name: 'Basic',         description: 'Rough numbers from your data lab.' },
  2: { name: 'Standard',      description: 'Your data analyst provides exact metrics.' },
  3: { name: 'Full Insight',  description: 'Full funnel analysis with projections.' },
};

// ─── Tutorial hints ────────────────────────────────────────
export const TUTORIAL_HINTS = [
  { trigger: 'start',      text: 'Welcome. Click Build to start placing market rooms.' },
  { trigger: 'first_room', text: 'Good. Now hatch an agent to work in your new room.' },
  { trigger: 'first_hire', text: null }, // dynamic — set at runtime per company type
  { trigger: 'first_project', text: 'Missions are coming in. Watch your agents work and manage cash flow.' },
  { trigger: 'low_mood',   text: 'Your agents look tired. Build a Recharge Lounge to let them recover.' },
  { trigger: 'low_energy', text: 'An agent is running low on energy. Build a Recharge Lounge for faster recovery.' },
  { trigger: 'low_motivation', text: 'An agent motivation is dropping. Set up perks in the Recharge Lounge or give a raise.' },
  { trigger: 'stalled',    text: 'Missions are stalling. Hatch more agents for the right rooms.' },
  { trigger: 'low_alignment', text: 'Crew sync is low. Click the steward and run Hub Sync in the Strategy Room.' },
  { trigger: 'analytics',  text: 'Build a Signal Lab and hatch an analyst to see market metrics.' },
];

// ─── Equipment configuration options ─────────────────────
export const EQUIPMENT_CONFIGS = {
  sales_pricing: {
    label: 'Pricing Strategy', icon: '💰',
    options: [
      { key: 'budget',   label: 'Budget',   desc: 'Lower prices, faster close (pay ×0.7, close +30%)' },
      { key: 'standard', label: 'Standard', desc: 'Balanced pricing' },
      { key: 'premium',  label: 'Premium',  desc: 'Higher prices, slower close (pay ×1.3, close −30%)' },
    ],
    default: 'standard',
  },
  sales_followup: {
    label: 'Follow-up Intensity', icon: '📞',
    options: [
      { key: 'relaxed',    label: 'Relaxed',    desc: 'Low pressure (close ×0.8)' },
      { key: 'balanced',   label: 'Balanced',   desc: 'Normal follow-up' },
      { key: 'aggressive', label: 'Aggressive', desc: 'High pressure (close ×1.3, costs mood)' },
    ],
    default: 'balanced',
  },
  seo_focus: {
    label: 'SEO Focus', icon: '🎯',
    options: [
      { key: 'technical', label: 'Technical', desc: 'Technical SEO (+30% SEO quality)' },
      { key: 'content',   label: 'Content',   desc: 'Content SEO (+10% SEO, +20% organic)' },
      { key: 'backlinks', label: 'Backlinks', desc: 'Link building (+20% reputation gain)' },
    ],
    default: 'content',
  },
  seo_keywords: {
    label: 'Keyword Strategy', icon: '🔑',
    options: [
      { key: 'broad', label: 'Broad',  desc: 'Wide reach (+20% organic, −10% CR)' },
      { key: 'niche', label: 'Niche',  desc: 'Targeted (−20% organic, +30% CR)' },
      { key: 'local', label: 'Local',  desc: 'Local focus (steady traffic, +10% CR)' },
    ],
    default: 'broad',
  },
  content_research: {
    label: 'Research Depth', icon: '📚',
    options: [
      { key: 'quick',    label: 'Quick',    desc: 'Fast but lower quality (speed +30%, quality −20%)' },
      { key: 'thorough', label: 'Thorough', desc: 'Balanced approach' },
      { key: 'deep',     label: 'Deep',     desc: 'Slow but high quality (speed −30%, quality +30%)' },
    ],
    default: 'thorough',
  },
  content_style: {
    label: 'Content Style', icon: '✏️',
    options: [
      { key: 'shortform', label: 'Short-form', desc: 'Quick articles (speed +20%, quality −10%)' },
      { key: 'longform',  label: 'Long-form',  desc: 'In-depth pieces (speed −20%, quality +20%)' },
      { key: 'viral',     label: 'Viral',       desc: 'Shareable content (+30% organic, quality −10%)' },
    ],
    default: 'longform',
  },
  video_quality: {
    label: 'Production Quality', icon: '🎥',
    options: [
      { key: 'quick',     label: 'Quick',     desc: 'Fast production (speed +40%, quality −30%)' },
      { key: 'standard',  label: 'Standard',  desc: 'Normal production' },
      { key: 'cinematic', label: 'Cinematic', desc: 'Premium (speed −40%, quality +40%)' },
    ],
    default: 'standard',
  },
  video_effects: {
    label: 'Visual Effects', icon: '✨',
    options: [
      { key: 'basic',    label: 'Basic',    desc: 'Simple editing' },
      { key: 'advanced', label: 'Advanced', desc: 'Complex effects (+20% quality)' },
    ],
    default: 'basic',
  },
  design_style: {
    label: 'Design Style', icon: '🎨',
    options: [
      { key: 'minimalist', label: 'Minimalist', desc: 'Clean and simple (+10% CR)' },
      { key: 'bold',       label: 'Bold',       desc: 'Eye-catching (+10% quality, +15% CR)' },
      { key: 'playful',    label: 'Playful',    desc: 'Fun and creative (+10% organic)' },
    ],
    default: 'bold',
  },
  design_palette: {
    label: 'Color Palette', icon: '🎨',
    options: [
      { key: 'warm',    label: 'Warm',    desc: 'Warm tones (+5% CR)' },
      { key: 'cool',    label: 'Cool',    desc: 'Cool tones (+5% CR)' },
      { key: 'vibrant', label: 'Vibrant', desc: 'Vibrant colors (+8% CR)' },
    ],
    default: 'warm',
  },
  support_sla: {
    label: 'SLA Target', icon: '⏱️',
    options: [
      { key: 'fast',     label: 'Fast',     desc: 'Quick responses (speed +30%, quality −20%)' },
      { key: 'standard', label: 'Standard', desc: 'Normal support' },
      { key: 'thorough', label: 'Thorough', desc: 'Deep investigation (speed −30%, quality +30%)' },
    ],
    default: 'standard',
  },
  support_templates: {
    label: 'Response Templates', icon: '📋',
    options: [
      { key: 'basic',  label: 'Basic',  desc: 'Generic responses (speed +10%, quality −10%)' },
      { key: 'custom', label: 'Custom', desc: 'Tailored responses (speed −10%, quality +15%)' },
    ],
    default: 'basic',
  },
  coffee_quality: {
    label: 'Coffee Quality', icon: '☕',
    options: [
      { key: 'instant',  label: 'Instant',  desc: 'Basic coffee (1× mood recovery)' },
      { key: 'drip',     label: 'Drip',     desc: 'Good coffee (1.3× mood recovery)' },
      { key: 'espresso', label: 'Espresso', desc: 'Premium coffee (1.6× mood recovery)' },
    ],
    default: 'instant',
  },
  break_duration: {
    label: 'Break Policy', icon: '🛋️',
    options: [
      { key: 'short',    label: 'Short',    desc: 'Quick breaks, less recovery (0.7× duration)' },
      { key: 'normal',   label: 'Normal',   desc: 'Standard breaks' },
      { key: 'extended', label: 'Extended', desc: 'Long breaks, better recovery (1.5× duration)' },
    ],
    default: 'normal',
  },
  meeting_schedule: {
    label: 'Meeting Frequency', icon: '📅',
    options: [
      { key: 'weekly',   label: 'Weekly',   desc: 'Standups every week' },
      { key: 'biweekly', label: 'Biweekly', desc: 'Every 2 weeks' },
    ],
    default: 'weekly',
  },
  meeting_focus: {
    label: 'Meeting Focus', icon: '🧠',
    options: [
      { key: 'brainstorm', label: 'Brainstorm', desc: 'Creative focus (+skill, less mood)' },
      { key: 'review',     label: 'Review',     desc: 'Performance review (balanced)' },
      { key: 'planning',   label: 'Planning',   desc: 'Strategic planning (+mood)' },
    ],
    default: 'review',
  },
  lobby_style: {
    label: 'Lobby Style', icon: '🏢',
    options: [
      { key: 'casual',       label: 'Casual',       desc: 'Relaxed atmosphere (+1 rep/week)' },
      { key: 'professional', label: 'Professional', desc: 'Polished look (+2 rep/week)' },
      { key: 'premium',      label: 'Premium',      desc: 'Impressive space (+3 rep/week)' },
    ],
    default: 'casual',
  },
  data_server: {
    label: 'Analytics Dashboard', icon: '📊',
    options: [
      { key: 'open', label: 'Open Dashboard', desc: 'View business analytics' },
    ],
    default: 'open',
  },
  data_monitor: {
    label: 'Full Metrics', icon: '📈',
    options: [
      { key: 'open', label: 'Open Metrics', desc: 'View detailed funnel data' },
    ],
    default: 'open',
  },
  eng_methodology: {
    label: 'Dev Methodology', icon: '⚙️',
    options: [
      { key: 'agile',     label: 'Agile',     desc: 'Fast iterations (speed +20%, quality -10%)' },
      { key: 'balanced',  label: 'Balanced',   desc: 'Standard development' },
      { key: 'waterfall', label: 'Waterfall', desc: 'Thorough planning (speed -20%, quality +20%)' },
    ],
    default: 'balanced',
  },
  eng_stack: {
    label: 'Tech Stack', icon: '🧰',
    options: [
      { key: 'modern', label: 'Modern', desc: 'Cutting-edge tools (speed +15%, quality -5%)' },
      { key: 'stable', label: 'Stable', desc: 'Proven technologies (quality +10%)' },
    ],
    default: 'stable',
  },
  workshop_quality: {
    label: 'Build Quality', icon: '🔧',
    options: [
      { key: 'quick',   label: 'Quick',   desc: 'Fast turnaround (speed +30%, quality -20%)' },
      { key: 'precise', label: 'Precise', desc: 'High precision (speed -20%, quality +30%)' },
    ],
    default: 'quick',
  },
  workshop_tools: {
    label: 'Tool Grade', icon: '🛠️',
    options: [
      { key: 'basic', label: 'Basic', desc: 'Standard tools' },
      { key: 'pro',   label: 'Pro',   desc: 'Premium tools (+15% quality, +10% speed)' },
    ],
    default: 'basic',
  },
  marketing_channel: {
    label: 'Channel Focus', icon: '📣',
    options: [
      { key: 'paid',    label: 'Paid',    desc: 'Focus on paid ads (CPC -30%)' },
      { key: 'organic', label: 'Organic', desc: 'Focus on organic growth (+25% organic visitors)' },
      { key: 'both',    label: 'Both',    desc: 'Balanced approach' },
    ],
    default: 'both',
  },
  marketing_spend: {
    label: 'Ad Spend Level', icon: '💰',
    options: [
      { key: 'lean',       label: 'Lean',       desc: '$80/day — efficient but limited reach' },
      { key: 'standard',   label: 'Standard',   desc: '$200/day — balanced reach and cost' },
      { key: 'aggressive', label: 'Aggressive', desc: '$400/day — maximum reach, expensive' },
    ],
    default: 'standard',
  },
  sales_commission: {
    label: 'Commission Rate', icon: '💵',
    options: [
      { key: 'none',     label: 'No Bonus',  desc: 'Base deals, no commission cost' },
      { key: 'standard', label: 'Standard',  desc: '+15% deal value, 8% commission (best margin)' },
      { key: 'generous', label: 'Generous',  desc: '+25% deal value, 18% commission' },
      { key: 'lavish',   label: 'Lavish',    desc: '+30% deal value, 30% commission (low margin!)' },
    ],
    default: 'standard',
  },
  pr_approach: {
    label: 'PR Approach', icon: '📰',
    options: [
      { key: 'aggressive', label: 'Aggressive', desc: 'High visibility (reputation +2x, risk of backlash)' },
      { key: 'steady',     label: 'Steady',     desc: 'Consistent, reliable coverage' },
    ],
    default: 'steady',
  },
  pricing_strategy: {
    label: 'Pricing Strategy', icon: '🏷️',
    options: [
      { key: 'discount',  label: 'Discount',  desc: 'Lower prices, more walk-in sales (pay ×0.7, walk-in +40%)' },
      { key: 'standard',  label: 'Standard',  desc: 'Balanced pricing and foot traffic' },
      { key: 'premium',   label: 'Premium',   desc: 'Higher prices, fewer sales (pay ×1.4, walk-in −30%)' },
    ],
    default: 'standard',
  },
  perks_package: {
    label: 'Perks Package', icon: '🏋️',
    options: [
      { key: 'none',    label: 'None',    desc: 'No perks (free)' },
      { key: 'basic',   label: 'Basic',   desc: 'Sport pass — motivation +0.1/day ($15/day)' },
      { key: 'premium', label: 'Premium', desc: 'Sport + Cinema — motivation +0.2/day, mood +0.05/day ($35/day)' },
      { key: 'elite',   label: 'Elite',   desc: 'Full wellness — motivation +0.3/day, mood +0.1/day, energy +15% ($60/day)' },
    ],
    default: 'none',
  },
  workspace_quality: {
    label: 'Workspace Quality', icon: '🪑',
    options: [
      { key: 'basic',     label: 'Basic',     desc: 'Standard workspace (free)' },
      { key: 'ergonomic', label: 'Ergonomic', desc: 'Ergonomic desks — energy drain -10% ($20/day)' },
      { key: 'premium',   label: 'Premium',   desc: 'Premium workspace — energy drain -15%, motivation decay -20% ($40/day)' },
    ],
    default: 'basic',
  },
};

// ─── Hatcher desk types ─────────────────────────────────
export const COMPANY_TYPES = {
  digital_agency: {
    name: 'Signal Guild',
    icon: '📡',
    tagline: 'Scout demand, publish signals, and route flow',
    available: ['seo','content','video','design','data','sales','support','marketing','pr','hr','finance','legal','it'],
    startUnlocked: ['lobby','seo','content','support'],
    bonuses: { organicMultiplier: 1.2 },
  },
  saas_startup: {
    name: 'Protocol Forge',
    icon: '⚙️',
    tagline: 'Build protocol rooms and compound agent output',
    available: ['engineering','design','content','data','sales','support','marketing','it','rd','hr','finance','legal'],
    startUnlocked: ['lobby','engineering','support'],
    bonuses: { projectPayMultiplier: 0.7, organicMultiplier: 0.5 },
  },
  ecommerce: {
    name: 'Market Bazaar',
    icon: '🏪',
    tagline: 'Trade inventory, route demand, and expand the vault',
    available: ['marketing','design','content','sales','support','warehouse','data','pr','hr','finance','it','legal'],
    startUnlocked: ['lobby','sales','warehouse','support'],
    bonuses: { marketingEfficiency: 1.3, bulkOrderChance: 0.12 },
  },
  creative_house: {
    name: 'Lore House',
    icon: '🎭',
    tagline: 'Turn agent stories into reputation and mission value',
    available: ['design','video','content','seo','sales','pr','marketing','hr','finance','support'],
    startUnlocked: ['lobby','design','content','support'],
    bonuses: { reputationGainMultiplier: 1.5 },
  },
  tech_lab: {
    name: 'Brain Core Lab',
    icon: '🧠',
    tagline: 'Tune agent cores, ship upgrades, and scale fast',
    available: ['engineering','data','design','sales','support','it','rd','marketing','hr','finance','legal'],
    startUnlocked: ['lobby','engineering','data'],
    bonuses: { rdInnovationRate: 1.5, projectPayMultiplier: 1.2 },
  },
  maker_co: {
    name: 'Fabricator Co.',
    icon: '🏭',
    tagline: 'Craft upgrades, stock the vault, and fulfill missions',
    available: ['workshop','warehouse','engineering','design','sales','support','rd','hr','finance','legal','it'],
    startUnlocked: ['lobby','workshop','warehouse'],
    bonuses: { bulkOrderChance: 0.15, projectPayMultiplier: 1.1 },
  },
  consulting_firm: {
    name: 'Strategy Desk',
    icon: '🏛️',
    tagline: 'Read markets, advise desks, and sell premium missions',
    available: ['data','engineering','content','sales','pr','marketing','support','hr','finance','legal','it'],
    startUnlocked: ['lobby','data','content','support'],
    bonuses: { reputationPayMultiplier: 2.0, projectPayMultiplier: 1.1 },
  },
  staffing_agency: {
    name: 'Hatchery Desk',
    icon: '🥚',
    tagline: 'Hatch agents, train crews, and fill every room',
    available: ['hr','support','sales','marketing','pr','finance','legal','it','data','content'],
    startUnlocked: ['lobby','hr','support','sales'],
    bonuses: { hireCostDiscount: 0.5, founderDemandMultiplier: 2.5, placementFeeMultiplier: 1.3 },
  },
  fashion_retail: {
    name: 'Street Market',
    icon: '🏬',
    tagline: 'Run a visible market stall with fast walk-in flow',
    available: ['shopfront','design','warehouse','sales','marketing','pr','support','hr','finance','legal','it','content'],
    startUnlocked: ['lobby','shopfront','warehouse'],
    bonuses: { walkinMultiplier: 3.0, organicMultiplier: 1.0, retailCloseBoost: 3.0 },
  },
};

// ─── Growth model definitions per company type ────────────
export const GROWTH_MODELS = {
  digital_agency:  { model: 'linear',       label: 'Signal Growth' },
  saas_startup:    { model: 'exponential',  label: 'Protocol Growth' },
  ecommerce:       { model: 'physical',     label: 'Trade Flow Growth' },
  creative_house:  { model: 'linear',       label: 'Reputation Growth' },
  tech_lab:        { model: 'exponential',  label: 'Brain Core Growth' },
  maker_co:        { model: 'physical',     label: 'Fabrication Growth' },
  consulting_firm: { model: 'premium',      label: 'Strategy Growth' },
  staffing_agency: { model: 'linear',       label: 'Hatchery Growth' },
  fashion_retail:  { model: 'physical',     label: 'Street Market Growth' },
};
