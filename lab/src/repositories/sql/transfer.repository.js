// Transfer antar rekening: debit + kredit + dua baris mutasi dalam SATU transaksi database.
import { withTransaction } from '../../db/oracle.js';
import { AppError, notFound } from '../../utils/app-error.js';
import { toMoney } from '../../utils/format.js';

const INSERT_TXN = `
  INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES (:accountId, :txnType, 'TRANSFER', :amount, TO_TIMESTAMP(:txnAt, 'YYYY-MM-DD"T"HH24:MI:SS'), :description, :refNo)`;

export async function transfer({ fromAccountId, toAccountId, amount, description }) {
  return withTransaction(async (conn) => {
    // 1. Kunci kedua rekening (urut account_id supaya dua transfer berlawanan arah tidak saling tunggu).
    const locked = await conn.execute(
      `SELECT account_id, account_no, status FROM accounts
        WHERE account_id IN (:fromId, :toId)
        ORDER BY account_id
        FOR UPDATE`,
      { fromId: fromAccountId, toId: toAccountId },
    );
    const from = locked.rows.find((r) => Number(r.ACCOUNT_ID) === fromAccountId);
    const to = locked.rows.find((r) => Number(r.ACCOUNT_ID) === toAccountId);
    if (!from) throw notFound(`Rekening asal ${fromAccountId}`);
    if (!to) throw notFound(`Rekening tujuan ${toAccountId}`);
    for (const acc of [from, to]) {
      if (acc.STATUS === 'DIBLOKIR') throw new AppError(409, 'ACCOUNT_BLOCKED', `Rekening ${acc.ACCOUNT_NO} diblokir`);
      if (acc.STATUS === 'DITUTUP') throw new AppError(409, 'ACCOUNT_CLOSED', `Rekening ${acc.ACCOUNT_NO} sudah ditutup`);
    }

    // 2. Debit: hanya berhasil kalau saldo cukup (dicek di database, bukan di JavaScript).
    const debit = await conn.execute(
      'UPDATE accounts SET balance = balance - :amount WHERE account_id = :id AND balance >= :amount',
      { amount, id: fromAccountId },
    );
    if (debit.rowsAffected === 0) {
      throw new AppError(409, 'INSUFFICIENT_BALANCE', `Saldo rekening ${from.ACCOUNT_NO} tidak cukup`);
    }

    // 3. Kredit.
    await conn.execute('UPDATE accounts SET balance = balance + :amount WHERE account_id = :id', { amount, id: toAccountId });

    // 4. Dua baris mutasi dengan nomor referensi dan jam yang sama.
    const meta = await conn.execute(
      `SELECT transfer_ref_seq.NEXTVAL AS seq,
              TO_CHAR(SYSTIMESTAMP AT TIME ZONE '+07:00', 'YYYY-MM-DD"T"HH24:MI:SS') AS txn_at
         FROM dual`,
    );
    const transferRef = `REF-SIM-T${meta.rows[0].SEQ}`;
    const txnAt = meta.rows[0].TXN_AT;
    await conn.execute(INSERT_TXN, {
      accountId: fromAccountId, txnType: 'TRANSFER_KELUAR', amount, txnAt,
      description: description ?? `Transfer ke ${to.ACCOUNT_NO}`, refNo: `${transferRef}-D`,
    });
    await conn.execute(INSERT_TXN, {
      accountId: toAccountId, txnType: 'TRANSFER_MASUK', amount, txnAt,
      description: description ?? `Transfer dari ${from.ACCOUNT_NO}`, refNo: `${transferRef}-K`,
    });

    return { refNo: transferRef, fromAccountId, toAccountId, amount: toMoney(amount), txnAt: `${txnAt}+07:00` };
  });
}
