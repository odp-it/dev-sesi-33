import { Branch } from '../../models/index.js';

export async function findAll() {
  const branches = await Branch.findAll({ order: [['branchCode', 'ASC']] });
  return branches.map((b) => ({ id: b.id, branchCode: b.branchCode, branchName: b.branchName, city: b.city }));
}
