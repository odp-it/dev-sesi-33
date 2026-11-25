// Model untuk 4 tabel yang SUDAH ADA (dibuat 01-schema.sql). Tidak pernah di-sync.
// Oracle menyimpan nama tanpa kutip dalam huruf besar, Sequelize selalu memberi kutip:
// jadi tableName dan field ditulis huruf besar persis seperti di database.
// Nama unique key = nama constraint di database, supaya error ORA-00001 bisa dipetakan ke field.
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

const common = { timestamps: false, freezeTableName: true };

export const Branch = sequelize.define('Branch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'BRANCH_ID' },
  branchCode: { type: DataTypes.STRING(20), allowNull: false, unique: 'UQ_BRANCHES_CODE', field: 'BRANCH_CODE' },
  branchName: { type: DataTypes.STRING(100), allowNull: false, field: 'BRANCH_NAME' },
  city: { type: DataTypes.STRING(50), allowNull: false, field: 'CITY' },
}, { ...common, tableName: 'BRANCHES' });

export const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'CUSTOMER_ID' },
  cifNo: { type: DataTypes.STRING(20), allowNull: false, unique: 'UQ_CUSTOMERS_CIF', field: 'CIF_NO' },
  fullName: {
    type: DataTypes.STRING(100), allowNull: false, field: 'FULL_NAME',
    validate: { len: { args: [3, 100], msg: 'fullName 3-100 karakter' } },
  },
  email: {
    type: DataTypes.STRING(100), unique: 'UQ_CUSTOMERS_EMAIL', field: 'EMAIL',
    validate: { isEmail: { msg: 'email tidak valid' } },
  },
  phone: { type: DataTypes.STRING(20), field: 'PHONE' },
  segment: {
    type: DataTypes.STRING(10), allowNull: false, field: 'SEGMENT',
    validate: { isIn: { args: [['INDIVIDU', 'UMKM']], msg: 'segment harus INDIVIDU atau UMKM' } },
  },
  branchId: { type: DataTypes.INTEGER, allowNull: false, field: 'BRANCH_ID' },
  createdAt: { type: DataTypes.DATE, field: 'CREATED_AT' },
}, { ...common, tableName: 'CUSTOMERS' });

export const Account = sequelize.define('Account', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ACCOUNT_ID' },
  accountNo: { type: DataTypes.STRING(20), allowNull: false, unique: 'UQ_ACCOUNTS_NO', field: 'ACCOUNT_NO' },
  customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'CUSTOMER_ID' },
  product: { type: DataTypes.STRING(10), allowNull: false, field: 'PRODUCT' },
  balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'BALANCE' },
  status: { type: DataTypes.STRING(10), allowNull: false, field: 'STATUS' },
  openedAt: { type: DataTypes.DATE, field: 'OPENED_AT' },
}, { ...common, tableName: 'ACCOUNTS' });

export const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'TXN_ID' },
  accountId: { type: DataTypes.INTEGER, allowNull: false, field: 'ACCOUNT_ID' },
  txnType: { type: DataTypes.STRING(20), allowNull: false, field: 'TXN_TYPE' },
  category: { type: DataTypes.STRING(20), allowNull: false, field: 'CATEGORY' },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'AMOUNT' },
  txnAt: { type: DataTypes.DATE, field: 'TXN_AT' },
  description: { type: DataTypes.STRING(200), field: 'DESCRIPTION' },
  refNo: { type: DataTypes.STRING(20), allowNull: false, unique: 'UQ_TRANSACTIONS_REF', field: 'REF_NO' },
}, { ...common, tableName: 'TRANSACTIONS' });
