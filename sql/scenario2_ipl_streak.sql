-- Scenario 2: players scoring 30+ in at least 3 consecutive matches in IPL 2024.
-- Match sequence is determined by match_date then match_id, including matches where
-- the player scored fewer than 30 (those rows break a streak).
WITH player_match_sequence AS (
  SELECT
    p.player_id,
    p.player_name,
    s.match_id,
    s.match_date,
    s.runs,
    ROW_NUMBER() OVER (
      PARTITION BY p.player_id
      ORDER BY s.match_date, s.match_id
    ) AS match_number
  FROM ipl_match_scores s
  JOIN players p ON p.player_id = s.player_id
  WHERE s.season = 2024
),
qualified AS (
  SELECT *,
    SUM(CASE WHEN runs >= 30 THEN 0 ELSE 1 END) OVER (
      PARTITION BY player_id
      ORDER BY match_number
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS streak_group
  FROM player_match_sequence
),
streaks AS (
  SELECT
    player_id,
    player_name,
    MIN(match_date) AS streak_start_date,
    COUNT(*) AS consecutive_matches
  FROM qualified
  WHERE runs >= 30
  GROUP BY player_id, player_name, streak_group
  HAVING COUNT(*) >= 3
)
SELECT DISTINCT player_name, streak_start_date, consecutive_matches
FROM streaks
ORDER BY streak_start_date, player_name;
