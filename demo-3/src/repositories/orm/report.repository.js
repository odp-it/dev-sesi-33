// Laporan tetap SQL (GROUP BY ROLLUP), dijalankan lewat sequelize.query dengan bind variable ($nama).
// Hasil SUM tidak punya skala desimal, jadi di-CAST ke NUMBER(17,2) supaya datang sebagai string.
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../models/index.js';
import { toMoney } from '../../utils/format.js';

export async function branchBalances() {
  const rows = await sequelize.query(
    `SELECT b.branch_code, b.branch_name,
            COUNT(a.account_id) AS account_count,
            CAST(NVL(SUM(a.balance), 0) AS NUMBER(17, 2)) AS total_balance
       FROM branches b
       LEFT JOIN customers c ON c.branch_id = b.branch_id
       LEFT JOIN accounts a ON a.customer_id = c.customer_id
      GROUP BY b.branch_code, b.branch_name
      ORDER BY b.branch_code`,
    { type: QueryTypes.SELECT },
  );
  return rows.map((r) => ({
    branchCode: r.BRANCH_CODE,
    branchName: r.BRANCH_NAME,
    accountCount: r.ACCOUNT_COUNT,
    totalBalance: toMoney(r.TOTAL_BALANCE),
  }));
}

const CASH_IN = `CASE WHEN t.txn_type IN ('SETOR', 'TRANSFER_MASUK') THEN t.amount ELSE 0 END`;
const CASH_OUT = `CASE WHEN t.txn_type IN ('TARIK', 'TRANSFER_KELUAR') THEN t.amount ELSE 0 END`;

// Bind Sequelize ($nama) yang dipakai dua kali di satu SQL gagal di Oracle (NJS-098),
// jadi batas bulan dihitung di sini dan tiap bind dipakai sekali. Nama $end ditolak Oracle (ORA-01745).
function monthRange(month) {
  const [year, mon] = month.split('-').map(Number);
  const next = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, '0')}`;
  return { monthStart: `${month}-01`, monthEnd: `${next}-01` };
}

// accountId null = semua rekening. Filter rekening ditambahkan hanya kalau ada (bind tetap sekali pakai).
export async function cashflow(accountId, month) {
  const bind = monthRange(month);
  let accountFilter = '';
  if (accountId) {
    accountFilter = 'AND t.account_id = $accountId';
    bind.accountId = accountId;
  }
  const rows = await sequelize.query(
    `SELECT NVL(t.category, 'TOTAL') AS category,
            CAST(SUM(${CASH_IN}) AS NUMBER(17, 2)) AS cash_in,
            CAST(SUM(${CASH_OUT}) AS NUMBER(17, 2)) AS cash_out,
            CAST(SUM(${CASH_IN}) - SUM(${CASH_OUT}) AS NUMBER(17, 2)) AS net,
            COUNT(*) AS txn_count
       FROM transactions t
      WHERE t.txn_at >= TO_DATE($monthStart, 'YYYY-MM-DD')
        AND t.txn_at < TO_DATE($monthEnd, 'YYYY-MM-DD')
        ${accountFilter}
      GROUP BY ROLLUP (t.category)
      ORDER BY GROUPING(t.category), t.category`,
    { bind, type: QueryTypes.SELECT },
  );
  const mapped = rows.map((r) => ({
    category: r.CATEGORY,
    in: toMoney(r.CASH_IN),
    out: toMoney(r.CASH_OUT),
    count: Number(r.TXN_COUNT),
    net: toMoney(r.NET),
  }));
  const total = mapped.find((r) => r.category === 'TOTAL');
  const categories = mapped.filter((r) => r.category !== 'TOTAL').map(({ net, ...k }) => k);
  return { categories, total };
}
