import { query } from '../../db/oracle.js';

export async function findAll() {
  const result = await query('SELECT branch_id, branch_code, branch_name, city FROM branches ORDER BY branch_code');
  return result.rows.map((r) => ({
    id: Number(r.BRANCH_ID),
    branchCode: r.BRANCH_CODE,
    branchName: r.BRANCH_NAME,
    city: r.CITY,
  }));
}
