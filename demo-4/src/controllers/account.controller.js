import * as accountService from '../services/account.service.js';

export async function listBranches(req, res) {
  res.json(await accountService.listBranches());
}

export async function get(req, res) {
  res.json(await accountService.get(req.valid.params.id));
}

export async function listTransactions(req, res) {
  res.json(await accountService.listTransactions(req.valid.params.id, req.valid.query));
}

export async function transfer(req, res) {
  res.status(201).json(await accountService.transfer(req.valid.body));
}

export async function branchBalances(req, res) {
  res.json(await accountService.branchBalances());
}

export async function cashflow(req, res) {
  res.json(await accountService.cashflow(req.valid.query));
}
