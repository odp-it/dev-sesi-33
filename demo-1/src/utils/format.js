// Uang dari Oracle datang sebagai string ("1500000", "2500.5", bahkan ".5" tanpa nol di depan).
// Kontrak API meminta string dengan dua angka desimal ("1500000.00"), tanpa lewat float.
export function toMoney(value) {
  if (value === null || value === undefined) return null;
  const text = String(value);
  const sign = text.startsWith('-') ? '-' : '';
  const [whole, fraction = ''] = text.replace('-', '').split('.');
  return `${sign}${whole || '0'}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

// Kolom TIMESTAMP menyimpan jam WIB. Format ISO 8601 dibuat di SQL supaya tidak bergantung TZ laptop.
export const isoWib = (column) => `TO_CHAR(${column}, 'YYYY-MM-DD"T"HH24:MI:SS') || '+07:00'`;
