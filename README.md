# 33 - Oracle REST API with Sequelize ORM

Lab ini menulis ulang lapisan data REST API sesi 31 dengan Sequelize, tanpa mengubah route, controller, service, validasi, atau kontrak. Aplikasi bisa jalan dengan dua lapisan data (`DATA_LAYER=sql` atau `orm`), dan koleksi Bruno yang sama dipakai untuk keduanya. Di Demo 4, dua server dijalankan berdampingan dan responsnya dibandingkan. Di Lab, tiap tim memindahkan satu endpoint ALP ke Sequelize lengkap dengan test, lalu memeriksanya dengan `npm run cek:lab`.

## Tujuan

1. Mengganti repository SQL langsung dengan repository Sequelize tanpa mengubah kontrak API.
2. Menulis pagination, filter, CRUD, dan transfer dengan API Sequelize (`findAndCountAll`, `Op`, `sequelize.transaction`).
3. Memetakan error Sequelize (`UniqueConstraintError`, `ForeignKeyConstraintError`) ke kode error kontrak yang sama.
4. Membandingkan SQL langsung dan ORM dari hasil, SQL yang dibuat, dan jumlah kode.

## Estimasi Waktu

Empat Demo lalu satu Lab. **Demo**: instruktur memperagakan, peserta mengikuti dari file starter dengan langkah bernomor (individu). Demo 1 dan 2 inti sesi (nasabah, rekening, dan mutasi dengan Sequelize), Demo 3 penting (transfer dengan `sequelize.transaction()`), Demo 4 penerapan dan diskusi. Tiap Demo punya **Tantangan tambahan** untuk yang selesai lebih cepat (tidak wajib). **Lab**: tugas tim dengan rubrik 100 poin dan cek otomatis.

| Bagian | Peraga | Ikuti | Total |
| --- | --- | --- | --- |
| Demo 1 · Setup, baseline dua lapisan, dan nasabah dengan Sequelize + error mapping | 25 | 35 | ±60 menit |
| Demo 2 · Rekening & mutasi | 5 | 15 | ±20 menit |
| Demo 3 · Transfer dengan `sequelize.transaction()` | 10 | 20 | ±30 menit |
| Demo 4 · Bandingkan SQL vs ORM | 15 | 15 | ±30 menit |
| Lab · Porting endpoint ALP ke Sequelize dengan test (tim) | | | ±45 menit |
| **Total** | | | **±185 menit** |

Sisa 25 menit dari 210 menit konten dipakai untuk pembuka (10) dan penutup (15).

## Environment & Tools

Versi dikunci, dicek 22 Nov 2026.

| Tool | Versi | Catatan |
| --- | --- | --- |
| Node.js | 26 LTS (fallback 24 LTS) | |
| Container `oracle-alp`, user `ALP_DEV` | Oracle AI Database Free 23.26.4 | Dari sesi 21, di Docker Desktop (atau Rancher Desktop, CLI `docker` sama) |
| Paket npm | `sequelize` 6.37.8, `oracledb` 26.0.0, `express` 5.3.0, `zod` 4.6.7, `swagger-ui-express` 5.0.1, `yaml` 2.9.1 | Dikunci di `package-lock.json` |
| Bruno | 4.3.x | Environment `local` (port 3000) dan `local-orm` (port 3001) |

Oracle Instant Client tidak perlu (node-oracledb Thin mode). Kombinasi sequelize 6.37.8 + oracledb 26.0.0 berada di luar tabel dukungan resmi Sequelize v6 (yang mencantumkan node-oracledb `^5.4.0`), tapi sudah dites jalan untuk semua endpoint lab ini. Dokumentasi Sequelize v6 yang menyebut Instant Client ditulis untuk node-oracledb 5 (hanya Thick); abaikan untuk lab ini.

## Struktur Repo

| Folder | Isi | Sudah terisi |
| --- | --- | --- |
| [`demo-1/`](demo-1/) | Demo 1 · Setup, Baseline Dua Lapisan, dan Nasabah | belum ada |
| [`demo-2/`](demo-2/) | Demo 2 · Rekening & Mutasi | Demo 1 |
| [`demo-3/`](demo-3/) | Demo 3 · Transfer dengan `sequelize.transaction()` | Demo 1–2 |
| [`demo-4/`](demo-4/) | Demo 4 · Bandingkan SQL vs ORM | Demo 1–3 |
| [`lab/`](lab/) | Lab · Porting Endpoint ALP ke Sequelize | Demo 1–3 |

Setiap folder adalah project lengkap yang berdiri sendiri. Konfigurasi lokal (`.env`), hasil install, dan repo Git dibuat per folder. Database yang dipakai tetap sama.

## Demo dan Lab

Demo memakai format **refactor kata**: tiap fungsi di `repositories/orm/` punya pasangan di `repositories/sql/` dengan nama, parameter, dan bentuk hasil yang sama. Baca versi SQL-nya, tulis versi ORM, jalankan Bruno, ulangi. Demo dikerjakan individu (bandingkan hasil dengan teman sebelah di Demo 4), Lab dikerjakan per tim.

### Target

| Bagian | Hasil (Bruno, environment `local-orm`) |
| --- | --- |
| Demo 1 | `dev:sql` 26/26 lulus, `dev:orm` 7/26 lulus; setelah nasabah dan error mapping: 17/26 |
| Demo 2 | 22/26 |
| Demo 3 | 26/26 |
| Demo 4 | `npm run compare`: 11 endpoint `sama: 'ya'`, tabel jumlah baris kode per repository |
| Lab | `npm run cek:lab` mencetak skor otomatis untuk endpoint ALP tim (maks. 80) |

### Studi Kasus

Tim ALP Tabungan UMKM memutuskan memakai ORM supaya kode lebih pendek dan relasi lebih mudah dibaca. Syaratnya: frontend dan mobile tidak boleh merasakan perubahan apa pun. Kontrak API, kode error, format uang, dan format waktu harus identik. Semua data adalah data simulasi.

### Kriteria Selesai

- [ ] Bruno `local-orm`: 26 dari 26 lulus, dua kali berturut-turut
- [ ] Bruno `local` (lapisan SQL) tetap 26 dari 26
- [ ] `npm run compare`: 11 endpoint `'ya'`
- [ ] Tidak ada file di `routes/`, `controllers/`, `services/`, `schemas/` yang berubah
- [ ] Tabel perbandingan 4.3 terisi
- [ ] Lab: skor `npm run cek:lab` dicatat, M1–M3 siap dinilai

## Verifikasi & Expected Result

| Cek | Expected result |
| --- | --- |
| `GET /health` (orm) | `{"status":"ok","layer":"orm","db":"up"}` |
| `GET /health` (sql) | `{"status":"ok","layer":"sql","db":"up","pool":{...}}` |
| Respons endpoint | Identik byte per byte antara dua lapisan (dicek `npm run compare`) |
| Uang | String dua desimal di kedua lapisan |
| Waktu | `+07:00` di kedua lapisan |
| Transfer ORM | `201 { refNo: "REF-SIM-T100001", fromAccountId, toAccountId, amount, txnAt }` setelah reset, dua mutasi `-D`/`-K` |

## Troubleshooting

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
| `DPI-1047: Cannot locate a 64-bit Oracle Client library` | Kode memanggil `oracledb.initOracleClient()` (Thick mode) tetapi Instant Client tidak terpasang atau path salah | Lab ini memakai Thin mode: hapus pemanggilan `initOracleClient`. Instant Client hanya perlu jika instruktur meminta Thick mode |
| Catatan lain menyuruh memasang Oracle Instant Client untuk Sequelize | Dokumentasi lama (node-oracledb 5, hanya Thick) | Tidak perlu di lab ini: `oracledb` 26 berjalan di Thin mode |
| `EADDRINUSE: address already in use :::3001` | `dev:orm` lama masih jalan di terminal lain | Hentikan dengan Ctrl+C di terminal itu |
| PowerShell: `Invoke-WebRequest : ... parameter ...` atau `Missing an argument for parameter 'InFile'` | `curl` adalah alias PowerShell 5.1; pesan error bergantung opsi yang dipakai | Ketik `curl.exe` |
| PowerShell: `Unrecognized token in source text` pada `@requests/...` | Argumen berawalan `@` tanpa kutip dibaca sebagai splatting | `-d "@requests/customer-email-duplikat.json"` |
| `npx` (Bruno CLI) gagal: `ENOENT ... npm-cache\_npx\<hash>\package.json` | Proses `npx` sebelumnya terhenti di tengah (Ctrl+C, timeout), cache `_npx` rusak | PowerShell: `Remove-Item $env:LOCALAPPDATA\npm-cache\_npx -Recurse -Force`, lalu ulangi. macOS/Linux: `rm -rf ~/.npm/_npx` |
| VS Code: dialog `Do you trust the authors of the files in this folder?`, tombol Run belum aktif | Folder baru dibuka dalam Restricted Mode | Pilih **Trust Folder & Continue** |

## Cleanup

Hentikan kedua server (Ctrl+C di tiap terminal). `npm run db:reset` mengembalikan data awal Tabungan UMKM; tabel ALP tim tidak dihapus.

Sesi 34 menambahkan login JWT dan pembatasan role di atas API ini. Lapisan data yang dipilih tim (SQL atau ORM) tidak memengaruhi middleware auth karena keduanya berada di balik service yang sama.
