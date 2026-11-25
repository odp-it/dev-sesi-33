// ACCOUNTS dan TRANSACTIONS lewat Sequelize.
import { Op } from 'sequelize';
import { Account, Transaction } from '../../models/index.js';
import { toMoney } from '../../utils/format.js';
import { AppError } from '../../utils/app-error.js';
import { toWib } from './format.js';

const todo = (step) => new AppError(501, 'NOT_IMPLEMENTED', `TODO ${step} (orm) belum dikerjakan`);

const toAccount = (a) => ({
  id: a.id,
  accountNo: a.accountNo,
  customerId: a.customerId,
  product: a.product,
  balance: toMoney(a.balance),
  status: a.status,
  openedAt: toWib(a.openedAt),
});

const toTransaction = (t) => ({
  id: t.id,
  refNo: t.refNo,
  accountId: t.accountId,
  txnType: t.txnType,
  category: t.category,
  amount: toMoney(t.amount),
  txnAt: toWib(t.txnAt),
  description: t.description,
});

// TODO 2.1: rekening milik nasabah, urut id
// eslint-disable-next-line no-unused-vars
export async function findByCustomer(customerId) {
  throw todo('2.1');
}

// TODO 2.1: Account.findByPk(id) -> toAccount atau null
// eslint-disable-next-line no-unused-vars
export async function findById(id) {
  throw todo('2.1');
}

// TODO 2.2: mutasi dengan filter from/to (Op.gte / Op.lt pada txnAt), category, pagination.
//   from '2026-03-01' -> new Date('2026-03-01T00:00:00Z'); to -> tanggal berikutnya (batas < )
//   order [['txnAt', 'ASC'], ['id', 'ASC']]
// eslint-disable-next-line no-unused-vars
export async function findTransactions(accountId, { from, to, category, page, pageSize }) {
  throw todo('2.2');
}
