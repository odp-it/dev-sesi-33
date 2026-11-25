// Akses tabel ACCOUNTS dan TRANSACTIONS (mutasi) dengan SQL langsung.
import { query } from '../../db/oracle.js';
import { isoWib, toMoney } from '../../utils/format.js';

const SELECT_ACCOUNT = `
  SELECT account_id, account_no, customer_id, product, balance, status, ${isoWib('opened_at')} AS opened_at
    FROM accounts`;

const toAccount = (r) => ({
  id: Number(r.ACCOUNT_ID),
  accountNo: r.ACCOUNT_NO,
  customerId: Number(r.CUSTOMER_ID),
  product: r.PRODUCT,
  balance: toMoney(r.BALANCE),
  status: r.STATUS,
  openedAt: r.OPENED_AT,
});

const toTransaction = (r) => ({
  id: Number(r.TXN_ID),
  refNo: r.REF_NO,
  accountId: Number(r.ACCOUNT_ID),
  txnType: r.TXN_TYPE,
  category: r.CATEGORY,
  amount: toMoney(r.AMOUNT),
  txnAt: r.TXN_AT,
  description: r.DESCRIPTION,
});

export async function findByCustomer(customerId) {
  const result = await query(`${SELECT_ACCOUNT} WHERE customer_id = :customerId ORDER BY account_id`, { customerId });
  return result.rows.map(toAccount);
}

export async function findById(id) {
  const result = await query(`${SELECT_ACCOUNT} WHERE account_id = :id`, { id });
  return result.rows[0] ? toAccount(result.rows[0]) : null;
}

export async function findTransactions(accountId, { from, to, category, page, pageSize }) {
  const where = ['t.account_id = :accountId'];
  const binds = { accountId };
  if (from) {
    where.push(`t.txn_at >= TO_DATE(:fromDate, 'YYYY-MM-DD')`);
    binds.fromDate = from;
  }
  if (to) {
    where.push(`t.txn_at < TO_DATE(:toDate, 'YYYY-MM-DD') + 1`);
    binds.toDate = to;
  }
  if (category) {
    where.push('t.category = :category');
    binds.category = category;
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;
  const count = await query(`SELECT COUNT(*) AS total FROM transactions t ${whereSql}`, binds);
  const result = await query(
    `SELECT t.txn_id, t.account_id, t.txn_type, t.category, t.amount, ${isoWib('t.txn_at')} AS txn_at,
            t.description, t.ref_no
       FROM transactions t ${whereSql}
      ORDER BY t.txn_at, t.txn_id
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    { ...binds, offset: (page - 1) * pageSize, limit: pageSize },
  );
  return { rows: result.rows.map(toTransaction), total: Number(count.rows[0].TOTAL) };
}
