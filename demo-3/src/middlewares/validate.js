// Validasi params, query, dan body dengan zod. Hasil yang sudah bersih disimpan di req.valid.
// Express 5: req.query hanya getter, jadi hasil validasi tidak ditulis balik ke req.query.
import { AppError } from '../utils/app-error.js';

export function validate(schemas) {
  return (req, res, next) => {
    req.valid = {};
    const details = [];
    for (const part of ['params', 'query', 'body']) {
      if (!schemas[part]) continue;
      const result = schemas[part].safeParse(req[part] ?? {});
      if (result.success) {
        req.valid[part] = result.data;
      } else {
        for (const issue of result.error.issues) {
          details.push({ field: issue.path.join('.') || part, issue: issue.code, message: issue.message });
        }
      }
    }
    if (details.length) {
      return next(new AppError(400, 'VALIDATION_ERROR', details[0].message, details));
    }
    next();
  };
}
