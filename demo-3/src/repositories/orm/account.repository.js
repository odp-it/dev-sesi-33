// ACCOUNTS dan TRANSACTIONS lewat Sequelize.
import { Op } from 'sequelize';
import { Account, Transaction } from '../../models/index.js';
import { toMoney } from '../../utils/format.js';
import { toWib } from './format.js';

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

export async function findByCustomer(customerId) {
  const accounts = await Account.findAll({ where: { customerId }, order: [['id', 'ASC']] });
  return accounts.map(toAccount);
}

export async function findById(id) {
  const account = await Account.findByPk(id);
  return account ? toAccount(account) : null;
}

export async function findTransactions(accountId, { from, to, category, page, pageSize }) {
  const where = { accountId };
  if (from || to) where.txnAt = {};
  if (from) where.txnAt[Op.gte] = new Date(`${from}T00:00:00Z`);
  if (to) where.txnAt[Op.lt] = new Date(new Date(`${to}T00:00:00Z`).getTime() + 24 * 60 * 60 * 1000);
  if (category) where.category = category;

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    order: [['txnAt', 'ASC'], ['id', 'ASC']],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  return { rows: rows.map(toTransaction), total: count };
}
