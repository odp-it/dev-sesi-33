// Bandingkan respons API lapisan SQL (port 3000) dan ORM (port 3001) untuk request yang sama.
// Jalankan dulu dua server: `npm run dev:sql` dan `npm run dev:orm` di dua terminal.
// Pakai: npm run compare
import { readdir, readFile } from 'node:fs/promises';

const SQL = process.env.SQL_URL ?? 'http://localhost:3000';
const ORM = process.env.ORM_URL ?? 'http://localhost:3001';
const PATHS = [
  '/api/branches',
  '/api/customers?page=1&pageSize=5',
  '/api/customers?q=contoh&segment=UMKM&page=2&pageSize=2',
  '/api/customers/1',
  '/api/customers/999',
  '/api/customers/1/accounts',
  '/api/accounts/13',
  '/api/accounts/1/transactions?from=2026-03-01&to=2026-03-31',
  '/api/accounts/13/transactions?category=PENJUALAN&pageSize=3&page=2',
  '/api/reports/branch-balances',
  '/api/reports/cashflow?accountId=13&month=2026-02',
];

async function get(base, path) {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.text() };
}

const rows = [];
for (const path of PATHS) {
  const [a, b] = await Promise.all([get(SQL, path), get(ORM, path)]);
  rows.push({ endpoint: path.slice(0, 48), sql: a.status, orm: b.status, sama: a.status === b.status && a.body === b.body ? 'ya' : 'TIDAK' });
}
console.table(rows);

// Jumlah baris kode per lapisan (tanpa baris kosong dan komentar).
async function countLines(layer) {
  const dir = new URL(`../src/repositories/${layer}/`, import.meta.url);
  const result = {};
  for (const file of (await readdir(dir)).filter((f) => f.endsWith('.repository.js'))) {
    const text = await readFile(new URL(file, dir), 'utf8');
    result[file.replace('.repository.js', '')] = text.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length;
  }
  return result;
}
const sqlLines = await countLines('sql');
const ormLines = await countLines('orm');
console.table(Object.keys(sqlLines).map((name) => ({ repository: name, sql: sqlLines[name], orm: ormLines[name] ?? '-' })));
