// Menjalankan aplikasi (lapisan orm) di port acak untuk test dan cek otomatis. File ini sudah lengkap, biarkan apa adanya.
import { once } from 'node:events';
import oracledb from 'oracledb';

export async function startServer() {
  process.env.DATA_LAYER = 'orm';
  // Login dicek sekali dengan satu koneksi SEBELUM Sequelize dimuat. Kalau gagal, pool tidak pernah dibuat:
  // pool yang dibiarkan hidup dengan password salah bisa mengulang login dan mengunci user database.
  const probe = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  });
  await probe.close();
  const { app } = await import('../src/app.js'); // di sini kode aplikasi dan src/alp/ tim ikut dimuat
  const { closeDb, initDb } = await import('../src/db/index.js');
  const { sequelize } = await import('../src/db/sequelize.js');
  try {
    await initDb();
  } catch (err) {
    await closeDb().catch(() => {});
    throw err;
  }
  const server = app.listen(0, '127.0.0.1'); // port 0: dipilih sistem, tidak bentrok dengan dev:sql / dev:orm
  await once(server, 'listening');
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    sequelize,
    async stop() {
      server.closeAllConnections();
      server.close();
      await closeDb();
    },
  };
}
