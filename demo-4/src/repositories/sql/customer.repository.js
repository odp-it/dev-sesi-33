// Akses tabel CUSTOMERS dengan SQL langsung. Semua nilai dari pemakai lewat bind variable.
// Bentuk hasil mengikuti kontrak sesi 29: daftar = CustomerSummary, detail = CustomerDetail.
import oracledb from 'oracledb';
import { query } from '../../db/oracle.js';
import { isoWib } from '../../utils/format.js';

const SELECT_CUSTOMER = `
  SELECT c.customer_id, c.cif_no, c.full_name, c.email, c.phone, c.segment,
         c.branch_id, b.branch_code, ${isoWib('c.created_at')} AS created_at
    FROM customers c
    JOIN branches b ON b.branch_id = c.branch_id`;

const toSummary = (r) => ({
  id: Number(r.CUSTOMER_ID),
  cifNo: r.CIF_NO,
  fullName: r.FULL_NAME,
  segment: r.SEGMENT,
  branchCode: r.BRANCH_CODE,
});

const toDetail = (r) => ({
  id: Number(r.CUSTOMER_ID),
  cifNo: r.CIF_NO,
  fullName: r.FULL_NAME,
  email: r.EMAIL,
  phone: r.PHONE,
  segment: r.SEGMENT,
  branchId: Number(r.BRANCH_ID),
  branchCode: r.BRANCH_CODE,
  createdAt: r.CREATED_AT,
  accountCount: Number(r.ACCOUNT_COUNT),
});

// Filter opsional q (nama atau CIF) dan segment -> potongan WHERE + binds.
function buildFilter({ q, segment }) {
  const where = [];
  const binds = {};
  if (q) {
    where.push(`(UPPER(c.full_name) LIKE '%' || UPPER(:q) || '%' OR c.cif_no LIKE '%' || UPPER(:q) || '%')`);
    binds.q = q;
  }
  if (segment) {
    where.push('c.segment = :segment');
    binds.segment = segment;
  }
  return { whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '', binds };
}

export async function findMany({ page, pageSize, q, segment }) {
  const { whereSql, binds } = buildFilter({ q, segment });
  const count = await query(`SELECT COUNT(*) AS total FROM customers c ${whereSql}`, binds);
  const result = await query(
    `${SELECT_CUSTOMER} ${whereSql}
      ORDER BY c.customer_id
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    { ...binds, offset: (page - 1) * pageSize, limit: pageSize },
  );
  return { rows: result.rows.map(toSummary), total: Number(count.rows[0].TOTAL) };
}

export async function findById(id) {
  const result = await query(
    `SELECT x.*, (SELECT COUNT(*) FROM accounts a WHERE a.customer_id = x.customer_id) AS account_count
       FROM (${SELECT_CUSTOMER} WHERE c.customer_id = :id) x`,
    { id },
  );
  return result.rows[0] ? toDetail(result.rows[0]) : null;
}

// Nomor CIF dibuat server dari ID baru: CIF-SIM-0013. Insert + update dalam satu blok PL/SQL,
// jadi satu kali kirim ke database dan satu kali commit.
export async function create(data) {
  const result = await query(
    `DECLARE
       v_id customers.customer_id%TYPE;
     BEGIN
       INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
       VALUES ('CIF-SIM-BARU', :fullName, :email, :phone, :segment, :branchId,
               CAST(SYSTIMESTAMP AT TIME ZONE '+07:00' AS TIMESTAMP))
       RETURNING customer_id INTO v_id;
       UPDATE customers SET cif_no = 'CIF-SIM-' || LPAD(v_id, 4, '0') WHERE customer_id = v_id;
       :id := v_id;
     END;`,
    {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      segment: data.segment,
      branchId: data.branchId,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    },
    { autoCommit: true },
  );
  return result.outBinds.id;
}

export async function update(id, data) {
  const result = await query(
    `UPDATE customers
        SET full_name = :fullName, email = :email, phone = :phone, segment = :segment, branch_id = :branchId
      WHERE customer_id = :id`,
    { id, fullName: data.fullName, email: data.email, phone: data.phone, segment: data.segment, branchId: data.branchId },
    { autoCommit: true },
  );
  return result.rowsAffected;
}

export async function remove(id) {
  const result = await query('DELETE FROM customers WHERE customer_id = :id', { id }, { autoCommit: true });
  return result.rowsAffected;
}
