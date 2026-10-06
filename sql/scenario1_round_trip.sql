-- Scenario 1: reverse-direction transfer within 24 hours, amounts within 10%.
-- SQLite syntax. A->B amount and B->A amount must differ by no more than 10%
-- of the first transaction amount.
SELECT
    t1.transaction_id AS outbound_transaction_id,
    t2.transaction_id AS return_transaction_id,
    t1.from_account_id AS account_a,
    t1.to_account_id AS account_b,
    t1.amount AS outbound_amount,
    t2.amount AS return_amount,
    t1.transaction_time AS outbound_time,
    t2.transaction_time AS return_time,
    ABS(t1.amount - t2.amount) * 1.0 / t1.amount AS relative_difference
FROM transactions t1
JOIN transactions t2
  ON t1.from_account_id = t2.to_account_id
 AND t1.to_account_id = t2.from_account_id
 AND t1.transaction_id <> t2.transaction_id
 AND t2.transaction_time >= t1.transaction_time
 AND t2.transaction_time <= datetime(t1.transaction_time, '+24 hours')
WHERE ABS(t1.amount - t2.amount) <= t1.amount * 0.10
ORDER BY t1.transaction_time, t1.transaction_id;
