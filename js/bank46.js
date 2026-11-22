// Generator soal kelas 4–6 (51 topik). Mendaftarkan diri ke GENERATORS di bank.js.
// Setiap soal membawa `math` agar kuncinya bisa dihitung ulang oleh tests/verify.mjs.
import { GENERATORS as G, numOpts, textOpts, item, uniq, NAMES, polyCells, noCarrySum, smallFromBig } from './bank.js';
import { fmt, fmtDec, rp, terbilang } from './words.js';
import { topicsOf } from './curriculum.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const PV = ['satuan', 'puluhan', 'ratusan', 'ribuan', 'puluh ribuan', 'ratus ribuan'];

// ── pecahan ──
// Bentuk baku: pecahan paling sederhana; lebih dari 1 ditulis sebagai pecahan campuran ("1 1/2"), bilangan bulat tanpa pecahan.
function fracStr(n, d) {
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return String(n);
  if (n > d) return `${Math.floor(n / d)} ${n % d}/${d}`;
  return `${n}/${d}`;
}
const fracVal = (s) => { const p = String(s).trim().split(' '); if (p.length === 2) { const [a, b] = p[1].split('/').map(Number); return Number(p[0]) + a / b; } if (s.includes('/')) { const [a, b] = s.split('/').map(Number); return a / b; } return Number(s); };
// Opsi pecahan: buang pengecoh yang nilainya sama dengan jawaban atau satu sama lain.
function fracOpts(rng, ans, cands, K) {
  const out = [ans]; const vals = [fracVal(ans)];
  for (const c of rng.shuffle(uniq(cands))) {
    if (out.length >= K) break;
    if (!c || /(^|\s)0\//.test(c) || /\/0$/.test(c) || /\/1$/.test(c)) continue;
    const v = fracVal(c); if (!(v > 0) || vals.some((x) => Math.abs(x - v) < 1e-9)) continue;
    out.push(c); vals.push(v);
  }
  const v0 = vals[0], den = ans.includes('/') ? Number(ans.split('/').pop()) : 4;
  for (let k = 1; out.length < K && k < 40; k++) for (const sgn of [1, -1]) {
    const num = Math.round(v0 * den) + sgn * k; if (num <= 0 || out.length >= K) continue;
    const c = fracStr(num, den); const v = fracVal(c); if (!vals.some((x) => Math.abs(x - v) < 1e-9)) { out.push(c); vals.push(v); }
  }
  return rng.shuffle(out).map((s) => ({ label: s, value: s }));
}
// Opsi desimal: nilai dibulatkan agar tidak ada galat pecahan biner; label gaya Indonesia (koma).
function decOpts(rng, ans, cands, K, suffix = '') {
  const r = (x) => Math.round(x * 1000) / 1000; const out = [r(ans)];
  for (const c of rng.shuffle(cands.map(r))) if (out.length < K && c >= 0 && !out.includes(c)) out.push(c);
  for (const d of [0.1, -0.1, 0.2, 1, 0.01]) { const c = r(ans + d); if (out.length < K && c >= 0 && !out.includes(c)) out.push(c); }
  return out.sort((a, b) => a - b).map((v) => ({ label: fmtDec(v) + suffix, value: v }));
}
const withUnit = (opts, u) => opts.map((o) => ({ ...o, label: `${o.label} ${u}` }));
const signed = (n) => (n < 0 ? `−${-n}` : String(n));

// Urutan sebagai pilihan: satu benar + permutasi lain.
function orderOpts(rng, vals, asc, K, f = fmt) {
  const sorted = vals.slice().sort((a, b) => (asc ? a - b : b - a));
  const right = sorted.map(f).join('; ');
  const perms = new Set();
  while (perms.size < K - 1) { const p = rng.shuffle(vals.slice()).map(f).join('; '); if (p !== right) perms.add(p); }
  return { right, opts: rng.shuffle([right, ...perms]).map((x) => ({ label: x, value: x })) };
}
function oneCorrect(rng, ans, pool, isRight, K) {
  const wrong = rng.shuffle(uniq(pool.filter((x) => x !== ans && !isRight(x)))).slice(0, K - 1);
  return [ans, ...wrong].sort((a, b) => a - b).map((x) => ({ label: fmt(x), value: x }));
}

// ===================== KELAS 4 =====================
G['4.1.1'] = (rng, lv, K) => {
  const n = rng.int(1, 9) * 1000 + rng.int(0, 9) * 100 + (rng.chance(0.4) ? 0 : rng.int(1, 9)) * 10 + rng.int(0, 9);
  const d = String(n).split('').map(Number);
  if (lv === 1) {
    const swap = Number(`${d[0]}${d[2]}${d[1]}${d[3]}`);
    return item({ q: 'Bilangan yang ditunjukkan tabel nilai tempat ini adalah …', v: { t: 'pv', n }, ans: n, opts: numOpts(rng, n, [swap, Number(`${d[0]}${d[1]}${d[3]}${d[2]}`), n + 1000, Number(d.filter((x, i) => i === 0 || x).join(''))].filter((x) => x !== n), K, 0, 99999),
      math: { kind: 'expr', e: `${d[0]}*1000+${d[1]}*100+${d[2]}*10+${d[3]}` }, hint: 'Baca dari ribuan, lalu ratusan, puluhan, dan satuan.', explain: `${d[0]} ribuan, ${d[1]} ratusan, ${d[2]} puluhan, dan ${d[3]} satuan membentuk ${fmt(n)}.` });
  }
  if (lv === 2) {
    let p = rng.int(1, 3); let m = n; if (Math.floor(m / 10 ** p) % 10 === 0) m += 10 ** p;
    const dg = Math.floor(m / 10 ** p) % 10, val = dg * 10 ** p;
    return item({ q: `Nilai angka ${dg} pada bilangan ${fmt(m)} adalah …`, v: { t: 'pv', n: m, hl: p }, ans: val, opts: numOpts(rng, val, [dg, dg * 10 ** (p - 1), dg * 10 ** ((p + 1) % 4 || 4), m].filter((x) => x !== val), K, 0, 99999),
      math: { kind: 'placeval', n: m, place: p }, hint: 'Lihat kolom tempat angka itu berada.', explain: `Angka ${dg} berada di tempat ${PV[p]}, jadi nilainya ${fmt(val)}.` });
  }
  const m = rng.int(1, 9) * 1000 + (rng.chance(0.5) ? 0 : rng.int(1, 9)) * 100 + rng.int(0, 9) * 10 + rng.int(1, 9);
  const ds = String(m).split('').map(Number);
  const wrongs = [Number(`${ds[0]}${ds[2]}${ds[3]}`), ds[0] * 10000 + (m % 1000), Number(`${ds[0]}${ds[1]}${ds[3]}${ds[2]}`), m + 100];
  return item({ q: `Lambang bilangan dari "${terbilang(m)}" adalah …`, v: null, ans: m, opts: numOpts(rng, m, wrongs.filter((x) => x !== m), K, 0, 99999),
    math: { kind: 'word', word: terbilang(m) }, hint: 'Tulis ribuan dulu, lalu isi ratusan, puluhan, dan satuan. Tempat yang kosong diisi 0.', explain: `"${cap(terbilang(m))}" ditulis ${fmt(m)}.` });
};

G['4.1.2'] = (rng, lv, K) => {
  if (lv === 1) {
    const a = rng.int(1000, 9999); let b = rng.chance(0.5) ? Math.floor(a / 100) * 100 + rng.int(0, 99) : rng.int(1000, 9999); if (rng.chance(0.12)) b = a;
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return item({ q: 'Tanda yang tepat untuk mengisi kotak adalah …', v: { t: 'eq', text: `${fmt(a)} □ ${fmt(b)}` }, ans, opts: ['>', '<', '='].map((s) => ({ label: s, value: s })), fixedOpts: true,
      math: { kind: 'cmp', a, b }, hint: 'Bandingkan dari angka paling kiri.', explain: `${fmt(a)} ${ans === '>' ? 'lebih besar dari' : ans === '<' ? 'lebih kecil dari' : 'sama dengan'} ${fmt(b)}.` });
  }
  if (lv === 2) {
    const base = rng.int(1, 9) * 1000; const vals = uniq([...Array(K)].map(() => base + rng.int(0, 999)));
    while (vals.length < K) vals.push(base + rng.int(0, 999));
    const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
    return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: uniq(vals).sort((a, b) => a - b).map((x) => ({ label: fmt(x), value: x })),
      math: { kind: big ? 'max' : 'min', vals }, hint: 'Ribuannya sama. Bandingkan ratusannya, lalu puluhan.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${fmt(ans)}.` });
  }
  const vals = uniq([...Array(4)].map(() => rng.int(1000, 9999))); while (vals.length < 4) vals.push(rng.int(1000, 9999));
  const asc = rng.chance(0.5); const { right, opts } = orderOpts(rng, vals, asc, K);
  return item({ q: `Urutan bilangan dari yang ${asc ? 'terkecil' : 'terbesar'} adalah …`, v: null, ans: right, opts, math: { kind: 'orderf', vals, asc }, hint: 'Cari bilangan yang paling kecil atau paling besar dulu.', explain: `Urutannya: ${right}.` });
};

G['4.1.3'] = (rng, lv, K) => {
  const r = rng.int(1, 9), ra = rng.int(0, 9), pu = rng.int(0, 9), sa = rng.int(1, 9); const n = r * 1000 + ra * 100 + pu * 10 + sa;
  if (lv === 1) {
    const parts = [r * 1000, ra * 100, pu * 10, sa].filter((x) => x);
    return item({ q: `${parts.map(fmt).join(' + ')} = …`, v: null, ans: n, opts: numOpts(rng, n, [r * 1000 + pu * 100 + ra * 10 + sa, r + ra + pu + sa, n + 10, r * 100 + ra * 10 + pu].filter((x) => x !== n), K, 0, 99999),
      math: { kind: 'expr', e: parts.join('+') }, hint: 'Gabungkan ribuan, ratusan, puluhan, dan satuan.', explain: `${parts.map(fmt).join(' + ')} = ${fmt(n)}.` });
  }
  if (lv === 2) {
    const ra2 = ra || 3; const m = r * 1000 + ra2 * 100 + sa; const miss = ra2 * 100;
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${fmt(m)} = ${fmt(r * 1000)} + □ + ${sa}` }, ans: miss, opts: numOpts(rng, miss, [ra2, ra2 * 10, ra2 * 1000], K, 0, 99999),
      math: { kind: 'expr', e: `${m}-${r * 1000}-${sa}` }, hint: 'Angka yang hilang ada di tempat ratusan.', explain: `${fmt(m)} = ${fmt(r * 1000)} + ${fmt(miss)} + ${sa}.` });
  }
  const m = r * 1000 + (rng.chance(0.5) ? 0 : ra * 100) + pu * 10 + (rng.chance(0.4) ? 0 : sa);
  const ds = String(m).padStart(4, '0').split('').map(Number);
  const parts = ds.map((x, i) => x * 10 ** (3 - i)).filter((x) => x);
  const right = parts.map(fmt).join(' + ');
  const wrong1 = ds.map((x, i) => x * 10 ** (2 - i < 0 ? 0 : 3 - i - (i === 1 ? 1 : 0))).filter((x) => x).map(fmt).join(' + ');
  const wrong2 = parts.map((x, i) => (i === parts.length - 1 && x >= 10 ? x / 10 : x)).map(fmt).join(' + ');
  const wrong3 = parts.map((x, i) => (i === 0 ? x / 10 : x)).map(fmt).join(' + ');
  const wrong4 = parts.map((x) => (x < 1000 && x >= 10 ? x * 10 : x)).map(fmt).join(' + ');
  const pool = uniq([wrong1, wrong2, wrong3, wrong4].filter((w) => w !== right && w.split(' + ').reduce((s, x) => s + Number(x.replace(/\./g, '')), 0) !== m));
  return item({ q: `Bentuk panjang dari ${fmt(m)} adalah …`, v: null, ans: right, opts: rng.shuffle([right, ...pool.slice(0, K - 1)]).map((x) => ({ label: x, value: x })),
    math: { kind: 'sumstr', n: m }, hint: 'Jumlahkan setiap pilihan. Hasilnya harus sama dengan bilangan itu.', explain: `${fmt(m)} = ${right}.` });
};

G['4.1.4'] = (rng, lv, K) => {
  const [n1, n2] = rng.sample(NAMES, 2);
  if (lv === 1) {
    const a = rng.int(150, 600), b = rng.int(100, 950 - a), s = a + b;
    return item({ q: `Perpustakaan menerima ${fmt(a)} buku pada bulan Juli dan ${fmt(b)} buku pada bulan Agustus. Berapa buku yang diterima seluruhnya?`, v: null, ans: s,
      opts: numOpts(rng, s, [noCarrySum(a, b), s + 10, s - 10, s + 100], K, 0, 2000), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Seluruhnya berarti dijumlahkan.', explain: `${fmt(a)} + ${fmt(b)} = ${fmt(s)} buku.` });
  }
  if (lv === 2) {
    const a = rng.int(400, 999), b = rng.int(120, a - 60), d = a - b;
    return item({ q: `Panitia menyiapkan ${fmt(a)} botol air. Sebanyak ${fmt(b)} botol sudah dibagikan. Berapa botol yang belum dibagikan?`, v: null, ans: d,
      opts: numOpts(rng, d, [smallFromBig(a, b), d + 10, d - 10, d + 100], K, 0, 2000), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Yang belum dibagikan = semua dikurangi yang sudah dibagikan.', explain: `${fmt(a)} − ${fmt(b)} = ${fmt(d)} botol.` });
  }
  const a = rng.int(200, 600), b = rng.int(100, 300), c = rng.int(50, a + b - 50); const r = a + b - c;
  return item({ q: `${n1} punya ${fmt(a)} kelereng. Ia membeli ${fmt(b)} kelereng lagi, lalu memberikan ${fmt(c)} kelereng kepada ${n2}. Berapa kelereng ${n1} sekarang?`, v: null, ans: r,
    opts: numOpts(rng, r, [a + b + c, a + b, a - c, r + 10], K, 0, 2000), math: { kind: 'expr', e: `${a}+${b}-${c}` }, hint: 'Kerjakan dua langkah: tambah dulu, lalu kurangi.', explain: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}, lalu ${fmt(a + b)} − ${fmt(c)} = ${fmt(r)}.` });
};

G['4.1.5'] = (rng, lv, K) => {
  if (lv === 1) { const g = rng.int(4, 9), n = rng.int(6, 11), p = g * n;
    return item({ q: `Ada ${g} kotak pensil. Setiap kotak berisi ${n} pensil. Berapa banyak pensil seluruhnya?`, v: null, ans: p, opts: numOpts(rng, p, [g + n, g * (n + 1), (g - 1) * n, p + 10], K, 0, 200),
      math: { kind: 'expr', e: `${g}*${n}` }, hint: 'Banyak kotak dikali isi setiap kotak.', explain: `${g} × ${n} = ${p} pensil.` }); }
  if (lv === 2) { const k = rng.int(4, 9), q = rng.int(4, 11), n = k * q;
    return item({ q: `Ibu membuat ${n} kue. Setiap toples diisi ${k} kue. Berapa toples yang diperlukan?`, v: null, ans: q, opts: numOpts(rng, q, [n - k, n + k, q + 1, k], K, 1, 200),
      math: { kind: 'expr', e: `${n}/${k}` }, hint: `Berapa kali ${k} sama dengan ${n}?`, explain: `${n} : ${k} = ${q} toples, karena ${q} × ${k} = ${n}.` }); }
  const g = rng.int(3, 8), n = rng.pick([4, 6, 8, 10, 12]), k = rng.pick([2, 3, 4, 6].filter((x) => (g * n) % x === 0 && x !== g)); const tot = g * n, each = tot / k;
  return item({ q: `Ayah membeli ${g} bungkus permen. Setiap bungkus berisi ${n} permen. Semua permen dibagikan sama banyak kepada ${k} anak. Berapa permen yang diterima setiap anak?`, v: null, ans: each,
    opts: numOpts(rng, each, [tot, g * n * k, Math.round(n / k) || 1, each + 1], K, 1, 400), math: { kind: 'expr', e: `${g}*${n}/${k}` }, hint: 'Hitung semua permen dulu, lalu bagi.', explain: `${g} × ${n} = ${tot} permen. ${tot} : ${k} = ${each} permen.` });
};

G['4.1.6'] = (rng, lv, K) => {
  if (lv === 1) { const n = rng.pick([24, 30, 36, 40, 42, 48, 56, 60, 72, 84, 90]); const facs = [...Array(n)].map((_, i) => i + 1).filter((d) => n % d === 0 && d > 1 && d < n); const ans = rng.pick(facs);
    return item({ q: `Manakah yang merupakan faktor dari ${n}?`, v: null, ans, opts: oneCorrect(rng, ans, [...Array(n - 2)].map((_, i) => i + 2), (x) => n % x === 0, K),
      math: { kind: 'factorof', n, vals: null }, hint: `Faktor dari ${n} dapat membagi ${n} tanpa sisa.`, explain: `${n} : ${ans} = ${n / ans} tanpa sisa, jadi ${ans} adalah faktor dari ${n}.` }); }
  if (lv === 2) { const m = rng.int(6, 15); const ans = m * rng.int(3, 9);
    return item({ q: `Manakah yang merupakan kelipatan ${m}?`, v: null, ans, opts: oneCorrect(rng, ans, [...Array(90)].map((_, i) => i + 10).filter((x) => Math.abs(x - ans) < 25), (x) => x % m === 0, K),
      math: { kind: 'multipleof', m, vals: null }, hint: `Kelipatan ${m} adalah hasil ${m} × 1, ${m} × 2, ${m} × 3, dan seterusnya.`, explain: `${ans} = ${m} × ${ans / m}, jadi ${ans} kelipatan ${m}.` }); }
  const n = rng.pick([12, 16, 18, 20, 24, 28, 30, 36]); const c = [...Array(n)].filter((_, i) => n % (i + 1) === 0).length;
  return item({ q: `Banyak faktor dari ${n} adalah …`, v: null, ans: c, opts: numOpts(rng, c, [c - 1, c - 2, c + 1, c + 2], K, 1, 20),
    math: { kind: 'divcount', n }, hint: `Tulis pasangan perkalian yang hasilnya ${n}, mulai dari 1 × ${n}.`, explain: `Faktor dari ${n} adalah ${[...Array(n)].map((_, i) => i + 1).filter((d) => n % d === 0).join(', ')}. Ada ${c} faktor.` });
};

G['4.1.7'] = (rng, lv, K) => {
  if (lv === 3) {
    const d = rng.int(3, 9), up = rng.chance(0.6), a0 = up ? rng.int(1, 20) : rng.int(60, 99); const seq = [0, 1, 2, 3].map((i) => a0 + (up ? i : -i) * d);
    const right = `${up ? 'ditambah' : 'dikurangi'} ${d}`;
    const opts = uniq([right, `${up ? 'ditambah' : 'dikurangi'} ${d + 1}`, `${up ? 'dikurangi' : 'ditambah'} ${d}`, `${up ? 'ditambah' : 'dikurangi'} ${d - 1}`]).slice(0, K);
    return item({ q: `Aturan pola bilangan ${seq.join(', ')} adalah …`, v: null, ans: right, opts: rng.shuffle(opts).map((x) => ({ label: cap(x), value: x })),
      math: { kind: 'rule', seq }, hint: 'Hitung selisih dua bilangan yang berurutan.', explain: up ? `${seq[1]} − ${seq[0]} = ${d}. Jadi, setiap langkah ${right}.` : `${seq[0]} − ${seq[1]} = ${d}. Jadi, setiap langkah ${right}.` });
  }
  const d = rng.int(3, 12), up = lv === 1 || rng.chance(0.4), a0 = up ? rng.int(1, 30) : rng.int(70, 100); const seq = [0, 1, 2, 3, 4].map((i) => a0 + (up ? i : -i) * d);
  if (seq.some((x) => x < 0 || x > 100)) return G['4.1.7'](rng, lv, K);
  const miss = lv === 1 ? 4 : rng.int(1, 3); const ans = seq[miss]; const shown = seq.map((x, i) => (i === miss ? '…' : x));
  return item({ q: `Bilangan yang tepat untuk melengkapi pola ${shown.join(', ')} adalah …`, v: null, ans, opts: numOpts(rng, ans, [ans + 1, ans - 1, ans + d, ans - d], K, 0, 120),
    math: { kind: 'seqmiss', seq: seq.map((x, i) => (i === miss ? null : x)) }, hint: 'Cari selisih dua bilangan yang berdekatan.', explain: `Polanya ${up ? 'bertambah' : 'berkurang'} ${d}. Bilangan yang tepat adalah ${ans}.` });
};

G['4.1.8'] = (rng, lv, K) => {
  if (lv === 1) { const a = rng.int(15, 60), b = rng.int(15, 40);
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${a} + ${b} = ${b} + □` }, ans: a, opts: numOpts(rng, a, [b, a + b, a - b > 0 ? a - b : a + 1], K, 0, 200),
      math: { kind: 'expr', e: `${a}+${b}-${b}` }, hint: 'Urutan bilangan yang dijumlahkan boleh ditukar.', explain: `${a} + ${b} = ${b} + ${a}. Ini sifat pertukaran.` }); }
  if (lv === 2) { const a = rng.int(10, 40), b = rng.int(11, 29), c = rng.int(1, 9);
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `(${a} + ${b}) + ${c} = ${a} + (□ + ${c})` }, ans: b, opts: numOpts(rng, b, [a, b + c, c], K, 0, 200),
      math: { kind: 'expr', e: `${b}` }, hint: 'Pada penjumlahan, pengelompokan boleh dipindah. Bilangannya tetap sama.', explain: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c}). Ini sifat pengelompokan.` }); }
  if (rng.chance(0.5)) { const b = rng.int(12, 45), c = rng.int(10, 50), a = b + c;
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `□ − ${b} = ${c}` }, ans: a, opts: numOpts(rng, a, [c - b > 0 ? c - b : c + 1, a + 10, a - 10], K, 0, 200),
      math: { kind: 'expr', e: `${b}+${c}` }, hint: `Bilangan itu dikurangi ${b} hasilnya ${c}. Coba ${c} + ${b}.`, explain: `${c} + ${b} = ${a}. Periksa: ${a} − ${b} = ${c}.` }); }
  const a = rng.int(50, 99), c = rng.int(10, a - 10), b = a - c;
  return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${a} − □ = ${c}` }, ans: b, opts: numOpts(rng, b, [a + c, b + 10, b - 10], K, 0, 200),
    math: { kind: 'expr', e: `${a}-${c}` }, hint: `${a} dikurangi berapa agar tersisa ${c}?`, explain: `${a} − ${b} = ${c}.` });
};

G['4.2.1'] = (rng, lv, K) => {
  if (lv === 1) { const ds = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], K); const big = rng.chance(0.5); const d = big ? Math.min(...ds) : Math.max(...ds);
    return item({ q: `Pecahan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans: `1/${d}`, opts: ds.map((x) => ({ label: `1/${x}`, value: `1/${x}` })),
      math: { kind: big ? 'fracmax' : 'fracmin', fr: ds.map((x) => [1, x]) }, hint: 'Pembilangnya sama-sama 1. Makin besar penyebut, makin kecil bagiannya.', explain: `Dari pilihan itu, 1/${d} paling ${big ? 'besar' : 'kecil'} karena penyebutnya paling ${big ? 'kecil' : 'besar'}.` }); }
  if (lv === 2) { const d = rng.int(7, 12); const ns = rng.sample([...Array(d - 1)].map((_, i) => i + 1), 3); const asc = rng.chance(0.6);
    const { right, opts } = orderOpts(rng, ns, asc, K, (n) => `${n}/${d}`);
    return item({ q: `Urutan pecahan dari yang ${asc ? 'terkecil' : 'terbesar'} adalah …`, v: null, ans: right, opts, math: { kind: 'fracorder', fr: ns.map((n) => [n, d]), asc },
      hint: 'Penyebutnya sama. Bandingkan pembilangnya.', explain: `Penyebutnya sama, jadi urutannya mengikuti pembilang: ${right}.` }); }
  const d1 = rng.pick([3, 4, 5, 6]); const set = [`1/${d1}`, `${d1 - 1}/${d1}`, `1/${d1 * 2}`, `${d1 + 1}/${d1 * 2}`]; const vals = set.map(fracVal); if (new Set(vals).size < 4) return G['4.2.1'](rng, lv, K); const big = rng.chance(0.5);
  const ans = set[vals.indexOf(big ? Math.max(...vals) : Math.min(...vals))];
  return item({ q: `Pecahan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: rng.shuffle(set).map((x) => ({ label: x, value: x })),
    math: { kind: big ? 'fracmax' : 'fracmin', fr: set.map((x) => x.split('/').map(Number)) }, hint: 'Bandingkan dulu pecahan yang penyebutnya sama atau pembilangnya sama.', explain: `Pecahan yang paling ${big ? 'besar' : 'kecil'} adalah ${ans}.` });
};

G['4.2.2'] = (rng, lv, K) => {
  const d = rng.pick([2, 3, 4, 5]), n = rng.int(1, d - 1), m = rng.pick([2, 3, 4]);
  if (lv === 1) return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'stack', items: [{ t: 'eq', text: `${n}/${d} = □/${d * m}` }, { t: 'fraceq', a: [n, d], b: [0, d * m] }] }, ans: n * m,
    opts: numOpts(rng, n * m, [n, n + m, d * m - n * m, n * m + 1].filter((x) => x !== n * m && x > 0), K, 1, 40), math: { kind: 'fraceq', n, d, D: d * m }, hint: `Penyebut dikali ${m}. Pembilang juga dikali ${m}.`, explain: `${n}/${d} = ${n * m}/${d * m} karena pembilang dan penyebut sama-sama dikali ${m}.` });
  if (lv === 2) { const ans = `${n * m}/${d * m}`;
    return item({ q: `Pecahan yang senilai dengan ${n}/${d} adalah …`, v: { t: 'frac', shape: 'bar', parts: d, shaded: n }, ans, opts: fracOpts(rng, ans, [`${n * m}/${d * m + 1}`, `${n + m}/${d + m}`, `${n * m}/${d}`, `${n}/${d * m}`, `${d * m}/${n * m}`, `${n * m + 1}/${d * m}`], K),
      math: { kind: 'fracval', n, d }, hint: 'Kalikan pembilang dan penyebut dengan bilangan yang sama.', explain: `${n}/${d} = ${n * m}/${d * m}.` }); }
  return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${n}/${d} = ${n * m}/□` }, ans: d * m, opts: numOpts(rng, d * m, [d + m, d * m + 1, n * m + d, d], K, 1, 60),
    math: { kind: 'fraceqden', n, d, N: n * m }, hint: `Pembilang ${n} menjadi ${n * m}, berarti dikali ${m}.`, explain: `${n} × ${m} = ${n * m}, maka penyebutnya ${d} × ${m} = ${d * m}.` });
};

G['4.2.3'] = (rng, lv, K) => {
  if (lv === 1) { const k = rng.int(1, 9);
    return item({ q: 'Bagian yang diwarnai jika ditulis dalam bentuk desimal adalah …', v: { t: 'hgrid', n: 10, shaded: k }, ans: k / 10, opts: decOpts(rng, k / 10, [k / 100, k, (k + 1) / 10, (10 - k) / 10], K),
      math: { kind: 'dec', e: `${k}/10` }, hint: 'Pita dibagi 10 bagian. Satu bagian = 0,1.', explain: `${k} dari 10 bagian = ${k}/10 = ${fmtDec(k / 10)}.` }); }
  if (lv === 2) { const m = rng.int(11, 99);
    return item({ q: 'Bagian yang diwarnai jika ditulis dalam bentuk desimal adalah …', v: { t: 'hgrid', n: 100, shaded: m }, ans: m / 100, opts: decOpts(rng, m / 100, [m / 10, m / 1000, (100 - m) / 100, (m + 10) / 100], K),
      math: { kind: 'dec', e: `${m}/100` }, hint: 'Petak dibagi 100. Satu petak = 0,01.', explain: `${m} dari 100 petak = ${m}/100 = ${fmtDec(m / 100)}.` }); }
  const hund = rng.chance(0.6); const k = hund ? rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 25, 45, 75]) : rng.int(1, 9); const den = hund ? 100 : 10; const v = k / den;
  return item({ q: `${k}/${den} jika ditulis dalam bentuk desimal adalah …`, v: null, ans: v, opts: decOpts(rng, v, [k / (den === 100 ? 10 : 100), k, k / 1000, v + 0.1], K),
    math: { kind: 'dec', e: `${k}/${den}` }, hint: den === 100 ? 'Perseratus berarti dua angka di belakang koma.' : 'Persepuluh berarti satu angka di belakang koma.', explain: `${k}/${den} = ${fmtDec(v)}.` });
};

G['4.2.4'] = (rng, lv, K) => {
  if (lv === 1) { const p = rng.int(5, 95);
    return item({ q: 'Berapa persen bagian yang diwarnai?', v: { t: 'hgrid', n: 100, shaded: p }, ans: p, opts: numOpts(rng, p, [100 - p, p + 10, p - 10, Math.round(p / 10)], K, 0, 100).map((o) => ({ ...o, label: `${o.value}%` })),
      math: { kind: 'count', n: p }, hint: 'Ada 100 petak. Setiap petak = 1%.', explain: `${p} dari 100 petak diwarnai, jadi ${p}%.` }); }
  if (lv === 2) { const p = rng.pick([5, 8, 12, 25, 30, 35, 40, 45, 60, 75, 90]);
    return item({ q: `${fmtDec(p / 100)} sama dengan berapa persen?`, v: null, ans: p, opts: decOpts(rng, p, [p / 10, p * 10, 100 - p], K, '%'),
      math: { kind: 'dec', e: `${p}` }, hint: 'Desimal dikali 100 menjadi persen.', explain: `${fmtDec(p / 100)} = ${p}/100 = ${p}%.` }); }
  const [fr, p] = rng.pick([['1/2', 50], ['1/4', 25], ['3/4', 75], ['1/5', 20], ['2/5', 40], ['1/10', 10], ['3/10', 30], ['4/5', 80]]);
  const [a, b] = fr.split('/').map(Number);
  return item({ q: `${fr} sama dengan berapa persen?`, v: null, ans: p, opts: numOpts(rng, p, [Number(`${a}${b}`), a * 10, b * 10, 100 - p].filter((x) => x !== p && x <= 100), K, 0, 100).map((o) => ({ ...o, label: `${o.value}%` })),
    math: { kind: 'dec', e: `${a}/${b}*100` }, hint: 'Ubah dulu menjadi pecahan berpenyebut 100.', explain: `${fr} = ${p}/100 = ${p}%.` });
};

G['4.2.5'] = (rng, lv, K) => {
  if (lv === 1) { const w = rng.int(3, 7), h = rng.int(2, 5); const cells = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) cells.push([x, y]);
    return item({ q: 'Berapa petak satuan luas bangun ini?', v: { t: 'area', cells, w: 8, h: 6 }, ans: w * h, opts: withUnit(numOpts(rng, w * h, [2 * (w + h), w + h, w * h + w], K, 1, 60), 'petak'),
      math: { kind: 'area', cells }, hint: 'Hitung banyak baris dikali banyak petak di setiap baris.', explain: `${h} baris × ${w} petak = ${w * h} petak satuan.` }); }
  if (lv === 2) { const n = rng.int(8, 16); const cells = polyCells(rng, n);
    return item({ q: 'Berapa petak satuan luas bangun ini?', v: { t: 'area', cells, w: 5, h: 4 }, ans: n, opts: withUnit(numOpts(rng, n, [n + 1, n - 1, n + 2], K, 1, 30), 'petak'),
      math: { kind: 'area', cells }, hint: 'Tandai petak yang sudah dihitung agar tidak terhitung dua kali.', explain: `Ada ${n} petak berwarna, jadi luasnya ${n} petak satuan.` }); }
  const w = rng.int(5, 9), h = rng.int(3, 6); const cells = []; for (let x = 0; x < w; x++) cells.push([x, 0]); for (let y = 1; y < h; y++) cells.push([0, y]);
  return item({ q: `Sebuah lantai berbentuk persegi panjang akan ditutup ubin persegi. Baris pertama memuat ${w} ubin dan kolom pertama memuat ${h} ubin. Berapa ubin yang diperlukan seluruhnya?`, v: { t: 'area', cells, w, h },
    ans: w * h, opts: withUnit(numOpts(rng, w * h, [w + h - 1, w + h, 2 * (w + h)], K, 1, 80), 'ubin'), math: { kind: 'expr', e: `${w}*${h}` }, hint: 'Setiap baris memuat ubin yang sama banyak.', explain: `${h} baris × ${w} ubin = ${w * h} ubin.` });
};

function stackHeights(rng, R, C, maxH = 3) {
  for (;;) {
    const h = [...Array(R)].map(() => [...Array(C)].map(() => rng.int(0, maxH)));
    for (let r = 1; r < R; r++) for (let c = 0; c < C; c++) h[r][c] = Math.min(h[r][c], h[r - 1][c]); // baris depan tidak lebih tinggi
    if (h.every((row) => row.some((x) => x > 0)) && [...Array(C)].every((_, c) => h.some((row) => row[c] > 0))) return h;
  }
}
const stackCount = (h) => h.flat().reduce((s, x) => s + x, 0);

G['4.2.6'] = (rng, lv, K) => {
  if (lv === 1) { const l = rng.int(2, 4), w = rng.int(1, 3), h = rng.int(1, 3); const v = l * w * h;
    return item({ q: 'Volume balok ini sama dengan berapa kubus satuan?', v: { t: 'cubes', l, w, h }, ans: v, opts: withUnit(numOpts(rng, v, [l + w + h, l * h, l * w, v + l], K, 1, 60), 'kubus'),
      math: { kind: 'expr', e: `${l}*${w}*${h}` }, hint: 'Hitung kubus satu lapisan, lalu kalikan dengan banyak lapisan.', explain: `Satu lapisan ada ${l} × ${w} = ${l * w} kubus. Ada ${h} lapisan, jadi ${l * w * h} kubus satuan.` }); }
  if (lv === 2) { const h = stackHeights(rng, 2, rng.int(2, 3)); const n = stackCount(h);
    return item({ q: 'Susunan ini dibuat dari berapa kubus satuan? Tidak ada kubus yang melayang.', v: { t: 'kstack', heights: h }, ans: n, opts: withUnit(numOpts(rng, n, [n - 1, n + 1, n - 2, n + 2], K, 1, 40), 'kubus'),
      math: { kind: 'stackcount', heights: h }, hint: 'Hitung tumpukan satu per satu, termasuk kubus di bawah yang tertutup.', explain: `Jumlah semua tumpukan adalah ${h.flat().filter((x) => x).join(' + ')} = ${n} kubus.` }); }
  const p = rng.int(3, 6), l = rng.int(2, 4), t = rng.int(2, 4); const v = p * l * t;
  return item({ q: `Sebuah kotak diisi penuh kubus satuan: ${p} kubus memanjang, ${l} kubus melebar, dan ${t} lapis. Berapa volume kotak itu?`, v: null, ans: v, opts: withUnit(numOpts(rng, v, [p + l + t, p * l, v + p * l, 2 * (p * l + l * t + p * t)], K, 1, 200), 'kubus satuan'),
    math: { kind: 'expr', e: `${p}*${l}*${t}` }, hint: 'Satu lapis berisi panjang × lebar kubus.', explain: `${p} × ${l} = ${p * l} kubus per lapis. ${p * l} × ${t} = ${v} kubus satuan.` });
};

const QUAD = {
  persegi: 'memiliki empat sisi sama panjang dan empat sudut siku-siku',
  'persegi panjang': 'memiliki dua pasang sisi sejajar, empat sudut siku-siku, dan tidak semua sisinya sama panjang',
  trapesium: 'memiliki tepat sepasang sisi sejajar',
  'jajar genjang': 'memiliki dua pasang sisi sejajar, tetapi tidak memiliki sudut siku-siku dan tidak semua sisinya sama panjang',
  'belah ketupat': 'memiliki empat sisi sama panjang, tetapi tidak memiliki sudut siku-siku',
  'layang-layang': 'memiliki dua pasang sisi yang berdekatan sama panjang dan tidak memiliki sisi sejajar',
};
const PTS = {
  trapesium: { pts: [[25, 20], [75, 20], [95, 80], [5, 80]], par: 1 }, 'jajar genjang': { pts: [[25, 20], [95, 20], [75, 80], [5, 80]], par: 2 },
  'persegi panjang': { pts: [[5, 25], [95, 25], [95, 75], [5, 75]], par: 2 }, 'layang-layang': { pts: [[50, 5], [80, 35], [50, 95], [20, 35]], par: 0 },
  segitiga: { pts: [[50, 10], [95, 85], [5, 85]], par: 0 }, persegi: { pts: [[15, 15], [85, 15], [85, 85], [15, 85]], par: 2 },
};
G['4.2.7'] = (rng, lv, K) => {
  if (lv === 1) { const ans = rng.pick(Object.keys(QUAD));
    return item({ q: `Bangun datar yang ${QUAD[ans]} adalah …`, v: null, ans, opts: textOpts(rng, ans, Object.keys(QUAD), K).map((o) => ({ label: cap(o.value), value: o.value })),
      math: { kind: 'quaddef', def: QUAD[ans] }, hint: 'Bayangkan setiap bangun pada pilihan, lalu periksa cirinya satu per satu.', explain: `${cap(ans)} ${QUAD[ans]}.` }); }
  if (lv === 2) { const k = rng.pick(Object.keys(PTS)); const n = PTS[k].par;
    return item({ q: `Bangun ${k} di bawah ini memiliki berapa pasang sisi sejajar?`, v: { t: 'ptype', pts: PTS[k].pts }, ans: n, opts: numOpts(rng, n, [0, 1, 2, 3], K, 0, 4),
      math: { kind: 'parallel', k }, hint: 'Sisi sejajar tidak akan pernah bertemu walaupun diperpanjang.', explain: n === 0 ? `${cap(k)} tidak memiliki sisi sejajar.` : `${cap(k)} memiliki ${n} pasang sisi sejajar.` }); }
  return item({ q: 'Dua segitiga siku-siku yang sama besar dapat disusun menjadi bangun-bangun berikut, kecuali …', v: { t: 'pieces', items: ['rtri', 'rtri'] }, ans: 'segi lima',
    opts: rng.shuffle(['persegi panjang', 'jajar genjang', 'segitiga', 'segi lima']).map((x) => ({ label: cap(x), value: x })), math: { kind: 'fixed', ans: 'segi lima' },
    hint: 'Dua segitiga punya 6 titik sudut. Saat ditempel, beberapa titik sudut menyatu.', explain: 'Dua segitiga siku-siku dapat membentuk persegi panjang, jajar genjang, atau segitiga, tetapi tidak dapat membentuk segi lima.' });
};

const HARVEST = [['🍅', 'tomat'], ['🌽', 'jagung'], ['🥕', 'wortel'], ['🍆', 'terung']];
G['4.2.8'] = (rng, lv, K) => {
  const cats = rng.sample(HARVEST, 4); const vals = rng.sample([2, 4, 6, 8, 10, 12, 14, 16], 4); const rows = cats.map((c, i) => ({ e: c[0], label: c[1], n: vals[i] }));
  if (lv === 1) { const r = rng.pick(rows);
    return item({ q: `Piktogram ini menunjukkan hasil panen kebun sekolah. Satu gambar mewakili 2 buah. Berapa banyak ${r.label} yang dipanen?`, v: { t: 'picto', rows, per: 2, unit: 'buah' }, ans: r.n,
      opts: numOpts(rng, r.n, [r.n / 2, r.n + 2, r.n - 2], K, 1, 40), math: { kind: 'read', rows, label: r.label }, hint: 'Hitung gambarnya, lalu kalikan 2.', explain: `Ada ${r.n / 2} gambar ${r.label}. ${r.n / 2} × 2 = ${r.n} buah.` }); }
  const [a, b] = rng.sample(rows, 2).sort((x, y) => y.n - x.n);
  if (lv === 2) return item({ q: `Diagram batang ini menunjukkan hasil panen kebun sekolah. Berapa selisih panen ${a.label} dan ${b.label}?`, v: { t: 'bars2', rows, max: 16, step: 2 }, ans: a.n - b.n,
    opts: numOpts(rng, a.n - b.n, [a.n + b.n, a.n, (a.n - b.n) / 2], K, 0, 40), math: { kind: 'expr', e: `${a.n}-${b.n}` }, hint: 'Baca tinggi kedua batang, lalu kurangkan.', explain: `${a.n} − ${b.n} = ${a.n - b.n}.` });
  const tot = rows.reduce((s, x) => s + x.n, 0);
  return item({ q: 'Diagram batang ini menunjukkan hasil panen kebun sekolah. Berapa jumlah seluruh hasil panen?', v: { t: 'bars2', rows, max: 16, step: 2 }, ans: tot,
    opts: numOpts(rng, tot, [tot - 2, tot + 2, tot - rows[0].n], K, 0, 100), math: { kind: 'expr', e: rows.map((r) => r.n).join('+') }, hint: 'Jumlahkan tinggi semua batang.', explain: `${rows.map((r) => r.n).join(' + ')} = ${tot}.` });
};

// ===================== KELAS 5 =====================
function bigNum(rng, digits, zeros = 0.3) { let s = String(rng.int(1, 9)); for (let i = 1; i < digits; i++) s += rng.chance(zeros) ? '0' : String(rng.int(1, 9)); return Number(s); }
function pvItem(rng, lv, K, digits, max) {
  const n = bigNum(rng, digits);
  if (lv === 1) { const s = String(n); const swap = Number(s.slice(0, 1) + s[2] + s[1] + s.slice(3)); const noz = Number(s.replace(/0/g, '') || 1);
    return item({ q: 'Bilangan yang ditunjukkan tabel nilai tempat ini adalah …', v: { t: 'pv', n }, ans: n, opts: numOpts(rng, n, [swap, noz, n + 10 ** (digits - 2), n * 10 > max * 10 ? n - 10 ** (digits - 1) : n * 10].filter((x) => x !== n && x > 0), K, 0, max * 10),
      math: { kind: 'word', word: terbilang(n) }, hint: 'Baca kolom dari kiri ke kanan.', explain: `Bilangan itu ${fmt(n)}, dibaca ${terbilang(n)}.` }); }
  if (lv === 2) { let m = n; let p = rng.int(1, digits - 1); if (Math.floor(m / 10 ** p) % 10 === 0) m += 10 ** p; const dg = Math.floor(m / 10 ** p) % 10, val = dg * 10 ** p;
    return item({ q: `Nilai angka ${dg} pada bilangan ${fmt(m)} adalah …`, v: null, ans: val, opts: numOpts(rng, val, [dg, dg * 10 ** (p - 1), dg * 10 ** (p + 1), m].filter((x) => x !== val), K, 0, max * 100),
      math: { kind: 'placeval', n: m, place: p }, hint: 'Hitung posisi angka itu dari kanan: satuan, puluhan, ratusan, ribuan, dan seterusnya.', explain: `Angka ${dg} berada di tempat ${PV[p]}, jadi nilainya ${fmt(val)}.` }); }
  const m = bigNum(rng, digits, 0.45); const s = String(m);
  const wrongs = [Number(s.replace(/0/g, '')), Number(s + '0'), Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1)), m + 10 ** (digits - 3)];
  return item({ q: `Lambang bilangan dari "${terbilang(m)}" adalah …`, v: null, ans: m, opts: numOpts(rng, m, wrongs.filter((x) => x !== m && x > 0), K, 0, max * 100),
    math: { kind: 'word', word: terbilang(m) }, hint: 'Tulis per kelompok tiga angka. Tempat yang kosong diisi 0.', explain: `"${cap(terbilang(m))}" ditulis ${fmt(m)}.` });
}
G['5.1.1'] = (rng, lv, K) => pvItem(rng, lv, K, 5, 100000);

G['5.1.2'] = (rng, lv, K) => {
  if (lv === 1) { const a = rng.int(10000, 99999); let b = Math.floor(a / 1000) * 1000 + rng.int(0, 999); if (rng.chance(0.3)) b = rng.int(10000, 99999); if (rng.chance(0.1)) b = a;
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return item({ q: 'Tanda yang tepat untuk mengisi kotak adalah …', v: { t: 'eq', text: `${fmt(a)} □ ${fmt(b)}` }, ans, opts: ['>', '<', '='].map((x) => ({ label: x, value: x })), fixedOpts: true,
      math: { kind: 'cmp', a, b }, hint: 'Bandingkan angka dari kiri. Berhenti di angka pertama yang berbeda.', explain: `${fmt(a)} ${ans} ${fmt(b)}.` }); }
  if (lv === 2) { const vals = uniq([...Array(4)].map(() => rng.int(10000, 99999))); while (vals.length < 4) vals.push(rng.int(10000, 99999)); const asc = rng.chance(0.5);
    const { right, opts } = orderOpts(rng, vals, asc, K);
    return item({ q: `Urutan bilangan dari yang ${asc ? 'terkecil' : 'terbesar'} adalah …`, v: null, ans: right, opts, math: { kind: 'orderf', vals, asc }, hint: 'Bandingkan puluh ribuannya dulu.', explain: `Urutannya: ${right}.` }); }
  const ds = String(bigNum(rng, 5, 0.35)).split('').map(Number); const parts = ds.map((x, i) => x * 10 ** (4 - i)).filter((x) => x); const n = parts.reduce((s, x) => s + x, 0);
  return item({ q: `${parts.map(fmt).join(' + ')} = …`, v: null, ans: n, opts: numOpts(rng, n, [Number(ds.filter((x) => x).join('')), n + 9000, n - 900 > 0 ? n - 900 : n + 90, n * 10 > 999999 ? n + 1 : Math.floor(n / 10)].filter((x) => x !== n), K, 0, 999999),
    math: { kind: 'expr', e: parts.join('+') }, hint: 'Susun menurut nilai tempat. Jangan lupa angka 0.', explain: `${parts.map(fmt).join(' + ')} = ${fmt(n)}.` });
};

G['5.1.3'] = (rng, lv, K) => {
  if (lv === 1) { const add = rng.chance(0.5); let a = rng.int(20000, 70000), b = rng.int(10000, 29000); if (!add && b > a) [a, b] = [b, a]; const r = add ? a + b : a - b;
    return item({ q: `${fmt(a)} ${add ? '+' : '−'} ${fmt(b)} = …`, v: { t: 'column', a: fmt(a).replace(/\./g, ''), b: fmt(b).replace(/\./g, ''), op: add ? '+' : '−' }, ans: r,
      opts: numOpts(rng, r, [add ? noCarrySum(a, b) : smallFromBig(a, b), r + 1000, r - 1000, r + 10], K, 0, 200000), math: { kind: 'expr', e: `${a}${add ? '+' : '-'}${b}` }, hint: 'Hitung bersusun mulai dari satuan.', explain: `${fmt(a)} ${add ? '+' : '−'} ${fmt(b)} = ${fmt(r)}.` }); }
  if (lv === 2) { const a = rng.int(120, 900), b = rng.int(12, 99); const p = a * b; if (p > 100000) return G['5.1.3'](rng, lv, K);
    return item({ q: `${fmt(a)} × ${b} = …`, v: null, ans: p, opts: numOpts(rng, p, [a * (b % 10) + a * Math.floor(b / 10), a * b + a, a * b - b, a * (b % 10) + Math.floor(b / 10) * a * 10 + 100], K, 0, 200000),
      math: { kind: 'expr', e: `${a}*${b}` }, hint: `Kalikan ${a} dengan satuan dan puluhan ${b}, lalu jumlahkan.`, explain: `${fmt(a)} × ${b} = ${fmt(a)} × ${b % 10} + ${fmt(a)} × ${b - (b % 10)} = ${fmt(p)}.` }); }
  const k = rng.int(12, 48), q = rng.int(105, 999); const n = k * q; if (n > 100000) return G['5.1.3'](rng, lv, K);
  return item({ q: `Sebuah pabrik mengemas ${fmt(n)} botol ke dalam kardus. Setiap kardus berisi ${k} botol. Berapa kardus yang diperlukan?`, v: null, ans: q,
    opts: numOpts(rng, q, [q + 10, q - 10, q * 10 > 99999 ? q + 1 : q * 10, n - k], K, 1, 1000000), math: { kind: 'expr', e: `${n}/${k}` }, hint: 'Bagi banyak botol dengan isi satu kardus.', explain: `${fmt(n)} : ${k} = ${fmt(q)} kardus. Periksa: ${fmt(q)} × ${k} = ${fmt(n)}.` });
};

const isPrime = (n) => n > 1 && [...Array(Math.floor(Math.sqrt(n)) - 1)].every((_, i) => n % (i + 2) !== 0);
G['5.1.4'] = (rng, lv, K) => {
  if (lv === 1) { const [a, b] = rng.pick([[4, 6], [3, 4], [6, 8], [4, 10], [6, 9], [5, 6], [8, 12], [3, 5]]); const L = lcm(a, b); const ans = L * rng.int(1, 3);
    return item({ q: `Manakah yang merupakan kelipatan persekutuan dari ${a} dan ${b}?`, v: null, ans, opts: oneCorrect(rng, ans, [...Array(80)].map((_, i) => i + 6).filter((x) => x % a === 0 || x % b === 0), (x) => x % a === 0 && x % b === 0, K),
      math: { kind: 'commonmult', a, b }, hint: `Bilangan itu harus kelipatan ${a} dan sekaligus kelipatan ${b}.`, explain: `${ans} = ${a} × ${ans / a} = ${b} × ${ans / b}.` }); }
  if (lv === 2) { const [a, b] = rng.pick([[12, 18], [18, 24], [16, 24], [20, 30], [24, 36], [15, 25], [14, 21], [30, 45]]); const cf = [...Array(a)].map((_, i) => i + 1).filter((d) => a % d === 0 && b % d === 0 && d > 1); const ans = rng.pick(cf);
    return item({ q: `Manakah yang merupakan faktor persekutuan dari ${a} dan ${b}?`, v: null, ans, opts: oneCorrect(rng, ans, [...Array(b)].map((_, i) => i + 2).filter((d) => a % d === 0 || b % d === 0), (d) => a % d === 0 && b % d === 0, K),
      math: { kind: 'commonfac', a, b }, hint: `Bilangan itu harus membagi habis ${a} dan juga ${b}.`, explain: `${a} : ${ans} = ${a / ans} dan ${b} : ${ans} = ${b / ans}.` }); }
  const primes = [...Array(90)].map((_, i) => i + 11).filter(isPrime); const ans = rng.pick(primes);
  const comps = [...Array(90)].map((_, i) => i + 11).filter((x) => !isPrime(x) && x % 2 === 1);
  return item({ q: 'Manakah yang merupakan bilangan prima?', v: null, ans, opts: oneCorrect(rng, ans, comps, isPrime, K), math: { kind: 'prime' },
    hint: 'Bilangan prima hanya punya dua faktor: 1 dan bilangan itu sendiri.', explain: `${ans} hanya habis dibagi 1 dan ${ans}, jadi ${ans} bilangan prima. Bilangan lain pada pilihan punya faktor lain.` });
};

G['5.1.5'] = (rng, lv, K) => {
  if (lv === 1) { const [a, b] = rng.pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [9, 12], [6, 10]]); const L = lcm(a, b), F = gcd(a, b);
    return item({ q: `KPK dari ${a} dan ${b} adalah …`, v: null, ans: L, opts: numOpts(rng, L, [a * b, F, a + b, L * 2].filter((x) => x !== L), K, 1, 400),
      math: { kind: 'kpk', a, b }, hint: `Tulis kelipatan ${a} dan ${b}. Cari yang sama dan paling kecil.`, explain: `Kelipatan persekutuan terkecil dari ${a} dan ${b} adalah ${L}.` }); }
  if (lv === 2) { const [a, b] = rng.pick([[12, 18], [16, 24], [18, 27], [20, 30], [24, 36], [28, 42], [30, 45], [36, 48]]); const F = gcd(a, b), L = lcm(a, b);
    return item({ q: `FPB dari ${a} dan ${b} adalah …`, v: null, ans: F, opts: numOpts(rng, F, [L, F / 2, F * 2, b - a].filter((x) => x !== F && Number.isInteger(x)), K, 1, 400),
      math: { kind: 'fpb', a, b }, hint: `Tulis faktor ${a} dan ${b}. Cari yang sama dan paling besar.`, explain: `Faktor persekutuan terbesar dari ${a} dan ${b} adalah ${F}.` }); }
  if (rng.chance(0.5)) { const [a, b] = rng.pick([[6, 8], [4, 6], [10, 15], [12, 18], [8, 12], [6, 10]]); const L = lcm(a, b);
    return item({ q: `Lampu merah berkedip setiap ${a} detik. Lampu hijau berkedip setiap ${b} detik. Keduanya baru saja berkedip bersama. Setelah berapa detik keduanya berkedip bersama lagi?`, v: null, ans: L,
      opts: numOpts(rng, L, [a * b, gcd(a, b), a + b], K, 1, 400), math: { kind: 'kpk', a, b }, hint: 'Cari waktu pertama yang merupakan kelipatan kedua bilangan.', explain: `KPK dari ${a} dan ${b} adalah ${L}. Jadi, setelah ${L} detik.` }); }
  const [a, b] = rng.pick([[24, 36], [18, 30], [32, 48], [20, 28], [36, 54], [40, 60]]); const F = gcd(a, b);
  return item({ q: `Ada ${a} buku tulis dan ${b} pensil. Semuanya dibagikan ke beberapa kantong. Setiap kantong mendapat buku dan pensil sama banyak. Paling banyak berapa kantong yang dapat dibuat?`, v: null, ans: F,
    opts: numOpts(rng, F, [lcm(a, b), F / 2, a + b, b - a].filter((x) => Number.isInteger(x) && x !== F), K, 1, 400), math: { kind: 'fpb', a, b }, hint: 'Banyak kantong harus membagi habis kedua bilangan.', explain: `FPB dari ${a} dan ${b} adalah ${F}. Jadi, paling banyak ${F} kantong.` });
};

G['5.1.6'] = (rng, lv, K) => {
  if (lv === 1) { let a, b, c, d; do { b = rng.int(3, 9); d = rng.int(3, 9); a = rng.int(1, b - 1); c = rng.int(1, d - 1); } while (b === d || a * d === b * c || gcd(a, b) > 1 || gcd(c, d) > 1);
    const askBig = rng.chance(0.6); const ans = (a / b > c / d) === askBig ? `${a}/${b}` : `${c}/${d}`;
    return item({ q: `Mana yang lebih ${askBig ? 'besar' : 'kecil'}, ${a}/${b} atau ${c}/${d}?`, v: null, ans, opts: [`${a}/${b}`, `${c}/${d}`].map((x) => ({ label: x, value: x })).concat([{ label: 'Sama besar', value: 'sama' }]), fixedOpts: true,
      math: { kind: askBig ? 'fracmax' : 'fracmin', fr: [[a, b], [c, d]] }, hint: 'Samakan penyebutnya dulu.', explain: `${a}/${b} = ${a * d}/${b * d} dan ${c}/${d} = ${c * b}/${b * d}. Jadi, ${ans} lebih ${askBig ? 'besar' : 'kecil'}.` }); }
  if (lv === 2) { const d = rng.int(3, 8), w = rng.int(1, 4), r = rng.int(1, d - 1); const n = w * d + r; const ans = fracStr(n, d);
    return item({ q: `Pecahan ${n}/${d} jika diubah menjadi pecahan campuran adalah …`, v: null, ans, opts: fracOpts(rng, ans, [`${w + 1} ${r}/${d}`, `${w} ${d - r}/${d}`, `${r} ${w}/${d}`, `${w} ${r}/${n}`, `${w - 1 || w + 2} ${r}/${d}`], K),
      math: { kind: 'fracval', n, d }, hint: `${n} dibagi ${d}: hasil baginya menjadi bilangan bulat, sisanya menjadi pembilang.`, explain: `${n} : ${d} = ${w} sisa ${r}, jadi ${n}/${d} = ${ans}.` }); }
  const d = rng.pick([4, 6, 8]); const items3 = uniq([`${rng.int(1, 2)} ${rng.int(1, d - 1)}/${d}`, `${rng.int(1, 2)} ${rng.int(1, d - 1)}/${d}`, `${rng.int(d + 1, 3 * d - 1)}/${d}`]);
  if (items3.length < 3 || new Set(items3.map(fracVal)).size < 3) return G['5.1.6'](rng, lv, K);
  const asc = rng.chance(0.6); const { right, opts } = orderOpts(rng, items3.map(fracVal), asc, K, (v) => items3.find((x) => fracVal(x) === v));
  return item({ q: `Urutan pecahan dari yang ${asc ? 'terkecil' : 'terbesar'} adalah …`, v: null, ans: right, opts, math: { kind: 'fracorderstr', asc },
    hint: 'Ubah semuanya menjadi pecahan biasa berpenyebut sama, lalu bandingkan pembilangnya.', explain: `Urutannya: ${right}.` });
};

G['5.1.7'] = (rng, lv, K) => {
  if (lv === 1) { const d = rng.int(5, 12); const a = rng.int(1, d - 2), b = rng.int(1, d - 1 - a); const ans = fracStr(a + b, d);
    return item({ q: `${a}/${d} + ${b}/${d} = …`, v: null, ans, opts: fracOpts(rng, ans, [`${a + b}/${d * 2}`, fracStr(a + b + 1, d), fracStr(Math.abs(a - b) || 1, d), `${a * b}/${d}`, fracStr(a + b, d + 1)], K),
      math: { kind: 'fracexpr', e: `${a}/${d}+${b}/${d}` }, hint: 'Penyebutnya sama. Jumlahkan pembilangnya saja.', explain: `${a}/${d} + ${b}/${d} = ${a + b}/${d}${fracStr(a + b, d) !== `${a + b}/${d}` ? ` = ${ans}` : ''}.` }); }
  if (lv === 2) { let b, d; do { b = rng.int(2, 6); d = rng.int(2, 8); } while (b === d || lcm(b, d) > 24); const a = rng.int(1, b - 1), c = rng.int(1, d - 1); const L = lcm(b, d); const N = a * (L / b) + c * (L / d); const ans = fracStr(N, L);
    return item({ q: `${a}/${b} + ${c}/${d} = …`, v: null, ans, opts: fracOpts(rng, ans, [`${a + c}/${b + d}`, `${a + c}/${L}`, fracStr(N + 1, L), `${a * c}/${b * d}`, fracStr(N, L * 2)], K),
      math: { kind: 'fracexpr', e: `${a}/${b}+${c}/${d}` }, hint: `Samakan penyebutnya menjadi ${L}.`, explain: `${a}/${b} = ${a * (L / b)}/${L} dan ${c}/${d} = ${c * (L / d)}/${L}. Jumlahnya ${N}/${L}${ans !== `${N}/${L}` ? ` = ${ans}` : ''}.` }); }
  const d = rng.pick([3, 4, 5, 6, 8]); const w = rng.int(1, 3), r = rng.int(1, d - 1), s = rng.int(1, d - 1); if (w * d + r - s <= 0) return G['5.1.7'](rng, lv, K);
  const N = w * d + r - s; const ans = fracStr(N, d);
  return item({ q: `${w} ${r}/${d} − ${s}/${d} = …`, v: null, ans, opts: fracOpts(rng, ans, [`${w} ${Math.abs(r - s) || 1}/${d}`, fracStr(N + d, d), fracStr(w * d + r + s, d), fracStr(Math.max(N - d, 1), d), `${w - 1 || 3} ${r}/${d}`], K),
    math: { kind: 'fracexpr', e: `${w}+${r}/${d}-${s}/${d}` }, hint: 'Ubah pecahan campuran menjadi pecahan biasa dulu.', explain: `${w} ${r}/${d} = ${w * d + r}/${d}. ${w * d + r}/${d} − ${s}/${d} = ${N}/${d}${ans !== `${N}/${d}` ? ` = ${ans}` : ''}.` });
};

G['5.1.8'] = (rng, lv, K) => {
  if (lv === 1) { const a = rng.pick([10, 20, 30, 40, 50]), x = rng.int(3, 20); const p = a * x;
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${a} × □ = ${fmt(p)}` }, ans: x, opts: numOpts(rng, x, [p - a, x * 10, x + 1, p / 10].filter((y) => y !== x), K, 1, 1000),
      math: { kind: 'expr', e: `${p}/${a}` }, hint: `Pembagian adalah kebalikan perkalian: ${fmt(p)} : ${a}.`, explain: `${fmt(p)} : ${a} = ${x}. Periksa: ${a} × ${x} = ${fmt(p)}.` }); }
  if (lv === 2) { const k = rng.int(4, 12), q = rng.int(25, 90); const n = k * q;
    return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `□ : ${k} = ${q}` }, ans: n, opts: numOpts(rng, n, [q + k, q - k, n + k, n - q].filter((y) => y > 0 && y !== n), K, 1, 2000),
      math: { kind: 'expr', e: `${k}*${q}` }, hint: `Bilangan itu dibagi ${k} hasilnya ${q}. Coba ${q} × ${k}.`, explain: `${q} × ${k} = ${fmt(n)}. Periksa: ${fmt(n)} : ${k} = ${q}.` }); }
  const a = rng.int(12, 48) * 2, b = rng.pick([5, 10, 20, 25]); const p = a * b; const c = rng.pick([10, 20, 50, 100].filter((x) => p % x === 0 && x !== b)); if (!c) return G['5.1.8'](rng, lv, K); const x = p / c;
  return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${a} × ${b} = □ × ${c}` }, ans: x, opts: numOpts(rng, x, [p, a, x * 10, p - c].filter((y) => y !== x && y > 0), K, 1, 5000),
    math: { kind: 'expr', e: `${a}*${b}/${c}` }, hint: `Hitung ruas kiri dulu, lalu bagi dengan ${c}.`, explain: `${a} × ${b} = ${fmt(p)}. ${fmt(p)} : ${c} = ${x}.` });
};

G['5.2.1'] = (rng, lv, K) => {
  if (lv === 1) { const w = rng.int(6, 20), h = rng.int(3, w - 1); const P = 2 * (w + h);
    return item({ q: 'Berapa keliling persegi panjang ini?', v: { t: 'mshape', kind: 'rect', w, h }, ans: P, opts: withUnit(numOpts(rng, P, [w * h, w + h, 2 * w + h, 4 * w], K, 1, 1000), 'cm'),
      math: { kind: 'expr', e: `2*(${w}+${h})` }, hint: 'Keliling = jumlah panjang semua sisi.', explain: `${w} + ${h} + ${w} + ${h} = ${P} cm.` }); }
  if (lv === 2) { const n = rng.pick([5, 6, 8]), s = rng.int(3, 15); const P = n * s; const NM = { 5: 'segi lima', 6: 'segi enam', 8: 'segi delapan' };
    return item({ q: `Sebuah ${NM[n]} beraturan memiliki sisi ${s} cm. Berapa kelilingnya?`, v: { t: 'mshape', kind: 'poly', n, s }, ans: P, opts: withUnit(numOpts(rng, P, [(n - 1) * s, (n + 1) * s, s * s, n + s], K, 1, 1000), 'cm'),
      math: { kind: 'expr', e: `${n}*${s}` }, hint: 'Semua sisinya sama panjang. Hitung banyak sisinya.', explain: `${n} sisi × ${s} cm = ${P} cm.` }); }
  const w = rng.int(8, 16), h = rng.int(6, 12), cw = rng.int(2, w - 3), ch = rng.int(2, h - 3); const P = 2 * (w + h);
  return item({ q: 'Berapa keliling bangun gabungan ini?', v: { t: 'mshape', kind: 'L', w, h, cut: [cw, ch] }, ans: P, opts: withUnit(numOpts(rng, P, [P - 2 * ch, P - cw - ch, w * h - cw * ch, w + h + (w - cw) + (h - ch)], K, 1, 1000), 'cm'),
    math: { kind: 'expr', e: `2*(${w}+${h})` }, hint: 'Cari panjang sisi yang belum tertulis, lalu jumlahkan semua sisi.', explain: `Sisi yang belum tertulis: ${cw} cm dan ${ch} cm. Kelilingnya ${w} + ${h} + ${w - cw} + ${h - ch} + ${cw} + ${ch} = ${P} cm.` });
};

G['5.2.2'] = (rng, lv, K) => {
  if (lv === 1) { const w = rng.int(5, 15), h = rng.int(3, 12); const A = w * h;
    return item({ q: 'Berapa luas persegi panjang ini?', v: { t: 'mshape', kind: 'rect', w, h }, ans: A, opts: withUnit(numOpts(rng, A, [2 * (w + h), w + h, A + w], K, 1, 2000), 'cm²'),
      math: { kind: 'expr', e: `${w}*${h}` }, hint: 'Luas persegi panjang = panjang × lebar.', explain: `${w} × ${h} = ${A} cm².` }); }
  if (lv === 2) { const a = rng.int(3, 12) * 2, t = rng.int(3, 14); const A = (a * t) / 2;
    return item({ q: 'Berapa luas segitiga siku-siku ini?', v: { t: 'mshape', kind: 'tri', a, ht: t }, ans: A, opts: withUnit(numOpts(rng, A, [a * t, a + t, A + a].filter((x) => x !== A), K, 1, 2000), 'cm²'),
      math: { kind: 'expr', e: `${a}*${t}/2` }, hint: 'Segitiga ini setengah dari persegi panjang.', explain: `${a} × ${t} : 2 = ${A} cm².` }); }
  const w = rng.int(8, 16), h = rng.int(6, 12), cw = rng.int(2, w - 3), ch = rng.int(2, h - 3); const A = w * h - cw * ch;
  return item({ q: 'Berapa luas bangun gabungan ini?', v: { t: 'mshape', kind: 'L', w, h, cut: [cw, ch] }, ans: A, opts: withUnit(numOpts(rng, A, [w * h, 2 * (w + h), w * h - cw, A + cw * ch / 2].filter((x) => Number.isInteger(x) && x !== A), K, 1, 2000), 'cm²'),
    math: { kind: 'expr', e: `${w}*${h}-${cw}*${ch}` }, hint: 'Hitung luas persegi panjang besar, lalu kurangi bagian yang terpotong.', explain: `${w} × ${h} = ${w * h}. Bagian terpotong ${cw} × ${ch} = ${cw * ch}. Luasnya ${w * h} − ${cw * ch} = ${A} cm².` });
};

const angType = (d) => (d < 90 ? 'lancip' : d === 90 ? 'siku-siku' : d < 180 ? 'tumpul' : 'lurus');
G['5.2.3'] = (rng, lv, K) => {
  if (lv === 1) { const d = rng.pick([30, 40, 50, 60, 70, 90, 90, 110, 120, 135, 150, 180]); const ans = angType(d);
    return item({ q: 'Jenis sudut ini adalah sudut …', v: { t: 'angle', deg: d, rot: rng.pick([0, 0, 15, 30]) }, ans, opts: ['lancip', 'siku-siku', 'tumpul', 'lurus'].map((x) => ({ label: cap(x), value: x })),
      math: { kind: 'angtype', deg: d }, hint: 'Bandingkan dengan sudut siku-siku seperti pojok buku.', explain: `Sudut ini besarnya ${d}°. Sudut ${ans} ${ans === 'lancip' ? 'kurang dari 90°' : ans === 'siku-siku' ? 'tepat 90°' : ans === 'tumpul' ? 'lebih dari 90° dan kurang dari 180°' : 'tepat 180°'}.` }); }
  if (lv === 2) { const d = rng.int(2, 16) * 10;
    return item({ q: 'Berapa besar sudut yang ditunjukkan busur derajat ini?', v: { t: 'protractor', deg: d }, ans: d, opts: withUnit(numOpts(rng, d, [180 - d, d + 10, d - 10, d + 20].filter((x) => x !== d && x > 0 && x < 180), K, 0, 180), '°').map((o) => ({ ...o, label: o.label.replace(' °', '°') })),
      math: { kind: 'expr', e: `${d}` }, hint: 'Sinar biru ada di angka 0. Baca angka yang dilewati sinar merah.', explain: `Sinar merah menunjuk ${d}°, dihitung dari 0° pada sinar biru.` }); }
  if (rng.chance(0.5)) { const d = rng.pick([25, 45, 75, 89, 91, 100, 125, 160, 179]); const ans = angType(d);
    return item({ q: `Sudut yang besarnya ${d}° termasuk sudut …`, v: null, ans, opts: ['lancip', 'siku-siku', 'tumpul', 'lurus'].map((x) => ({ label: cap(x), value: x })), math: { kind: 'angtype', deg: d },
      hint: 'Lancip: kurang dari 90°. Tumpul: antara 90° dan 180°.', explain: `${d}° ${d < 90 ? 'kurang dari 90°' : 'lebih dari 90° dan kurang dari 180°'}, jadi sudut ${ans}.` }); }
  const [h, deg] = rng.pick([[3, 90], [9, 90], [6, 180], [2, 60], [4, 120], [1, 30], [5, 150]]);
  return item({ q: `Pada pukul ${String(h).padStart(2, '0')}.00, jarum pendek dan jarum panjang membentuk sudut sebesar …`, v: { t: 'clock', h, m: 0 }, ans: deg, opts: numOpts(rng, deg, [h * 10, deg + 30, deg - 30, 360 - deg].filter((x) => x > 0 && x !== deg && x <= 360), K, 0, 360).map((o) => ({ ...o, label: `${o.value}°` })),
    math: { kind: 'expr', e: `${Math.min(h, 12 - h)}*30` }, hint: 'Jarak antara dua angka di jam adalah 30°.', explain: `Jarum berjarak ${Math.min(h, 12 - h)} angka. ${Math.min(h, 12 - h)} × 30° = ${deg}°.` });
};

const TRI = {
  'sama sisi': { pts: [[50, 8], [96, 88], [4, 88]], ticks: [1, 1, 1], rights: [], def: 'ketiga sisinya sama panjang' },
  'sama kaki': { pts: [[50, 5], [80, 92], [20, 92]], ticks: [1, 0, 1], rights: [], def: 'tepat dua sisinya sama panjang' },
  'siku-siku': { pts: [[10, 10], [10, 90], [92, 90]], ticks: [0, 0, 0], rights: [1], def: 'salah satu sudutnya siku-siku' },
  sembarang: { pts: [[30, 10], [96, 90], [4, 70]], ticks: [0, 0, 0], rights: [], def: 'ketiga sisinya berbeda panjang dan tidak memiliki sudut siku-siku' },
};
G['5.2.4'] = (rng, lv, K) => {
  if (lv === 1) { const k = rng.pick(Object.keys(TRI)); const T0 = TRI[k];
    return item({ q: 'Segitiga ini termasuk segitiga …', v: { t: 'ptype', pts: T0.pts, ticks: T0.ticks, rights: T0.rights }, ans: k, opts: Object.keys(TRI).map((x) => ({ label: cap(x), value: x })),
      math: { kind: 'tritype', k }, hint: 'Garis kecil merah menandai sisi yang sama panjang. Kotak biru menandai sudut siku-siku.', explain: `Segitiga ini ${T0.def}, jadi termasuk segitiga ${k}.` }); }
  if (lv === 2) { const ans = rng.pick(Object.keys(QUAD));
    return item({ q: `Segiempat yang ${QUAD[ans]} adalah …`, v: null, ans, opts: textOpts(rng, ans, Object.keys(QUAD), K).map((o) => ({ label: cap(o.value), value: o.value })),
      math: { kind: 'quaddef', def: QUAD[ans] }, hint: 'Periksa sisi sejajar, sisi sama panjang, dan sudut siku-siku.', explain: `${cap(ans)} ${QUAD[ans]}.` }); }
  if (rng.chance(0.4)) return item({ q: 'Besar setiap sudut pada segitiga sama sisi adalah …', v: { t: 'ptype', pts: TRI['sama sisi'].pts, ticks: [1, 1, 1] }, ans: 60, opts: numOpts(rng, 60, [90, 45, 180, 30], K, 0, 180).map((o) => ({ ...o, label: `${o.value}°` })),
    math: { kind: 'expr', e: '180/3' }, hint: 'Jumlah sudut segitiga 180°, dan ketiga sudutnya sama besar.', explain: '180° : 3 = 60°.' });
  const a = rng.int(30, 80), b = rng.int(30, 140 - a); const c = 180 - a - b;
  return item({ q: `Dua sudut sebuah segitiga besarnya ${a}° dan ${b}°. Berapa besar sudut ketiga?`, v: null, ans: c, opts: numOpts(rng, c, [360 - a - b, a + b, 90 - a > 0 ? 90 - a : c + 10, c + 10], K, 1, 360).map((o) => ({ ...o, label: `${o.value}°` })),
    math: { kind: 'expr', e: `180-${a}-${b}` }, hint: 'Jumlah ketiga sudut segitiga selalu 180°.', explain: `180° − ${a}° − ${b}° = ${c}°.` });
};

const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}.${String(m % 60).padStart(2, '0')}`;
const durTxt = (m) => (m >= 60 ? `${Math.floor(m / 60)} jam${m % 60 ? ` ${m % 60} menit` : ''}` : `${m} menit`);
G['5.2.5'] = (rng, lv, K) => {
  if (lv === 1) { const h = rng.int(6, 15), m1 = rng.int(0, 7) * 5, d = rng.int(3, 11 - m1 / 5) * 5; const s = h * 60 + m1, e = s + d;
    return item({ q: `Rina belajar dari pukul ${hhmm(s)} sampai pukul ${hhmm(e)}. Berapa lama Rina belajar?`, v: { t: 'dclock', start: hhmm(s), end: hhmm(e) }, ans: d,
      opts: numOpts(rng, d, [d + 5, d - 5, d + 10, e % 60].filter((x) => x > 0 && x !== d), K, 1, 600).map((o) => ({ ...o, label: durTxt(o.value) })), math: { kind: 'duration', s, e }, hint: 'Hitung maju dari waktu mulai sampai waktu selesai.', explain: `Dari ${hhmm(s)} ke ${hhmm(e)} adalah ${d} menit.` }); }
  if (lv === 2) { const s = rng.int(6, 14) * 60 + rng.int(6, 11) * 5, d = rng.int(13, 30) * 5; const e = s + d;
    const naive = (Math.floor(e / 60) - Math.floor(s / 60)) * 60 + Math.abs((e % 60) - (s % 60));
    return item({ q: `Perjalanan bus dimulai pukul ${hhmm(s)} dan tiba pukul ${hhmm(e)}. Berapa lama perjalanan itu?`, v: { t: 'dclock', start: hhmm(s), end: hhmm(e) }, ans: d,
      opts: numOpts(rng, d, [naive, d + 60, d - 10, d + 20].filter((x) => x > 0 && x !== d), K, 1, 900).map((o) => ({ ...o, label: durTxt(o.value) })), math: { kind: 'duration', s, e },
      hint: 'Hitung sampai jam berikutnya dulu, lalu tambahkan sisanya.', explain: `Dari ${hhmm(s)} ke ${hhmm(e)} = ${durTxt(d)}.` }); }
  const s = rng.int(7, 15) * 60 + rng.int(1, 11) * 5, d = rng.int(10, 26) * 5; const e = s + d;
  const opts = uniq([hhmm(e), hhmm(e + 60), hhmm(e - 10), hhmm(s + Math.floor(d / 60) * 60 + ((s % 60) + (d % 60)) % 60), hhmm(e + 10)]).slice(0, K);
  return item({ q: `Lomba dimulai pukul ${hhmm(s)} dan berlangsung selama ${durTxt(d)}. Pukul berapa lomba selesai?`, v: { t: 'dclock', start: hhmm(s) }, ans: hhmm(e), opts: rng.shuffle(opts).map((x) => ({ label: `Pukul ${x}`, value: x })),
    math: { kind: 'endtime', s, d }, hint: 'Tambahkan jamnya dulu, lalu menitnya. Ingat: 60 menit = 1 jam.', explain: `${hhmm(s)} ditambah ${durTxt(d)} adalah pukul ${hhmm(e)}.` });
};

G['5.2.6'] = (rng, lv, K) => {
  const nm = rng.pick(NAMES);
  if (lv === 1) { const a = rng.int(5, 30) * 500, b = rng.int(4, 40) * 500; const s = a + b;
    return item({ q: `${nm} membeli buku tulis seharga ${rp(a)} dan pensil warna seharga ${rp(b)}. Berapa yang harus dibayar ${nm}?`, v: null, ans: s,
      opts: numOpts(rng, s, [s + 1000, s - 500, Math.abs(a - b), s + 500].filter((x) => x !== s && x > 0), K, 0, 200000).map((o) => ({ ...o, label: rp(o.value) })), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Jumlahkan kedua harga.', explain: `${rp(a)} + ${rp(b)} = ${rp(s)}.` }); }
  if (lv === 2) { const pay = rng.pick([20000, 50000, 100000]); const cost = rng.int(Math.floor(pay / 2500), Math.floor(pay / 500) - 1) * 500; const ch = pay - cost;
    return item({ q: `${nm} berbelanja seharga ${rp(cost)}. Ia membayar dengan uang ini. Berapa uang kembaliannya?`, v: { t: 'money', items: [pay] }, ans: ch,
      opts: numOpts(rng, ch, [ch + 1000, ch - 500, smallFromBig(pay, cost), ch + 500].filter((x) => x !== ch && x > 0), K, 0, 200000).map((o) => ({ ...o, label: rp(o.value) })), math: { kind: 'expr', e: `${pay}-${cost}` },
      hint: 'Kembalian = uang yang dibayarkan − harga belanja.', explain: `${rp(pay)} − ${rp(cost)} = ${rp(ch)}.` }); }
  const per = rng.pick([1000, 1500, 2000, 2500, 5000]), wk = rng.int(2, 6); const days = wk * 7; const tot = per * days;
  return item({ q: `${nm} menabung ${rp(per)} setiap hari selama ${wk} minggu. Berapa jumlah tabungannya?`, v: null, ans: tot,
    opts: numOpts(rng, tot, [per * wk, per * wk * 5, tot + per, tot - per * 7], K, 0, 1000000).map((o) => ({ ...o, label: rp(o.value) })), math: { kind: 'expr', e: `${per}*${days}` }, hint: `${wk} minggu = ${wk} × 7 hari.`, explain: `${wk} × 7 = ${days} hari. ${rp(per)} × ${days} = ${rp(tot)}.` });
};

G['5.2.7'] = (rng, lv, K) => {
  const scores = [60, 70, 80, 90, 100]; const freq = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 5);
  const tab = { t: 'table', head: ['Nilai', 'Banyak siswa'], rows: scores.map((s, i) => [s, freq[i]]) };
  if (lv === 1) { const i = rng.int(0, 4);
    return item({ q: `Tabel frekuensi ini menunjukkan nilai ulangan siswa kelas 5. Berapa siswa yang mendapat nilai ${scores[i]}?`, v: tab, ans: freq[i], opts: numOpts(rng, freq[i], freq, K, 0, 20),
      math: { kind: 'read', rows: scores.map((s, j) => ({ label: String(s), n: freq[j] })), label: String(scores[i]) }, hint: 'Cari baris nilainya, lalu lihat kolom banyak siswa.', explain: `Ada ${freq[i]} siswa yang mendapat nilai ${scores[i]}.` }); }
  if (lv === 2) { const tot = freq.reduce((a, b) => a + b, 0);
    return item({ q: 'Tabel frekuensi ini menunjukkan nilai ulangan siswa kelas 5. Berapa banyak siswa seluruhnya?', v: tab, ans: tot, opts: numOpts(rng, tot, [tot - 1, tot + 1, scores.length, tot - freq[0]], K, 0, 100),
      math: { kind: 'expr', e: freq.join('+') }, hint: 'Jumlahkan semua angka di kolom banyak siswa.', explain: `${freq.join(' + ')} = ${tot} siswa.` }); }
  const above = scores.map((s, i) => [s, freq[i]]).filter(([s]) => s >= 80).reduce((a, [, f]) => a + f, 0);
  return item({ q: 'Tabel frekuensi ini menunjukkan nilai ulangan siswa kelas 5. Berapa siswa yang mendapat nilai 80 atau lebih?', v: tab, ans: above,
    opts: numOpts(rng, above, [freq[2], freq[2] + freq[3], above + freq[1]], K, 0, 100), math: { kind: 'expr', e: `${freq[2]}+${freq[3]}+${freq[4]}` }, hint: 'Nilai 80 atau lebih berarti 80, 90, dan 100.', explain: `${freq[2]} + ${freq[3]} + ${freq[4]} = ${above} siswa.` });
};

G['5.2.8'] = (rng, lv, K) => {
  if (lv === 2) { const vals = uniq([...Array(4)].map(() => bigNum(rng, 6, 0.3))); while (vals.length < 4) vals.push(bigNum(rng, 6)); const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
    return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.sort((a, b) => a - b).map((x) => ({ label: fmt(x), value: x })), math: { kind: big ? 'max' : 'min', vals },
      hint: 'Bandingkan ratus ribuannya dulu.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${fmt(ans)}.` }); }
  return pvItem(rng, lv, K, 6, 1000000);
};

// ===================== KELAS 6 =====================
G['6.1.1'] = (rng, lv, K) => {
  if (lv === 1) { const k = rng.int(2, 6), d = rng.int(3, 9), n = rng.int(1, d - 1); const ans = fracStr(k * n, d);
    return item({ q: `${k} × ${n}/${d} = …`, v: null, ans, opts: fracOpts(rng, ans, [`${k * n}/${k * d}`, fracStr(n, k * d), fracStr(k + n, d), fracStr(k * n + 1, d), fracStr(k * d, n)], K),
      math: { kind: 'fracexpr', e: `${k}*${n}/${d}` }, hint: 'Kalikan bilangan asli dengan pembilangnya saja.', explain: `${k} × ${n}/${d} = ${k * n}/${d}${ans !== `${k * n}/${d}` ? ` = ${ans}` : ''}.` }); }
  if (lv === 2) { const d = rng.pick([2, 3, 4, 5, 6]), n = rng.int(1, d - 1), m = rng.int(2, 6) * d; const ans = fracStr(n * m, d);
    return item({ q: `${n}/${d} × ${m} = …`, v: null, ans, opts: fracOpts(rng, ans, [fracStr(n, d * m), String(m / d), fracStr(n * m + d, d), String(n + m), fracStr(m, n * d)], K),
      math: { kind: 'fracexpr', e: `${n}/${d}*${m}` }, hint: `${n}/${d} dari ${m} berarti ${m} dibagi ${d}, lalu dikali ${n}.`, explain: `${m} : ${d} = ${m / d}, lalu ${m / d} × ${n} = ${(m / d) * n}.` }); }
  const d = rng.pick([2, 3, 4]), n = rng.int(1, d - 1), days = rng.int(3, 9); const ans = fracStr(n * days, d);
  return item({ q: `Setiap hari Bayu minum ${n}/${d} liter susu. Berapa liter susu yang diminum Bayu selama ${days} hari?`, v: null, ans,
    opts: withUnit(fracOpts(rng, ans, [fracStr(n, d * days), fracStr(n + days, d), fracStr(n * days + 1, d), fracStr(n * days, d + 1), String(days)], K), 'liter'), math: { kind: 'fracexpr', e: `${days}*${n}/${d}` },
    hint: 'Kalikan banyak hari dengan susu per hari.', explain: `${days} × ${n}/${d} = ${n * days}/${d}${ans !== `${n * days}/${d}` ? ` = ${ans}` : ''} liter.` });
};

G['6.1.2'] = (rng, lv, K) => {
  if (lv === 1) { const k = rng.int(2, 5), d = rng.int(3, 9), n = k * rng.int(1, Math.floor((d - 1) / k) || 1); if (n >= d) return G['6.1.2'](rng, lv, K); const ans = fracStr(n, d * k);
    return item({ q: `${n}/${d} : ${k} = …`, v: null, ans, opts: fracOpts(rng, ans, [fracStr(n * k, d), fracStr(n, d + k), fracStr(k, n * d), fracStr(n + k, d * k), `${n}/${d * k + 1}`], K),
      math: { kind: 'fracexpr', e: `${n}/${d}/${k}` }, hint: `Membagi dengan ${k} sama dengan mengalikan dengan 1/${k}.`, explain: `${n}/${d} : ${k} = ${n}/${d} × 1/${k} = ${n}/${d * k}${ans !== `${n}/${d * k}` ? ` = ${ans}` : ''}.` }); }
  if (lv === 2) { const k = rng.int(2, 9), d = rng.pick([2, 3, 4, 5]); const ans = String(k * d);
    return item({ q: `${k} : 1/${d} = …`, v: null, ans, opts: fracOpts(rng, ans, [fracStr(k, d), fracStr(d, k), String(k + d), String(k * d + 1), fracStr(1, k * d)], K),
      math: { kind: 'fracexpr', e: `${k}/(1/${d})` }, hint: `Berapa banyak 1/${d} dalam ${k} utuh?`, explain: `Setiap 1 utuh berisi ${d} bagian 1/${d}. ${k} × ${d} = ${k * d}.` }); }
  const d = rng.pick([2, 4, 5]), n = rng.int(1, d - 1); const len = n * rng.int(2, 8); if (gcd(n, d) > 1) return G['6.1.2'](rng, lv, K); const pieces = (len * d) / n;
  return item({ q: `Pita sepanjang ${len} meter dipotong menjadi beberapa bagian. Setiap bagian panjangnya ${n}/${d} meter. Berapa banyak potongan pita?`, v: null, ans: String(pieces),
    opts: fracOpts(rng, String(pieces), [fracStr(len * n, d), String(len * d), String(pieces + 1), String(len + d), fracStr(len, d)], K).map((o) => ({ ...o, label: `${o.label} potong` })), math: { kind: 'fracexpr', e: `${len}/(${n}/${d})` },
    hint: 'Bagilah panjang pita dengan panjang setiap potongan.', explain: `${len} : ${n}/${d} = ${len} × ${d}/${n} = ${pieces} potong.` });
};

G['6.1.3'] = (rng, lv, K) => {
  if (lv === 1) { const [fr, v] = rng.pick([['1/2', 0.5], ['3/5', 0.6], ['2/5', 0.4], ['4/5', 0.8], ['1/5', 0.2], ['7/10', 0.7], ['3/2', 1.5], ['9/10', 0.9]]); const [a, b] = fr.split('/').map(Number);
    return item({ q: `Pecahan ${fr} jika ditulis dalam bentuk desimal adalah …`, v: null, ans: v, opts: decOpts(rng, v, [a / 10 + b / 100 > 0 ? Number(`${a}.${b}`) : 0.3, b / 10, v / 10, (b - a) / 10], K),
      math: { kind: 'dec', e: fr }, hint: 'Ubah dulu menjadi pecahan berpenyebut 10.', explain: `${fr} = ${Math.round(v * 10)}/10 = ${fmtDec(v)}.` }); }
  const vals = uniq([...Array(4)].map(() => rng.int(10, 59) / 10)); while (vals.length < 4) vals.push(rng.int(10, 59) / 10);
  if (lv === 2) { const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
    return item({ q: `Bilangan desimal mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.sort((a, b) => a - b).map((x) => ({ label: fmtDec(x), value: x })),
      math: { kind: big ? 'max' : 'min', vals }, hint: 'Bandingkan bilangan bulatnya dulu, lalu angka di belakang koma.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${fmtDec(ans)}.` }); }
  const asc = rng.chance(0.5); const { right, opts } = orderOpts(rng, vals, asc, K, (x) => fmtDec(x));
  return item({ q: `Urutan bilangan desimal dari yang ${asc ? 'terkecil' : 'terbesar'} adalah …`, v: { t: 'dline', from: 0, to: 6, step: 0.5, labels: [0, 1, 2, 3, 4, 5, 6], dp: 0 }, ans: right, opts,
    math: { kind: 'orderdec', vals, asc }, hint: 'Bayangkan letak setiap bilangan pada garis bilangan.', explain: `Urutannya: ${right}.` });
};

G['6.1.4'] = (rng, lv, K) => {
  if (lv === 1) { const d = rng.int(3, 8), w = rng.int(1, 4), r = rng.int(1, d - 1); if (gcd(r, d) > 1) return G['6.1.4'](rng, lv, K); const n = w * d + r; const ans = `${w} ${r}/${d}`;
    return item({ q: `Bentuk pecahan campuran dari ${n}/${d} adalah …`, v: null, ans, opts: fracOpts(rng, ans, [`${w + 1} ${r}/${d}`, `${r} ${w}/${d}`, `${w} ${d - r}/${d}`, `${w} ${r}/${n}`], K),
      math: { kind: 'fracval', n, d }, hint: `Bagilah ${n} dengan ${d}. Hasil bagi menjadi bilangan bulat, sisanya menjadi pembilang.`, explain: `${n} : ${d} = ${w} sisa ${r}, jadi ${n}/${d} = ${ans}.` }); }
  if (lv === 2) { const [fr, p] = rng.pick([['3/5', 60], ['1/4', 25], ['7/10', 70], ['3/4', 75], ['2/5', 40], ['9/20', 45], ['1/20', 5], ['6/25', 24]]); const [a, b] = fr.split('/').map(Number);
    return item({ q: `Pecahan ${fr} sama dengan berapa persen?`, v: null, ans: p, opts: numOpts(rng, p, [Number(`${a}${b}`), a * 10, 100 - p, b].filter((x) => x !== p && x <= 100), K, 0, 100).map((o) => ({ ...o, label: `${o.value}%` })),
      math: { kind: 'dec', e: `${a}/${b}*100` }, hint: 'Ubah menjadi pecahan berpenyebut 100.', explain: `${fr} = ${p}/100 = ${p}%.` }); }
  for (;;) {
    const cands = [{ l: `${rng.int(1, 9) * 10}%`, v: 0 }, { l: fmtDec(rng.int(1, 9) / 10), v: 0 }, { l: rng.pick(['1/2', '1/4', '3/4', '2/5', '3/5', '4/5']), v: 0 }, { l: `${rng.pick([15, 35, 55, 65, 85])}%`, v: 0 }];
    cands.forEach((c) => { c.v = c.l.endsWith('%') ? Number(c.l.slice(0, -1)) / 100 : c.l.includes('/') ? fracVal(c.l) : Number(c.l.replace(',', '.')); });
    if (new Set(cands.map((c) => c.v)).size < 4) continue;
    const big = rng.chance(0.5); const best = cands.reduce((m, c) => (big ? (c.v > m.v ? c : m) : c.v < m.v ? c : m));
    return item({ q: `Manakah yang nilainya paling ${big ? 'besar' : 'kecil'}?`, v: null, ans: best.l, opts: rng.shuffle(cands).map((c) => ({ label: c.l, value: c.l })), math: { kind: big ? 'mixmax' : 'mixmin' },
      hint: 'Ubah semuanya ke bentuk yang sama, misalnya persen.', explain: `Jika diubah ke persen: ${cands.map((c) => `${c.l} = ${Math.round(c.v * 100)}%`).join('; ')}. Yang paling ${big ? 'besar' : 'kecil'} adalah ${best.l}.` });
  }
};

G['6.1.5'] = (rng, lv, K) => {
  if (lv === 1) { const r = rng.int(2, 4), a = rng.int(1, 5); const seq = [0, 1, 2, 3].map((i) => a * r ** i); const ans = a * r ** 4;
    return item({ q: `Bilangan berikutnya pada pola ${seq.map(fmt).join(', ')}, … adalah …`, v: null, ans, opts: numOpts(rng, ans, [seq[3] + (seq[3] - seq[2]), seq[3] * (r + 1), ans + r, seq[3] + r], K, 1, 100000),
      math: { kind: 'seqmul', seq, next: 1 }, hint: 'Bandingkan setiap bilangan dengan bilangan sebelumnya. Dikali berapa?', explain: `Setiap langkah dikali ${r}. ${fmt(seq[3])} × ${r} = ${fmt(ans)}.` }); }
  if (lv === 2) { const r = rng.pick([2, 3, 5, 10]), last = rng.int(1, 9); const seq = [4, 3, 2, 1].map((i) => last * r ** i); const ans = last;
    return item({ q: `Bilangan berikutnya pada pola ${seq.map(fmt).join(', ')}, … adalah …`, v: null, ans, opts: numOpts(rng, ans, [seq[3] - (seq[2] - seq[3]) > 0 ? seq[3] - (seq[2] - seq[3]) : ans + 2, seq[3] - r > 0 ? seq[3] - r : ans + 1, ans * 2, seq[3]], K, 0, 100000),
      math: { kind: 'seqmul', seq, next: 1 }, hint: 'Pola ini mengecil. Coba bagi setiap bilangan dengan bilangan yang sama.', explain: `Setiap langkah dibagi ${r}. ${fmt(seq[3])} : ${r} = ${ans}.` }); }
  const r = rng.pick([2, 3, 4]), a = rng.int(2, 7); const seq = [0, 1, 2, 3].map((i) => a * r ** i); const miss = rng.int(1, 2); const ans = seq[miss];
  return item({ q: `Bilangan yang tepat untuk melengkapi pola ${seq.map((x, i) => (i === miss ? '…' : fmt(x))).join(', ')} adalah …`, v: null, ans,
    opts: numOpts(rng, ans, [(seq[miss - 1] + seq[miss + 1]) / 2, ans + r, ans * 2 === ans ? ans + 1 : seq[miss - 1] + r, ans - 1].filter((x) => Number.isInteger(x) && x !== ans), K, 1, 100000), math: { kind: 'seqmulmiss', seq: seq.map((x, i) => (i === miss ? null : x)) },
    hint: 'Cari bilangan pengali yang tetap pada pola ini.', explain: `Setiap langkah dikali ${r}. ${fmt(seq[miss - 1])} × ${r} = ${fmt(ans)}.` });
};

const PAIRS = [['🍎', 'apel', '🍊', 'jeruk'], ['🔵', 'kelereng biru', '🔴', 'kelereng merah'], ['🐔', 'ayam', '🦆', 'bebek'], ['🌻', 'bunga matahari', '🌹', 'bunga mawar']];
const ratioStr = (a, b) => `${a} : ${b}`;
G['6.1.6'] = (rng, lv, K) => {
  if (lv === 1) { let a, b; do { a = rng.int(2, 7); b = rng.int(2, 7); } while (a === b || gcd(a, b) > 1); const [ea, na, eb, nb] = rng.pick(PAIRS); const ans = ratioStr(a, b);
    const pool = uniq([ratioStr(b, a), ratioStr(a, a + b), ratioStr(a + b, b), ratioStr(a, b + 1), ratioStr(a - 1 || a + 1, b)]).filter((x) => x !== ans);
    return item({ q: `Perbandingan banyak ${na} dan ${nb} adalah …`, v: { t: 'ratio', a, b, ea, eb }, ans, opts: rng.shuffle([ans, ...rng.sample(pool, K - 1)]).map((x) => ({ label: x, value: x })),
      math: { kind: 'ratio', a, b }, hint: 'Hitung masing-masing. Urutannya harus sama dengan urutan di pertanyaan.', explain: `Ada ${a} ${na} dan ${b} ${nb}, jadi perbandingannya ${a} : ${b}.` }); }
  if (lv === 2) { let a, b; do { a = rng.int(1, 6); b = rng.int(2, 9); } while (a === b || gcd(a, b) > 1); const m = rng.int(2, 5); const ans = ratioStr(a * m, b * m);
    const pool = uniq([ratioStr(b * m, a * m), ratioStr(a + m, b + m), ratioStr(a * m, b + m), ratioStr(a * m, b * m + 1)]).filter((x) => x !== ans);
    return item({ q: `Rasio yang senilai dengan ${a} : ${b} adalah …`, v: null, ans, opts: rng.shuffle([ans, ...pool.slice(0, K - 1)]).map((x) => ({ label: x, value: x })),
      math: { kind: 'ratio', a, b }, hint: 'Kedua bilangan harus dikali dengan bilangan yang sama.', explain: `${a} × ${m} = ${a * m} dan ${b} × ${m} = ${b * m}, jadi ${a} : ${b} = ${ans}.` }); }
  let a, b; do { a = rng.int(2, 5); b = rng.int(2, 9); } while (a === b || gcd(a, b) > 1); const m = rng.int(2, 8); const [n1, n2] = rng.sample(NAMES, 2);
  return item({ q: `Perbandingan kelereng ${n1} dan ${n2} adalah ${a} : ${b}. Jika kelereng ${n1} ada ${a * m}, berapa kelereng ${n2}?`, v: null, ans: b * m,
    opts: numOpts(rng, b * m, [a * m + (b - a), b + m, a * b * m, b * m + b], K, 1, 500), math: { kind: 'expr', e: `${a * m}/${a}*${b}` }, hint: `${a * m} adalah ${a} dikali berapa?`, explain: `${a * m} : ${a} = ${m}. Kelereng ${n2} = ${b} × ${m} = ${b * m}.` });
};

G['6.1.7'] = (rng, lv, K) => {
  if (lv === 1) { const n = rng.int(3, 8), u = rng.int(2, 9) * 500; const tot = n * u;
    return item({ q: `Harga ${n} buku tulis adalah ${rp(tot)}. Berapa harga 1 buku tulis?`, v: null, ans: u, opts: numOpts(rng, u, [tot - n, u + 500, u * 2, tot / 2].filter((x) => Number.isInteger(x) && x !== u), K, 1, 200000).map((o) => ({ ...o, label: rp(o.value) })),
      math: { kind: 'expr', e: `${tot}/${n}` }, hint: 'Bagi harga total dengan banyak buku.', explain: `${rp(tot)} : ${n} = ${rp(u)}.` }); }
  if (lv === 2) { const n = rng.int(2, 5), u = rng.int(2, 8) * 1000, m = rng.int(6, 12); const tot = n * u;
    return item({ q: `Harga ${n} bungkus roti adalah ${rp(tot)}. Berapa harga ${m} bungkus roti?`, v: null, ans: u * m, opts: numOpts(rng, u * m, [tot * m, tot + (m - n) * 1000, u * (m - n), tot * (m - n)].filter((x) => x !== u * m && x > 0), K, 1, 1000000).map((o) => ({ ...o, label: rp(o.value) })),
      math: { kind: 'expr', e: `${tot}/${n}*${m}` }, hint: 'Cari harga 1 bungkus dulu.', explain: `Harga 1 bungkus = ${rp(tot)} : ${n} = ${rp(u)}. Harga ${m} bungkus = ${rp(u)} × ${m} = ${rp(u * m)}.` }); }
  if (rng.chance(0.5)) { const sp = rng.int(8, 20), h = rng.int(2, 5); const d = sp * h;
    return item({ q: `Sebuah sepeda menempuh ${sp} km dalam 1 jam. Dengan kecepatan yang sama, berapa jarak yang ditempuh dalam ${h} jam?`, v: null, ans: d, opts: withUnit(numOpts(rng, d, [sp + h, d + sp, sp * (h - 1)], K, 1, 1000), 'km'),
      math: { kind: 'expr', e: `${sp}*${h}` }, hint: 'Setiap jam menempuh jarak yang sama.', explain: `${sp} km × ${h} = ${d} km.` }); }
  const cups = rng.int(2, 4), cakes = rng.pick([8, 10, 12]), want = cakes * rng.int(2, 4); const need = (cups * want) / cakes;
  return item({ q: `Resep membutuhkan ${cups} gelas tepung untuk ${cakes} kue. Berapa gelas tepung untuk ${want} kue?`, v: null, ans: need, opts: withUnit(numOpts(rng, need, [cups + (want - cakes), want / cups, need + cups, need * 2].filter((x) => Number.isInteger(x) && x !== need), K, 1, 200), 'gelas'),
    math: { kind: 'expr', e: `${cups}*${want}/${cakes}` }, hint: `${want} kue adalah berapa kali ${cakes} kue?`, explain: `${want} : ${cakes} = ${want / cakes}. Tepung = ${cups} × ${want / cakes} = ${need} gelas.` });
};

G['6.1.8'] = (rng, lv, K) => {
  const sOpts = (ans, cands) => { const s = [ans]; for (const c of rng.shuffle(uniq(cands))) if (s.length < K && !s.includes(c)) s.push(c); for (let d = 1; s.length < K; d++) { if (!s.includes(ans + d)) s.push(ans + d); else if (!s.includes(ans - d)) s.push(ans - d); } return s.sort((a, b) => a - b).map((v) => ({ label: signed(v), value: v })); };
  if (lv === 1) { const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4]);
    return item({ q: 'Bilangan bulat yang ditunjuk panah adalah …', v: { t: 'dline', from: -5, to: 5, step: 1, labels: [-5, 0, 5], arrow: x, dp: 0 }, ans: x, opts: sOpts(x, [-x, x + 1, x - 1]),
      math: { kind: 'int', v: x }, hint: 'Bilangan di kiri 0 adalah bilangan negatif.', explain: `Panah berada ${Math.abs(x)} langkah di ${x < 0 ? 'kiri' : 'kanan'} 0, jadi bilangannya ${signed(x)}.` }); }
  if (lv === 2) { const vals = rng.sample([-9, -7, -6, -4, -3, -2, -1, 0, 2, 3, 5, 8], 4); const small = rng.chance(0.6); const ans = small ? Math.min(...vals) : Math.max(...vals);
    return item({ q: `Bilangan mana yang paling ${small ? 'kecil' : 'besar'}?`, v: null, ans, opts: vals.sort((a, b) => a - b).map((v) => ({ label: signed(v), value: v })), math: { kind: small ? 'min' : 'max', vals },
      hint: 'Pada garis bilangan, makin ke kiri makin kecil.', explain: `Yang paling ${small ? 'kecil' : 'besar'} adalah ${signed(ans)}.` }); }
  const t0 = rng.int(-8, -1), up = rng.int(3, 12); const t1 = t0 + up;
  return item({ q: `Suhu di puncak gunung pada pagi hari ${signed(t0)} °C. Pada siang hari suhunya naik ${up} °C. Berapa suhu pada siang hari?`, v: { t: 'dline', from: -10, to: 10, step: 1, labels: [-10, -5, 0, 5, 10], mark: t0, dp: 0 }, ans: t1,
    opts: sOpts(t1, [-t1, t0 - up, -t0 + up, t1 + 2]).map((o) => ({ ...o, label: `${o.label} °C` })), math: { kind: 'int', v: t0 + up }, hint: 'Mulai dari suhu pagi, lalu melangkah ke kanan sebanyak kenaikannya.', explain: `${signed(t0)} + ${up} = ${signed(t1)}. Suhu siang hari ${signed(t1)} °C.` });
};

G['6.1.9'] = (rng, lv, K) => {
  if (lv < 3) { const sc = lv === 1 ? 100000 : rng.pick([50000, 200000, 250000]); const cm = rng.int(2, 9); const km = (cm * sc) / 100000;
    return item({ q: `Skala sebuah peta 1 : ${fmt(sc)}. Jarak dua kota di peta ${cm} cm. Berapa jarak sebenarnya?`, v: { t: 'scalemap', cm: Math.min(cm, 8), scaleTxt: `Skala 1 : ${fmt(sc)}`, a: '🏠', b: '🏫' }, ans: km,
      opts: decOpts(rng, km, [km * 10, km / 10, cm * sc / 1000, km + cm], K, ' km'), math: { kind: 'dec', e: `${cm}*${sc}/100000` }, hint: '1 km = 100.000 cm.', explain: `${cm} × ${fmt(sc)} = ${fmt(cm * sc)} cm = ${fmtDec(km)} km.` }); }
  const sc = rng.pick([100000, 200000, 500000]); const cm = rng.int(2, 8); const km = (cm * sc) / 100000;
  return item({ q: `Jarak sebenarnya dua kota ${fmt(km)} km. Skala peta 1 : ${fmt(sc)}. Berapa jarak kedua kota itu di peta?`, v: null, ans: cm, opts: withUnit(numOpts(rng, cm, [cm * 10, km, cm + 1, Math.round(km * 2)].filter((x) => x !== cm), K, 1, 10000), 'cm'),
    math: { kind: 'expr', e: `${km}*100000/${sc}` }, hint: 'Ubah km menjadi cm dulu, lalu bagi dengan angka skala.', explain: `${fmt(km)} km = ${fmt(km * 100000)} cm. ${fmt(km * 100000)} : ${fmt(sc)} = ${cm} cm.` });
};

// jaring-jaring kubus: lipatan disimulasikan dengan menggulingkan dadu
function foldsToCube(cells) {
  const key = (c) => c.join(','); const set = new Set(cells.map(key)); const seen = new Map();
  const roll = (s, dir) => { const [d, u, n, so, e, w] = s; if (dir === 'E') return [e, w, n, so, u, d]; if (dir === 'W') return [w, e, n, so, d, u]; if (dir === 'N') return [n, so, u, d, e, w]; return [so, n, d, u, e, w]; };
  const q = [[cells[0], [0, 1, 2, 3, 4, 5]]]; seen.set(key(cells[0]), 0);
  while (q.length) { const [[x, y], s] = q.shift(); for (const [dx, dy, dir] of [[1, 0, 'E'], [-1, 0, 'W'], [0, -1, 'N'], [0, 1, 'S']]) { const k = key([x + dx, y + dy]); if (set.has(k) && !seen.has(k)) { const ns = roll(s, dir); seen.set(k, ns[0]); q.push([[x + dx, y + dy], ns]); } } }
  return seen.size === 6 && new Set(seen.values()).size === 6;
}
const normCells = (cells) => { const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1])); return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
function randomHexomino(rng) { for (;;) { const c = polyCells(rng, 6); if (c.length === 6) return normCells(c); } }
G['6.2.1'] = (rng, lv, K) => {
  if (lv === 1) {
    const valid = (() => { for (;;) { const c = randomHexomino(rng); if (foldsToCube(c)) return c; } })();
    const wrong = []; while (wrong.length < K - 1) { const c = randomHexomino(rng); const j = JSON.stringify(c); if (!foldsToCube(c) && !wrong.includes(j)) wrong.push(j); }
    const vj = JSON.stringify(valid);
    return item({ q: 'Manakah yang merupakan jaring-jaring kubus?', v: null, ans: vj, opts: rng.shuffle([vj, ...wrong]).map((j) => ({ label: `@cells:${j}`, value: j, html: true })),
      math: { kind: 'cubenet' }, hint: 'Bayangkan setiap gambar dilipat. Tidak boleh ada dua persegi yang menumpuk.', explain: 'Jaring-jaring yang benar dapat dilipat menjadi kubus tanpa ada sisi yang menumpuk atau terbuka.' }); }
  if (lv === 2) { const h = stackHeights(rng, rng.int(2, 3), 3); const n = stackCount(h);
    return item({ q: 'Bangun ini disusun dari berapa kubus satuan? Tidak ada kubus yang melayang.', v: { t: 'kstack', heights: h }, ans: n, opts: withUnit(numOpts(rng, n, [n - 1, n + 1, n - 2, n + 3], K, 1, 60), 'kubus'),
      math: { kind: 'stackcount', heights: h }, hint: 'Hitung tumpukan satu per satu, termasuk kubus yang tertutup di bawahnya.', explain: `Jumlah semua tumpukan adalah ${h.flat().filter((x) => x).join(' + ')} = ${n} kubus.` }); }
  const p = rng.int(3, 4), l = rng.int(2, 3), t = rng.int(2, 3), r = rng.int(1, 3); const n = p * l * t - r;
  return item({ q: `Sebuah balok disusun dari kubus satuan berukuran ${p} × ${l} × ${t}. Kemudian ${r} kubus di bagian pojok diambil. Berapa kubus yang tersisa?`, v: { t: 'cubes', l: p, w: l, h: t }, ans: n,
    opts: withUnit(numOpts(rng, n, [p * l * t, p + l + t - r, n - 1, n + 2], K, 1, 100), 'kubus'), math: { kind: 'expr', e: `${p}*${l}*${t}-${r}` }, hint: 'Hitung semua kubus balok, lalu kurangi yang diambil.', explain: `${p} × ${l} × ${t} = ${p * l * t}. ${p * l * t} − ${r} = ${n} kubus.` });
};

function views(h) {
  const R = h.length, C = h[0].length, H = Math.max(...h.flat());
  const top = []; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (h[r][c]) top.push([c, r]);
  const front = []; for (let c = 0; c < C; c++) { const m = Math.max(...h.map((row) => row[c])); for (let z = 0; z < m; z++) front.push([c, H - 1 - z]); }
  const right = []; for (let r = 0; r < R; r++) { const m = Math.max(...h[r]); for (let z = 0; z < m; z++) right.push([R - 1 - r, H - 1 - z]); }
  return { top: normCells(top), front: normCells(front), right: normCells(right) };
}
const mirror = (cells) => normCells(cells.map(([x, y]) => [-x, y]));
const flipV = (cells) => normCells(cells.map(([x, y]) => [x, -y]));
G['6.2.2'] = (rng, lv, K) => {
  for (let tries = 0; tries < 60; tries++) {
    const h = stackHeights(rng, rng.int(2, 3), 3); const V = views(h); const which = lv === 1 ? 'top' : lv === 2 ? 'front' : 'right';
    const ans = JSON.stringify(V[which]);
    const pool = uniq([V.top, V.front, V.right, mirror(V[which]), flipV(V[which]), mirror(V.top), flipV(V.front)].map((c) => JSON.stringify(c))).filter((j) => j !== ans);
    if (pool.length < K - 1) continue;
    const NAME = { top: 'atas', front: 'depan', right: 'samping kanan' };
    return item({ q: `Manakah gambar tampak ${NAME[which]} dari susunan kubus ini?`, v: { t: 'kstack', heights: h }, ans, opts: rng.shuffle([ans, ...rng.sample(pool, K - 1)]).map((j) => ({ label: `@cells:${j}`, value: j, html: true })),
      math: { kind: 'view', heights: h, which }, hint: which === 'top' ? 'Bayangkan kamu melihat dari atas. Hanya bagian atas setiap tumpukan yang terlihat.' : which === 'front' ? 'Bayangkan kamu berdiri di depan susunan. Lihat tumpukan tertinggi di setiap kolom.' : 'Bayangkan kamu berdiri di sebelah kanan susunan. Bagian depan ada di sebelah kirimu.',
      explain: `Tampak ${NAME[which]} adalah gambar yang ditandai hijau.` });
  }
  return G['6.2.2'](rng, lv, K);
};

const SOLID_FACTS = { kubus: { sisi: 6, rusuk: 12, 'titik sudut': 8 }, balok: { sisi: 6, rusuk: 12, 'titik sudut': 8 } };
G['6.2.3'] = (rng, lv, K) => {
  if (lv < 3) { const k = lv === 1 ? 'kubus' : 'balok'; const f = rng.pick(Object.keys(SOLID_FACTS[k])); const n = SOLID_FACTS[k][f];
    return item({ q: `${cap(k)} memiliki berapa ${f}?`, v: { t: 'solid', k, size: 120 }, ans: n, opts: numOpts(rng, n, [6, 8, 12, 4, 10].filter((x) => x !== n), K, 1, 20),
      math: { kind: 'solidfact', k, f }, hint: f === 'rusuk' ? 'Rusuk adalah garis tempat dua sisi bertemu.' : f === 'titik sudut' ? 'Titik sudut adalah pojok tempat rusuk-rusuk bertemu.' : 'Sisi adalah bidang datar yang membatasi bangun ruang.', explain: `${cap(k)} memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.` }); }
  const Q = [
    ['Bangun ruang yang semua sisinya berbentuk persegi adalah …', 'kubus', ['balok', 'tabung', 'kerucut'], 'Keenam sisi kubus berbentuk persegi yang sama besar.'],
    ['Sisi-sisi balok berbentuk …', 'persegi panjang', ['segitiga', 'lingkaran', 'trapesium'], 'Sisi balok berbentuk persegi panjang. Kadang ada dua sisi yang berbentuk persegi.'],
    ['Bangun datar yang menjadi alas tabung adalah …', 'lingkaran', ['persegi', 'segitiga', 'persegi panjang'], 'Alas dan tutup tabung berbentuk lingkaran.'],
    ['Persamaan kubus dan balok adalah keduanya memiliki …', '12 rusuk', ['6 sisi persegi', 'sisi lengkung', '6 titik sudut'], 'Kubus dan balok sama-sama memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.'],
  ];
  const [q, ans, wr, ex] = rng.pick(Q);
  return item({ q, v: null, ans, opts: rng.shuffle([ans, ...wr]).map((x) => ({ label: cap(x), value: x })), math: { kind: 'fixed', ans }, hint: 'Bayangkan bentuk benda nyata, misalnya dadu dan kardus.', explain: ex });
};

const MAP_ITEMS = [['🏫', 'sekolah'], ['🏠', 'rumah'], ['🌳', 'taman'], ['🕌', 'masjid'], ['🏥', 'puskesmas'], ['🏪', 'warung']];
G['6.2.4'] = (rng, lv, K) => {
  const cols = 5, rows = 4; const cells = rng.sample([...Array(cols * rows)].map((_, i) => [i % cols, Math.floor(i / cols)]), 4); const its = rng.sample(MAP_ITEMS, 4).map((m, i) => ({ e: m[0], name: m[1], c: cells[i][0], r: cells[i][1] }));
  const code = (c, r) => `${String.fromCharCode(65 + c)}${r + 1}`; const v = { t: 'cmap', cols, rows, items: its };
  if (lv === 1) { const it = its[0]; const ans = code(it.c, it.r); const pool = uniq([code(it.r % cols, it.c % rows), code(it.c + 1 < cols ? it.c + 1 : it.c - 1, it.r), code(it.c, it.r + 1 < rows ? it.r + 1 : it.r - 1), ...its.slice(1).map((x) => code(x.c, x.r))]).filter((x) => x !== ans);
    return item({ q: `Di petak manakah letak ${it.name} ${it.e}?`, v, ans, opts: rng.shuffle([ans, ...pool.slice(0, K - 1)]).map((x) => ({ label: x, value: x })), math: { kind: 'mapat', items: its, name: it.name },
      hint: 'Tulis huruf kolom dulu, lalu angka baris.', explain: `${cap(it.name)} berada di kolom ${ans[0]} baris ${ans.slice(1)}, yaitu petak ${ans}.` }); }
  if (lv === 2) { const it = rng.pick(its);
    return item({ q: `Bangunan apa yang berada di petak ${code(it.c, it.r)}?`, v, ans: it.name, opts: rng.shuffle(its.map((x) => ({ label: `${x.e} ${cap(x.name)}`, value: x.name }))), fixedOpts: true,
      math: { kind: 'mapwhat', items: its, at: code(it.c, it.r) }, hint: 'Cari kolom hurufnya di atas, lalu baris angkanya di kiri.', explain: `Di petak ${code(it.c, it.r)} ada ${it.name}.` }); }
  for (let tries = 0; tries < 50; tries++) {
    const it = its[0]; const dx = rng.int(-3, 3), dy = rng.int(-2, 2); const nc = it.c + dx, nr = it.r + dy; if ((dx === 0 && dy === 0) || dx === 0 || dy === 0 || nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
    const ans = code(nc, nr); const txt = `${Math.abs(dx)} petak ke ${dx > 0 ? 'kanan' : 'kiri'} dan ${Math.abs(dy)} petak ke ${dy > 0 ? 'bawah' : 'atas'}`;
    const pool = uniq([code(it.c - dx, nr), code(nc, it.r - dy), code(it.c + dy, it.r + dx), code(nc, nr + 1), code(nc + 1, nr)].filter((x) => /^[A-E][1-4]$/.test(x) && x !== ans));
    if (pool.length < K - 1) continue;
    return item({ q: `Dari ${it.name} ${it.e}, Sari berjalan ${txt}. Di petak manakah Sari sekarang?`, v, ans, opts: rng.shuffle([ans, ...pool.slice(0, K - 1)]).map((x) => ({ label: x, value: x })),
      math: { kind: 'mapmove', from: [it.c, it.r], dx, dy }, hint: 'Gerakkan jarimu di peta: ke kanan atau kiri dulu, lalu ke atas atau bawah.', explain: `Dari ${code(it.c, it.r)}, ${txt}, sampai di petak ${ans}.` });
  }
  return G['6.2.4'](rng, 2, K);
};

G['6.2.5'] = (rng, lv, K) => {
  const known = rng.int(3, 8) * 10 + rng.pick([0, 5]);
  if (lv === 1) return item({ q: 'Dua garis berpotongan. Berapa besar sudut yang ditandai tanda tanya?', v: { t: 'cross', known, ask: 'vertical' }, ans: known,
    opts: numOpts(rng, known, [180 - known, 90 - known > 0 ? 90 - known : known + 10, 360 - known, known + 10], K, 1, 360).map((o) => ({ ...o, label: `${o.value}°` })), math: { kind: 'expr', e: `${known}` },
    hint: 'Sudut yang saling berhadapan (bertolak belakang) besarnya sama.', explain: `Sudut bertanda tanya bertolak belakang dengan sudut ${known}°, jadi besarnya juga ${known}°.` });
  if (lv === 2) return item({ q: 'Dua garis berpotongan. Berapa besar sudut yang ditandai tanda tanya?', v: { t: 'cross', known, ask: 'adjacent' }, ans: 180 - known,
    opts: numOpts(rng, 180 - known, [known, 90 - known > 0 ? 90 - known : 100 - known, 360 - known, 190 - known], K, 1, 360).map((o) => ({ ...o, label: `${o.value}°` })), math: { kind: 'expr', e: `180-${known}` },
    hint: 'Dua sudut yang bersebelahan pada garis lurus berjumlah 180°.', explain: `180° − ${known}° = ${180 - known}°.` });
  return item({ q: `Dua garis berpotongan dan membentuk empat sudut. Salah satu sudutnya ${known}°. Berapa jumlah keempat sudut itu?`, v: null, ans: 360, opts: numOpts(rng, 360, [180, 4 * known, 2 * known + 180, 90], K, 1, 720).map((o) => ({ ...o, label: `${o.value}°` })),
    math: { kind: 'expr', e: `2*${known}+2*(180-${known})` }, hint: 'Dua sudut bertolak belakang sama besar, dan dua sudut bersebelahan berjumlah 180°.', explain: `${known}° + ${180 - known}° + ${known}° + ${180 - known}° = 360°.` });
};

const LIKELY = ['pasti', 'mungkin', 'mustahil'];
G['6.2.6'] = (rng, lv, K) => {
  const opts = LIKELY.map((x) => ({ label: cap(x), value: x }));
  if (lv === 1) { const [s, ans] = rng.pick([['Matahari terbit dari arah timur.', 'pasti'], ['Besok turun hujan.', 'mungkin'], ['Seekor kucing dapat terbang ke bulan.', 'mustahil'], ['Hari sesudah Senin adalah Selasa.', 'pasti'], ['Saat koin dilempar, muncul sisi gambar.', 'mungkin'], ['Air laut berasa manis.', 'mustahil']]);
    return item({ q: `Kejadian "${s.slice(0, -1)}" termasuk kejadian yang …`, v: null, ans, opts, fixedOpts: true, math: { kind: 'fixed', ans },
      hint: 'Pasti: selalu terjadi. Mungkin: bisa terjadi, bisa tidak. Mustahil: tidak akan pernah terjadi.', explain: `Kejadian itu ${ans === 'pasti' ? 'selalu terjadi' : ans === 'mungkin' ? 'bisa terjadi, bisa juga tidak' : 'tidak akan pernah terjadi'}, jadi ${ans}.` }); }
  if (lv === 2) { const cols = rng.sample(['merah', 'biru', 'kuning', 'hijau'], rng.int(1, 3)); const marbles = Object.fromEntries(cols.map((c) => [c, rng.int(2, 5)])); const pickC = rng.pick(['merah', 'biru', 'kuning', 'hijau']);
    const ans = !marbles[pickC] ? 'mustahil' : cols.length === 1 ? 'pasti' : 'mungkin';
    return item({ q: `Sebuah kelereng diambil tanpa melihat dari kantong ini. Terambilnya kelereng ${pickC} termasuk kejadian yang …`, v: { t: 'bag', marbles }, ans, opts, fixedOpts: true, math: { kind: 'bagchance', marbles, pickC },
      hint: 'Lihat warna kelereng apa saja yang ada di dalam kantong.', explain: !marbles[pickC] ? `Tidak ada kelereng ${pickC} di kantong, jadi mustahil.` : cols.length === 1 ? `Semua kelereng berwarna ${pickC}, jadi pasti.` : `Ada kelereng ${pickC} dan warna lain, jadi mungkin.` }); }
  const [s, ans] = rng.pick([['muncul mata dadu 7', 'mustahil'], ['muncul mata dadu kurang dari 7', 'pasti'], ['muncul mata dadu genap', 'mungkin'], ['muncul mata dadu 0', 'mustahil'], ['muncul mata dadu lebih dari 4', 'mungkin'], ['muncul mata dadu 1 sampai 6', 'pasti']]);
  return item({ q: `Sebuah dadu biasa (mata 1 sampai 6) dilempar sekali. Kejadian ${s} termasuk kejadian yang …`, v: { t: 'emoji', e: '🎲' }, ans, opts, fixedOpts: true, math: { kind: 'fixed', ans },
    hint: 'Mata dadu hanya 1, 2, 3, 4, 5, dan 6.', explain: `Mata dadu yang mungkin hanya 1 sampai 6, jadi kejadian itu ${ans}.` });
};

G['6.2.7'] = (rng, lv, K) => {
  if (lv === 1) { const cols = rng.sample(['merah', 'biru', 'kuning', 'hijau'], 3); const counts = rng.sample([1, 2, 3, 4, 5, 6, 7], 3); const marbles = Object.fromEntries(cols.map((c, i) => [c, counts[i]])); const most = rng.chance(0.6);
    const ans = cols[counts.indexOf(most ? Math.max(...counts) : Math.min(...counts))];
    return item({ q: `Sebuah kelereng diambil tanpa melihat. Warna apa yang paling ${most ? 'mungkin' : 'kecil kemungkinannya'} terambil?`, v: { t: 'bag', marbles }, ans, opts: cols.map((c) => ({ label: cap(c), value: c })), fixedOpts: true,
      math: { kind: most ? 'argmax' : 'argmin', vals: counts, names: cols }, hint: 'Warna yang jumlahnya paling banyak paling mungkin terambil.', explain: `Ada ${counts.map((n, i) => `${n} ${cols[i]}`).join(', ')}. Jadi, ${ans} paling ${most ? 'mungkin' : 'kecil kemungkinannya'}.` }); }
  if (lv === 2) { const pal = rng.sample(['merah', 'biru', 'kuning', 'hijau'], 3); const counts = rng.sample([1, 2, 3, 4], 3); const sectors = rng.shuffle(pal.flatMap((c, i) => Array(counts[i]).fill(c)));
    const ans = pal[counts.indexOf(Math.max(...counts))];
    return item({ q: 'Pemutar ini diputar sekali. Warna apa yang paling mungkin ditunjuk jarum?', v: { t: 'spinner', sectors }, ans, opts: pal.map((c) => ({ label: cap(c), value: c })), fixedOpts: true,
      math: { kind: 'argmax', vals: counts, names: pal }, hint: 'Hitung bagian setiap warna. Semua bagian sama besar.', explain: `Warna ${ans} punya bagian paling banyak, yaitu ${Math.max(...counts)} bagian.` }); }
  for (;;) { const ra = rng.int(2, 5), ba = rng.int(1, 6), rb = rng.int(ra + 1, 8), bb = rng.int(2, 10); const pa = ra / (ra + ba), pb = rb / (rb + bb); if (Math.abs(pa - pb) < 0.08) continue;
    const ans = pa > pb ? 'A' : 'B';
    return item({ q: `Kantong A berisi ${ra} kelereng merah dan ${ba} kelereng biru. Kantong B berisi ${rb} kelereng merah dan ${bb} kelereng biru. Dari kantong mana kelereng merah lebih mungkin terambil?`, v: null, ans,
      opts: [{ label: 'Kantong A', value: 'A' }, { label: 'Kantong B', value: 'B' }, { label: 'Sama saja', value: 'sama' }], fixedOpts: true, math: { kind: 'twobags', a: [ra, ba], b: [rb, bb] },
      hint: 'Bandingkan bagian kelereng merah dari seluruh kelereng di setiap kantong.', explain: `Kantong A: ${ra} dari ${ra + ba} merah. Kantong B: ${rb} dari ${rb + bb} merah. ${ra}/${ra + ba} ${pa > pb ? '>' : '<'} ${rb}/${rb + bb}, jadi kantong ${ans}.` }); }
};

G['6.2.9'] = (rng, lv, K) => {
  if (lv === 1) { const s = rng.int(3, 12); const V = s ** 3;
    return item({ q: `Berapa volume kubus yang panjang rusuknya ${s} cm?`, v: { t: 'solid', k: 'kubus', size: 110 }, ans: V, opts: withUnit(numOpts(rng, V, [s * s, 6 * s * s, 3 * s, 12 * s], K, 1, 5000), 'cm³'),
      math: { kind: 'expr', e: `${s}*${s}*${s}` }, hint: 'Volume kubus = rusuk × rusuk × rusuk.', explain: `${s} × ${s} × ${s} = ${V} cm³.` }); }
  const p = rng.int(4, 15), l = rng.int(2, 10), t = rng.int(2, 10); const V = p * l * t;
  if (lv === 2) return item({ q: `Sebuah balok berukuran panjang ${p} cm, lebar ${l} cm, dan tinggi ${t} cm. Berapa volumenya?`, v: { t: 'solid', k: 'balok', size: 110 }, ans: V,
    opts: withUnit(numOpts(rng, V, [p + l + t, p * l, 2 * (p * l + l * t + p * t), V + p], K, 1, 5000), 'cm³'), math: { kind: 'expr', e: `${p}*${l}*${t}` }, hint: 'Volume balok = panjang × lebar × tinggi.', explain: `${p} × ${l} × ${t} = ${V} cm³.` });
  return item({ q: `Volume sebuah balok ${fmt(V)} cm³. Panjangnya ${p} cm dan lebarnya ${l} cm. Berapa tingginya?`, v: null, ans: t, opts: withUnit(numOpts(rng, t, [V - p * l, V / p, t + 1, t * 2].filter((x) => Number.isInteger(x) && x !== t), K, 1, 5000), 'cm'),
    math: { kind: 'expr', e: `${V}/(${p}*${l})` }, hint: 'Tinggi = volume : (panjang × lebar).', explain: `${p} × ${l} = ${p * l}. ${fmt(V)} : ${p * l} = ${t} cm.` });
};

G['6.2.10'] = (rng, lv, K) => {
  if (lv === 1) { for (;;) { const n = rng.int(4, 6); const data = [...Array(n)].map(() => rng.int(5, 10)); const s = data.reduce((a, b) => a + b, 0); if (s % n) continue; const m = s / n;
    return item({ q: `Nilai ulangan Nia: ${data.join(', ')}. Berapa rata-ratanya?`, v: null, ans: m, opts: numOpts(rng, m, [s, m + 1, m - 1, Math.max(...data)].filter((x) => x !== m), K, 0, 100),
      math: { kind: 'mean', data }, hint: 'Rata-rata = jumlah semua nilai : banyak nilai.', explain: `(${data.join(' + ')}) : ${n} = ${s} : ${n} = ${m}.` }); } }
  if (lv === 2) { const n = rng.pick([5, 7]); const data = [...Array(n)].map(() => rng.int(140, 160)); const sorted = data.slice().sort((a, b) => a - b); const med = sorted[(n - 1) / 2];
    return item({ q: `Tinggi badan ${n} siswa (cm): ${data.join(', ')}. Berapa mediannya?`, v: null, ans: med, opts: numOpts(rng, med, [data[(n - 1) / 2], sorted[(n - 1) / 2 + 1], sorted[(n - 1) / 2 - 1]].filter((x) => x !== med), K, 0, 300).map((o) => ({ ...o, label: `${o.value} cm` })),
      math: { kind: 'median', data }, hint: 'Urutkan datanya dulu, lalu ambil nilai yang paling tengah.', explain: `Setelah diurutkan: ${sorted.join(', ')}. Nilai tengahnya ${med} cm.` }); }
  for (;;) { const vals = rng.sample([36, 37, 38, 39, 40], 4); const mode = vals[0]; const data = rng.shuffle([mode, mode, mode, vals[1], vals[1], vals[2], vals[3]]);
    return item({ q: `Ukuran sepatu siswa: ${data.join(', ')}. Ukuran yang paling sering muncul (modus) adalah …`, v: null, ans: mode, opts: numOpts(rng, mode, [vals[1], vals[2], vals[3]], K, 30, 50),
      math: { kind: 'mode', data }, hint: 'Hitung berapa kali setiap ukuran muncul.', explain: `Ukuran ${mode} muncul 3 kali, paling sering dibanding ukuran lain.` }); }
};

const REVIEW_BC = ['4.1.4', '4.1.6', '4.2.2', '4.2.4', '5.1.3', '5.1.5', '5.1.7', '5.2.2', '5.2.3', '5.2.5', '6.1.1', '6.1.3', '6.1.6', '6.2.4', '6.2.5', '6.2.7'];
G['6.2.8'] = (rng, lv, K) => { const tid = rng.pick(REVIEW_BC); return { ...G[tid](rng, Math.max(2, lv), K), from: tid }; };

void topicsOf;
export { fracStr, fracVal, foldsToCube, views };
