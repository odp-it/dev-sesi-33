// Lab: route endpoint ALP tim. Sudah dipasang di /api/alp (lihat ../app.js), hanya aktif di lapisan orm.
// Pola validasi: ../middlewares/validate.js + zod. Error: AppError dan notFound() dari ../utils/app-error.js.
//
// TODO LAB 5:
//   GET /<resource>              ?page&pageSize&<filter>  -> { data: [{ id, ... }], page, pageSize, total }
//   GET /<resource>/:id                                   -> { id, ... } atau 404 NOT_FOUND
//   GET /<resource>/:id/<anak>                            -> { data: [{ id, ... }] } atau 404 NOT_FOUND
//   id bukan bilangan bulat positif -> 400 VALIDATION_ERROR
import { Router } from 'express';

export const alpRouter = Router();
