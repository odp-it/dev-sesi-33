// Aturan bisnis nasabah. Tidak tahu SQL: semua akses data lewat repository.
import { accountRepo, customerRepo } from '../repositories/index.js';
import { notFound } from '../utils/app-error.js';

export async function list(query) {
  const { rows, total } = await customerRepo.findMany(query);
  return { data: rows, page: query.page, pageSize: query.pageSize, total };
}

export async function get(id) {
  const customer = await customerRepo.findById(id);
  if (!customer) throw notFound(`Nasabah ${id}`);
  return customer;
}

export async function create(data) {
  const id = await customerRepo.create(data);
  return customerRepo.findById(id);
}

export async function update(id, data) {
  const affected = await customerRepo.update(id, data);
  if (!affected) throw notFound(`Nasabah ${id}`);
  return customerRepo.findById(id);
}

export async function remove(id) {
  const affected = await customerRepo.remove(id);
  if (!affected) throw notFound(`Nasabah ${id}`);
}

export async function listAccounts(id) {
  await get(id);
  return { data: await accountRepo.findByCustomer(id) };
}
