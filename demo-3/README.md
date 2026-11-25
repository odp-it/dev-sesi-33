# Demo 3 · Transfer dengan `sequelize.transaction()`

[Persiapan](../README.md) · [Troubleshooting](../TROUBLESHOOTING.md)

> Hasil Demo 1 sampai Demo 2 sudah terisi di folder ini. Buka folder ini langsung di VS Code dan lakukan persiapan project di sini (`.env`, install, atau `git init`).

Kerjakan 3.1–3.2: transfer dengan `sequelize.transaction()`.

## 3.1 Tulis ulang transfer

Aturannya sama dengan sesi 31. Di `src/repositories/orm/transfer.repository.js`:

```js
export async function transfer({ fromAccountId, toAccountId, amount, description }) {
  return sequelize.transaction(async (t) => {
    // 1. Kunci kedua rekening (SELECT ... FOR UPDATE), urut id.
    const locked = await Account.findAll({
      where: { id: [fromAccountId, toAccountId] },
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    const from = locked.find((a) => a.id === fromAccountId);
    const to = locked.find((a) => a.id === toAccountId);
    if (!from) throw notFound(`Rekening asal ${fromAccountId}`);
    if (!to) throw notFound(`Rekening tujuan ${toAccountId}`);
    for (const acc of [from, to]) {
      if (acc.status === 'DIBLOKIR') throw new AppError(409, 'ACCOUNT_BLOCKED', `Rekening ${acc.accountNo} diblokir`);
      if (acc.status === 'DITUTUP') throw new AppError(409, 'ACCOUNT_CLOSED', `Rekening ${acc.accountNo} sudah ditutup`);
    }

    // 2. Cek saldo di JavaScript (baris sudah dikunci), bandingkan dalam sen BigInt, bukan float.
    if (toCents(from.balance) < toCents(amount)) {
      throw new AppError(409, 'INSUFFICIENT_BALANCE', `Saldo rekening ${from.accountNo} tidak cukup`);
    }

    // 3. Debit dan kredit: UPDATE ... SET BALANCE = BALANCE - :by.
    await from.decrement('balance', { by: amount, transaction: t });
    await to.increment('balance', { by: amount, transaction: t });

    // 4. Dua baris mutasi. Sequence tidak punya model, jadi pakai raw query.
    const [[{ SEQ }]] = await sequelize.query('SELECT transfer_ref_seq.NEXTVAL AS seq FROM dual', { transaction: t });
    const transferRef = `REF-SIM-T${SEQ}`;
    const txnAt = nowWib();
    await Transaction.create({
      accountId: fromAccountId, txnType: 'TRANSFER_KELUAR', category: 'TRANSFER', amount, txnAt,
      description: description ?? `Transfer ke ${to.accountNo}`, refNo: `${transferRef}-D`,
    }, { transaction: t });
    await Transaction.create({
      accountId: toAccountId, txnType: 'TRANSFER_MASUK', category: 'TRANSFER', amount, txnAt,
      description: description ?? `Transfer dari ${from.accountNo}`, refNo: `${transferRef}-K`,
    }, { transaction: t });

    return { refNo: transferRef, fromAccountId, toAccountId, amount: toMoney(amount), txnAt: toWib(txnAt) };
  });
}
```

Di versi SQL, cek saldo ada di `WHERE balance >= :amount`. Di versi ORM, cek pindah ke JavaScript. Itu aman karena baris sudah dikunci `FOR UPDATE`, dan perbandingan memakai `toCents()` (BigInt sen), tidak pernah float.

## 3.2 Test

```bash
npm run db:reset
```

Bruno `local-orm`: **26 dari 26**, 68/68 assertion. Jalankan sekali lagi tanpa reset: tetap 26.

## Tantangan tambahan Demo 3 (opsional)

1. Bukti transfer ORM aman saat bersamaan. Tulis `scripts/transfer-bersamaan.mjs` (Node memiliki `fetch`) yang membaca saldo rekening 1 dan 2, mengirim 20 `POST /api/transfers` ke `http://localhost:3001` bersamaan dengan `Promise.all` (10 dari 1 ke 2 dan 10 dari 2 ke 1, `"100000.00"`), lalu membaca saldo lagi. Target: semua `201`, total saldo sama dengan sebelumnya.
2. Dua percobaan di `transfer.repository.js` (orm), masing-masing dengan `throw new Error(...)` sementara tepat di atas `return { refNo: ... }`. (a) Semua query memakai `{ transaction: t }`. (b) Hapus `{ transaction: t }` dari `Transaction.create` pertama. Untuk masing-masing, catat saldo rekening 1 dan `total` mutasi rekening 1 dan 2 (`GET /api/accounts/1/transactions`) sebelum dan sesudah, lalu tulis satu kalimat tentang bedanya. Kembalikan kode dan `npm run db:reset` setelahnya.
