# Demo 2 · Rekening & Mutasi

[Persiapan](../README.md) · [Troubleshooting](../TROUBLESHOOTING.md)

> Hasil Demo 1 sudah terisi di folder ini. Buka folder ini langsung di VS Code dan lakukan persiapan project di sini (`.env`, install, atau `git init`).

Kerjakan 2.1–2.2: rekening dan mutasi dengan Sequelize.

## 2.1 Rekening

```js
export async function findByCustomer(customerId) {
  const accounts = await Account.findAll({ where: { customerId }, order: [['id', 'ASC']] });
  return accounts.map(toAccount);
}

export async function findById(id) {
  const account = await Account.findByPk(id);
  return account ? toAccount(account) : null;
}
```

## 2.2 Mutasi dengan filter

```js
export async function findTransactions(accountId, { from, to, category, page, pageSize }) {
  const where = { accountId };
  if (from || to) where.txnAt = {};
  if (from) where.txnAt[Op.gte] = new Date(`${from}T00:00:00Z`);
  if (to) where.txnAt[Op.lt] = new Date(new Date(`${to}T00:00:00Z`).getTime() + 24 * 60 * 60 * 1000);
  if (category) where.category = category;

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    order: [['txnAt', 'ASC'], ['id', 'ASC']],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  return { rows: rows.map(toTransaction), total: count };
}
```

Tanggal ditulis dengan akhiran `Z` karena proses berjalan dengan `TZ=UTC` dan kolom menyimpan jam WIB tanpa zona: `2026-03-01T00:00:00Z` dibandingkan apa adanya dengan `2026-03-01 00:00:00` di kolom. Bruno: **22 dari 26**.

## Tantangan tambahan Demo 2 (opsional)

Kerjakan di file baru `scripts/ringkasan-orm.js`, jangan mengubah repository. Awali dengan `import { initDb, closeDb } from '../src/db/sequelize.js'` dan `import { Transaction, sequelize } from '../src/models/index.js'`, jalankan dengan `node --env-file=.env --env-file=env/orm.env scripts/ringkasan-orm.js`.

1. Buat dua scope di model `Transaction` (`Transaction.addScope`): `masuk` (`SETOR`, `TRANSFER_MASUK`) dan `keluar` (`TARIK`, `TRANSFER_KELUAR`). Cetak total masuk dan total keluar rekening 1 dengan `Transaction.scope('masuk').findAll({ attributes: [[fn('SUM', col(...)), 'total']], raw: true })`. Target: `20900000` dan `6350000` (string dari Oracle). Petunjuk: `fn()` dan `col()` tidak memetakan nama atribut, tulis nama kolom database huruf besar (`AMOUNT`).
2. Cetak jumlah dan total per `category` untuk rekening 1 dengan `group`, lalu cocokkan dengan `sequelize.query` yang menjalankan `GROUP BY` yang sama. Target: 4 kategori (`BAHAN_BAKU` 3 / 4350000, `LAINNYA` 1 / 6500000, `PENJUALAN` 6 / 13800000, `TRANSFER` 2 / 2600000).
