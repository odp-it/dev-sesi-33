// CUSTOMERS lewat Sequelize. Fungsi dan bentuk hasil SAMA dengan sql/customer.repository.js.
import { Op } from 'sequelize';
import { Account, Branch, Customer, sequelize } from '../../models/index.js';
import { AppError } from '../../utils/app-error.js';
import { nowWib, toWib } from './format.js';

const todo = (step) => new AppError(501, 'NOT_IMPLEMENTED', `TODO ${step} (orm) belum dikerjakan`);

const withBranch = [{ model: Branch, as: 'branch', attributes: ['branchCode'] }];

const toSummary = (c) => ({
  id: c.id,
  cifNo: c.cifNo,
  fullName: c.fullName,
  segment: c.segment,
  branchCode: c.branch.branchCode,
});

const toDetail = (c, accountCount) => ({
  id: c.id,
  cifNo: c.cifNo,
  fullName: c.fullName,
  email: c.email,
  phone: c.phone,
  segment: c.segment,
  branchId: c.branchId,
  branchCode: c.branch.branchCode,
  createdAt: toWib(c.createdAt),
  accountCount,
});

function buildWhere({ q, segment }) {
  const where = {};
  if (q) {
    const pattern = `%${q.toUpperCase()}%`;
    where[Op.or] = [
      sequelize.where(sequelize.fn('UPPER', sequelize.col('Customer.FULL_NAME')), { [Op.like]: pattern }),
      { cifNo: { [Op.like]: pattern } },
    ];
  }
  if (segment) where.segment = segment;
  return where;
}

// TODO 1.4: Customer.findAndCountAll({ where, include: withBranch, order, offset, limit })
//          return { rows: [...toSummary], total: count }
// eslint-disable-next-line no-unused-vars
export async function findMany({ page, pageSize, q, segment }) {
  throw todo('1.4');
}

// TODO 1.5: Customer.findByPk(id, { include: withBranch }); null kalau tidak ada.
//          toDetail(customer, await Account.count({ where: { customerId: id } }))
// eslint-disable-next-line no-unused-vars
export async function findById(id) {
  throw todo('1.5');
}

// TODO 1.6: sequelize.transaction: Customer.create (cifNo sementara, createdAt: nowWib()),
//          lalu update cifNo = `CIF-SIM-${String(id).padStart(4, '0')}`, return id
// eslint-disable-next-line no-unused-vars
export async function create(data) {
  throw todo('1.6');
}

// TODO 1.6: Customer.update({...}, { where: { id } }) -> return jumlah baris berubah
// eslint-disable-next-line no-unused-vars
export async function update(id, data) {
  throw todo('1.6');
}

// TODO 1.6: Customer.destroy({ where: { id } }) -> return jumlah baris terhapus
// eslint-disable-next-line no-unused-vars
export async function remove(id) {
  throw todo('1.6');
}
