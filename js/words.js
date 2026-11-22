// Mengubah bilangan cacah 0–1.000.000 menjadi kata dalam Bahasa Indonesia.
const SATU = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];

export function terbilang(n) {
  if (!Number.isInteger(n) || n < 0 || n > 1000000) throw new Error('di luar jangkauan: ' + n);
  if (n < 10) return SATU[n];
  if (n === 10) return 'sepuluh';
  if (n === 11) return 'sebelas';
  if (n < 20) return SATU[n - 10] + ' belas';
  if (n < 100) {
    const p = Math.floor(n / 10), s = n % 10;
    return SATU[p] + ' puluh' + (s ? ' ' + SATU[s] : '');
  }
  if (n < 1000) {
    const r = Math.floor(n / 100), sisa = n % 100;
    return (r === 1 ? 'seratus' : SATU[r] + ' ratus') + (sisa ? ' ' + terbilang(sisa) : '');
  }
  if (n === 1000000) return 'satu juta';
  const ri = Math.floor(n / 1000), sisa = n % 1000;
  return (ri === 1 ? 'seribu' : terbilang(ri) + ' ribu') + (sisa ? ' ' + terbilang(sisa) : '');
}

// Format angka dengan titik ribuan (gaya Indonesia): 1000 -> "1.000"
export const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// Desimal gaya Indonesia: 1234.5 -> "1.234,5"; pembulatan aman untuk tampilan.
export const fmtDec = (x, dp = null) => {
  const r = dp == null ? Math.round(x * 1000) / 1000 : Number(x.toFixed(dp));
  const [i, f] = String(Math.abs(r)).split('.');
  return (r < 0 ? '−' : '') + fmt(i) + (f ? ',' + f : '');
};
// Rupiah: 25000 -> "Rp25.000"
export const rp = (n) => 'Rp' + fmt(n);
