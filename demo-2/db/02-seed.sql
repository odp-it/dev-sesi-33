-- Sesi 22 · Seed data simulasi Tabungan UMKM
-- Dibangkitkan skrip generator dengan seed acak tetap, jadi isinya sama di semua laptop. Jangan diedit manual.
-- Semua data simulasi: kode SIM, domain example.com, telepon 0800-0000-xxxx.
-- ID tidak ditulis: diisi identity column. FK dicari lewat kode unik (subquery).

-- 1. Cabang
INSERT INTO branches (branch_code, branch_name, city) VALUES ('KCP-SIM-01', 'Cabang Simulasi Kota Tua', 'Jakarta');
INSERT INTO branches (branch_code, branch_name, city) VALUES ('KCP-SIM-02', 'Cabang Simulasi Braga', 'Bandung');
INSERT INTO branches (branch_code, branch_name, city) VALUES ('KCP-SIM-03', 'Cabang Simulasi Tunjungan', 'Surabaya');

-- 2. Nasabah
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0001', 'Rina Contoh', 'rina.contoh@example.com', '0800-0000-0001', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-01'), TIMESTAMP '2025-11-03 09:10:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0002', 'Budi Contoh', 'budi.contoh@example.com', '0800-0000-0002', 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-01'), TIMESTAMP '2025-11-05 10:20:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0003', 'Sari Contoh', 'sari.contoh@example.com', '0800-0000-0003', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-02'), TIMESTAMP '2025-11-12 13:40:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0004', 'Agus Contoh', 'agus.contoh@example.com', '0800-0000-0004', 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-02'), TIMESTAMP '2025-11-20 11:00:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0005', 'Dewi Contoh', 'dewi.contoh@example.com', '0800-0000-0005', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-03'), TIMESTAMP '2025-12-01 09:30:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0006', 'Joko Contoh', 'joko.contoh@example.com', '0800-0000-0006', 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-03'), TIMESTAMP '2025-12-04 14:15:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0007', 'Maya Contoh', 'maya.contoh@example.com', '0800-0000-0007', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-01'), TIMESTAMP '2025-12-09 10:45:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0008', 'Hendra Contoh', 'hendra.contoh@example.com', '0800-0000-0008', 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-02'), TIMESTAMP '2025-12-15 15:05:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0009', 'Lina Contoh', 'lina.contoh@example.com', '0800-0000-0009', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-03'), TIMESTAMP '2025-12-18 08:50:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0010', 'Fajar Contoh', 'fajar.contoh@example.com', NULL, 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-01'), TIMESTAMP '2026-01-06 09:00:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0011', 'Wati Contoh', 'wati.contoh@example.com', '0800-0000-0011', 'UMKM',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-02'), TIMESTAMP '2026-03-18 10:30:00');
INSERT INTO customers (cif_no, full_name, email, phone, segment, branch_id, created_at)
  VALUES ('CIF-SIM-0012', 'Dimas Contoh', 'dimas.contoh@example.com', NULL, 'INDIVIDU',
          (SELECT branch_id FROM branches WHERE branch_code = 'KCP-SIM-03'), TIMESTAMP '2026-03-25 13:20:00');

-- 3. Rekening (saldo = hasil semua transaksi di bawah)
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000001', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0001'),
          'TABUNGAN', 14550000, 'AKTIF', TIMESTAMP '2026-01-02 09:15:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000002', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0001'),
          'GIRO', 15050000, 'AKTIF', TIMESTAMP '2026-01-02 09:30:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000003', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0002'),
          'TABUNGAN', 14800000, 'AKTIF', TIMESTAMP '2026-01-05 10:00:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000004', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0003'),
          'TABUNGAN', 24600000, 'AKTIF', TIMESTAMP '2026-01-05 11:20:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000005', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0003'),
          'GIRO', 17100000, 'AKTIF', TIMESTAMP '2026-01-06 09:05:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000006', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0004'),
          'TABUNGAN', 15100000, 'AKTIF', TIMESTAMP '2026-01-07 13:10:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000007', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0005'),
          'GIRO', 20750000, 'AKTIF', TIMESTAMP '2026-01-08 10:40:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000008', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0006'),
          'TABUNGAN', 14900000, 'AKTIF', TIMESTAMP '2026-01-08 14:00:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000009', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0006'),
          'TABUNGAN', 5300000, 'AKTIF', TIMESTAMP '2026-01-09 09:45:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000010', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0007'),
          'TABUNGAN', 16450000, 'AKTIF', TIMESTAMP '2026-01-12 11:30:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000011', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0008'),
          'TABUNGAN', 6900000, 'DIBLOKIR', TIMESTAMP '2026-01-12 15:00:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000012', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0009'),
          'TABUNGAN', 20050000, 'AKTIF', TIMESTAMP '2026-01-13 08:55:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000013', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0009'),
          'GIRO', 18100000, 'AKTIF', TIMESTAMP '2026-01-13 09:20:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000014', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0010'),
          'TABUNGAN', 14350000, 'AKTIF', TIMESTAMP '2026-01-14 10:10:00');
INSERT INTO accounts (account_no, customer_id, product, balance, status, opened_at)
  VALUES ('SIM-1000015', (SELECT customer_id FROM customers WHERE cif_no = 'CIF-SIM-0011'),
          'TABUNGAN', 0, 'AKTIF', TIMESTAMP '2026-03-20 10:45:00');

-- 4. Transaksi Januari-Maret 2026
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'LAINNYA', 6500000,
          TIMESTAMP '2026-01-02 09:20:00', 'Setoran awal', 'REF-SIM-000001');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'SETOR', 'LAINNYA', 6100000,
          TIMESTAMP '2026-01-02 09:35:00', 'Setoran awal', 'REF-SIM-000002');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'SETOR', 'LAINNYA', 3700000,
          TIMESTAMP '2026-01-05 10:05:00', 'Setoran awal', 'REF-SIM-000003');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'LAINNYA', 10450000,
          TIMESTAMP '2026-01-05 11:25:00', 'Setoran awal', 'REF-SIM-000004');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'SETOR', 'LAINNYA', 10950000,
          TIMESTAMP '2026-01-06 09:10:00', 'Setoran awal', 'REF-SIM-000005');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'SETOR', 'LAINNYA', 1600000,
          TIMESTAMP '2026-01-07 13:15:00', 'Setoran awal', 'REF-SIM-000006');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'SETOR', 'LAINNYA', 14600000,
          TIMESTAMP '2026-01-08 10:45:00', 'Setoran awal', 'REF-SIM-000007');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'SETOR', 'LAINNYA', 1500000,
          TIMESTAMP '2026-01-08 14:05:00', 'Setoran awal', 'REF-SIM-000008');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000009'), 'SETOR', 'LAINNYA', 3800000,
          TIMESTAMP '2026-01-09 09:50:00', 'Setoran awal', 'REF-SIM-000009');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 3200000,
          TIMESTAMP '2026-01-10 15:15:00', 'Setoran hasil penjualan', 'REF-SIM-000010');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'LAINNYA', 5900000,
          TIMESTAMP '2026-01-12 11:35:00', 'Setoran awal', 'REF-SIM-000011');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'TARIK', 'LAINNYA', 300000,
          TIMESTAMP '2026-01-12 15:00:00', 'Tarik tunai', 'REF-SIM-000012');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000011'), 'SETOR', 'LAINNYA', 3050000,
          TIMESTAMP '2026-01-12 15:05:00', 'Setoran awal', 'REF-SIM-000013');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000011'), 'TARIK', 'LAINNYA', 1400000,
          TIMESTAMP '2026-01-13 08:35:00', 'Tarik tunai', 'REF-SIM-000014');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'LAINNYA', 13200000,
          TIMESTAMP '2026-01-13 09:00:00', 'Setoran awal', 'REF-SIM-000015');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 3350000,
          TIMESTAMP '2026-01-13 09:15:00', 'Setoran hasil penjualan', 'REF-SIM-000016');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'SETOR', 'LAINNYA', 11700000,
          TIMESTAMP '2026-01-13 09:25:00', 'Setoran awal', 'REF-SIM-000017');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 1600000,
          TIMESTAMP '2026-01-13 13:50:00', 'Setoran hasil penjualan', 'REF-SIM-000018');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'SETOR', 'LAINNYA', 1850000,
          TIMESTAMP '2026-01-14 10:15:00', 'Setoran awal', 'REF-SIM-000019');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'TARIK', 'BAHAN_BAKU', 850000,
          TIMESTAMP '2026-01-16 10:50:00', 'Belanja bahan baku', 'REF-SIM-000020');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 2550000,
          TIMESTAMP '2026-01-17 08:10:00', 'Setoran hasil penjualan', 'REF-SIM-000021');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 2250000,
          TIMESTAMP '2026-01-19 14:45:00', 'Setoran hasil penjualan', 'REF-SIM-000022');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TRANSFER_MASUK', 'TRANSFER', 2000000,
          TIMESTAMP '2026-01-20 10:15:00', 'Pindah dana ke giro usaha (SIM-1000001)', 'REF-SIM-000023');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'TRANSFER_KELUAR', 'TRANSFER', 2000000,
          TIMESTAMP '2026-01-20 10:15:00', 'Pindah dana ke giro usaha (SIM-1000002)', 'REF-SIM-000024');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'SETOR', 'PENJUALAN', 4900000,
          TIMESTAMP '2026-01-20 12:20:00', 'Pembayaran pesanan grosir', 'REF-SIM-000025');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'TARIK', 'BAHAN_BAKU', 1250000,
          TIMESTAMP '2026-01-20 13:50:00', 'Belanja bahan baku', 'REF-SIM-000026');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'TARIK', 'BAHAN_BAKU', 2000000,
          TIMESTAMP '2026-01-20 15:55:00', 'Belanja bahan baku', 'REF-SIM-000027');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 2700000,
          TIMESTAMP '2026-01-21 09:50:00', 'Setoran hasil penjualan', 'REF-SIM-000028');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 3350000,
          TIMESTAMP '2026-01-21 11:40:00', 'Setoran hasil penjualan', 'REF-SIM-000029');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'SETOR', 'PENJUALAN', 5550000,
          TIMESTAMP '2026-01-23 15:30:00', 'Pembayaran pesanan grosir', 'REF-SIM-000030');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'TARIK', 'LAINNYA', 600000,
          TIMESTAMP '2026-01-24 12:45:00', 'Tarik tunai', 'REF-SIM-000031');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'TARIK', 'LAINNYA', 1000000,
          TIMESTAMP '2026-01-24 15:40:00', 'Tarik tunai', 'REF-SIM-000032');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'SETOR', 'GAJI', 7250000,
          TIMESTAMP '2026-01-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000033');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'SETOR', 'GAJI', 7250000,
          TIMESTAMP '2026-01-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000034');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'SETOR', 'GAJI', 5000000,
          TIMESTAMP '2026-01-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000035');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000011'), 'SETOR', 'GAJI', 5250000,
          TIMESTAMP '2026-01-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000036');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'SETOR', 'GAJI', 5500000,
          TIMESTAMP '2026-01-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000037');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 2100000,
          TIMESTAMP '2026-01-26 08:00:00', 'Setoran hasil penjualan', 'REF-SIM-000038');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'SETOR', 'PENJUALAN', 3350000,
          TIMESTAMP '2026-01-26 12:05:00', 'Pembayaran pesanan grosir', 'REF-SIM-000039');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'SETOR', 'PENJUALAN', 4250000,
          TIMESTAMP '2026-01-26 12:50:00', 'Pembayaran pesanan grosir', 'REF-SIM-000040');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'TARIK', 'BAHAN_BAKU', 1700000,
          TIMESTAMP '2026-01-26 15:45:00', 'Belanja bahan baku', 'REF-SIM-000041');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TARIK', 'GAJI', 1700000,
          TIMESTAMP '2026-01-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000042');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TARIK', 'GAJI', 2550000,
          TIMESTAMP '2026-01-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000043');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TARIK', 'GAJI', 1700000,
          TIMESTAMP '2026-01-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000044');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TARIK', 'GAJI', 1850000,
          TIMESTAMP '2026-01-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000045');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'TARIK', 'LAINNYA', 850000,
          TIMESTAMP '2026-01-27 12:40:00', 'Tarik tunai', 'REF-SIM-000046');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'TRANSFER_MASUK', 'TRANSFER', 750000,
          TIMESTAMP '2026-01-28 14:30:00', 'Bayar pesanan katering (SIM-1000003)', 'REF-SIM-000047');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'TRANSFER_KELUAR', 'TRANSFER', 750000,
          TIMESTAMP '2026-01-28 14:30:00', 'Bayar pesanan katering (SIM-1000004)', 'REF-SIM-000048');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 1400000,
          TIMESTAMP '2026-02-01 09:05:00', 'Setoran hasil penjualan', 'REF-SIM-000049');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'SETOR', 'PENJUALAN', 4100000,
          TIMESTAMP '2026-02-01 09:35:00', 'Pembayaran pesanan grosir', 'REF-SIM-000050');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'SETOR', 'PENJUALAN', 5700000,
          TIMESTAMP '2026-02-01 13:50:00', 'Pembayaran pesanan grosir', 'REF-SIM-000051');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'SETOR', 'PENJUALAN', 4900000,
          TIMESTAMP '2026-02-02 12:25:00', 'Pembayaran pesanan grosir', 'REF-SIM-000052');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'TARIK', 'LAINNYA', 850000,
          TIMESTAMP '2026-02-04 12:05:00', 'Tarik tunai', 'REF-SIM-000053');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'TARIK', 'BAHAN_BAKU', 1100000,
          TIMESTAMP '2026-02-06 13:10:00', 'Belanja bahan baku', 'REF-SIM-000054');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'TARIK', 'BAHAN_BAKU', 300000,
          TIMESTAMP '2026-02-07 12:20:00', 'Belanja bahan baku', 'REF-SIM-000055');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 500000,
          TIMESTAMP '2026-02-08 09:35:00', 'Setoran hasil penjualan', 'REF-SIM-000056');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000009'), 'TRANSFER_MASUK', 'TRANSFER', 1000000,
          TIMESTAMP '2026-02-09 09:40:00', 'Sisihkan tabungan (SIM-1000008)', 'REF-SIM-000057');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'TRANSFER_KELUAR', 'TRANSFER', 1000000,
          TIMESTAMP '2026-02-09 09:40:00', 'Sisihkan tabungan (SIM-1000009)', 'REF-SIM-000058');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 1800000,
          TIMESTAMP '2026-02-09 14:40:00', 'Setoran hasil penjualan', 'REF-SIM-000059');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 1450000,
          TIMESTAMP '2026-02-09 14:50:00', 'Setoran hasil penjualan', 'REF-SIM-000060');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000009'), 'SETOR', 'LAINNYA', 500000,
          TIMESTAMP '2026-02-10 11:00:00', 'Setoran tabungan', 'REF-SIM-000061');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 3500000,
          TIMESTAMP '2026-02-11 09:35:00', 'Setoran hasil penjualan', 'REF-SIM-000062');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TARIK', 'OPERASIONAL', 300000,
          TIMESTAMP '2026-02-12 15:30:00', 'Biaya listrik dan sewa', 'REF-SIM-000063');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 1450000,
          TIMESTAMP '2026-02-13 09:30:00', 'Setoran hasil penjualan', 'REF-SIM-000064');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TARIK', 'OPERASIONAL', 750000,
          TIMESTAMP '2026-02-14 10:00:00', 'Biaya listrik dan sewa', 'REF-SIM-000065');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'TARIK', 'LAINNYA', 1450000,
          TIMESTAMP '2026-02-15 09:45:00', 'Tarik tunai', 'REF-SIM-000066');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 2450000,
          TIMESTAMP '2026-02-15 15:45:00', 'Setoran hasil penjualan', 'REF-SIM-000067');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'TRANSFER_MASUK', 'TRANSFER', 1500000,
          TIMESTAMP '2026-02-16 13:05:00', 'Pindah dana operasional (SIM-1000005)', 'REF-SIM-000068');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TRANSFER_KELUAR', 'TRANSFER', 1500000,
          TIMESTAMP '2026-02-16 13:05:00', 'Pindah dana operasional (SIM-1000004)', 'REF-SIM-000069');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 1850000,
          TIMESTAMP '2026-02-18 15:30:00', 'Setoran hasil penjualan', 'REF-SIM-000070');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'TARIK', 'LAINNYA', 1500000,
          TIMESTAMP '2026-02-19 11:10:00', 'Tarik tunai', 'REF-SIM-000071');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TARIK', 'OPERASIONAL', 400000,
          TIMESTAMP '2026-02-19 15:55:00', 'Biaya listrik dan sewa', 'REF-SIM-000072');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'SETOR', 'PENJUALAN', 4350000,
          TIMESTAMP '2026-02-21 12:00:00', 'Pembayaran pesanan grosir', 'REF-SIM-000073');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'TRANSFER_MASUK', 'TRANSFER', 450000,
          TIMESTAMP '2026-02-23 11:25:00', 'Bayar pesanan kue (SIM-1000014)', 'REF-SIM-000074');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'TRANSFER_KELUAR', 'TRANSFER', 450000,
          TIMESTAMP '2026-02-23 11:25:00', 'Bayar pesanan kue (SIM-1000010)', 'REF-SIM-000075');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'SETOR', 'GAJI', 4000000,
          TIMESTAMP '2026-02-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000076');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'SETOR', 'GAJI', 4000000,
          TIMESTAMP '2026-02-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000077');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'SETOR', 'GAJI', 7000000,
          TIMESTAMP '2026-02-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000078');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'SETOR', 'GAJI', 5000000,
          TIMESTAMP '2026-02-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000079');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TARIK', 'OPERASIONAL', 1000000,
          TIMESTAMP '2026-02-26 09:35:00', 'Biaya listrik dan sewa', 'REF-SIM-000080');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'TARIK', 'BAHAN_BAKU', 1950000,
          TIMESTAMP '2026-02-26 10:10:00', 'Belanja bahan baku', 'REF-SIM-000081');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'TARIK', 'LAINNYA', 1450000,
          TIMESTAMP '2026-02-26 10:40:00', 'Tarik tunai', 'REF-SIM-000082');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TARIK', 'GAJI', 2100000,
          TIMESTAMP '2026-02-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000083');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TARIK', 'GAJI', 1900000,
          TIMESTAMP '2026-02-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000084');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TARIK', 'GAJI', 2350000,
          TIMESTAMP '2026-02-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000085');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TARIK', 'GAJI', 2850000,
          TIMESTAMP '2026-02-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000086');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'TARIK', 'BAHAN_BAKU', 1300000,
          TIMESTAMP '2026-02-27 15:50:00', 'Belanja bahan baku', 'REF-SIM-000087');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 3450000,
          TIMESTAMP '2026-03-02 15:40:00', 'Setoran hasil penjualan', 'REF-SIM-000088');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TARIK', 'OPERASIONAL', 750000,
          TIMESTAMP '2026-03-03 12:35:00', 'Biaya listrik dan sewa', 'REF-SIM-000089');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'TARIK', 'BAHAN_BAKU', 900000,
          TIMESTAMP '2026-03-03 14:00:00', 'Belanja bahan baku', 'REF-SIM-000090');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'TARIK', 'LAINNYA', 1350000,
          TIMESTAMP '2026-03-04 08:25:00', 'Tarik tunai', 'REF-SIM-000091');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TRANSFER_MASUK', 'TRANSFER', 2500000,
          TIMESTAMP '2026-03-04 15:10:00', 'Pindah dana ke giro usaha (SIM-1000012)', 'REF-SIM-000092');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'TRANSFER_KELUAR', 'TRANSFER', 2500000,
          TIMESTAMP '2026-03-04 15:10:00', 'Pindah dana ke giro usaha (SIM-1000013)', 'REF-SIM-000093');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'SETOR', 'PENJUALAN', 3400000,
          TIMESTAMP '2026-03-05 15:25:00', 'Setoran hasil penjualan', 'REF-SIM-000094');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'SETOR', 'PENJUALAN', 5650000,
          TIMESTAMP '2026-03-06 13:40:00', 'Pembayaran pesanan grosir', 'REF-SIM-000095');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 3450000,
          TIMESTAMP '2026-03-07 12:25:00', 'Setoran hasil penjualan', 'REF-SIM-000096');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000004'), 'TARIK', 'BAHAN_BAKU', 1850000,
          TIMESTAMP '2026-03-07 12:55:00', 'Belanja bahan baku', 'REF-SIM-000097');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 2400000,
          TIMESTAMP '2026-03-07 13:35:00', 'Setoran hasil penjualan', 'REF-SIM-000098');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'TARIK', 'LAINNYA', 250000,
          TIMESTAMP '2026-03-08 09:45:00', 'Tarik tunai', 'REF-SIM-000099');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'SETOR', 'PENJUALAN', 2800000,
          TIMESTAMP '2026-03-08 15:45:00', 'Pembayaran pesanan grosir', 'REF-SIM-000100');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TRANSFER_MASUK', 'TRANSFER', 1250000,
          TIMESTAMP '2026-03-11 10:50:00', 'Bayar pesanan seragam (SIM-1000006)', 'REF-SIM-000101');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'TRANSFER_KELUAR', 'TRANSFER', 1250000,
          TIMESTAMP '2026-03-11 10:50:00', 'Bayar pesanan seragam (SIM-1000007)', 'REF-SIM-000102');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'TARIK', 'LAINNYA', 800000,
          TIMESTAMP '2026-03-13 08:05:00', 'Tarik tunai', 'REF-SIM-000103');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'SETOR', 'PENJUALAN', 2850000,
          TIMESTAMP '2026-03-13 13:30:00', 'Setoran hasil penjualan', 'REF-SIM-000104');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'SETOR', 'PENJUALAN', 2750000,
          TIMESTAMP '2026-03-14 11:50:00', 'Setoran hasil penjualan', 'REF-SIM-000105');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'SETOR', 'PENJUALAN', 5050000,
          TIMESTAMP '2026-03-15 10:30:00', 'Pembayaran pesanan grosir', 'REF-SIM-000106');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 1950000,
          TIMESTAMP '2026-03-15 14:20:00', 'Setoran hasil penjualan', 'REF-SIM-000107');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'SETOR', 'PENJUALAN', 2150000,
          TIMESTAMP '2026-03-16 10:25:00', 'Setoran hasil penjualan', 'REF-SIM-000108');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000012'), 'TARIK', 'BAHAN_BAKU', 1950000,
          TIMESTAMP '2026-03-16 15:05:00', 'Belanja bahan baku', 'REF-SIM-000109');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'TARIK', 'BAHAN_BAKU', 1350000,
          TIMESTAMP '2026-03-17 09:55:00', 'Belanja bahan baku', 'REF-SIM-000110');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TARIK', 'OPERASIONAL', 1000000,
          TIMESTAMP '2026-03-17 15:30:00', 'Biaya listrik dan sewa', 'REF-SIM-000111');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000001'), 'TRANSFER_MASUK', 'TRANSFER', 600000,
          TIMESTAMP '2026-03-19 09:35:00', 'Titip bayar bahan baku (SIM-1000010)', 'REF-SIM-000112');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000010'), 'TRANSFER_KELUAR', 'TRANSFER', 600000,
          TIMESTAMP '2026-03-19 09:35:00', 'Titip bayar bahan baku (SIM-1000001)', 'REF-SIM-000113');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'SETOR', 'PENJUALAN', 4700000,
          TIMESTAMP '2026-03-19 15:05:00', 'Pembayaran pesanan grosir', 'REF-SIM-000114');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TARIK', 'OPERASIONAL', 850000,
          TIMESTAMP '2026-03-20 12:05:00', 'Biaya listrik dan sewa', 'REF-SIM-000115');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'TARIK', 'LAINNYA', 1150000,
          TIMESTAMP '2026-03-23 09:55:00', 'Tarik tunai', 'REF-SIM-000116');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000003'), 'SETOR', 'GAJI', 4250000,
          TIMESTAMP '2026-03-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000117');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000006'), 'SETOR', 'GAJI', 5500000,
          TIMESTAMP '2026-03-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000118');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000008'), 'SETOR', 'GAJI', 5500000,
          TIMESTAMP '2026-03-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000119');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000014'), 'SETOR', 'GAJI', 5250000,
          TIMESTAMP '2026-03-25 08:30:00', 'Gaji bulanan', 'REF-SIM-000120');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TARIK', 'OPERASIONAL', 1150000,
          TIMESTAMP '2026-03-26 11:05:00', 'Biaya listrik dan sewa', 'REF-SIM-000121');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000002'), 'TARIK', 'GAJI', 1900000,
          TIMESTAMP '2026-03-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000122');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000005'), 'TARIK', 'GAJI', 1650000,
          TIMESTAMP '2026-03-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000123');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000007'), 'TARIK', 'GAJI', 2550000,
          TIMESTAMP '2026-03-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000124');
INSERT INTO transactions (account_id, txn_type, category, amount, txn_at, description, ref_no)
  VALUES ((SELECT account_id FROM accounts WHERE account_no = 'SIM-1000013'), 'TARIK', 'GAJI', 2600000,
          TIMESTAMP '2026-03-27 10:00:00', 'Gaji karyawan', 'REF-SIM-000125');

-- Simpan permanen. Auto Commit di SQL Developer for VS Code mati, jadi COMMIT wajib ditulis.
COMMIT;

-- Cek hasil seed
SELECT 'BRANCHES' AS tabel, COUNT(*) AS jumlah FROM branches
UNION ALL SELECT 'CUSTOMERS', COUNT(*) FROM customers
UNION ALL SELECT 'ACCOUNTS', COUNT(*) FROM accounts
UNION ALL SELECT 'TRANSACTIONS', COUNT(*) FROM transactions;

SELECT SUM(balance) AS total_saldo FROM accounts;
