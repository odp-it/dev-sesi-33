// Controller: ambil input yang sudah divalidasi, panggil service, kirim respons HTTP.
// Express 5 meneruskan error dari fungsi async ke error handler tanpa try/catch.
import * as customerService from '../services/customer.service.js';

export async function list(req, res) {
  res.json(await customerService.list(req.valid.query));
}

export async function get(req, res) {
  res.json(await customerService.get(req.valid.params.id));
}

export async function create(req, res) {
  const customer = await customerService.create(req.valid.body);
  res.status(201).location(`/api/customers/${customer.id}`).json(customer);
}

export async function update(req, res) {
  res.json(await customerService.update(req.valid.params.id, req.valid.body));
}

export async function remove(req, res) {
  await customerService.remove(req.valid.params.id);
  res.status(204).end();
}

export async function listAccounts(req, res) {
  res.json(await customerService.listAccounts(req.valid.params.id));
}
