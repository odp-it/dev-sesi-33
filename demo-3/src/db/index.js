// Pilih lapisan data dari DATA_LAYER: "sql" (node-oracledb langsung, sesi 31) atau "orm" (Sequelize).
// Hanya satu yang dimuat: pengaturan global node-oracledb kedua lapisan berbeda.
export const DATA_LAYER = process.env.DATA_LAYER === 'orm' ? 'orm' : 'sql';

const db = DATA_LAYER === 'orm' ? await import('./sequelize.js') : await import('./oracle.js');

export const { initDb, closeDb, ping } = db;
