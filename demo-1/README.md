# Demo 1 · Setup, Baseline Dua Lapisan, dan Nasabah

[Persiapan](../README.md) · [Troubleshooting](../TROUBLESHOOTING.md)

> Buka folder ini langsung di VS Code dan lakukan persiapan project di sini (`.env`, install, atau `git init`).

Kerjakan 1.1–1.7: setup, baseline dua lapisan, lalu endpoint nasabah dengan Sequelize.

## 1.1 Install dan data

```bash
npm ci
cp .env.example .env
npm run db:reset
```

PowerShell: `Copy-Item .env.example .env`. Isi `DB_PASSWORD`. `TZ=UTC` wajib ada (di Windows pun terbaca lewat `--env-file`). Kalau VS Code menampilkan dialog `Do you trust the authors of the files in this folder?`, pilih **Trust Folder & Continue**.

## 1.2 Baseline lapisan SQL

```bash
npm run dev:sql
```

Yang harus terlihat: `API Tabungan UMKM jalan di http://localhost:3000 (DATA_LAYER=sql)`. Di Bruno, buka folder `bruno/`, pilih environment **local**, **Run Collection**: 26 dari 26 lulus.

## 1.3 Baseline lapisan ORM

Buka terminal kedua (biarkan `dev:sql` tetap jalan):

```bash
npm run db:reset
npm run dev:orm
```

Yang harus terlihat: `... http://localhost:3001 (DATA_LAYER=orm)`. Di Bruno, ganti environment ke **local-orm**, Run Collection: **7 dari 26 lulus**. Yang gagal menjawab `501` dengan pesan `TODO ... (orm) belum dikerjakan`.

`npm run dev:orm` memuat `.env` lalu `env/orm.env`. File yang dimuat terakhir menang, jadi `DATA_LAYER` dan `PORT` dari `env/orm.env` menimpa nilai di `.env`.

**Nasabah dengan Sequelize (1.4–1.7)**

Buka `src/repositories/sql/customer.repository.js` dan `src/repositories/orm/customer.repository.js` berdampingan (**View → Editor Layout → Two Columns**).

## 1.4 Daftar nasabah

```js
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
```

`findAndCountAll` menjalankan dua query (COUNT dan SELECT), sama seperti versi SQL. Bedanya, SQL-nya dibuat Sequelize.

## 1.5 Detail nasabah

```js
export async function findById(id) {
  const customer = await Customer.findByPk(id, { include: withBranch });
  if (!customer) return null;
  return toDetail(customer, await Account.count({ where: { customerId: id } }));
}
```

## 1.6 Buat, ganti, hapus

```js
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
```

Nomor CIF dibuat dari ID baru seperti versi SQL, jadi `create` dan `update` CIF dibungkus `sequelize.transaction()`. Di luar transaksi, setiap `create`/`update`/`destroy` langsung di-commit Sequelize (tidak ada `autoCommit`).

## 1.7 Error Sequelize ke kode kontrak

Restart `dev:orm` (Ctrl+C lalu `npm run dev:orm`; `--watch` hanya memantau file `.js`), lalu kirim nasabah ganda:

```bash
curl -X POST http://localhost:3001/api/customers -H "Content-Type: application/json" -d "@requests/customer-email-duplikat.json"
```

PowerShell: ketik `curl.exe` (bukan `curl`) dan biarkan `@requests/...` berkutip: argumen berawalan `@` tanpa kutip bisa dibaca sebagai splatting. `curl -i` di Windows PowerShell 5.1 memberi `Missing an argument for parameter 'InFile'`.

Sebelum 1.7, respons `500 INTERNAL_ERROR`, dan terminal server mencetak `SequelizeUniqueConstraintError: Validation error` tanpa kode ORA. Lapisan SQL menjawab `409 DUPLICATE` untuk request yang sama.

Di `src/middlewares/error-handler.js`, isi `fromSequelize` (TODO 1.7):

```js
function fromSequelize(err) {
  if (err instanceof UniqueConstraintError) {
    const field = COLUMN_FIELDS[err.fields?.[0]];
    const message = `${field ?? 'Data'} sudah dipakai`;
    return new AppError(409, 'DUPLICATE', message, field ? [{ field, issue: 'duplicate', message }] : undefined);
  }
  if (err instanceof ForeignKeyConstraintError) return fromOracle(err.parent);
  if (err instanceof ValidationError) {
    const details = err.errors.map((e) => ({ field: e.path, issue: e.validatorKey ?? e.type, message: e.message }));
    return new AppError(400, 'VALIDATION_ERROR', details[0]?.message ?? 'Data tidak valid', details);
  }
  if (err instanceof DatabaseError && err.parent?.errorNum) return fromOracle(err.parent);
  return null;
}
```

`err.fields` berisi nama kolom (`EMAIL`) karena nama unique key di model sama dengan nama constraint di database (`unique: 'UQ_CUSTOMERS_EMAIL'`, dari sesi 32). Untuk foreign key, error Oracle asli ada di `err.parent`, jadi pemetaan ORA-02292 dari sesi 31 dipakai ulang.

Ulangi curl: `409`, `{"error":{"code":"DUPLICATE","message":"email sudah dipakai","details":[{"field":"email","issue":"duplicate","message":"email sudah dipakai"}]}}`. Bruno (`local-orm`): **17 dari 26**.

## Tantangan tambahan Demo 1 (opsional)

Kerjakan setelah 1.7. Bruno `local-orm` tetap 17 dari 26, `npm run compare` tetap `'ya'`.

1. `findById` sekarang menjalankan dua query (`findByPk` lalu `Account.count`). Jadikan satu: hitung jumlah rekening dengan subquery lewat `attributes: { include: [[sequelize.literal(...), 'accountCount']] }`. Buktikan dengan `DB_LOG_SQL=true`: `GET /api/customers/1` hanya memunculkan satu baris `SQL>` (selain `SELECT 1+1` saat start). Petunjuk: alias tabel utama adalah `"Customer"` (dengan kutip) dan kolom ditulis huruf besar, mis. `"Customer"."CUSTOMER_ID"`.
2. Tebak lalu buktikan bahwa dua skenario error `PUT /api/customers/1` identik di kedua lapisan: (a) `email` milik nasabah 2, (b) `branchId` 99. Tulis status dan kode error yang kamu harapkan, kirim ke port 3000 dan 3001, lalu bandingkan isi respons.
