-- Hatcher Markets multiplayer schema draft.
-- Resettable economy state is scoped by alpha_epoch_id.
-- Identity, wallet bindings, and cosmetic entitlements live outside resettable saves.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE alpha_epochs (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
  reset_reason TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX alpha_epochs_one_active_idx
  ON alpha_epochs ((status))
  WHERE status = 'active';

CREATE TABLE players (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  wallet_address TEXT UNIQUE,
  founder_badge BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_terms_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cosmetic_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  cosmetic_key TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('alpha', 'founder', 'hatcher_utility', 'admin_grant')),
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_id, cosmetic_key)
);

CREATE TABLE hub_saves (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  snapshot_version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, alpha_epoch_id)
);

CREATE TABLE market_snapshots (
  id BIGSERIAL PRIMARY KEY,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  rule_version INTEGER NOT NULL,
  market_tick BIGINT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alpha_epoch_id, market_tick)
);

CREATE TABLE market_events (
  id BIGSERIAL PRIMARY KEY,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  player_id TEXT REFERENCES players(id) ON DELETE SET NULL,
  market_tick BIGINT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'market-pulse',
      'run-contract',
      'place-order',
      'craft-core',
      'buy-cosmetic',
      'system-tick',
      'admin-reset'
    )
  ),
  intent JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX market_events_epoch_tick_idx
  ON market_events (alpha_epoch_id, market_tick, id);

CREATE INDEX market_events_player_idx
  ON market_events (player_id, created_at DESC);

CREATE TABLE active_contracts (
  id TEXT NOT NULL,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  resource_id TEXT NOT NULL,
  title TEXT NOT NULL,
  reward_credits INTEGER NOT NULL CHECK (reward_credits > 0),
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'complete', 'expired')),
  completed_by TEXT REFERENCES players(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, alpha_epoch_id)
);

CREATE TABLE leaderboard_snapshots (
  id BIGSERIAL PRIMARY KEY,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  board_key TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leaderboard_snapshots_latest_idx
  ON leaderboard_snapshots (alpha_epoch_id, board_key, created_at DESC);

CREATE TABLE player_epoch_progress (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  alpha_epoch_id BIGINT NOT NULL REFERENCES alpha_epochs(id),
  credits BIGINT NOT NULL DEFAULT 0,
  market_score BIGINT NOT NULL DEFAULT 0,
  completed_contracts INTEGER NOT NULL DEFAULT 0,
  inventory JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, alpha_epoch_id)
);
