// Satu connection pool untuk seluruh aplikasi.
import oracledb from 'oracledb';
import { config } from '../config.js';

// Baris hasil query berupa object { KOLOM: nilai }.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// NUMBER diambil sebagai string supaya uang NUMBER(15,2) tidak berubah jadi float JavaScript.
oracledb.fetchAsString = [oracledb.NUMBER];

let pool;

export async function initPool() {
  pool = await oracledb.createPool({
    user: config.db.user,
    password: config.db.password,
    connectString: config.db.connectString,
    poolMin: config.db.poolMin,
    poolMax: config.db.poolMax,
    poolIncrement: 1,
  });
  // Thin mode membuat pool tanpa langsung login: pinjam satu koneksi supaya salah konfigurasi ketahuan saat start.
  const conn = await pool.getConnection();
  await conn.close();
  return pool;
}

export async function closePool() {
  if (pool) await pool.close(10);
}

export function poolStatus() {
  return { open: pool.connectionsOpen, inUse: pool.connectionsInUse, max: pool.poolMax };
}

// Satu statement, pinjam koneksi lalu kembalikan ke pool.
export async function query(sql, binds = {}, options = {}) {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.execute(sql, binds, options);
  } finally {
    if (conn) await conn.close();
  }
}

// Antarmuka yang sama dengan src/db/sequelize.js (dipakai src/db/index.js).
export const initDb = initPool;
export const closeDb = closePool;
export async function ping() {
  await query('SELECT 1 FROM dual');
  return { layer: 'sql', db: 'up', pool: poolStatus() };
}

// Beberapa statement dalam satu transaksi: commit kalau semua berhasil, rollback kalau ada error.
export async function withTransaction(work) {
  const conn = await pool.getConnection();
  try {
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.close();
  }
}
