# Checklist

[Kembali ke README](README.md)

## Kriteria Selesai

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
