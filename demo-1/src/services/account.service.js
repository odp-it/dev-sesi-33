import { accountRepo, branchRepo, reportRepo, transferRepo } from '../repositories/index.js';
import { notFound } from '../utils/app-error.js';

export async function listBranches() {
  return { data: await branchRepo.findAll() };
}

export async function get(id) {
  const account = await accountRepo.findById(id);
  if (!account) throw notFound(`Rekening ${id}`);
  return account;
}

export async function listTransactions(id, query) {
  await get(id);
  const { rows, total } = await accountRepo.findTransactions(id, query);
  return { data: rows, page: query.page, pageSize: query.pageSize, total };
}

export async function transfer(input) {
  return transferRepo.transfer(input);
}

export async function branchBalances() {
  return { data: await reportRepo.branchBalances() };
}

// Bentuk Cashflow kontrak sesi 29. Semua angka dihitung di SQL, di sini hanya disusun.
export async function cashflow({ accountId, month }) {
  const account = accountId ? await get(accountId) : null;
  const { categories, total } = await reportRepo.cashflow(accountId ?? null, month);
  return {
    month,
    accountId: accountId ?? null,
    accountNo: account?.accountNo ?? null,
    transactions: total?.count ?? 0,
    totalIn: total?.in ?? '0.00',
    totalOut: total?.out ?? '0.00',
    net: total?.net ?? '0.00',
    categories,
  };
}
