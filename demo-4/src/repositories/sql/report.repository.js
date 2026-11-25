// Query laporan untuk dashboard (aggregate di database, bukan di JavaScript).
// Bentuk hasil mengikuti kontrak sesi 29 (BranchBalance, Cashflow).
import { query } from '../../db/oracle.js';
import { toMoney } from '../../utils/format.js';

export async function branchBalances() {
  const result = await query(
    `SELECT b.branch_code, b.branch_name,
            COUNT(a.account_id) AS account_count,
            NVL(SUM(a.balance), 0) AS total_balance
       FROM branches b
       LEFT JOIN customers c ON c.branch_id = b.branch_id
       LEFT JOIN accounts a ON a.customer_id = c.customer_id
      GROUP BY b.branch_code, b.branch_name
      ORDER BY b.branch_code`,
  );
  return result.rows.map((r) => ({
    branchCode: r.BRANCH_CODE,
    branchName: r.BRANCH_NAME,
    accountCount: Number(r.ACCOUNT_COUNT),
    totalBalance: toMoney(r.TOTAL_BALANCE),
  }));
}

const CASH_IN = `CASE WHEN t.txn_type IN ('SETOR', 'TRANSFER_MASUK') THEN t.amount ELSE 0 END`;
const CASH_OUT = `CASE WHEN t.txn_type IN ('TARIK', 'TRANSFER_KELUAR') THEN t.amount ELSE 0 END`;

// Arus kas satu bulan per kategori. accountId null = semua rekening.
// GROUP BY ROLLUP menambah satu baris total (category NULL) di akhir.
export async function cashflow(accountId, month) {
  const result = await query(
    `SELECT NVL(t.category, 'TOTAL') AS category,
            SUM(${CASH_IN}) AS cash_in,
            SUM(${CASH_OUT}) AS cash_out,
            SUM(${CASH_IN}) - SUM(${CASH_OUT}) AS net,
            COUNT(*) AS txn_count
       FROM transactions t
      WHERE (:accountId IS NULL OR t.account_id = :accountId)
        AND t.txn_at >= TO_DATE(:month || '-01', 'YYYY-MM-DD')
        AND t.txn_at < ADD_MONTHS(TO_DATE(:month || '-01', 'YYYY-MM-DD'), 1)
      GROUP BY ROLLUP (t.category)
      ORDER BY GROUPING(t.category), t.category`,
    { accountId: accountId ?? null, month },
  );
  const rows = result.rows.map((r) => ({
    category: r.CATEGORY,
    in: toMoney(r.CASH_IN),
    out: toMoney(r.CASH_OUT),
    count: Number(r.TXN_COUNT),
    net: toMoney(r.NET),
  }));
  const total = rows.find((r) => r.category === 'TOTAL');
  const categories = rows.filter((r) => r.category !== 'TOTAL').map(({ net, ...k }) => k);
  return { categories, total };
}
