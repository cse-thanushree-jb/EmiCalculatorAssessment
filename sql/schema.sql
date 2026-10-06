-- SQLite-compatible schema
CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  account_name TEXT NOT NULL
);

CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY,
  from_account_id INTEGER NOT NULL,
  to_account_id INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  transaction_time TIMESTAMP NOT NULL,
  FOREIGN KEY (from_account_id) REFERENCES accounts(account_id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY,
  player_name TEXT NOT NULL
);

CREATE TABLE ipl_match_scores (
  season INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  match_date DATE NOT NULL,
  player_id INTEGER NOT NULL,
  runs INTEGER NOT NULL,
  PRIMARY KEY (season, match_id, player_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);
