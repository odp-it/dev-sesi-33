// Model Sequelize untuk 4 tabel Tabungan UMKM (dari sesi 32) + relasi 1:N.
import { sequelize } from '../db/sequelize.js';
import { Account, Branch, Customer, Transaction } from './core.js';

Branch.hasMany(Customer, { foreignKey: 'branchId', as: 'customers' });
Customer.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

Customer.hasMany(Account, { foreignKey: 'customerId', as: 'accounts' });
Account.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

export { sequelize, Account, Branch, Customer, Transaction };
