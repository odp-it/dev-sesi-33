// CUSTOMERS lewat Sequelize. Fungsi dan bentuk hasil SAMA dengan sql/customer.repository.js.
import { Op } from 'sequelize';
import { Account, Branch, Customer, sequelize } from '../../models/index.js';
import { nowWib, toWib } from './format.js';

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

export async function findMany({ page, pageSize, q, segment }) {
  const { rows, count } = await Customer.findAndCountAll({
    where: buildWhere({ q, segment }),
    include: withBranch,
    order: [['id', 'ASC']],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  return { rows: rows.map(toSummary), total: count };
}

export async function findById(id) {
  const customer = await Customer.findByPk(id, { include: withBranch });
  if (!customer) return null;
  return toDetail(customer, await Account.count({ where: { customerId: id } }));
}

// Nomor CIF dibuat dari ID baru (CIF-SIM-0013): create + update dalam satu transaksi.
export async function create(data) {
  return sequelize.transaction(async (t) => {
    const customer = await Customer.create({
      cifNo: 'CIF-SIM-BARU',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      segment: data.segment,
      branchId: data.branchId,
      createdAt: nowWib(),
    }, { transaction: t });
    await customer.update({ cifNo: `CIF-SIM-${String(customer.id).padStart(4, '0')}` }, { transaction: t });
    return customer.id;
  });
}

export async function update(id, data) {
  const [affected] = await Customer.update(
    { fullName: data.fullName, email: data.email, phone: data.phone, segment: data.segment, branchId: data.branchId },
    { where: { id } },
  );
  return affected;
}

export async function remove(id) {
  return Customer.destroy({ where: { id } });
}
