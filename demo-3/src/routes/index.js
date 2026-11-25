// Semua endpoint kontrak API (program/api-contract.md), tanpa auth (auth di sesi 34).
import { Router } from 'express';
import * as accounts from '../controllers/account.controller.js';
import * as customers from '../controllers/customer.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  cashflowQuery, customerBody, customerUpdateBody, idParam, listCustomersQuery, transactionsQuery, transferBody,
} from '../schemas/index.js';

export const router = Router();

router.get('/branches', accounts.listBranches);

router.get('/customers', validate({ query: listCustomersQuery }), customers.list);
router.get('/customers/:id', validate({ params: idParam }), customers.get);
router.post('/customers', validate({ body: customerBody }), customers.create);
router.put('/customers/:id', validate({ params: idParam, body: customerUpdateBody }), customers.update);
router.delete('/customers/:id', validate({ params: idParam }), customers.remove);
router.get('/customers/:id/accounts', validate({ params: idParam }), customers.listAccounts);

router.get('/accounts/:id', validate({ params: idParam }), accounts.get);
router.get('/accounts/:id/transactions', validate({ params: idParam, query: transactionsQuery }), accounts.listTransactions);

router.post('/transfers', validate({ body: transferBody }), accounts.transfer);

router.get('/reports/branch-balances', accounts.branchBalances);
router.get('/reports/cashflow', validate({ query: cashflowQuery }), accounts.cashflow);
