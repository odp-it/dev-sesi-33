// Error handler terpusat: semua error jadi format { error: { code, message, details } }.
import { DatabaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';
import { AppError } from '../utils/app-error.js';

// Nama constraint Oracle -> field di kontrak API.
const UNIQUE_FIELDS = {
  UQ_CUSTOMERS_CIF: 'cifNo',
  UQ_CUSTOMERS_EMAIL: 'email',
  UQ_ACCOUNTS_NO: 'accountNo',
  UQ_TRANSACTIONS_REF: 'refNo',
};

const FK_FIELDS = {
  FK_CUSTOMERS_BRANCH: 'branchId',
  FK_ACCOUNTS_CUSTOMER: 'customerId',
  FK_TRANSACTIONS_ACCOUNT: 'accountId',
};

// "ORA-00001: unique constraint (ALP_DEV.UQ_CUSTOMERS_EMAIL) violated ..." -> "UQ_CUSTOMERS_EMAIL"
const constraintOf = (message) => message.match(/\(\w+\.(\w+)\)/)?.[1];

function fromOracle(err) {
  switch (err.errorNum) {
    case 1: {
      const field = UNIQUE_FIELDS[constraintOf(err.message)];
      const message = `${field ?? 'Data'} sudah dipakai`;
      return new AppError(409, 'DUPLICATE', message, field ? [{ field, issue: 'duplicate', message }] : undefined);
    }
    case 2292:
      if (constraintOf(err.message) === 'FK_ACCOUNTS_CUSTOMER') {
        return new AppError(409, 'CUSTOMER_HAS_ACCOUNTS', 'Nasabah masih punya rekening, tidak bisa dihapus');
      }
      return new AppError(409, 'HAS_RELATED_DATA', 'Data masih dipakai tabel lain');
    case 2291: {
      const field = FK_FIELDS[constraintOf(err.message)];
      const message = `${field ?? 'Data referensi'} tidak ditemukan`;
      return new AppError(400, 'VALIDATION_ERROR', message, field ? [{ field, issue: 'not_found', message }] : undefined);
    }
    default:
      return null;
  }
}

// Kolom database -> field kontrak API (Sequelize melaporkan nama kolom, mis. "CIF_NO").
const COLUMN_FIELDS = { CIF_NO: 'cifNo', EMAIL: 'email', ACCOUNT_NO: 'accountNo', REF_NO: 'refNo' };

// Error dari Sequelize (lapisan ORM). Dicek dari yang paling khusus.
// eslint-disable-next-line no-unused-vars
function fromSequelize(err) {
  // TODO 1.7: UniqueConstraintError      -> 409 DUPLICATE, field dari COLUMN_FIELDS[err.fields[0]], details { field, issue, message }
  // TODO 1.7: ForeignKeyConstraintError  -> fromOracle(err.parent)  (ORA-02292 / ORA-02291)
  // TODO 1.7: ValidationError (model)    -> 400 VALIDATION_ERROR dengan details per field
  // TODO 1.7: DatabaseError lain         -> fromOracle(err.parent) kalau ada errorNum
  // Urutan penting: UniqueConstraintError adalah turunan ValidationError.
  return null;
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let appError = err instanceof AppError ? err : null;
  if (!appError && err.type === 'entity.parse.failed') {
    appError = new AppError(400, 'VALIDATION_ERROR', 'Body bukan JSON yang valid');
  }
  if (!appError && err.errorNum) appError = fromOracle(err);
  if (!appError) appError = fromSequelize(err);

  if (!appError) {
    console.error(err);
    appError = new AppError(500, 'INTERNAL_ERROR', 'Terjadi kesalahan di server');
  }
  const body = { error: { code: appError.code, message: appError.message } };
  if (appError.details) body.error.details = appError.details;
  res.status(appError.status).json(body);
}

export function notFoundRoute(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Endpoint ${req.method} ${req.path} tidak ada` } });
}
