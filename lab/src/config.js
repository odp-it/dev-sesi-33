// Membaca konfigurasi dari environment (diisi lewat `node --env-file=.env`).
const required = ['DB_USER', 'DB_PASSWORD', 'DB_CONNECT_STRING'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  throw new Error(`Variabel environment belum diisi: ${missing.join(', ')}. Cek file .env`);
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: Number(process.env.DB_POOL_MIN ?? 1),
    poolMax: Number(process.env.DB_POOL_MAX ?? 5),
  },
};
