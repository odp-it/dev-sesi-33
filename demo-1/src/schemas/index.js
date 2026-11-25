// Skema validasi input (zod 4). Pesan error berbahasa Indonesia karena dibaca pemakai API.
import { z } from 'zod';

const MONEY = /^\d{1,13}(\.\d{1,2})?$/;

export const idParam = z.object({
  id: z.coerce.number({ error: 'id harus angka' }).int('id harus bilangan bulat').positive('id harus lebih dari 0'),
});

const page = z.coerce.number().int().min(1, 'page minimal 1').default(1);
const pageSize = z.coerce.number().int().min(1, 'pageSize minimal 1').max(50, 'pageSize maksimal 50').default(10);

export const listCustomersQuery = z.object({
  page,
  pageSize,
  q: z.string().trim().max(50).optional(),
  segment: z.enum(['INDIVIDU', 'UMKM'], { error: 'segment harus INDIVIDU atau UMKM' }).optional(),
});

// Sama dengan createCustomerSchema sesi 29: cifNo tidak dikirim, dibuat server (CIF-SIM-<id>).
export const customerBody = z.object({
  fullName: z.string({ error: 'fullName wajib diisi' }).trim().min(3, 'fullName minimal 3 karakter').max(100),
  email: z.email('email tidak valid').max(100),
  phone: z.string({ error: 'phone wajib diisi' }).regex(/^0800-0000-\d{4}$/, 'phone harus berformat 0800-0000-xxxx (nomor simulasi)'),
  segment: z.enum(['INDIVIDU', 'UMKM'], { error: 'segment harus INDIVIDU atau UMKM' }),
  branchId: z.coerce.number({ error: 'branchId harus angka' }).int().positive(),
});

// PUT mengganti semua data yang sama (cifNo tetap).
export const customerUpdateBody = customerBody;

export const transactionsQuery = z
  .object({
    page,
    pageSize: pageSize.default(20),
    from: z.iso.date('from harus tanggal valid format YYYY-MM-DD').optional(),
    to: z.iso.date('to harus tanggal valid format YYYY-MM-DD').optional(),
    category: z.enum(['PENJUALAN', 'BAHAN_BAKU', 'OPERASIONAL', 'GAJI', 'TRANSFER', 'LAINNYA']).optional(),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to, { message: 'from tidak boleh setelah to', path: ['from'] });

const amount = z
  .string({ error: 'amount harus string desimal, contoh "250000.00"' })
  .regex(MONEY, 'amount harus angka desimal maksimal 2 angka di belakang titik')
  .superRefine((value, ctx) => {
    if (!/[1-9]/.test(value)) {
      ctx.addIssue({ code: 'too_small', origin: 'number', minimum: 0, inclusive: false, input: value, message: 'amount harus lebih dari 0' });
    }
  });

export const transferBody = z
  .object({
    fromAccountId: z.number({ error: 'fromAccountId harus angka' }).int().positive(),
    toAccountId: z.number({ error: 'toAccountId harus angka' }).int().positive(),
    amount,
    description: z.string().trim().max(200).optional(),
  })
  .refine((v) => v.fromAccountId !== v.toAccountId, { message: 'Rekening asal dan tujuan tidak boleh sama', path: ['toAccountId'] });

// accountId opsional: tanpa accountId = semua rekening (sama dengan sesi 29).
export const cashflowQuery = z.object({
  accountId: z.coerce.number({ error: 'accountId harus angka' }).int().positive().optional(),
  month: z.string({ error: 'month wajib diisi, contoh 2026-03' }).regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month harus format YYYY-MM'),
});
