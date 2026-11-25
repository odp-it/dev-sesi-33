// Titik masuk: buka koneksi database dulu, baru terima request.
import { config } from './config.js';
import { closeDb, DATA_LAYER, initDb } from './db/index.js';
import { app } from './app.js';

await initDb();
const server = app.listen(config.port, async (err) => {
  if (err) {
    // Express 5 memanggil callback ini juga saat gagal listen (mis. port sudah dipakai).
    console.error(`Server gagal start di port ${config.port}: ${err.message}`);
    await closeDb();
    process.exit(1);
  }
  console.log(`API Tabungan UMKM jalan di http://localhost:${config.port} (DATA_LAYER=${DATA_LAYER})`);
  console.log(`Swagger UI: http://localhost:${config.port}/docs`);
});

let closing = false;
async function shutdown(signal) {
  if (closing) return; // sinyal kedua (mis. dari --watch) diabaikan
  closing = true;
  console.log(`${signal} diterima, menutup server dan koneksi database...`);
  server.close();
  await closeDb();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
