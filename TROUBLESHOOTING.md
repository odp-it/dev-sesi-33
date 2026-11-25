# Troubleshooting

[Kembali ke README](README.md)

| Masalah / Error | Penyebab | Solusi |
| --- | --- | --- |
| `501 NOT_IMPLEMENTED` `TODO ... (orm)` | Fungsi ORM belum ditulis | Kerjakan langkah sesuai nama TODO |
| ID nasabah baru melompat (mis. 21) dan berbeda dengan teman | Identity column memakai cache 20 nomor | Normal; bandingkan respons dengan lapisan SQL setelah `npm run db:reset`, bukan ID-nya |
| `500` dan `SequelizeUniqueConstraintError: Validation error` di terminal | `fromSequelize` belum memetakan error | Langkah 1.7 |
| `409 DUPLICATE` tanpa `details` | `err.fields` kosong: nama unique key di model beda dengan constraint database | `unique: 'UQ_CUSTOMERS_EMAIL'` di `src/models/core.js` |
| `"balance":"10000000"` tanpa `.00` atau `"balance":10000000` (number) | `toMoney` lupa dipakai, atau `fetchTypeHandler` di `src/db/sequelize.js` hilang | Pakai mapper `toAccount`/`toTransaction` yang sudah ada |
| `createdAt` berakhiran `.000Z` | Date dikirim apa adanya, bukan lewat `toWib()` | Pakai mapper `toDetail` |
| Jam mutasi bergeser 7 jam | `TZ=UTC` tidak ada di `.env` | Tambahkan `TZ=UTC`, restart |
| `NJS-098: 3 bind placeholders were used in the SQL statement but 2 bind values were provided` | Bind `$nama` dipakai dua kali dalam satu `sequelize.query` | Pakai nama berbeda untuk tiap posisi (lihat `report.repository.js`) |
| `ORA-01745: invalid host/bind variable name` | Nama bind adalah kata kunci Oracle (mis. `$end`) | Ganti nama, mis. `$monthEnd` |
| Transfer kedua tetap mengubah saldo setelah error | Ada query transfer tanpa `{ transaction: t }` | Tambahkan `transaction: t` di semua query transfer |
| `cek:lab`: `lab-alp.json belum siap` | Masih ada isian `ISI_` atau nama kolom salah ketik | Isi semua kunci yang disebut di catatan |
| `cek:lab`: `belum ada model dengan tableName ...` | Model belum diimpor router, atau `tableName` tidak huruf besar | Impor model lewat `repository.js`, tulis nama tabel huruf besar |
| `cek:lab`: `respons benar, tetapi log Sequelize tidak memuat FROM ...` | Data diambil dengan `sequelize.query` atau SQL tulisan tangan | Pakai `findAndCountAll`, `findByPk`, `findAll` |
| `cek:lab`: `Cek berhenti: ORA-00942 ...` atau `ORA-00904 ...` | Tabel atau kolom di `lab-alp.json` tidak ada di schema `.env` | Cocokkan nama dengan database, jalankan DDL ALP tim |
| `cek:lab`: `Cek berhenti: ORA-01017 ...` | Password di `.env` salah | Perbaiki `.env` sekali saja. Jangan mencoba berulang: 10 kali gagal login mengunci user |
| `npm run compare`: `TypeError: fetch failed` | Salah satu server belum jalan | Jalankan `npm run dev:sql` dan `npm run dev:orm` |
| `Failed running 'src/server.js'. Waiting for file changes before restarting...` | Server berhenti karena error saat start (mode `--watch`) | Baca error di atas baris itu, perbaiki, simpan file |
| `DPI-1047: Cannot locate a 64-bit Oracle Client library` | Kode memanggil `oracledb.initOracleClient()` (Thick mode) tetapi Instant Client tidak terpasang atau path salah | Lab ini memakai Thin mode: hapus pemanggilan `initOracleClient`. Instant Client hanya untuk Thick mode |
| Catatan lain menyuruh memasang Oracle Instant Client untuk Sequelize | Dokumentasi lama (node-oracledb 5, hanya Thick) | Lewati di lab ini: `oracledb` 26 berjalan di Thin mode |
| `EADDRINUSE: address already in use :::3001` | `dev:orm` lama masih jalan di terminal lain | Hentikan dengan Ctrl+C di terminal itu |
| PowerShell: `Invoke-WebRequest : ... parameter ...` atau `Missing an argument for parameter 'InFile'` | `curl` adalah alias PowerShell 5.1; pesan error bergantung opsi yang dipakai | Ketik `curl.exe` |
| PowerShell: `Unrecognized token in source text` pada `@requests/...` | Argumen berawalan `@` tanpa kutip dibaca sebagai splatting | `-d "@requests/customer-email-duplikat.json"` |
| `npx` (Bruno CLI) gagal: `ENOENT ... npm-cache\_npx\<hash>\package.json` | Proses `npx` sebelumnya terhenti di tengah (Ctrl+C, timeout), cache `_npx` rusak | PowerShell: `Remove-Item $env:LOCALAPPDATA\npm-cache\_npx -Recurse -Force`, lalu ulangi. macOS/Linux: `rm -rf ~/.npm/_npx` |
| VS Code: dialog `Do you trust the authors of the files in this folder?`, tombol Run belum aktif | Folder baru dibuka dalam Restricted Mode | Pilih **Trust Folder & Continue** |
