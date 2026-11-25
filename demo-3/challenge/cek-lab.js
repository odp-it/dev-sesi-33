// Sesi 33 · Lab: cek otomatis porting endpoint ALP tim ke Sequelize (80 poin otomatis; 20 poin dinilai manual).
// Cara pakai (dari folder lab):
//   1. Isi challenge/lab-alp.json sesuai tabel ALP tim.
//   2. npm run cek:lab        (server boleh mati; aplikasi lapisan orm dijalankan di port acak)
//   3. Baca tabel poin dan catatan, perbaiki, jalankan lagi.
// Jawaban endpoint dibandingkan dengan isi database. Cek ini sendiri hanya menjalankan SELECT dan hanya
// mengirim request GET, lalu menjalankan challenge/alp.test.js milik tim.
// "Lewat model" dibuktikan dari log Sequelize: SQL buatan model menulis FROM "TABEL" "Alias" dengan kutip.
// Kriteria 2-10 hanya mendapat poin kalau request itu memunculkan SQL seperti itu.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import oracledb from 'oracledb';

const CONFIG = new URL('./lab-alp.json', import.meta.url);
const TEST_FILE = fileURLToPath(new URL('./alp.test.js', import.meta.url));
const LAB_DIR = fileURLToPath(new URL('..', import.meta.url));
const NO_ID = 999999999;

const CRITERIA = [
  ['1. Model dan relasi Sequelize', 10],
  ['2. Daftar lewat model, sesuai database', 10],
  ['3. Pagination: page, pageSize, total', 10],
  ['4. Filter lewat query string', 5],
  ["5. Input ' OR '1'='1 tidak tembus", 5],
  ['6. Detail: 200', 5],
  ['7. Detail: 404 dan 400', 10],
  ['8. Data anak lewat relasi', 5],
  ['9. Data anak: induk tidak ada 404', 5],
  ['10. Uang: string dua desimal', 5],
  ['11. Test tim', 10],
];
const points = CRITERIA.map(() => 0);
const labels = CRITERIA.map(([name]) => name);
const notes = [];
const score = (no, value) => { points[no - 1] = value; };

function readConfig() {
  const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
  const identifiers = {
    table: cfg.table,
    idColumn: cfg.idColumn,
    'filter.column': cfg.filter?.column,
    'child.table': cfg.child?.table,
    'child.idColumn': cfg.child?.idColumn,
    'child.fkColumn': cfg.child?.fkColumn,
    'money.column': cfg.money?.column,
  };
  const paths = {
    resource: cfg.resource,
    'filter.param': cfg.filter?.param,
    'child.resource': cfg.child?.resource,
    'money.field': cfg.money?.field,
  };
  const bad = [];
  for (const [key, value] of Object.entries(identifiers)) {
    if (!/^[A-Za-z][A-Za-z0-9_$#]{0,127}$/.test(value ?? '') || /^ISI_/i.test(value)) bad.push(key);
  }
  for (const [key, value] of Object.entries(paths)) {
    if (!/^[A-Za-z0-9_-]+$/.test(value ?? '') || /^ISI_/.test(value)) bad.push(key);
  }
  const v = cfg.filter?.value;
  if (typeof v !== 'string' || v === '' || /^ISI_/.test(v)) bad.push('filter.value');
  if (!['resource', 'child'].includes(cfg.money?.on)) bad.push('money.on');
  return { cfg, bad };
}

let baseUrl;
let sqlLog = [];

// Satu request GET beserta SQL yang dibuat Sequelize selama request itu.
async function get(path) {
  sqlLog = [];
  try {
    const res = await fetch(baseUrl + path, { signal: AbortSignal.timeout(10000) });
    const body = await res.json().catch(() => null);
    return { status: res.status, body, sql: sqlLog.join('\n') };
  } catch (err) {
    return { status: 0, body: null, sql: '', error: err.message };
  }
}

const fromModel = (res, table) => new RegExp(`(FROM|JOIN) "${table.toUpperCase().replaceAll('$', '\\$')}"\\s+(AS )?"`).test(res.sql);
const idsOf = (body) => (Array.isArray(body?.data) ? body.data.map((item) => item?.id) : null);
const sameIds = (got, want) => got !== null && got.length === want.length && got.every((id, i) => id === want[i]);
const isError = (res, status, code) => res.status === status && res.body?.error?.code === code;

// Kriteria 1: dua model terdaftar, kolomnya ada di database, dan relasinya dipasang.
async function checkModels(cfg, sequelize, select) {
  const found = {};
  let columnsOk = true;
  for (const [role, table, idColumn] of [
    ['induk', cfg.table, cfg.idColumn],
    ['anak', cfg.child.table, cfg.child.idColumn],
  ]) {
    const model = Object.values(sequelize.models).find((m) => m.tableName === table.toUpperCase());
    if (!model) {
      columnsOk = false;
      notes.push(`1: belum ada model dengan tableName '${table.toUpperCase()}' (huruf besar) yang diimpor router ALP.`);
      continue;
    }
    found[role] = model;
    const dbColumns = (await select(
      'SELECT column_name FROM user_tab_columns WHERE table_name = :t', [table.toUpperCase()])).map((r) => r[0]);
    const fields = Object.values(model.getAttributes()).map((a) => a.field);
    const unknown = fields.filter((f) => !dbColumns.includes(f));
    const pk = model.primaryKeyField ?? model.getAttributes()[model.primaryKeyAttribute]?.field;
    if (unknown.length || pk !== idColumn.toUpperCase()) {
      columnsOk = false;
      if (unknown.length) notes.push(`1: field model ${role} tidak ada di ${table}: ${unknown.join(', ')}.`);
      if (pk !== idColumn.toUpperCase()) notes.push(`1: primary key model ${role} harus ke kolom ${idColumn} (saat ini ${pk ?? '-'}).`);
    }
  }
  const { induk, anak } = found;
  const fk = cfg.child.fkColumn.toUpperCase();
  const fieldOf = (model, attribute) => model.getAttributes()[attribute]?.field;
  const hasMany = induk && anak && Object.values(induk.associations).some(
    (a) => a.associationType === 'HasMany' && a.target === anak && fieldOf(anak, a.foreignKey) === fk);
  if (induk && anak && !hasMany) notes.push(`1: model induk belum punya hasMany ke model anak dengan foreign key kolom ${fk}.`);
  score(1, (columnsOk ? 5 : 0) + (hasMany ? 5 : 0));
}

async function checkEndpoints(cfg, db) {
  // outFormat ditulis di sini supaya tidak bergantung pada pengaturan driver yang diubah aplikasi.
  const select = async (sql, binds = []) =>
    (await db.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_ARRAY })).rows;
  const ids = async (sql, binds = []) => (await select(sql, binds)).map((r) => Number(r[0]));
  const base = `/api/alp/${cfg.resource}`;
  const allIds = await ids(`SELECT ${cfg.idColumn} FROM ${cfg.table} ORDER BY ${cfg.idColumn}`);
  if (allIds.length < 3) notes.push(`Tabel ${cfg.table} berisi ${allIds.length} baris. Isi minimal 3 baris data contoh.`);

  const notModel = (no, table, res) =>
    notes.push(`${no}: respons benar, tetapi log Sequelize tidak memuat FROM "${table.toUpperCase()}" "..." ` +
      `(${res.sql ? 'SQL tulisan tangan?' : 'tidak ada query Sequelize'}). Pakai method model.`);

  // 2. Daftar
  const list = await get(`${base}?pageSize=50`);
  const listMatch = allIds.length > 0 && list.status === 200 && sameIds(idsOf(list.body), allIds.slice(0, 50));
  const listOk = listMatch && fromModel(list, cfg.table);
  score(2, listOk ? 10 : 0);
  if (!listMatch) {
    notes.push(`2: GET ${base}?pageSize=50 -> status ${list.status}. Harus 200, data[].id berupa angka, urut, ` +
      `sama dengan ${Math.min(allIds.length, 50)} baris pertama ${cfg.table}.`);
  } else if (!listOk) notModel(2, cfg.table, list);

  // 3. Pagination (halaman 2, dua baris per halaman)
  let pageOk = false;
  if (listOk && allIds.length >= 3) {
    const res = await get(`${base}?page=2&pageSize=2`);
    pageOk = res.status === 200 && sameIds(idsOf(res.body), allIds.slice(2, 4)) && res.body.page === 2 &&
      res.body.pageSize === 2 && res.body.total === allIds.length && fromModel(res, cfg.table);
    if (!pageOk) {
      notes.push(`3: ?page=2&pageSize=2 harus berisi id ${allIds.slice(2, 4).join(', ')}, page 2, pageSize 2, ` +
        `total ${allIds.length} (angka). Didapat status ${res.status}, id ${idsOf(res.body)?.join(', ') ?? '-'}, ` +
        `total ${JSON.stringify(res.body?.total)}.`);
    }
  } else notes.push('3: dicek setelah daftar (kriteria 2) lulus dan tabel berisi minimal 3 baris.');
  score(3, pageOk ? 10 : 0);

  // 4-5. Filter dan injection
  const { param, column, value } = cfg.filter;
  const filterIds = await ids(
    `SELECT ${cfg.idColumn} FROM ${cfg.table} WHERE ${column} = :v ORDER BY ${cfg.idColumn}`, [value]);
  let filterOk = false;
  if (filterIds.length === 0 || filterIds.length === allIds.length) {
    notes.push(`4: filter.value harus menyaring sebagian data. Saat ini cocok ${filterIds.length} dari ${allIds.length}.`);
  } else if (listOk) {
    const res = await get(`${base}?${param}=${encodeURIComponent(value)}&pageSize=50`);
    filterOk = res.status === 200 && sameIds(idsOf(res.body), filterIds.slice(0, 50)) &&
      res.body.total === filterIds.length && fromModel(res, cfg.table);
    if (!filterOk) {
      notes.push(`4: ?${param}=${value} -> status ${res.status}. Harus ${filterIds.length} baris dan total ${filterIds.length}.`);
    }
  } else notes.push('4: dicek setelah daftar (kriteria 2) lulus.');
  score(4, filterOk ? 5 : 0);

  let safe = false;
  if (filterOk) {
    const res = await get(`${base}?${param}=${encodeURIComponent("' OR '1'='1")}`);
    safe = isError(res, 400, 'VALIDATION_ERROR') ||
      (res.status === 200 && idsOf(res.body)?.length === 0 && res.body.total === 0);
    if (!safe) notes.push(`5: input ' OR '1'='1 -> status ${res.status}. Harus 0 baris atau 400 VALIDATION_ERROR.`);
  } else notes.push('5: dicek setelah filter (kriteria 4) lulus.');
  score(5, safe ? 5 : 0);

  // 6-7. Detail
  let detailOk = allIds.length > 0;
  for (const id of new Set([allIds[0], allIds.at(-1)])) {
    if (!detailOk) break;
    const res = await get(`${base}/${id}`);
    detailOk = res.status === 200 && res.body?.id === id;
    if (!detailOk) notes.push(`6: GET ${base}/${id} -> status ${res.status}. Harus 200 dengan id ${id} (angka).`);
    else if (!fromModel(res, cfg.table)) {
      detailOk = false;
      notModel(6, cfg.table, res);
    }
  }
  score(6, detailOk ? 5 : 0);

  if (detailOk) {
    const res = await get(`${base}/${NO_ID}`);
    const notFound = isError(res, 404, 'NOT_FOUND');
    if (!notFound) notes.push(`7: id ${NO_ID} -> status ${res.status}. Harus 404 dengan error.code NOT_FOUND.`);
    const failed = [];
    for (const input of ['abc', '0', '1.5']) {
      const r = await get(`${base}/${input}`);
      if (!isError(r, 400, 'VALIDATION_ERROR')) failed.push(`${input} -> ${r.status}`);
    }
    if (failed.length) notes.push(`7: ${failed.join(', ')}. Harus 400 dengan error.code VALIDATION_ERROR.`);
    score(7, (notFound ? 5 : 0) + (failed.length ? 0 : 5));
  } else notes.push('7: dicek setelah detail 200 (kriteria 6) lulus.');

  // 8-9. Data anak: dua induk berbeda (anak paling banyak dan paling sedikit)
  const { resource, table, idColumn, fkColumn } = cfg.child;
  const parents = await select(
    `SELECT ${fkColumn}, COUNT(*) FROM ${table} WHERE ${fkColumn} IS NOT NULL
      GROUP BY ${fkColumn} ORDER BY COUNT(*) DESC, ${fkColumn}`);
  let childOk = false;
  const childResponses = []; // dipakai lagi untuk cek uang di data anak
  if (parents.length < 2) {
    notes.push(`8: data contoh di ${table} harus milik minimal 2 induk yang berbeda (saat ini ${parents.length}).`);
  } else {
    childOk = true;
    for (const parent of [Number(parents[0][0]), Number(parents.at(-1)[0])]) {
      const want = await ids(`SELECT ${idColumn} FROM ${table} WHERE ${fkColumn} = :id ORDER BY ${idColumn}`, [parent]);
      const res = await get(`${base}/${parent}/${resource}`);
      const match = res.status === 200 && sameIds(idsOf(res.body), want);
      if (!match || !fromModel(res, table)) {
        childOk = false;
        if (match) notModel(8, table, res);
        else notes.push(`8: GET ${base}/${parent}/${resource} -> status ${res.status}. Harus ${want.length} baris ${table}, urut ${idColumn}.`);
        break;
      }
      childResponses.push({ parent, items: res.body.data });
    }
  }
  score(8, childOk ? 5 : 0);

  let childNotFound = false;
  if (childOk) {
    const res = await get(`${base}/${NO_ID}/${resource}`);
    childNotFound = isError(res, 404, 'NOT_FOUND');
    if (!childNotFound) notes.push(`9: induk ${NO_ID} -> status ${res.status}. Harus 404 NOT_FOUND, bukan data kosong.`);
  } else notes.push('9: dicek setelah data anak (kriteria 8) lulus.');
  score(9, childNotFound ? 5 : 0);

  // 10. Uang: setiap baris respons dibandingkan dengan nilai kolom di database, diformat dua desimal oleh Oracle.
  const { on, column: moneyColumn, field } = cfg.money;
  const moneyTable = on === 'child' ? table : cfg.table;
  const moneyId = on === 'child' ? idColumn : cfg.idColumn;
  const items = on === 'child' ? childResponses.flatMap((c) => c.items) : listOk ? list.body.data : [];
  let moneyOk = items.length > 0;
  if (moneyOk) {
    const want = new Map((await select(
      `SELECT ${moneyId}, TO_CHAR(${moneyColumn}, 'FM99999999999999990.00') FROM ${moneyTable}`))
      .map((r) => [Number(r[0]), r[1]]));
    const wrong = items.find((item) => (item[field] ?? null) !== want.get(item.id));
    moneyOk = !wrong;
    if (wrong) {
      notes.push(`10: id ${wrong.id}: ${field} = ${JSON.stringify(wrong[field])}, ` +
        `harus ${JSON.stringify(want.get(wrong.id))} (string dua desimal, pakai toMoney).`);
    }
  } else notes.push(`10: dicek setelah ${on === 'child' ? 'data anak (kriteria 8)' : 'daftar (kriteria 2)'} lulus.`);
  score(10, moneyOk ? 5 : 0);
}

function checkTeamTests() {
  let pass = 0;
  let fail = 0;
  if (existsSync(TEST_FILE)) {
    const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', TEST_FILE],
      { cwd: LAB_DIR, env: process.env, encoding: 'utf8', timeout: 60000 });
    pass = Number(/^# pass (\d+)/m.exec(run.stdout ?? '')?.[1] ?? 0);
    fail = Number(/^# fail (\d+)/m.exec(run.stdout ?? '')?.[1] ?? 0);
    if (run.status !== 0 && fail === 0) fail = 1; // test berhenti karena error atau lewat 60 detik
  }
  const value = fail > 0 ? 0 : pass >= 4 ? 10 : pass >= 2 ? 5 : 0;
  labels[10] = `11. Test tim: ${pass} lulus, ${fail} gagal`;
  score(11, value);
  if (value < 10) notes.push('11: minimal 4 test lulus dan 0 gagal untuk 10 poin (2-3 lulus: 5). Lihat npm run test:alp.');
}

function report(title) {
  console.log(`\nCek Lab Sesi 33 - ${title}`);
  console.log(`${'Kriteria'.padEnd(44)}Poin`);
  console.log('-'.repeat(52));
  CRITERIA.forEach(([, max], i) => {
    console.log(`${labels[i].padEnd(42)}${String(points[i]).padStart(3)} / ${String(max).padStart(2)}`);
  });
  console.log('-'.repeat(52));
  console.log(`${'Subtotal otomatis'.padEnd(42)}${String(points.reduce((a, b) => a + b, 0)).padStart(3)} / 80`);
  if (notes.length) console.log(`\nCatatan:\n- ${notes.join('\n- ')}`);
  console.log('\nSisa 20 poin dinilai manual (README bagian Lab).');
}

let cfg;
try {
  const result = readConfig();
  if (result.bad.length) {
    notes.push(`challenge/lab-alp.json belum diisi atau tidak valid: ${result.bad.join(', ')}.`);
    report('lab-alp.json belum siap');
    process.exit(0);
  }
  cfg = result.cfg;
} catch (err) {
  notes.push(`challenge/lab-alp.json tidak bisa dibaca: ${err.message}`);
  report('lab-alp.json belum siap');
  process.exit(0);
}

// Pesan error dari aplikasi tim disimpan, supaya tabel poin tidak tertimbun stack trace.
const appErrors = new Set();
const originalError = console.error;
console.error = (err) => appErrors.add(String(err?.message ?? err).split('\n')[0]);

let server;
let db;
try {
  const { startServer } = await import('./server-uji.js');
  server = await startServer(); // di sini kode aplikasi tim ikut dimuat
  baseUrl = server.baseUrl;
  server.sequelize.options.logging = (sql) => sqlLog.push(sql);
  db = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  });
  const select = async (sql, binds = []) =>
    (await db.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_ARRAY })).rows;
  await checkModels(cfg, server.sequelize, select);
  await checkEndpoints(cfg, db);
} catch (err) {
  notes.push(`Cek berhenti: ${err.message.split('\n')[0]}`);
  process.exitCode = 1;
} finally {
  if (db) await db.close().catch(() => {});
  if (server) await server.stop().catch(() => {});
  console.error = originalError;
}
if (appErrors.size) notes.push(`Error dari aplikasi: ${[...appErrors].slice(0, 3).join(' | ')}`);
if (process.exitCode !== 1) checkTeamTests();
report(`/api/alp/${cfg.resource} (tabel ${cfg.table.toUpperCase()})`);
// Koneksi yang gagal bisa menahan proses tetap hidup, jadi proses diakhiri di sini.
process.exit(process.exitCode ?? 0);
