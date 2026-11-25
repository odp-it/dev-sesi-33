# Lab · Porting Endpoint ALP ke Sequelize

[Persiapan](../README.md) · [Troubleshooting](../TROUBLESHOOTING.md)

> Hasil Demo 1 sampai Demo 3 sudah terisi di folder ini. Buka folder ini langsung di VS Code dan lakukan persiapan project di sini (`.env`, install, atau `git init`).

## Skenario

Tech lead tim ALP memutuskan satu endpoint ALP dipindahkan dulu ke Sequelize sebagai percobaan, sebelum tim memilih lapisan data untuk seluruh backend. Pilih endpoint baca yang sudah tim buat (Lab sesi 30, `/api/alp/<resource>`) atau, kalau belum ada, satu tabel ALP beserta tabel anaknya dari Lab sesi 22. Syaratnya: pemakai API tidak merasakan bedanya, daftar memakai pagination sesuai kontrak, dan ada test.

## Yang disiapkan

- Dua tabel ALP tim (induk dan anak, relasi 1:N) ada di schema yang dipakai `.env`. `npm run db:reset` hanya menghapus tabel Tabungan UMKM, tabel ALP tidak tersentuh.
- Data contoh fiktif: minimal 3 baris di tabel induk, anak milik minimal 2 induk yang berbeda, satu nilai filter yang cocok dengan sebagian baris saja, dan satu kolom uang `NUMBER(p,2)` di tabel induk atau anak.
- Lab hanya jalan di lapisan orm. `src/app.js` sudah memasang `src/alp/router.js` di `/api/alp` saat `DATA_LAYER=orm` (`npm run dev:orm`).

## Kontrak endpoint

| Request | Respons berhasil | Respons gagal |
| --- | --- | --- |
| `GET /api/alp/<resource>?page=&pageSize=&<filter>=` | `200 { data: [{ id, ... }], page, pageSize, total }`, urut primary key, `pageSize` bawaan 10, maksimal 50 | filter tidak dikenal boleh `400 VALIDATION_ERROR` |
| `GET /api/alp/<resource>/:id` | `200 { id, ... }` | `404 NOT_FOUND`; id bukan bilangan bulat positif `400 VALIDATION_ERROR` |
| `GET /api/alp/<resource>/:id/<anak>` | `200 { data: [{ id, ... }] }`, urut primary key anak | induk tidak ada `404 NOT_FOUND` |

`id`, `total`, `page`, dan `pageSize` berupa number. Uang berupa string dua desimal (`toMoney`), waktu `+07:00` (`toWib`). Format error sama dengan kontrak sesi 29.

## Langkah

1. `src/alp/models.js` (TODO LAB 1): dua model dan relasi `hasMany` + `belongsTo`. `tableName` dan `field` huruf besar. Jangan memanggil `sync()`.
2. `src/alp/repository.js` (TODO LAB 2–4): daftar dengan `findAndCountAll`, detail dengan `findByPk`, data anak lewat model. Tanpa `sequelize.query` dan tanpa SQL tulisan tangan.
3. `src/alp/router.js` (TODO LAB 5): tiga route, validasi zod, `404` dengan `notFound()`.
4. `challenge/alp.test.js`: minimal 4 test yang memanggil endpoint tim. Pakai GET saja, atau kembalikan data yang diubah. `npm run test:alp`.
5. `challenge/lab-alp.json`: isi sesuai tabel tim, lalu `npm run cek:lab` (server boleh mati).

| Isian `lab-alp.json` | Arti |
| --- | --- |
| `resource`, `table`, `idColumn` | Nama di URL, tabel induk, kolom primary key |
| `filter.param`, `filter.column`, `filter.value` | Nama query string, kolom yang difilter, nilai yang cocok dengan sebagian baris |
| `child.resource`, `child.table`, `child.idColumn`, `child.fkColumn` | Nama di URL, tabel anak, primary key anak, kolom foreign key ke induk |
| `money.on`, `money.column`, `money.field` | `"resource"` (dicek di daftar) atau `"child"` (dicek di data anak), kolom uang, nama field di respons |

## Rubrik · 100 poin (80 otomatis + 20 manual)

| No | Kriteria otomatis (`npm run cek:lab`) | Poin |
| --- | --- | --- |
| 1 | Model dan relasi: dua model dengan kolom yang ada di database dan primary key benar (5), `hasMany` induk ke anak dengan foreign key yang benar (5) | 10 |
| 2 | Daftar lewat model, sama dengan isi database | 10 |
| 3 | Pagination: `?page=2&pageSize=2` berisi baris yang benar, `page`, `pageSize`, `total` | 10 |
| 4 | Filter lewat query string | 5 |
| 5 | Input `' OR '1'='1` tidak tembus | 5 |
| 6 | Detail `200` | 5 |
| 7 | Detail `404 NOT_FOUND` (5) dan `400 VALIDATION_ERROR` untuk `abc`, `0`, `1.5` (5) | 10 |
| 8 | Data anak lewat relasi, sesuai induk | 5 |
| 9 | Data anak: induk tidak ada `404` | 5 |
| 10 | Uang string dua desimal, sama dengan database | 5 |
| 11 | Test tim: minimal 4 lulus dan 0 gagal (2–3 lulus: 5) | 10 |

Cek membandingkan jawaban endpoint dengan hasil `SELECT` miliknya sendiri. Poin kriteria 2–10 hanya diberikan kalau log Sequelize untuk request itu memuat SQL buatan model (`FROM "NAMA_TABEL" "Alias"` dengan kutip). Jawaban yang benar lewat `sequelize.query` atau SQL tulisan tangan belum dihitung sebagai porting. Cek hanya mengirim GET dan menjalankan SELECT, lalu menjalankan test tim.

| No | Kriteria manual (lewat review) | Poin |
| --- | --- | --- |
| M1 | Tabel perbandingan SQL vs ORM untuk endpoint yang diporting: jumlah baris kode, SQL buatan Sequelize untuk satu request daftar dan satu data anak (`DB_LOG_SQL=true`), satu hal yang jadi lebih mudah dan satu yang lebih sulit | 8 |
| M2 | Kontrak tidak berubah: nama field, format uang dan waktu, serta kode error sama dengan versi SQL tim (atau dengan kontrak di atas bila versi SQL belum ada), dibuktikan dengan satu respons yang dibandingkan | 6 |
| M3 | Keputusan lapisan data ALP (SQL langsung, ORM, atau campuran) dan alasannya, ditulis di backlog ALP | 6 |

Prioritas: kerjakan dulu kriteria wajib 45 poin: nomor 1, 2, 3, 6, dan 7. Sisanya menyusul.

## Bonus Lab (opsional, maks. +10, dinilai manual)

1. **+7** `POST /api/alp/<resource>` yang menyimpan satu baris induk dan baris anaknya dalam satu `sequelize.transaction()`. Buktikan rollback: kirim request yang gagal di baris anak (misalnya melanggar unique atau CHECK), lalu tunjukkan `total` daftar tidak berubah.
2. **+3** Unique constraint milik ALP menjawab `409 DUPLICATE` dengan `details` berisi nama field (petunjuk: nama `unique` di model dan `COLUMN_FIELDS`).

Hapus lagi data percobaan Bonus supaya angka test tetap sama.
