-- Menghapus objek Tabungan UMKM supaya schema bisa dibuat ulang dari awal.

DROP TABLE IF EXISTS transactions PURGE;
DROP TABLE IF EXISTS accounts PURGE;
DROP TABLE IF EXISTS customers PURGE;
DROP TABLE IF EXISTS branches PURGE;
DROP SEQUENCE IF EXISTS transfer_ref_seq;
