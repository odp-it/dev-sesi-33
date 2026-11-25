// Membuat ulang schema Tabungan UMKM dan mengisi data simulasi.
// Pakai: npm run db:reset   (membaca DB_USER, DB_PASSWORD, DB_CONNECT_STRING dari .env)
import { readFile } from 'node:fs/promises';
import oracledb from 'oracledb';

const FILES = ['db/00-drop.sql', 'db/01-schema.sql', 'db/02-seed.sql'];
// ORA-00942 tabel tidak ada, ORA-02289 sequence tidak ada: wajar saat reset pertama.
const IGNORE_ON_DROP = [942, 2289];

function splitSql(text) {
  return text
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s && s.toUpperCase() !== 'COMMIT');
}

const conn = await oracledb.getConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
});

try {
  for (const file of FILES) {
    const statements = splitSql(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'));
    for (const sql of statements) {
      try {
        await conn.execute(sql);
      } catch (err) {
        if (file.includes('drop') && IGNORE_ON_DROP.includes(err.errorNum)) continue;
        throw err;
      }
    }
    console.log(`${file}: ${statements.length} statement`);
  }
  await conn.commit();

  const { rows } = await conn.execute(
    `SELECT (SELECT COUNT(*) FROM branches) AS branches,
            (SELECT COUNT(*) FROM customers) AS customers,
            (SELECT COUNT(*) FROM accounts) AS accounts,
            (SELECT COUNT(*) FROM transactions) AS transactions,
            (SELECT TO_CHAR(SUM(balance), 'FM999999999990.00') FROM accounts) AS total_balance
       FROM dual`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );
  console.table(rows);
} finally {
  await conn.close();
}
