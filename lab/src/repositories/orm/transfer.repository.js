// Transfer lewat Sequelize managed transaction: commit otomatis kalau selesai, rollback otomatis kalau throw.
import { Account, sequelize, Transaction } from '../../models/index.js';
import { AppError, notFound } from '../../utils/app-error.js';
import { toMoney } from '../../utils/format.js';
import { nowWib, toCents, toWib } from './format.js';

export async function transfer({ fromAccountId, toAccountId, amount, description }) {
  return sequelize.transaction(async (t) => {
    // 1. Kunci kedua rekening (SELECT ... FOR UPDATE), urut id.
    const locked = await Account.findAll({
      where: { id: [fromAccountId, toAccountId] },
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const from = locked.find((a) => a.id === fromAccountId);
    const to = locked.find((a) => a.id === toAccountId);
    if (!from) throw notFound(`Rekening asal ${fromAccountId}`);
    if (!to) throw notFound(`Rekening tujuan ${toAccountId}`);
    for (const acc of [from, to]) {
      if (acc.status === 'DIBLOKIR') throw new AppError(409, 'ACCOUNT_BLOCKED', `Rekening ${acc.accountNo} diblokir`);
      if (acc.status === 'DITUTUP') throw new AppError(409, 'ACCOUNT_CLOSED', `Rekening ${acc.accountNo} sudah ditutup`);
    }

    // 2. Cek saldo di JavaScript (baris sudah dikunci), bandingkan dalam sen BigInt, bukan float.
    if (toCents(from.balance) < toCents(amount)) {
      throw new AppError(409, 'INSUFFICIENT_BALANCE', `Saldo rekening ${from.accountNo} tidak cukup`);
    }

    // 3. Debit dan kredit: UPDATE ... SET BALANCE = BALANCE - :by.
    await from.decrement('balance', { by: amount, transaction: t });
    await to.increment('balance', { by: amount, transaction: t });

    // 4. Dua baris mutasi. Sequence tidak punya model, jadi pakai raw query.
    const [[{ SEQ }]] = await sequelize.query('SELECT transfer_ref_seq.NEXTVAL AS seq FROM dual', { transaction: t });
    const transferRef = `REF-SIM-T${SEQ}`;
    const txnAt = nowWib();
    await Transaction.create({
      accountId: fromAccountId, txnType: 'TRANSFER_KELUAR', category: 'TRANSFER', amount, txnAt,
      description: description ?? `Transfer ke ${to.accountNo}`, refNo: `${transferRef}-D`,
    }, { transaction: t });
    await Transaction.create({
      accountId: toAccountId, txnType: 'TRANSFER_MASUK', category: 'TRANSFER', amount, txnAt,
      description: description ?? `Transfer dari ${from.accountNo}`, refNo: `${transferRef}-K`,
    }, { transaction: t });

    return { refNo: transferRef, fromAccountId, toAccountId, amount: toMoney(amount), txnAt: toWib(txnAt) };
  });
}
