// Lab: test untuk endpoint ALP tim (lapisan orm). Jalankan dengan: npm run test:alp
// node:test dan node:assert bawaan Node.js, tidak ada paket tambahan.
// Ganti setiap test.todo dengan test yang benar-benar memanggil endpoint tim dan memeriksa status serta isi respons.
// Test hanya memakai GET (atau mengembalikan data yang diubahnya).
//
// Contoh pola:
//   test('GET /health 200 dan lapisan orm', async () => {
//     const res = await fetch(`${server.baseUrl}/health`);
//     assert.equal(res.status, 200);
//     assert.equal((await res.json()).layer, 'orm');
//   });
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startServer } from './server-uji.js';

let server;

before(async () => {
  server = await startServer();
});

after(async () => {
  await server?.stop();
});

test.todo('daftar resource: 200, total sesuai jumlah data contoh');
test.todo('pagination: halaman 2 berisi baris yang benar');
test.todo('filter: hanya baris yang cocok yang keluar');
test.todo('detail: id yang ada 200, id yang tidak ada 404 NOT_FOUND');
test.todo('input tidak valid: 400 VALIDATION_ERROR');
