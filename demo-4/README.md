# Demo 4 · Bandingkan SQL vs ORM

[Persiapan](../README.md) · [Troubleshooting](../TROUBLESHOOTING.md)

> Hasil Demo 1 sampai Demo 3 sudah terisi di folder ini. Buka folder ini langsung di VS Code dan lakukan persiapan project di sini (`.env`, install, atau `git init`).

Kerjakan 4.1–4.3: bandingkan lapisan SQL dan ORM.

## 4.1 Dua server, satu perbandingan

Pastikan `npm run dev:sql` (port 3000) dan `npm run dev:orm` (port 3001) jalan di dua terminal, lalu di terminal ketiga:

```bash
npm run db:reset
npm run compare
```

Yang harus terlihat: 11 baris endpoint dengan kolom `sql`, `orm` berisi status yang sama dan `sama` = `'ya'`, lalu tabel jumlah baris kode:

```text
┌─────────┬────────────┬─────┬─────┐
│ (index) │ repository │ sql │ orm │
├─────────┼────────────┼─────┼─────┤
│ 0       │ 'account'  │ 59  │ 45  │
│ 1       │ 'branch'   │ 10  │ 5   │
│ 2       │ 'customer' │ 97  │ 75  │
│ 3       │ 'report'   │ 48  │ 61  │
│ 4       │ 'transfer' │ 49  │ 39  │
└─────────┴────────────┴─────┴─────┘
```

Angka baris kode bisa sedikit berbeda kalau kode ditulis dengan gaya lain.

## 4.2 Lihat SQL buatan Sequelize

Hentikan `dev:orm`, ubah `DB_LOG_SQL=true` di `.env`, jalankan lagi `npm run dev:orm`, lalu:

```bash
curl "http://localhost:3001/api/customers?q=contoh&segment=UMKM&page=2&pageSize=2"
```

Di terminal server muncul dua baris `SQL>`: satu `SELECT count("Customer"."CUSTOMER_ID")`, satu SELECT dengan `LEFT OUTER JOIN "BRANCHES"` dan `OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY`. Bandingkan dengan `findMany` di `repositories/sql/customer.repository.js`. Kembalikan `DB_LOG_SQL=false`.

## 4.3 Tabel perbandingan

Isi tabel ini dari pengalaman lab (berpasangan dengan teman sebelah):

| Aspek | SQL langsung (sesi 31) | Sequelize (sesi 33) |
| --- | --- | --- |
| Jumlah baris repository (4.1) | | |
| Siapa yang menulis SQL | | |
| Pagination | | |
| Error data ganda: dari mana nama field diambil | | |
| Cek saldo transfer ada di mana | | |
| Laporan `GROUP BY ROLLUP` | | |
| Uang sebagai string: caranya | | |
| Yang paling mudah dibaca tim ALP | | |

## Tantangan tambahan Demo 4 (opsional)

1. Perluas `scripts/compare-layers.js`: tambahkan GET `/api/customers/abc`, `/api/accounts/999`, `/api/customers?page=3&pageSize=5`, `/api/accounts/1/transactions?from=2026-03-31&to=2026-03-01`, dan bandingkan dua POST (`requests/customer-invalid.json` dan `requests/customer-email-duplikat.json`) ke kedua server. Target: 17 baris, semuanya `'ya'` (kode `400`, `404`, `200`, `400`, `400`, `409`).
2. Tulis `scripts/waktu-layer.mjs`: untuk tiga endpoint GET (`/api/customers?pageSize=50`, `/api/customers/1`, `/api/accounts/1/transactions?pageSize=50`), kirim 100 request berurutan ke tiap lapisan (setelah satu request pemanasan), cetak rata-rata milidetik dan rasio ORM/SQL dengan `console.table`. Tulis satu kalimat: apa yang membuat `/api/customers/1` paling berbeda? (Petunjuk: hitung jumlah baris `SQL>` per request dengan `DB_LOG_SQL=true`.)
