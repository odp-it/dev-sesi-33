# 33 - Oracle REST API with Sequelize ORM

Lab ini menulis ulang lapisan data REST API sesi 31 dengan Sequelize, tanpa mengubah route, controller, service, validasi, atau kontrak. Aplikasi bisa jalan dengan dua lapisan data (`DATA_LAYER=sql` atau `orm`), dan koleksi Bruno yang sama dipakai untuk keduanya. Di Demo 4, dua server dijalankan berdampingan dan responsnya dibandingkan. Di Lab, tiap tim memindahkan satu endpoint ALP ke Sequelize lengkap dengan test, lalu memeriksanya dengan `npm run cek:lab`.

## Environment & Tools

Versi dikunci, dicek 22 Nov 2026.

| Tool | Versi | Catatan |
| --- | --- | --- |
| Node.js | 26 LTS (fallback 24 LTS) | |
| Container `oracle-alp`, user `ALP_DEV` | Oracle AI Database Free 23.26.4 | Dari sesi 21, di Docker Desktop (atau Rancher Desktop, CLI `docker` sama) |
| Paket npm | `sequelize` 6.37.8, `oracledb` 26.0.0, `express` 5.3.0, `zod` 4.6.7, `swagger-ui-express` 5.0.1, `yaml` 2.9.1 | Dikunci di `package-lock.json` |
| Bruno | 4.3.x | Environment `local` (port 3000) dan `local-orm` (port 3001) |

Lab ini memakai node-oracledb Thin mode, tanpa Oracle Instant Client. Kombinasi sequelize 6.37.8 + oracledb 26.0.0 berada di luar tabel dukungan resmi Sequelize v6 (yang mencantumkan node-oracledb `^5.4.0`), tapi sudah dites jalan untuk semua endpoint lab ini. Dokumentasi Sequelize v6 yang menyebut Instant Client ditulis untuk node-oracledb 5 (hanya Thick); abaikan untuk lab ini.

## Struktur Repo

| Folder | Isi | Sudah terisi |
| --- | --- | --- |
| [`demo-1/`](demo-1/) | Demo 1 · Setup, Baseline Dua Lapisan, dan Nasabah | belum ada |
| [`demo-2/`](demo-2/) | Demo 2 · Rekening & Mutasi | Demo 1 |
| [`demo-3/`](demo-3/) | Demo 3 · Transfer dengan `sequelize.transaction()` | Demo 1–2 |
| [`demo-4/`](demo-4/) | Demo 4 · Bandingkan SQL vs ORM | Demo 1–3 |
| [`lab/`](lab/) | Lab · Porting Endpoint ALP ke Sequelize | Demo 1–3 |

Setiap folder adalah project lengkap yang berdiri sendiri. Konfigurasi lokal (`.env`), hasil install, dan repo Git dibuat per folder. Database yang dipakai tetap sama.

## Studi Kasus

Tim ALP Tabungan UMKM memutuskan memakai ORM supaya kode lebih pendek dan relasi lebih mudah dibaca. Syaratnya: frontend dan mobile tidak boleh merasakan perubahan apa pun. Kontrak API, kode error, format uang, dan format waktu harus identik. Semua data adalah data simulasi.

## Bantuan

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md): pesan error dan cara memperbaikinya.
- [CHECKLIST.md](CHECKLIST.md): hasil yang harus terlihat dan kriteria selesai.

## Cleanup

Hentikan kedua server (Ctrl+C di tiap terminal). `npm run db:reset` mengembalikan data awal Tabungan UMKM; tabel ALP tim tidak dihapus.

Sesi 34 menambahkan login JWT dan pembatasan role di atas API ini. Lapisan data yang dipilih tim (SQL atau ORM) tidak memengaruhi middleware auth karena keduanya berada di balik service yang sama.
