// Lapisan data ORM: satu instance Sequelize (di dalamnya pool node-oracledb sendiri).
import oracledb from 'oracledb';
import { Sequelize } from 'sequelize';

if (process.env.TZ !== 'UTC') {
  console.warn('Peringatan: TZ bukan UTC. Tambahkan TZ=UTC di .env (wajib untuk dialect Oracle).');
}

// Uang NUMBER(15,2) diambil sebagai string (Sequelize dialect Oracle bawaannya mengembalikan number).
oracledb.fetchTypeHandler = (meta) => {
  if (meta.dbType === oracledb.DB_TYPE_NUMBER && meta.scale > 0) return { type: oracledb.STRING };
  return undefined;
};

export const sequelize = new Sequelize({
  dialect: 'oracle',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOptions: { connectString: process.env.DB_CONNECT_STRING },
  pool: { min: 1, max: 5 },
  logging: process.env.DB_LOG_SQL === 'true' ? (sql) => console.log(`  SQL> ${sql}`) : false,
});

export async function initDb() {
  await sequelize.authenticate();
}

export async function closeDb() {
  await sequelize.close();
}

export async function ping() {
  await sequelize.query('SELECT 1 FROM dual');
  return { layer: 'orm', db: 'up' };
}
