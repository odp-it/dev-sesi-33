// Lab: model Sequelize untuk dua tabel ALP tim (induk dan anak) yang SUDAH ADA di database.
// Pola sama dengan ../models/core.js dan ../models/index.js. Jangan memanggil sync().
//
// TODO LAB 1:
//   1. sequelize.define untuk tabel induk dan tabel anak: tableName dan field ditulis HURUF BESAR persis
//      seperti di database, { timestamps: false, freezeTableName: true }, primary key dengan field kolom ID.
//   2. Relasi 1:N dua arah: Induk.hasMany(Anak, { foreignKey, as }) dan Anak.belongsTo(Induk, { foreignKey, as }).
//   3. Export kedua model.
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';
