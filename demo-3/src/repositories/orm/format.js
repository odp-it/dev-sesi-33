// Dengan TZ=UTC, Sequelize membaca TIMESTAMP (jam WIB tanpa zona) sebagai Date UTC dengan angka jam yang sama.
// Ambil angkanya, tempel +07:00: hasilnya sama persis dengan TO_CHAR(...) || '+07:00' di lapisan SQL.
export const toWib = (date) => (date ? `${date.toISOString().slice(0, 19)}+07:00` : null);

// Jam WIB sekarang sebagai Date "jam dinding" (dipakai saat menulis TIMESTAMP).
export const nowWib = () => new Date(Date.now() + 7 * 60 * 60 * 1000);

// Bandingkan uang tanpa float: "250000.5" -> 25000050n (sen).
export function toCents(value) {
  const [whole, fraction = ''] = String(value).split('.');
  return BigInt(whole || '0') * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}
