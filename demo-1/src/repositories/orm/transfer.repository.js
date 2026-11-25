// Transfer lewat Sequelize managed transaction.
import { Account, sequelize, Transaction } from '../../models/index.js';
import { AppError, notFound } from '../../utils/app-error.js';
import { toMoney } from '../../utils/format.js';
import { nowWib, toCents, toWib } from './format.js';

const todo = (step) => new AppError(501, 'NOT_IMPLEMENTED', `TODO ${step} (orm) belum dikerjakan`);

// TODO 3.1: tulis ulang transfer sesi 31 dengan sequelize.transaction(async (t) => { ... }).
//   Aturan sama: 404 rekening tidak ada, 409 ACCOUNT_BLOCKED / ACCOUNT_CLOSED, 409 INSUFFICIENT_BALANCE,
//   dua mutasi REF-SIM-T<seq>-D / -K, respons { refNo, fromAccountId, toAccountId, amount, txnAt }.
// eslint-disable-next-line no-unused-vars
export async function transfer({ fromAccountId, toAccountId, amount, description }) {
  throw todo('3.1');
}
