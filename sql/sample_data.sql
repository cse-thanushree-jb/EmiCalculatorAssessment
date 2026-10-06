-- Small illustrative data set for validating SQL locally; not official IPL statistics.
INSERT INTO accounts VALUES (1, 'Account A'), (2, 'Account B'), (3, 'Account C');
INSERT INTO transactions VALUES
(101, 1, 2, 1000.00, '2026-01-01 10:00:00'),
(102, 2, 1, 950.00, '2026-01-02 08:00:00'),
(103, 1, 3, 400.00, '2026-01-03 10:00:00'),
(104, 3, 1, 200.00, '2026-01-03 11:00:00');

INSERT INTO players VALUES (1, 'Example Batter'), (2, 'Another Batter');
INSERT INTO ipl_match_scores VALUES
(2024, 1, '2024-03-22', 1, 35),
(2024, 2, '2024-03-25', 1, 41),
(2024, 3, '2024-03-28', 1, 30),
(2024, 4, '2024-03-31', 1, 12),
(2024, 1, '2024-03-22', 2, 31),
(2024, 2, '2024-03-25', 2, 15),
(2024, 3, '2024-03-28', 2, 44);
