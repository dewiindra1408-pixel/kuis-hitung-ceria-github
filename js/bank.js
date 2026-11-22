// Bank soal kuis pilihan ganda untuk 46 topik. Semua soal dibuat oleh generator ber-seed.
// Setiap soal membawa `math` agar kunci jawabannya bisa dihitung ulang oleh tests/verify.mjs.
import { fmt, terbilang, HARI } from './words.js';
import { topicById } from './curriculum.js';

// ── data benda ──
// k: 'h' = hewan, 'm' = makanan, 'b' = benda lain
const OBJ = [
  ['🍎', 'apel', 'm'], ['🍊', 'jeruk', 'm'], ['🥭', 'mangga', 'm'], ['🍌', 'pisang', 'm'], ['🧁', 'kue', 'm'], ['🥚', 'telur', 'm'],
  ['🦆', 'bebek', 'h'], ['🐔', 'ayam', 'h'], ['🐟', 'ikan', 'h'], ['🐢', 'penyu', 'h'], ['🦀', 'kepiting', 'h'],
  ['🌸', 'bunga', 'b'], ['🐚', 'kerang', 'b'], ['⭐', 'bintang', 'b'], ['🏮', 'lampion', 'b'], ['🎈', 'balon', 'b'],
];
const FOOD = OBJ.filter((o) => o[2] === 'm');
const ANIM = OBJ.filter((o) => o[2] === 'h');
const COUNTABLE = OBJ.filter((o) => o[1] !== 'telur');
const NAMES = ['Ani', 'Budi', 'Sari', 'Dodi', 'Rina', 'Made', 'Ucok', 'Nia', 'Asep', 'Putu', 'Lina', 'Bayu'];

// ── pembuat soal ──
const K_OF = (kelas) => (kelas === 1 ? 3 : 4);
const uniq = (a) => [...new Set(a)];

function numOpts(rng, ans, miscon, K, lo = 0, hi = 1e9) {
  const set = [ans];
  for (const m of rng.shuffle(uniq(miscon))) if (set.length < K && Number.isInteger(m) && m >= lo && m <= hi && !set.includes(m)) set.push(m);
  const near = rng.shuffle([1, -1, 2, -2, 3, -3, 10, -10, 4, -4, 5, -5]);
  for (const d of near) { const c = ans + d; if (set.length < K && c >= lo && c <= hi && !set.includes(c)) set.push(c); }
  for (let c = lo; set.length < K && c <= hi; c++) if (!set.includes(c)) set.push(c);
  return set.sort((a, b) => a - b).map((n) => ({ label: fmt(n), value: n }));
}
function textOpts(rng, ans, others, K) {
  const pool = rng.shuffle(uniq(others.filter((o) => o !== ans))).slice(0, K - 1);
  return rng.shuffle([ans, ...pool]).map((s) => ({ label: s, value: s }));
}
const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const item = (o) => ({ hint: '', explain: '', ...o, explain: cap((o.explain || '').replace(/^"(.)/, (m, c) => '"' + c.toUpperCase())) });

// ── generator per topik ──
// Setiap generator: (rng, level, K) -> item
const G = {};

// ===== KELAS 1 SEMESTER 1 =====
G['1.1.1'] = (rng, lv, K) => {
  if (lv === 3 && rng.chance(0.35)) {
    return item({ q: 'Ada berapa ikan di dalam kolam?', v: { t: 'objects', groups: [{ e: '🐟', n: 0 }] }, ans: 0,
      opts: numOpts(rng, 0, [1, 2], K, 0, 10), math: { kind: 'count', n: 0 }, hint: 'Lihat baik-baik. Apakah ada ikan?', explain: 'Kolamnya kosong. Tidak ada ikan, jadi banyaknya 0 (nol).' });
  }
  if (lv === 3) {
    const n = rng.int(1, 10);
    return item({ q: `Lambang bilangan untuk "${terbilang(n)}" adalah …`, v: null, ans: n, opts: numOpts(rng, n, [n + 1, n - 1, n === 6 ? 9 : n === 9 ? 6 : n + 2], K, 0, 10),
      math: { kind: 'word', word: terbilang(n) }, hint: 'Ucapkan bilangannya pelan-pelan sambil menghitung dengan jari.', explain: `"${terbilang(n)[0].toUpperCase() + terbilang(n).slice(1)}" ditulis ${n}.` });
  }
  const [e, nm] = rng.pick(COUNTABLE);
  const n = lv === 1 ? rng.int(1, 5) : rng.int(6, 10);
  return item({ q: `Ada berapa ${nm}?`, v: lv === 1 ? { t: 'objects', groups: [{ e, n }] } : { t: 'tenframe', fills: [{ n, e }] }, ans: n,
    opts: numOpts(rng, n, [n + 1, n - 1], K, 1, 10), math: { kind: 'count', n }, hint: 'Tunjuk satu per satu sambil menghitung.', explain: `Kalau dihitung satu per satu, ada ${n} ${nm}.` });
};

G['1.1.2'] = (rng, lv, K) => {
  if (lv === 1) {
    const [[e1, n1], [e2, n2]] = rng.sample(COUNTABLE, 2);
    const a = rng.int(2, 8); let b = rng.int(2, 8); if (rng.chance(0.2)) b = a;
    const ans = a > b ? n1 : a < b ? n2 : 'sama banyak';
    const most = rng.chance(0.5);
    const q = most ? `Mana yang lebih banyak, ${n1} atau ${n2}?` : `Mana yang lebih sedikit, ${n1} atau ${n2}?`;
    const realAns = a === b ? 'sama banyak' : most ? ans : (ans === n1 ? n2 : n1);
    return item({ q, v: { t: 'stack', items: [{ t: 'objects', groups: [{ e: e1, n: a }], small: true }, { t: 'objects', groups: [{ e: e2, n: b }], small: true }] },
      ans: realAns, opts: [n1, n2, 'sama banyak'].map((s) => ({ label: s === 'sama banyak' ? 'Sama banyak' : `${s[0].toUpperCase()}${s.slice(1)}`, value: s })).slice(0, 3),
      math: { kind: 'cmpgroups', a, b, names: [n1, n2], most }, hint: 'Pasangkan satu dengan satu. Mana yang tidak punya pasangan?', explain: `Ada ${a} ${n1} dan ${b} ${n2}. ${a === b ? 'Banyaknya sama.' : `${realAns[0].toUpperCase() + realAns.slice(1)} lebih ${most ? 'banyak' : 'sedikit'}.`}` });
  }
  if (lv === 2) {
    const vals = rng.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], K);
    const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
    return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.map((n) => ({ label: fmt(n), value: n })),
      math: { kind: big ? 'max' : 'min', vals }, hint: 'Bayangkan garis bilangan. Bilangan di kanan lebih besar.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${ans}.` });
  }
  if (rng.chance(0.5)) {
    const n = rng.int(1, 9); const after = rng.chance(0.5) || n === 0;
    const ans = after ? n + 1 : n - 1;
    return item({ q: `Bilangan ${after ? 'sesudah' : 'sebelum'} ${n} adalah …`, v: { t: 'numline', from: 0, to: 10, step: 1, labels: 'all', mark: n }, ans,
      opts: numOpts(rng, ans, [after ? n - 1 : n + 1, n], K, 0, 10), math: { kind: 'expr', e: after ? `${n}+1` : `${n}-1` }, hint: `${after ? 'Sesudah berarti satu lebih banyak' : 'Sebelum berarti satu lebih sedikit'}.`, explain: `${after ? 'Sesudah' : 'Sebelum'} ${n} adalah ${ans}.` });
  }
  const row = rng.sample(['🐔', '🦆', '🐱', '🐶', '🐰', '🐸'], 5);
  const NAMA = { '🐔': 'ayam', '🦆': 'bebek', '🐱': 'kucing', '🐶': 'anjing', '🐰': 'kelinci', '🐸': 'katak' };
  const pos = rng.int(1, 5);
  return item({ q: `Hewan ke-${pos} dari bendera adalah …`, v: { t: 'row', items: row }, ans: row[pos - 1],
    opts: textOpts(rng, row[pos - 1], row, K).map((o) => ({ label: `${o.value} ${NAMA[o.value]}`, value: o.value })),
    math: { kind: 'ordinal', row, pos }, hint: 'Mulai hitung dari hewan yang paling dekat dengan bendera.', explain: `Dihitung dari bendera, hewan ke-${pos} adalah ${NAMA[row[pos - 1]]}.` });
};

G['1.1.3'] = (rng, lv, K) => {
  if (lv === 1) {
    const a = rng.int(1, 9);
    return item({ q: `Ada ${a} kelereng. Berapa kelereng lagi agar menjadi 10?`, v: { t: 'tenframe', fills: [{ n: a, e: '🔵' }] }, ans: 10 - a,
      opts: numOpts(rng, 10 - a, [a, 10 - a + 1, 10 - a - 1], K, 0, 10), math: { kind: 'expr', e: `10-${a}` }, hint: 'Hitung kotak yang masih kosong.', explain: `${a} dan ${10 - a} menjadi 10.` });
  }
  if (lv === 2) {
    const s = rng.int(4, 10), a = rng.int(1, s - 1);
    return item({ q: `${a} dan … menjadi ${s}.`, v: { t: 'eq', text: `${a} + □ = ${s}` }, ans: s - a,
      opts: numOpts(rng, s - a, [s, s + a, s - a + 1], K, 0, 10), math: { kind: 'expr', e: `${s}-${a}` }, hint: `Mulai dari ${a}, lalu hitung maju sampai ${s}.`, explain: `${a} + ${s - a} = ${s}.` });
  }
  const s = rng.int(5, 10), a = rng.int(1, s - 1);
  const wrong = []; while (wrong.length < K - 1) { const x = rng.int(1, 9), y = rng.int(0, 9); if (x + y !== s && x + y <= 10 && !wrong.includes(`${x} dan ${y}`)) wrong.push(`${x} dan ${y}`); }
  const ans = `${a} dan ${s - a}`;
  return item({ q: `Pasangan bilangan mana yang jika digabung menjadi ${s}?`, v: { t: 'dots', n: s, filled: a }, ans,
    opts: rng.shuffle([ans, ...wrong]).map((x) => ({ label: x, value: x })), math: { kind: 'pairsum', s }, hint: 'Jumlahkan dua bilangan pada setiap pilihan.', explain: `${a} + ${s - a} = ${s}.` });
};

G['1.1.4'] = (rng, lv, K) => {
  const s = lv === 1 ? rng.int(3, 7) : rng.int(5, 10); const a = rng.int(1, s - 1), b = s - a;
  const mis = [s + 1, s - 1, Math.abs(a - b)];
  if (lv === 3) return item({ q: `${a} + ${b} = …`, v: { t: 'eq', text: `${a} + ${b} = □` }, ans: s, opts: numOpts(rng, s, mis, K, 0, 10),
    math: { kind: 'expr', e: `${a}+${b}` }, hint: `Mulai dari ${Math.max(a, b)}, lalu hitung maju ${Math.min(a, b)} kali.`, explain: `${a} + ${b} = ${s}.` });
  const [e, nm, k] = rng.pick(COUNTABLE);
  const verb = k === 'h' ? `Lalu datang ${b} ${nm} lagi.` : `Ibu memberi ${b} ${nm} lagi.`;
  return item({ q: `Ada ${a} ${nm}. ${verb} Berapa ${nm} sekarang?`, v: lv === 1 ? { t: 'objects', groups: [{ e, n: a }, { e, n: b }], op: '+' } : { t: 'tenframe', fills: [{ n: a, e }, { n: b, e: e === '🔵' ? '🔴' : e }] },
    ans: s, opts: numOpts(rng, s, mis, K, 0, 10), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Gabungkan semuanya, lalu hitung.', explain: `${a} + ${b} = ${s}. Jadi, ada ${s} ${nm}.` });
};

G['1.1.5'] = (rng, lv, K) => {
  const a = lv === 1 ? rng.int(3, 7) : rng.int(5, 10); const b = rng.int(1, a - 1), d = a - b;
  const mis = [a + b, d + 1, d - 1, b];
  if (lv === 2) {
    const [[e1, n1], [e2, n2]] = rng.sample(ANIM, 2);
    return item({ q: `Ada ${a} ${n1} dan ${b} ${n2}. Berapa ${n1} lebih banyak daripada ${n2}?`, v: { t: 'stack', items: [{ t: 'objects', groups: [{ e: e1, n: a }], small: true }, { t: 'objects', groups: [{ e: e2, n: b }], small: true }] },
      ans: d, opts: numOpts(rng, d, mis, K, 0, 10), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Pasangkan satu dengan satu. Hitung yang tidak punya pasangan.', explain: `${a} − ${b} = ${d}. Jadi, ${n1} lebih banyak ${d} ekor.` });
  }
  if (lv === 3) return item({ q: `Jika ${b} + ${d} = ${a}, maka ${a} − ${b} = …`, v: { t: 'eq', text: `${a} − ${b} = □` }, ans: d,
    opts: numOpts(rng, d, mis, K, 0, 10), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Pengurangan adalah kebalikan dari penjumlahan.', explain: `Karena ${b} + ${d} = ${a}, maka ${a} − ${b} = ${d}.` });
  const [e, nm, k] = rng.pick(COUNTABLE);
  const verb = k === 'h' ? `Lalu ${b} ${nm} pergi.` : k === 'm' ? `Lalu ${b} ${nm} dimakan.` : `Lalu ${b} ${nm} diambil.`;
  return item({ q: `Ada ${a} ${nm}. ${verb} Berapa ${nm} yang tersisa?`, v: { t: 'objects', groups: [{ e, n: a, crossed: b }] }, ans: d,
    opts: numOpts(rng, d, mis, K, 0, 10), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Hitung yang tidak dicoret.', explain: `${a} − ${b} = ${d}. Jadi, tersisa ${d} ${nm}.` });
};

G['1.1.6'] = (rng, lv, K) => {
  if (lv === 3) {
    const s = rng.int(3, 10), a = rng.int(1, s - 1);
    const right = `${s} = ${a} + ${s - a}`;
    const wrongs = uniq([`${s} = ${a} + ${s - a + 1}`, `${s} = ${a} + ${s}`, `${s} = ${s - a} − ${a}`, `${s} + ${a} = ${s - a}`].filter((x) => x !== right)).slice(0, K - 1);
    return item({ q: 'Kalimat matematika mana yang benar?', v: null, ans: right, opts: rng.shuffle([right, ...wrongs]).map((x) => ({ label: x, value: x })),
      math: { kind: 'onetrue' }, hint: 'Hitung nilai di kiri dan di kanan tanda =. Nilainya harus sama.', explain: `${a} + ${s - a} = ${s}, jadi nilai kiri dan kanan sama.` });
  }
  if (lv === 1) {
    const a = rng.int(1, 6), b = rng.int(1, 10 - a);
    return item({ q: 'Bilangan berapa yang membuat timbangan seimbang?', v: { t: 'balance', left: `${a} + ${b}`, right: '□' }, ans: a + b,
      opts: numOpts(rng, a + b, [a + b + 1, a + b - 1, Math.abs(a - b)], K, 0, 10), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Seimbang berarti nilai kiri sama dengan nilai kanan.', explain: `${a} + ${b} = ${a + b}. Kiri dan kanan sama-sama bernilai ${a + b}.` });
  }
  const a = rng.int(1, 6), b = rng.int(1, 10 - a); const c = rng.int(1, a + b - 1), x = a + b - c;
  return item({ q: 'Bilangan berapa yang membuat timbangan seimbang?', v: { t: 'balance', left: `${a} + ${b}`, right: `${c} + □` }, ans: x,
    opts: numOpts(rng, x, [a + b, a + b + c, x + 1], K, 0, 10), math: { kind: 'expr', e: `${a}+${b}-${c}` }, hint: `Kiri bernilai ${a + b}. Berapa yang ditambahkan ke ${c} agar menjadi ${a + b}?`, explain: `${a} + ${b} = ${a + b} dan ${c} + ${x} = ${a + b}. Jadi, kotak itu berisi ${x}.` });
};

const PAT_TOK = ['🔴', '🟡', '🔵', '🟩', '⭐', '🌸', '🍀'];
function patternItem(rng, lv, K, units) {
  const unitShape = rng.pick(units);
  const toks = rng.sample(PAT_TOK, Math.max(...unitShape) + 1);
  const unit = unitShape.map((i) => toks[i]);
  const len = Math.max(6, unit.length * 2 + 1);
  const seq = [...Array(len)].map((_, i) => unit[i % unit.length]);
  const miss = lv === 1 ? len - 1 : rng.int(1, len - 2);
  const ans = seq[miss]; const shown = seq.map((t, i) => (i === miss ? null : t));
  const pool = uniq([...toks, ...PAT_TOK]);
  return item({ q: lv === 1 ? 'Gambar apa yang berikutnya?' : 'Gambar apa yang hilang?', v: { t: 'pattern', seq: shown }, ans,
    opts: textOpts(rng, ans, [...toks, ...rng.sample(pool, 3)], K), math: { kind: 'pattern', seq: shown, unit, miss },
    hint: 'Cari bagian yang berulang. Ucapkan polanya keras-keras.', explain: `Polanya berulang: ${unit.join(' ')}. Jadi, gambar yang tepat adalah ${ans}.` });
}
G['1.1.7'] = (rng, lv, K) => patternItem(rng, lv, K, lv === 1 ? [[0, 1]] : lv === 2 ? [[0, 1], [0, 1, 2]] : [[0, 1, 2], [0, 0, 1]]);

const SOLID_NAME = { bola: 'bola', kubus: 'kubus', balok: 'balok', kerucut: 'kerucut', tabung: 'tabung' };
const SOLID_OBJ = { bola: [['🍊', 'jeruk'], ['🧶', 'gulungan benang']], kubus: [['🎲', 'dadu'], ['🧊', 'es batu']], balok: [['📦', 'kardus'], ['🧱', 'batu bata']], kerucut: [['🍦', 'contong es krim']] };
G['1.1.8'] = (rng, lv, K) => {
  const kinds = ['bola', 'kubus', 'balok', 'kerucut'];
  const k = rng.pick(kinds);
  if (lv === 1) return item({ q: 'Bangun ruang ini bernama …', v: { t: 'solid', k }, ans: k, opts: textOpts(rng, k, kinds, K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
    math: { kind: 'solid', show: k }, hint: 'Perhatikan bentuknya: bulat, kotak, atau runcing?', explain: `Bangun ini adalah ${k}.` });
  const [e, nm] = rng.pick(SOLID_OBJ[k]);
  if (lv === 2) return item({ q: `Bentuk ${nm} seperti bangun …`, v: { t: 'emoji', e }, ans: k, opts: textOpts(rng, k, kinds, K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
    math: { kind: 'solidobj', obj: nm, k }, hint: 'Bayangkan benda itu ada di tanganmu.', explain: `${nm[0].toUpperCase() + nm.slice(1)} berbentuk seperti ${k}.` });
  const others = kinds.filter((x) => x !== k).map((x) => rng.pick(SOLID_OBJ[x]));
  const opts = rng.shuffle([[e, nm], ...rng.sample(others, K - 1)]);
  return item({ q: `Benda mana yang berbentuk ${k}?`, v: { t: 'solid', k, size: 90 }, ans: e, opts: opts.map(([oe, on]) => ({ label: `${oe} ${on}`, value: oe })),
    math: { kind: 'solidpick', k, opts: opts.map((o) => o[1]) }, hint: `Cari benda yang bentuknya sama dengan gambar ${k}.`, explain: `${nm[0].toUpperCase() + nm.slice(1)} berbentuk ${k}.` });
};

const POS_ITEMS = [['🐱', 'kucing'], ['🐦', 'burung'], ['⚽', 'bola']];
G['1.1.9'] = (rng, lv, K) => {
  const pair = lv === 1 ? ['atas', 'bawah'] : lv === 2 ? ['depan', 'belakang'] : rng.pick([['atas', 'bawah'], ['depan', 'belakang']]);
  const ref = pair[0] === 'atas' ? 'kursi' : 'kotak';
  const all = ['atas', 'bawah', 'depan', 'belakang'];
  if (lv < 3) {
    const pos = rng.pick(pair); const [e, nm] = rng.pick(POS_ITEMS.filter((p) => !(p[1] === 'burung' && pos === 'bawah')));
    return item({ q: `Di mana ${nm} berada?`, v: { t: 'scene', ref, items: [{ e, pos }] }, ans: pos,
      opts: textOpts(rng, pos, [...pair, ...rng.sample(all.filter((x) => !pair.includes(x)), 2)], K).map((o) => ({ label: `Di ${o.value} ${ref}`, value: o.value })), math: { kind: 'position', pos },
      hint: `Lihat ${ref}nya dulu, lalu lihat letak ${nm}.`, explain: `${nm[0].toUpperCase() + nm.slice(1)} berada di ${pos} ${ref}.` });
  }
  const [[e1, n1], [e2, n2]] = rng.sample(POS_ITEMS.filter((p) => ref === 'kotak' || p[1] !== 'burung'), 2); const [p1, p2] = rng.shuffle(pair);
  const ask = rng.pick([[e1, n1, p1], [e2, n2, p2]]);
  return item({ q: `Apa yang ada di ${ask[2]} ${ref}?`, v: { t: 'scene', ref, items: [{ e: e1, pos: p1 }, { e: e2, pos: p2 }] }, ans: ask[0],
    opts: POS_ITEMS.slice(0, K).map(([e, nm]) => ({ label: `${e} ${nm[0].toUpperCase() + nm.slice(1)}`, value: e })), math: { kind: 'position2', items: [[e1, p1], [e2, p2]], ask: ask[2] },
    hint: `Cari benda yang letaknya di ${ask[2]} ${ref}.`, explain: `${ask[1][0].toUpperCase() + ask[1].slice(1)} berada di ${ask[2]} ${ref}.` });
};

// ===== KELAS 1 SEMESTER 2 =====
G['1.2.1'] = (rng, lv, K) => {
  if (lv === 1) {
    const n = rng.int(11, 20);
    return item({ q: 'Ada berapa kelereng?', v: { t: 'tenframe', fills: [{ n, e: '🔵' }] }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n - 10], K, 1, 20),
      math: { kind: 'count', n }, hint: 'Satu kotak penuh berisi 10. Lanjutkan hitung dari 10.', explain: `10 dan ${n - 10} lagi menjadi ${n}.` });
  }
  if (lv === 2) {
    const n = rng.int(11, 19); const after = rng.chance(0.5); const ans = after ? n + 1 : n - 1;
    return item({ q: `Bilangan ${after ? 'sesudah' : 'sebelum'} ${n} adalah …`, v: { t: 'numline', from: 10, to: 20, step: 1, labels: 'all', mark: n }, ans,
      opts: numOpts(rng, ans, [after ? n - 1 : n + 1, n], K, 10, 20), math: { kind: 'expr', e: after ? `${n}+1` : `${n}-1` }, hint: 'Lihat garis bilangan.', explain: `${after ? 'Sesudah' : 'Sebelum'} ${n} adalah ${ans}.` });
  }
  const n = rng.int(11, 20);
  const swapped = n < 20 ? Number(String(n).split('').reverse().join('')) : 2;
  return item({ q: `Lambang bilangan untuk "${terbilang(n)}" adalah …`, v: null, ans: n, opts: numOpts(rng, n, [swapped, n + 1, n - 1, n - 10], K, 1, 99),
    math: { kind: 'word', word: terbilang(n) }, hint: '"Belas" berarti sepuluh ditambah satuannya. Contohnya, tiga belas = 10 + 3.', explain: `"${terbilang(n)}" ditulis ${n}.` });
};

G['1.2.2'] = (rng, lv, K) => {
  if (lv === 1) {
    const o = rng.int(1, 9); const n = 10 + o;
    return item({ q: 'Ada berapa lidi semuanya?', v: { t: 'sticks', tens: 1, ones: o }, ans: n, opts: numOpts(rng, n, [o + 1, n + 1, n - 1, 11], K, 1, 20),
      math: { kind: 'expr', e: `10+${o}` }, hint: 'Satu ikat berisi 10 lidi.', explain: `1 ikat (10 lidi) dan ${o} lidi lepas. Jadi, ${n} lidi.` });
  }
  if (lv === 2) {
    const o = rng.int(0, 9), n = 10 + o;
    return item({ q: `${n} terdiri atas 1 puluhan dan … satuan.`, v: { t: 'blocks', tens: 1, o }, ans: o, opts: numOpts(rng, o, [n, 1, 10], K, 0, 20),
      math: { kind: 'expr', e: `${n}-10` }, hint: '1 puluhan sama dengan 10.', explain: `${n} = 10 + ${o}. Jadi, ada ${o} satuan.` });
  }
  const vals = rng.sample([...Array(11)].map((_, i) => 10 + i), K); const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
  return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.map((n) => ({ label: fmt(n), value: n })),
    math: { kind: big ? 'max' : 'min', vals }, hint: 'Semua punya 1 puluhan. Bandingkan satuannya.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${ans}.` });
};

G['1.2.3'] = (rng, lv, K) => {
  if (lv === 1) {
    const a = rng.int(6, 9), b = rng.int(11 - a, 9), s = a + b;
    return item({ q: `${a} + ${b} = …`, v: { t: 'tenframe', fills: [{ n: a, e: '🔴' }, { n: b, e: '🔵' }] }, ans: s, opts: numOpts(rng, s, [s - 1, s + 1, s - 10], K, 0, 20),
      math: { kind: 'expr', e: `${a}+${b}` }, hint: `Penuhi dulu kotak 10. ${a} perlu ${10 - a} lagi.`, explain: `${a} + ${10 - a} = 10, lalu 10 + ${b - (10 - a)} = ${s}.` });
  }
  if (lv === 2) {
    if (rng.chance(0.5)) { const d = rng.int(3, 9); return item({ q: `${d} + ${d} = …`, v: { t: 'eq', text: `${d} + ${d} = □` }, ans: 2 * d, opts: numOpts(rng, 2 * d, [2 * d - 1, 2 * d + 1, d + 1], K, 0, 20),
      math: { kind: 'expr', e: `${d}+${d}` }, hint: 'Ini bilangan kembar (dobel).', explain: `${d} + ${d} = ${2 * d}.` }); }
    const a = rng.int(11, 18), b = rng.int(a - 9, 9), d = a - b;
    return item({ q: `${a} − ${b} = …`, v: { t: 'eq', text: `${a} − ${b} = □` }, ans: d, opts: numOpts(rng, d, [d + 1, d - 1, a + b > 20 ? d + 10 : a + b], K, 0, 20),
      math: { kind: 'expr', e: `${a}-${b}` }, hint: `Kurangi sampai 10 dulu, lalu kurangi sisanya.`, explain: `${a} − ${b} = ${d}.` });
  }
  if (rng.chance(0.5)) {
    const a = rng.int(11, 18), b = rng.int(2, 9), d = a - b;
    return item({ q: `Ada ${a} burung di pohon. Lalu ${b} burung terbang. Berapa burung yang masih di pohon?`, v: { t: 'objects', groups: [{ e: '🐦', n: a, crossed: b }], small: true }, ans: d,
      opts: numOpts(rng, d, [a + b > 20 ? d + 2 : a + b, d + 1, d - 1], K, 0, 20), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Terbang berarti berkurang.', explain: `${a} − ${b} = ${d}. Jadi, masih ada ${d} burung.` });
  }
  const [n1, n2] = rng.sample(NAMES, 2), a = rng.int(5, 12), b = rng.int(3, 20 - a);
  return item({ q: `${n1} punya ${a} kelereng. ${n2} punya ${b} kelereng. Berapa kelereng mereka semuanya?`, v: null, ans: a + b,
    opts: numOpts(rng, a + b, [a + b + 1, a + b - 1, Math.abs(a - b)], K, 0, 20), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Semuanya berarti digabung.', explain: `${a} + ${b} = ${a + b}.` });
};

G['1.2.4'] = (rng, lv, K) => {
  const a = rng.int(5, 12), b = rng.int(2, 20 - a), s = a + b;
  if (lv === 1) return item({ q: `${a} + ${b} = …`, v: { t: 'balance', left: `${a} + ${b}`, right: '□' }, ans: s, opts: numOpts(rng, s, [s + 1, s - 1, Math.abs(a - b)], K, 0, 20),
    math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Tanda = berarti nilai kiri sama dengan nilai kanan.', explain: `${a} + ${b} = ${s}.` });
  if (lv === 2) return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `□ = ${a} + ${b}` }, ans: s, opts: numOpts(rng, s, [s + 1, s - 1, a], K, 0, 20),
    math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Kotaknya boleh di kiri. Nilainya tetap harus sama.', explain: `${a} + ${b} = ${s}, jadi ${s} = ${a} + ${b}.` });
  const c = rng.int(Math.max(1, s - 10), Math.min(10, s - 1)), x = s - c;
  return item({ q: `${a} + ${b} = ${c} + …`, v: { t: 'balance', left: `${a} + ${b}`, right: `${c} + □` }, ans: x, opts: numOpts(rng, x, [s, s + c, x + 1, x - 1], K, 0, 20),
    math: { kind: 'expr', e: `${a}+${b}-${c}` }, hint: `Kiri bernilai ${s}. ${c} ditambah berapa agar menjadi ${s}?`, explain: `${a} + ${b} = ${s} dan ${c} + ${x} = ${s}.` });
};

const RIB = [['#f2546b', 'merah', '🟥'], ['#3d8bfd', 'biru', '🟦'], ['#34b85a', 'hijau', '🟩'], ['#ffc21a', 'kuning', '🟨']];
G['1.2.5'] = (rng, lv, K) => {
  if (lv === 1) {
    const cols = rng.sample(RIB, K); const lens = rng.sample([3, 4, 5, 6, 7, 8, 9, 10], K);
    const longest = rng.chance(0.6); const idx = lens.indexOf(longest ? Math.max(...lens) : Math.min(...lens));
    return item({ q: `Pita mana yang paling ${longest ? 'panjang' : 'pendek'}?`, v: { t: 'lengths', items: cols.map((c, i) => ({ color: c[0], len: lens[i], off: 0 })) }, ans: cols[idx][1],
      opts: cols.map((c) => ({ label: `${c[2]} ${c[1][0].toUpperCase() + c[1].slice(1)}`, value: c[1] })), math: { kind: longest ? 'argmax' : 'argmin', vals: lens, names: cols.map((c) => c[1]) },
      hint: 'Semua pita mulai dari garis yang sama. Lihat ujung kanannya.', explain: `Pita ${cols[idx][1]} paling ${longest ? 'panjang' : 'pendek'}.` });
  }
  if (lv === 2) {
    const n = rng.int(3, 8);
    return item({ q: 'Berapa klip panjang pita ini?', v: { t: 'clips', n, mode: 'ok' }, ans: n, opts: numOpts(rng, n, [n + 1, n - 1], K, 1, 12),
      math: { kind: 'count', n }, hint: 'Hitung klip dari ujung kiri sampai ujung kanan pita.', explain: `Pita itu sama panjang dengan ${n} klip.` });
  }
  const mode = rng.pick(['ok', 'gap', 'overlap']);
  const L = { ok: 'Benar', gap: 'Salah, ada celah', overlap: 'Salah, klipnya bertumpuk' };
  return item({ q: 'Apakah cara mengukur pita ini benar?', v: { t: 'clips', n: rng.int(4, 6), mode }, ans: mode,
    opts: Object.entries(L).map(([k, l]) => ({ label: l, value: k })), math: { kind: 'measure', mode }, hint: 'Klip harus berjajar rapat, tidak berjarak dan tidak bertumpuk.',
    explain: mode === 'ok' ? 'Klipnya rapat dari ujung ke ujung. Caranya benar.' : mode === 'gap' ? 'Ada celah di antara klip, jadi hasilnya kurang tepat.' : 'Klipnya bertumpuk, jadi hasilnya kurang tepat.' });
};

// lama kegiatan (menit, perkiraan umum) — hanya dibandingkan bila selisihnya jelas (≥ 3 kali)
const ACTS = [['🧼', 'Mencuci tangan', 1], ['🪥', 'Menggosok gigi', 3], ['🛁', 'Mandi', 10], ['🍽️', 'Makan siang', 20], ['⚽', 'Bermain bola', 60], ['🏫', 'Belajar di sekolah', 300], ['🛌', 'Tidur malam', 540]];
const DAY_SEQ = [['🛌', 'Bangun tidur'], ['🛁', 'Mandi'], ['🏫', 'Berangkat sekolah'], ['🍽️', 'Makan siang'], ['🌙', 'Tidur malam']];
function farApart(rng, n) { for (;;) { const s = rng.sample(ACTS, n).sort((a, b) => a[2] - b[2]); if (s.every((x, i) => i === 0 || x[2] >= 3 * s[i - 1][2])) return rng.shuffle(s); } }
G['1.2.6'] = (rng, lv, K) => {
  if (lv < 3) {
    const n = lv === 1 ? 2 : Math.min(3, K); const acts = farApart(rng, n); const long = lv === 1 ? true : rng.chance(0.5);
    const ans = acts.reduce((m, a) => (long ? (a[2] > m[2] ? a : m) : a[2] < m[2] ? a : m));
    return item({ q: n === 2 ? 'Kegiatan mana yang lebih lama?' : `Kegiatan mana yang paling ${long ? 'lama' : 'sebentar'}?`, v: null, ans: ans[1], fixedOpts: n === 2,
      opts: acts.map((a) => ({ label: `${a[0]} ${a[1]}`, value: a[1] })), math: { kind: long ? 'argmax' : 'argmin', vals: acts.map((a) => a[2]), names: acts.map((a) => a[1]) },
      hint: 'Bayangkan kamu sedang melakukannya. Mana yang lebih cepat selesai?', explain: n === 2 ? `${ans[1]} memerlukan waktu lebih lama.` : `${ans[1]} ${long ? 'memerlukan waktu paling lama' : 'paling cepat selesai'}.` });
  }
  const i = rng.int(0, DAY_SEQ.length - 3); const three = DAY_SEQ.slice(i, i + 3);
  const right = three.map((x) => x[1]).join(' → ');
  const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map((p) => p.map((j) => three[j][1]).join(' → '));
  return item({ q: 'Urutan kegiatan yang benar adalah …', v: { t: 'basket', items: rng.shuffle(three.map((x) => x[0])) }, ans: right,
    opts: rng.shuffle([right, ...rng.sample(perms, K - 1)]).map((x) => ({ label: x, value: x })), math: { kind: 'dayorder', seq: DAY_SEQ.map((x) => x[1]), right },
    hint: 'Pikirkan kegiatanmu dari pagi sampai malam.', explain: `Urutannya: ${right}.` });
};

const SH_NAME = { tri: 'segitiga', rtri: 'segitiga', 'tri-wide': 'segitiga', sq: 'segiempat', rect: 'segiempat', rhombus: 'segiempat', trap: 'segiempat', pent: 'segi lima', hex: 'segi enam', circle: 'lingkaran' };
G['1.2.7'] = (rng, lv, K) => {
  if (lv < 3) {
    const pool = lv === 1 ? ['tri', 'sq', 'rect', 'circle'] : ['tri', 'rtri', 'rhombus', 'trap', 'pent', 'hex', 'circle'];
    const k = rng.pick(pool); const ans = SH_NAME[k];
    return item({ q: 'Bangun datar ini bernama …', v: { t: 'shape', k, fill: rng.int(0, 5), rot: lv === 2 ? rng.pick([0, 15, -20]) : 0 }, ans,
      opts: textOpts(rng, ans, ['segitiga', 'segiempat', 'lingkaran', 'segi lima', 'segi enam'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
      math: { kind: 'shapename', k }, hint: 'Hitung sisinya. Lingkaran tidak punya sisi lurus.', explain: `Bangun ini adalah ${ans}.` });
  }
  const odd = rng.pick(['circle', 'sq', 'open', 'curvy']); const tris = rng.sample(['tri', 'rtri', 'tri-wide'], K - 1);
  const keys = rng.shuffle([odd, ...tris]);
  return item({ q: 'Manakah yang bukan segitiga?', v: null, ans: odd,
    opts: keys.map((k, i) => ({ label: shapeOpt(k, i), value: k, html: true })), math: { kind: 'nottri', keys },
    hint: 'Segitiga punya 3 sisi lurus yang tertutup.', explain: odd === 'open' ? 'Bangun itu tidak tertutup, jadi bukan segitiga.' : odd === 'curvy' ? 'Sisinya melengkung, jadi bukan segitiga.' : 'Bangun itu tidak punya 3 sisi lurus, jadi bukan segitiga.' });
};
const shapeOpt = (k, i) => `@shape:${k}:${(i + 2) % 6}:${k === 'tri' ? 180 : k === 'rtri' ? 90 : 0}`; // dirender oleh UI

const COMP_COUNT = { 'sq-2tri': ['segitiga', 2], 'sq-4tri': ['segitiga', 4], 'hex-6tri': ['segitiga', 6], 'tri-4tri': ['segitiga', 4], 'rect-2sq': ['persegi', 2], 'rect-3sq': ['persegi', 3], 'rect-4tri': ['segitiga', 4] };
G['1.2.8'] = (rng, lv, K) => {
  if (lv < 3) {
    const id = rng.pick(lv === 1 ? ['sq-2tri', 'rect-2sq', 'rect-3sq'] : ['sq-4tri', 'hex-6tri', 'tri-4tri', 'rect-4tri']);
    const [nm, n] = COMP_COUNT[id];
    return item({ q: `Bangun ini disusun dari berapa ${nm}?`, v: { t: 'comp', id }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n + 2], K, 1, 8),
      math: { kind: 'comp', id }, hint: 'Setiap bagian punya warna berbeda. Hitung warnanya.', explain: `Bangun itu disusun dari ${n} ${nm}.` });
  }
  return item({ q: 'Dua segitiga ini dapat disusun menjadi …', v: { t: 'pieces', items: ['rtri', 'rtri'] }, ans: 'persegi',
    opts: textOpts(rng, 'persegi', ['lingkaran', 'segi lima', 'segi enam'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
    math: { kind: 'fixed', ans: 'persegi' }, hint: 'Bayangkan salah satu segitiga diputar lalu ditempelkan pada sisi miringnya.', explain: 'Dua segitiga siku-siku yang sama besar dapat disusun menjadi persegi.' });
};

const FRUITS = [['🍎', 'apel'], ['🍌', 'pisang'], ['🍊', 'jeruk'], ['🥭', 'mangga']];
function dataRows(rng, n, lo, hi, distinct = true) {
  const cats = rng.sample(FRUITS, n);
  const vals = distinct ? rng.sample([...Array(hi - lo + 1)].map((_, i) => lo + i), n) : cats.map(() => rng.int(lo, hi));
  return cats.map((c, i) => ({ e: c[0], label: c[1], n: vals[i] }));
}
function dataItem(rng, lv, K, kind, lo, hi) {
  const rows = dataRows(rng, kind === 'bars' ? 4 : K, lo, hi);
  const v = kind === 'bars' ? { t: 'bars', rows, max: hi } : { t: kind, rows };
  const intro = 'Data buah kesukaan teman sekelas.';
  if (lv === 1) {
    const r = rng.pick(rows);
    return item({ q: `${intro} Berapa anak yang suka ${r.label}?`, v, ans: r.n, opts: numOpts(rng, r.n, rows.map((x) => x.n), K, 0, 20),
      math: { kind: 'read', rows, label: r.label }, hint: kind === 'bars' ? 'Lihat ujung batang, lalu baca angka di sebelah kiri.' : 'Hitung gambarnya pada baris itu.', explain: `Ada ${r.n} anak yang suka ${r.label}.` });
  }
  if (lv === 2) {
    const most = rng.chance(0.5); const r = rows.reduce((m, x) => (most ? (x.n > m.n ? x : m) : x.n < m.n ? x : m));
    return item({ q: `${intro} Buah apa yang paling ${most ? 'banyak' : 'sedikit'} disukai?`, v, ans: r.label,
      opts: rows.map((x) => ({ label: `${x.e} ${x.label[0].toUpperCase() + x.label.slice(1)}`, value: x.label })),
      math: { kind: most ? 'argmax' : 'argmin', vals: rows.map((x) => x.n), names: rows.map((x) => x.label) }, hint: 'Bandingkan panjang setiap baris.', explain: `${r.label[0].toUpperCase() + r.label.slice(1)} paling ${most ? 'banyak' : 'sedikit'} disukai, yaitu ${r.n} anak.` });
  }
  const [a, b] = rng.sample(rows, 2).sort((x, y) => y.n - x.n);
  if (rng.chance(0.5) || kind === 'picto') return item({ q: `${intro} Berapa anak lebih banyak yang suka ${a.label} daripada ${b.label}?`, v, ans: a.n - b.n,
    opts: numOpts(rng, a.n - b.n, [a.n + b.n, a.n, b.n], K, 0, 40), math: { kind: 'expr', e: `${a.n}-${b.n}` }, hint: 'Cari selisihnya: yang banyak dikurangi yang sedikit.', explain: `${a.n} − ${b.n} = ${a.n - b.n}.` });
  const tot = rows.reduce((s, x) => s + x.n, 0);
  return item({ q: `${intro} Berapa banyak anak semuanya?`, v, ans: tot, opts: numOpts(rng, tot, [tot - 1, tot + 1, tot - rows[0].n], K, 0, 60),
    math: { kind: 'expr', e: rows.map((x) => x.n).join('+') }, hint: 'Jumlahkan semua data.', explain: `${rows.map((x) => x.n).join(' + ')} = ${tot}.` });
}
G['1.2.9'] = (rng, lv, K) => {
  // picto dengan menyortir keranjang di level 1
  if (lv === 1 && rng.chance(0.5)) {
    const [f1, f2] = rng.sample(FRUITS, 2); const a = rng.int(2, 6), b = rng.int(2, 6); const items = rng.shuffle([...Array(a).fill(f1[0]), ...Array(b).fill(f2[0])]);
    const ask = rng.pick([[f1, a], [f2, b]]);
    return item({ q: `Ada berapa ${ask[0][1]} di dalam keranjang?`, v: { t: 'basket', items }, ans: ask[1], opts: numOpts(rng, ask[1], [a + b, a === ask[1] ? b : a], K, 0, 12),
      math: { kind: 'sort', items, e: ask[0][0] }, hint: `Cari semua ${ask[0][1]}, lalu hitung.`, explain: `Ada ${ask[1]} ${ask[0][1]}.` });
  }
  return dataItem(rng, lv, K, 'picto', 1, 6);
};

// ===== KELAS 2 SEMESTER 1 =====
G['2.1.1'] = (rng, lv, K) => {
  if (lv === 1) {
    const t = rng.int(2, 4), o = rng.int(0, 9), n = t * 10 + o;
    return item({ q: 'Ada berapa lidi semuanya?', v: { t: 'sticks', tens: t, ones: o }, ans: n, opts: numOpts(rng, n, [t + o, o * 10 + t, n + 10, n - 1], K, 0, 50),
      math: { kind: 'expr', e: `${t}*10+${o}` }, hint: 'Hitung ikatan dengan loncat sepuluh, yaitu 10, 20, 30, dan seterusnya.', explain: `${t} ikat = ${t * 10}, ditambah ${o} lidi lepas = ${n}.` });
  }
  if (lv === 2) {
    const st = rng.pick([2, 5, 10]); const start = st === 2 ? rng.int(1, 15) * 2 : st === 5 ? rng.int(0, 4) * 5 : rng.int(0, 1) * 10;
    const seq = [0, 1, 2, 3].map((i) => start + i * st); const ans = start + 4 * st;
    return item({ q: `Lanjutkan loncatan ini: ${seq.join(', ')}, …`, v: { t: 'numline', from: start, to: ans, step: st, labels: 'ends', hops: 4 }, ans,
      opts: numOpts(rng, ans, [ans + 1, ans - st + 1, ans + st], K, 0, 60), math: { kind: 'seq', seq, next: 1 }, hint: `Setiap kali bertambah ${st}.`, explain: `Loncat ${st}: ${seq.join(', ')}, ${ans}.` });
  }
  const n = rng.int(21, 50); const t = Math.floor(n / 10), o = n % 10;
  return item({ q: `Lambang bilangan untuk "${terbilang(n)}" adalah …`, v: null, ans: n,
    opts: numOpts(rng, n, [o * 10 + t, t * 100 + o, n + 1, n - 10].filter((x) => x !== n), K, 0, 999), math: { kind: 'word', word: terbilang(n) }, hint: '"Puluh" menunjukkan angka puluhan.', explain: `"${terbilang(n)}" ditulis ${n}.` });
};

G['2.1.2'] = (rng, lv, K) => {
  if (lv === 1) {
    const t = rng.int(1, 4), o = rng.int(1, 9), n = t * 10 + o; const askT = rng.chance(0.5);
    const ans = askT ? t * 10 : o;
    return item({ q: `Pada bilangan ${n}, angka ${askT ? t : o} bernilai …`, v: { t: 'blocks', tens: t, o }, ans, opts: numOpts(rng, ans, askT ? [t, n, t + 10] : [o * 10, n, o + 1], K, 0, 99),
      math: { kind: 'placeval', n, place: askT ? 1 : 0 }, hint: 'Angka di kiri adalah puluhan. Angka di kanan adalah satuan.', explain: askT ? `Angka ${t} ada di tempat puluhan, jadi nilainya ${t * 10}.` : `Angka ${o} ada di tempat satuan, jadi nilainya ${o}.` });
  }
  if (lv === 2) {
    const a = rng.int(10, 50); let b = rng.int(10, 50); if (rng.chance(0.15)) b = a; if (rng.chance(0.3) && a % 10 !== Math.floor(a / 10) && a % 10 > 0 && a % 10 <= 5) b = (a % 10) * 10 + Math.floor(a / 10);
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return item({ q: 'Tanda yang tepat untuk mengisi kotak adalah …', v: { t: 'eq', text: `${a} □ ${b}` }, ans, opts: ['>', '<', '='].map((s) => ({ label: s, value: s })), fixedOpts: true,
      math: { kind: 'cmp', a, b }, hint: 'Bandingkan puluhannya dulu. Kalau sama, bandingkan satuannya.', explain: `${a} ${ans === '>' ? 'lebih besar dari' : ans === '<' ? 'lebih kecil dari' : 'sama dengan'} ${b}, jadi ${a} ${ans} ${b}.` });
  }
  const vals = rng.sample([...Array(41)].map((_, i) => 10 + i), 3); const asc = vals.slice().sort((x, y) => x - y);
  const right = asc.join(', ');
  const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map((p) => p.map((j) => asc[j]).join(', '));
  return item({ q: 'Urutan bilangan dari yang terkecil adalah …', v: { t: 'basket', items: vals.map((v) => `<b class="numchip">${v}</b>`) }, ans: right,
    opts: rng.shuffle([right, ...rng.sample(perms, K - 1)]).map((x) => ({ label: x, value: x })), math: { kind: 'order', vals, right }, hint: 'Cari bilangan terkecil dulu.', explain: `Dari yang terkecil: ${right}.` });
};

G['2.1.3'] = (rng, lv, K) => {
  if (lv === 1) { const a = rng.int(4, 12), b = rng.int(3, 20 - a); return item({ q: `${a} + ${b} = …`, v: { t: 'eq', text: `${a} + ${b} = □` }, ans: a + b, opts: numOpts(rng, a + b, [a + b + 1, a + b - 1, a + b + 10], K, 0, 30), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Coba buat 10 dulu.', explain: `${a} + ${b} = ${a + b}.` }); }
  if (lv === 2) { const a = rng.int(11, 20), b = rng.int(2, a - 1); return item({ q: `${a} − ${b} = …`, v: { t: 'eq', text: `${a} − ${b} = □` }, ans: a - b, opts: numOpts(rng, a - b, [a - b + 1, a - b - 1, a + b > 30 ? a - b + 10 : a + b], K, 0, 30), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Kurangi sampai 10 dulu, lalu kurangi sisanya.', explain: `${a} − ${b} = ${a - b}.` }); }
  const nm = rng.pick(NAMES);
  if (rng.chance(0.5)) { const a = rng.int(11, 20), b = rng.int(3, a - 2); return item({ q: `${nm} punya ${a} permen. ${nm} memberikan ${b} permen kepada adiknya. Berapa permen ${nm} sekarang?`, v: null, ans: a - b, opts: numOpts(rng, a - b, [a + b, a - b + 1, a - b - 1], K, 0, 40), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Memberikan berarti permennya berkurang.', explain: `${a} − ${b} = ${a - b}.` }); }
  const a = rng.int(6, 12), b = rng.int(4, 20 - a);
  return item({ q: `Di kelas ada ${a} siswa laki-laki dan ${b} siswa perempuan. Berapa jumlah siswa di kelas itu?`, v: null, ans: a + b, opts: numOpts(rng, a + b, [a + b + 1, a + b - 1, Math.abs(a - b)], K, 0, 40), math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Jumlah berarti digabung.', explain: `${a} + ${b} = ${a + b}.` });
};

G['2.1.4'] = (rng, lv, K) => {
  if (lv === 3 && rng.chance(0.5)) {
    const st = rng.int(1, 3), a0 = rng.int(1, 3); const seq = [0, 1, 2].map((i) => a0 + i * st); const ans = a0 + 3 * st; const e = rng.pick(['⭐', '🌸', '🍀']);
    return item({ q: `Berapa ${e} pada gambar berikutnya?`, v: { t: 'grow', seq, e }, ans, opts: numOpts(rng, ans, [ans + 1, ans - 1, seq[2] + 1], K, 1, 20),
      math: { kind: 'seq', seq, next: 1 }, hint: 'Hitung berapa yang bertambah setiap langkah.', explain: `Setiap langkah bertambah ${st}. ${seq[2]} + ${st} = ${ans}.` });
  }
  return patternItem(rng, lv, K, lv === 1 ? [[0, 0, 1]] : [[0, 0, 1], [0, 1, 1, 2], [0, 1, 2]]);
};

G['2.1.5'] = (rng, lv, K) => {
  if (lv === 1) {
    const [e, nm] = rng.pick([['🐱', 'kucing'], ['🐶', 'anjing'], ['🐔', 'ayam']]); const pos = rng.pick(['kanan', 'kiri']);
    return item({ q: `Dilihat dari tempatmu, di sebelah mana ${nm} berada?`, v: { t: 'scene', ref: 'rumah', items: [{ e, pos }], hands: true }, ans: pos,
      opts: ['kanan', 'kiri', 'atas', 'belakang'].slice(0, K).map((p) => ({ label: p === 'kanan' || p === 'kiri' ? `Di sebelah ${p} rumah` : `Di ${p} rumah`, value: p })),
      math: { kind: 'position', pos }, hint: 'Angkat tangan kananmu. Tangan itu menunjuk ke kanan.', explain: `${nm[0].toUpperCase() + nm.slice(1)} berada di sebelah ${pos} rumah.` });
  }
  const N = 4; const start = [rng.int(0, 3), rng.int(0, 3)];
  const DIRS = { kanan: [1, 0], kiri: [-1, 0], atas: [0, -1], bawah: [0, 1] };
  for (;;) {
    const steps = lv === 2 ? 1 : 2; const moves = [];
    let [x, y] = start;
    for (let i = 0; i < steps; i++) {
      const d = rng.pick(Object.keys(DIRS).filter((k) => !moves.length || k !== moves[moves.length - 1][0])); const n = rng.int(1, 2);
      moves.push([d, n]); x += DIRS[d][0] * n; y += DIRS[d][1] * n;
    }
    if (x < 0 || y < 0 || x >= N || y >= N || (x === start[0] && y === start[1])) continue;
    if (moves.length === 2 && DIRS[moves[0][0]][0] === -DIRS[moves[1][0]][0] && DIRS[moves[0][0]][1] === -DIRS[moves[1][0]][1]) continue;
    const cells = []; for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++) if (!(xx === start[0] && yy === start[1]) && !(xx === x && yy === y)) cells.push([xx, yy]);
    const others = rng.sample(cells, K - 1); const all = rng.shuffle([[x, y], ...others]); const letters = ['A', 'B', 'C', 'D'];
    const marks = all.map((c, i) => ({ x: c[0], y: c[1], l: letters[i] })); const ans = marks.find((m) => m.x === x && m.y === y).l;
    const txt = moves.map(([d, n]) => `${n} petak ke ${d}`).join(', lalu ');
    return item({ q: `Mulai dari ⭐, jalan ${txt}. Kamu sampai di petak mana?`, v: { t: 'grid', N, start, marks }, ans, opts: letters.slice(0, K).map((l) => ({ label: l, value: l })),
      math: { kind: 'grid', start, moves, marks }, hint: 'Gerakkan jarimu di gambar, satu petak demi satu petak.', explain: `Setelah berjalan ${txt}, kamu sampai di petak ${ans}.` });
  }
};

G['2.1.6'] = (rng, lv, K) => {
  if (lv === 1) {
    const k = rng.pick(['tri', 'sq', 'rect', 'pent', 'hex']); const n = { tri: 3, sq: 4, rect: 4, pent: 5, hex: 6 }[k];
    return item({ q: 'Bangun ini memiliki berapa sisi?', v: { t: 'shape', k, fill: rng.int(0, 5) }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n + 2], K, 2, 9),
      math: { kind: 'sides', k }, hint: 'Sisi adalah garis lurus di tepi bangun. Hitung satu per satu.', explain: `Bangun ini memiliki ${n} sisi.` });
  }
  if (lv === 2) {
    const curved = rng.chance(0.5);
    if (curved) return item({ q: 'Bangun datar mana yang memiliki sisi lengkung?', v: null, ans: 'lingkaran', opts: textOpts(rng, 'lingkaran', ['segitiga', 'persegi', 'segi lima', 'segi enam'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
      math: { kind: 'fixed', ans: 'lingkaran' }, hint: 'Lengkung berarti melengkung, tidak lurus.', explain: 'Lingkaran memiliki sisi lengkung. Bangun lainnya bersisi lurus.' });
    return item({ q: 'Bangun ruang mana yang semua sisinya datar?', v: null, ans: 'kubus', opts: textOpts(rng, 'kubus', ['bola', 'kerucut', 'tabung'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
      math: { kind: 'fixed', ans: 'kubus' }, hint: 'Bangun yang bisa menggelinding punya sisi lengkung.', explain: 'Semua sisi kubus datar. Bola, kerucut, dan tabung memiliki sisi lengkung.' });
  }
  const k = rng.pick(['tri', 'sq', 'pent', 'hex']); const n = { tri: 3, sq: 4, pent: 5, hex: 6 }[k];
  return item({ q: 'Bangun ini memiliki berapa pojok (titik sudut)?', v: { t: 'shape', k, fill: rng.int(0, 5), marks: true }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n * 2], K, 2, 12),
    math: { kind: 'sides', k }, hint: 'Pojok adalah tempat dua sisi bertemu. Lihat titik-titik putih.', explain: `Bangun ini memiliki ${n} pojok.` });
};

G['2.1.7'] = (rng, lv, K) => {
  const i = rng.int(0, 6);
  if (lv === 1) { const after = rng.chance(0.5); const ans = HARI[(i + (after ? 1 : 6)) % 7];
    return item({ q: `Hari ${after ? 'sesudah' : 'sebelum'} ${HARI[i]} adalah hari …`, v: null, ans, opts: textOpts(rng, ans, [HARI[(i + 1) % 7], HARI[(i + 6) % 7], HARI[(i + 2) % 7], HARI[(i + 5) % 7]], K),
      math: { kind: 'day', from: i, shift: after ? 1 : -1 }, hint: 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu.', explain: `${after ? 'Sesudah' : 'Sebelum'} ${HARI[i]} adalah ${ans}.` }); }
  if (lv === 2) { const s = rng.int(2, 3); const ans = HARI[(i + s) % 7];
    return item({ q: `Hari ini hari ${HARI[i]}. ${s === 2 ? 'Lusa' : 'Tiga hari lagi'} adalah hari …`, v: null, ans, opts: textOpts(rng, ans, [HARI[(i + s - 1) % 7], HARI[(i + s + 1) % 7], HARI[(i + 1) % 7]], K),
      math: { kind: 'day', from: i, shift: s }, hint: s === 2 ? 'Lusa berarti dua hari lagi.' : 'Hitung maju tiga hari.', explain: `${s === 2 ? 'Lusa' : 'Tiga hari'} sesudah ${HARI[i]} adalah ${ans}.` }); }
  if (rng.chance(0.5)) {
    const acts = farApart(rng, 3); const long = rng.chance(0.5); const ans = acts.reduce((m, a) => (long ? (a[2] > m[2] ? a : m) : a[2] < m[2] ? a : m));
    return item({ q: `Kegiatan mana yang paling ${long ? 'lama' : 'sebentar'}?`, v: null, ans: ans[1], opts: acts.map((a) => ({ label: `${a[0]} ${a[1]}`, value: a[1] })),
      math: { kind: long ? 'argmax' : 'argmin', vals: acts.map((a) => a[2]), names: acts.map((a) => a[1]) }, hint: 'Bayangkan kamu melakukannya.', explain: `${ans[1]} ${long ? 'paling lama' : 'paling cepat selesai'}.` });
  }
  const h = rng.int(1, 12); // pengayaan: jam tepat
  return item({ q: 'Jam ini menunjukkan pukul berapa?', v: { t: 'clock', h, m: 0 }, ans: h, opts: numOpts(rng, h, [(h % 12) + 1, h === 1 ? 12 : h - 1, 12], K, 1, 12).map((o) => ({ ...o, label: `Pukul ${o.value}` })),
    math: { kind: 'clock', h }, hint: 'Jarum pendek menunjuk jam. Jarum panjang di angka 12 berarti tepat.', explain: `Jarum pendek menunjuk angka ${h} dan jarum panjang di angka 12. Jadi, pukul ${h} tepat.` });
};

// ===== KELAS 2 SEMESTER 2 =====
G['2.2.1'] = (rng, lv, K) => {
  if (lv === 1) {
    const t = rng.int(3, 9), o = rng.int(0, 9), n = t * 10 + o;
    return item({ q: 'Bilangan yang ditunjukkan balok ini adalah …', v: { t: 'blocks', tens: t, o }, ans: n, opts: numOpts(rng, n, [o * 10 + t, t + o, n + 10, n - 1].filter((x) => x !== n), K, 0, 100),
      math: { kind: 'expr', e: `${t}*10+${o}` }, hint: 'Batang panjang bernilai 10. Kotak kecil bernilai 1.', explain: `${t} puluhan dan ${o} satuan = ${n}.` });
  }
  if (lv === 2) {
    const base = rng.int(2, 8) * 10; const x = base + rng.int(1, 9);
    return item({ q: 'Bilangan yang ditunjuk panah adalah …', v: { t: 'numline', from: base, to: base + 10, step: 1, labels: 'ends', arrow: x }, ans: x,
      opts: numOpts(rng, x, [x + 1, x - 1, x - base], K, 0, 100), math: { kind: 'numline', from: base, arrow: x }, hint: `Mulai dari ${base}, lalu hitung garis kecilnya.`, explain: `Dari ${base} maju ${x - base} langkah adalah ${x}.` });
  }
  let vals; do { vals = rng.sample([...Array(90)].map((_, i) => 10 + i), K); } while (false);
  if (rng.chance(0.6)) { const a = rng.int(1, 8), b = rng.int(a + 1, 9); vals[0] = a * 10 + b; vals[1] = b * 10 + a; vals = uniq(vals); while (vals.length < K) { const r = rng.int(10, 99); if (!vals.includes(r)) vals.push(r); } }
  vals = rng.shuffle(vals); const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
  return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.slice().sort((x, y) => x - y).map((n) => ({ label: fmt(n), value: n })),
    math: { kind: big ? 'max' : 'min', vals }, hint: 'Bandingkan angka puluhannya dulu.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${ans}.` });
};

G['2.2.2'] = (rng, lv, K) => {
  if (lv === 1) {
    const shape = rng.pick(['circle', 'square']);
    const kinds = rng.shuffle(['half', 'unequal', 'none', 'quarter']).slice(0, K - 1);
    const set = rng.shuffle(['half', ...kinds.filter((k) => k !== 'half')]).slice(0, K);
    while (set.length < K) set.push('quarter');
    return item({ q: 'Gambar mana yang diwarnai setengah?', v: null, ans: 'half', opts: uniq(set).map((k) => ({ label: fracOpt(shape, k), value: k, html: true })),
      math: { kind: 'halfpick' }, hint: 'Setengah berarti 1 dari 2 bagian yang sama besar.', explain: 'Setengah adalah 1 dari 2 bagian yang sama besar.' });
  }
  if (lv === 2) {
    const n = rng.pick([2, 4, 6, 8, 10]); const [e, nm] = rng.pick(FOOD.filter((f) => f[1] !== 'telur'));
    return item({ q: `Setengah dari ${n} ${nm} adalah …`, v: { t: 'objects', groups: [{ e, n }], small: n > 6 }, ans: n / 2, opts: numOpts(rng, n / 2, [n, n - 2, n / 2 + 1, 2], K, 1, 12),
      math: { kind: 'expr', e: `${n}/2` }, hint: 'Bagi menjadi 2 kelompok yang sama banyak.', explain: `${n} dibagi 2 kelompok sama banyak. Setiap kelompok berisi ${n / 2}.` });
  }
  const p = rng.pick([4, 6, 8]);
  return item({ q: `Bangun ini dibagi menjadi ${p} bagian sama besar. Berapa bagian yang harus diwarnai agar menjadi setengah?`, v: { t: 'frac', shape: 'bar', parts: p, shaded: 0 }, ans: p / 2,
    opts: numOpts(rng, p / 2, [1, 2, p, p / 2 + 1], K, 1, 8), math: { kind: 'expr', e: `${p}/2` }, hint: 'Setengah berarti separuh dari semua bagian.', explain: `Separuh dari ${p} bagian adalah ${p / 2} bagian.` });
};
const fracOpt = (shape, k) => `@frac:${shape}:${k}`;

G['2.2.3'] = (rng, lv, K) => {
  if (lv === 1) {
    const shape = rng.pick(['circle', 'square']);
    const set = ['quarter', ...rng.sample(['half', 'unequal4', 'three4'], K - 1)];
    return item({ q: 'Gambar mana yang diwarnai seperempat?', v: null, ans: 'quarter', opts: rng.shuffle(set).map((k) => ({ label: fracOpt(shape, k), value: k, html: true })),
      math: { kind: 'quarterpick' }, hint: 'Seperempat berarti 1 dari 4 bagian yang sama besar.', explain: 'Seperempat adalah 1 dari 4 bagian yang sama besar.' });
  }
  if (lv === 2) {
    return item({ q: 'Sebuah kue dipotong menjadi 4 bagian sama besar. Satu bagian disebut …', v: { t: 'frac', shape: 'circle', parts: 4, shaded: 1 }, ans: 'seperempat',
      opts: textOpts(rng, 'seperempat', ['setengah', 'utuh', 'empat'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })), math: { kind: 'fixed', ans: 'seperempat' },
      hint: 'Ada 4 bagian. Kita ambil 1 bagian.', explain: '1 dari 4 bagian yang sama besar disebut seperempat.' });
  }
  return item({ q: 'Dua kue sama besar. Mana yang lebih besar: setengah kue atau seperempat kue?', v: { t: 'stack', items: [{ t: 'frac', shape: 'circle', parts: 2, shaded: 1, size: 100 }, { t: 'frac', shape: 'circle', parts: 4, shaded: 1, size: 100 }] }, ans: 'setengah',
    opts: [['setengah', 'Setengah kue'], ['seperempat', 'Seperempat kue'], ['sama', 'Sama besar']].map(([v, l]) => ({ label: l, value: v })), fixedOpts: true,
    math: { kind: 'fixed', ans: 'setengah' }, hint: 'Makin banyak potongan, makin kecil setiap potongan.', explain: 'Kue yang dibagi 2 potongannya lebih besar daripada kue yang dibagi 4. Jadi, setengah lebih besar.' });
};

const HEAVY = [['🍉', 'semangka', 5], ['📘', 'buku', 3], ['🪨', 'batu', 4], ['🍍', 'nanas', 2]];
const LIGHT = [['🎈', 'balon', 0], ['🪶', 'bulu', 0], ['🍃', 'daun', 0], ['🌸', 'bunga', 1]];
G['2.2.4'] = (rng, lv, K) => {
  if (lv === 1) {
    const h = rng.pick(HEAVY), l = rng.pick(LIGHT); const heavyLeft = rng.chance(0.5); const askHeavy = rng.chance(0.6);
    const left = heavyLeft ? h : l, right = heavyLeft ? l : h;
    const ans = askHeavy ? h[1] : l[1];
    return item({ q: `Benda mana yang lebih ${askHeavy ? 'berat' : 'ringan'}?`, v: { t: 'pan', left: { e: left[0], n: 1 }, right: { e: right[0], n: 1 }, tilt: heavyLeft ? -1 : 1 }, ans,
      opts: [left, right].map((x) => ({ label: `${x[0]} ${x[1][0].toUpperCase() + x[1].slice(1)}`, value: x[1] })).concat(K > 2 ? [{ label: 'Sama berat', value: 'sama' }] : []).slice(0, 3), fixedOpts: true,
      math: { kind: 'pan', heavier: h[1], ask: askHeavy ? 'berat' : 'ringan', light: l[1] }, hint: 'Sisi timbangan yang turun berisi benda yang lebih berat.', explain: `Sisi timbangan yang berisi ${h[1]} turun. Jadi, ${h[1]} lebih berat dan ${l[1]} lebih ringan.` });
  }
  if (lv === 2) {
    const h = rng.pick(HEAVY.slice(0, 3)); const n = rng.int(3, 8);
    return item({ q: `Timbangan ini seimbang. ${h[1][0].toUpperCase() + h[1].slice(1)} sama berat dengan berapa kelereng?`, v: { t: 'pan', left: { e: h[0], n: 1 }, right: { e: '🔵', n }, tilt: 0 }, ans: n,
      opts: numOpts(rng, n, [n + 1, n - 1, 1], K, 1, 12), math: { kind: 'count', n }, hint: 'Seimbang berarti sama berat. Hitung kelerengnya.', explain: `Timbangan seimbang, jadi ${h[1]} sama berat dengan ${n} kelereng.` });
  }
  const three = rng.sample([['🍉', 'semangka'], ['📘', 'buku'], ['🍎', 'apel'], ['🪨', 'batu'], ['🍍', 'nanas']], 3); // urutan: [0] terberat
  const light = rng.chance(0.5); const ans = light ? three[2][1] : three[0][1];
  return item({ q: `Perhatikan kedua timbangan. Benda mana yang paling ${light ? 'ringan' : 'berat'}?`, v: { t: 'pans', pairs: [[three[0][0], three[1][0]], [three[1][0], three[2][0]]] }, ans,
    opts: rng.shuffle(three).map((x) => ({ label: `${x[0]} ${x[1][0].toUpperCase() + x[1].slice(1)}`, value: x[1] })), fixedOpts: true,
    math: { kind: 'chain', order: three.map((x) => x[1]), ask: light ? 'ringan' : 'berat' }, hint: 'Benda di sisi yang turun lebih berat.', explain: `${three[0][1][0].toUpperCase() + three[0][1].slice(1)} lebih berat dari ${three[1][1]}, dan ${three[1][1]} lebih berat dari ${three[2][1]}. Jadi, yang paling ${light ? 'ringan' : 'berat'} adalah ${ans}.` });
};

const SPORTS = [['⚽', 'sepak bola'], ['🪁', 'layang-layang'], ['🏸', 'bulu tangkis'], ['🏃', 'lari']];
G['2.2.5'] = (rng, lv, K) => {
  const n = rng.chance(0.5) ? 3 : 4; const cats = rng.sample(SPORTS, n); const vals = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], n);
  const rows = cats.map((c, i) => ({ e: c[0], label: c[1], n: vals[i] }));
  const v = lv === 2 ? { t: 'picto', rows: rows.map((r) => ({ ...r, n: Math.min(r.n, 8) })) } : { t: 'tally', rows };
  const R = lv === 2 ? v.rows : rows; const intro = 'Data permainan kesukaan siswa kelas 2.';
  if (lv === 1) { const r = rng.pick(R); return item({ q: `${intro} Berapa siswa yang suka ${r.label}?`, v, ans: r.n, opts: numOpts(rng, r.n, [r.n + 5, r.n - 1, r.n + 1], K, 0, 20), math: { kind: 'read', rows: R, label: r.label }, hint: 'Satu ikat turus berisi 5 garis.', explain: `Ada ${r.n} siswa yang suka ${r.label}.` }); }
  if (lv === 2) {
    if (new Set(R.map((r) => r.n)).size < R.length) R.forEach((r, i) => (r.n = 2 + i * 2));
    const most = rng.chance(0.5); const r = R.reduce((m, x) => (most ? (x.n > m.n ? x : m) : x.n < m.n ? x : m));
    return item({ q: `${intro} Permainan apa yang paling ${most ? 'banyak' : 'sedikit'} disukai?`, v, ans: r.label, opts: R.map((x) => ({ label: `${x.e} ${x.label[0].toUpperCase() + x.label.slice(1)}`, value: x.label })), fixedOpts: true,
      math: { kind: most ? 'argmax' : 'argmin', vals: R.map((x) => x.n), names: R.map((x) => x.label) }, hint: 'Bandingkan banyak gambar pada setiap baris.', explain: `${r.label[0].toUpperCase() + r.label.slice(1)} paling ${most ? 'banyak' : 'sedikit'} disukai.` });
  }
  const tot = rows.reduce((s, x) => s + x.n, 0);
  return item({ q: `${intro} Berapa jumlah semua siswa?`, v, ans: tot, opts: numOpts(rng, tot, [tot - 5, tot + 1, tot - 1], K, 0, 60), math: { kind: 'expr', e: rows.map((x) => x.n).join('+') }, hint: 'Jumlahkan banyak turus pada setiap baris.', explain: `${rows.map((x) => x.n).join(' + ')} = ${tot}.` });
};

const REVIEW_A = ['1.2.3', '1.2.4', '1.2.7', '2.1.2', '2.1.3', '2.1.5', '2.1.6', '2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.2.5'];
G['2.2.6'] = (rng, lv, K) => { const t = rng.pick(REVIEW_A); return { ...G[t](rng, Math.max(2, lv), K), from: t }; };

// ===== KELAS 3 SEMESTER 1 =====
G['3.1.1'] = (rng, lv, K) => {
  const h = rng.int(1, 9), t = rng.int(0, 9), o = rng.int(0, 9), n = h * 100 + t * 10 + o;
  if (lv === 1) {
    const hh = rng.int(1, 3);
    return item({ q: 'Bilangan yang ditunjukkan balok ini adalah …', v: { t: 'blocks', h: hh, tens: Math.min(t, 6), o: Math.min(o, 6) }, ans: hh * 100 + Math.min(t, 6) * 10 + Math.min(o, 6),
      opts: numOpts(rng, hh * 100 + Math.min(t, 6) * 10 + Math.min(o, 6), [hh * 100 + Math.min(o, 6) * 10 + Math.min(t, 6), hh + Math.min(t, 6) + Math.min(o, 6), hh * 100 + Math.min(t, 6) * 10 + Math.min(o, 6) + 100], K, 0, 1000),
      math: { kind: 'expr', e: `${hh}*100+${Math.min(t, 6)}*10+${Math.min(o, 6)}` }, hint: 'Lempeng besar = 100, batang = 10, kotak kecil = 1.', explain: `${hh} ratusan, ${Math.min(t, 6)} puluhan, dan ${Math.min(o, 6)} satuan.` });
  }
  if (lv === 2) {
    const place = rng.pick([2, 1, 0]); const digit = [o, t, h][place]; const nn = digit === 0 ? n + 10 ** place : n; const d = Math.floor(nn / 10 ** place) % 10; const val = d * 10 ** place;
    return item({ q: `Nilai angka ${d} pada bilangan ${fmt(nn)} adalah …`, v: null, ans: val, opts: numOpts(rng, val, [d, d * 10, d * 100, nn].filter((x) => x !== val), K, 0, 1000),
      math: { kind: 'placeval', n: nn, place }, hint: 'Lihat posisi angka itu: ratusan, puluhan, atau satuan.', explain: `Angka ${d} ada di tempat ${['satuan', 'puluhan', 'ratusan'][place]}, jadi nilainya ${fmt(val)}.` });
  }
  if (rng.chance(0.5)) {
    const tt = rng.int(1, 9), oo = rng.int(1, 9); const nn = h * 100 + oo;
    const n2 = rng.chance(0.5) ? nn : h * 100 + tt * 10;
    return item({ q: `Lambang bilangan untuk "${terbilang(n2)}" adalah …`, v: null, ans: n2, opts: numOpts(rng, n2, [h * 100 + (n2 % 100) * 10, h * 10 + (n2 % 100), h * 1000 + (n2 % 100), h * 100 + Math.floor((n2 % 100) / 10) + (n2 % 10) * 10].filter((x) => x !== n2), K, 0, 9999),
      math: { kind: 'word', word: terbilang(n2) }, hint: 'Tulis ratusannya dulu, lalu puluhan dan satuan. Ingat angka 0.', explain: `"${terbilang(n2)}" ditulis ${fmt(n2)}.` });
  }
  const vals = rng.sample([...Array(900)].map((_, i) => 100 + i), K); const big = rng.chance(0.5); const ans = big ? Math.max(...vals) : Math.min(...vals);
  return item({ q: `Bilangan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans, opts: vals.slice().sort((x, y) => x - y).map((x) => ({ label: fmt(x), value: x })), math: { kind: big ? 'max' : 'min', vals }, hint: 'Bandingkan ratusannya dulu.', explain: `Yang paling ${big ? 'besar' : 'kecil'} adalah ${fmt(ans)}.` });
};

function addPair(rng, carry) {
  for (;;) { const a = rng.int(100, 699), b = rng.int(100, 999 - a); const c = (a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10; if (c === carry && a + b <= 1000) return [a, b]; }
}
const noCarrySum = (a, b) => { let r = 0, p = 1; while (a || b) { r += (((a % 10) + (b % 10)) % 10) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; };
G['3.1.2'] = (rng, lv, K) => {
  const [a, b] = addPair(rng, lv > 1); const s = a + b;
  const mis = [noCarrySum(a, b), s + 10, s - 10, s + 100];
  if (lv < 3) return item({ q: `${fmt(a)} + ${fmt(b)} = …`, v: { t: 'column', a, b, op: '+' }, ans: s, opts: numOpts(rng, s, mis, K, 0, 2000),
    math: { kind: 'expr', e: `${a}+${b}` }, hint: lv === 1 ? 'Jumlahkan satuan, puluhan, lalu ratusan.' : 'Kalau satuan atau puluhan lebih dari 9, simpan 1 ke tempat berikutnya.', explain: `${fmt(a)} + ${fmt(b)} = ${fmt(s)}.` });
  return item({ q: `Perpustakaan sekolah punya ${fmt(a)} buku cerita dan ${fmt(b)} buku pelajaran. Berapa jumlah semua buku itu?`, v: null, ans: s, opts: numOpts(rng, s, mis, K, 0, 2000),
    math: { kind: 'expr', e: `${a}+${b}` }, hint: 'Jumlah semua berarti dijumlahkan.', explain: `${fmt(a)} + ${fmt(b)} = ${fmt(s)}.` });
};

function subPair(rng, borrow) {
  for (;;) { const a = rng.int(200, 999), b = rng.int(100, a - 50); const br = a % 10 < b % 10 || Math.floor(a / 10) % 10 < Math.floor(b / 10) % 10; if (br === borrow) return [a, b]; }
}
const smallFromBig = (a, b) => { let r = 0, p = 1; while (a || b) { r += Math.abs((a % 10) - (b % 10)) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; };
G['3.1.3'] = (rng, lv, K) => {
  const [a, b] = subPair(rng, lv > 1); const d = a - b; const mis = [smallFromBig(a, b), d + 10, d - 10, a + b > 2000 ? d + 100 : a + b];
  if (lv === 1) return item({ q: `${fmt(a)} − ${fmt(b)} = …`, v: { t: 'column', a, b, op: '−' }, ans: d, opts: numOpts(rng, d, mis, K, 0, 2000), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Kurangkan satuan, puluhan, lalu ratusan.', explain: `${fmt(a)} − ${fmt(b)} = ${fmt(d)}.` });
  if (lv === 2) return item({ q: `${fmt(a)} − ${fmt(b)} = …`, v: { t: 'column', a, b, op: '−' }, ans: d, opts: numOpts(rng, d, mis, K, 0, 2000), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Kalau angka atas lebih kecil, pinjam 1 dari tempat di sebelah kirinya.', explain: `${fmt(a)} − ${fmt(b)} = ${fmt(d)}. Periksa: ${fmt(d)} + ${fmt(b)} = ${fmt(a)}.` });
  return item({ q: `Pak Tani memanen ${fmt(a)} buah jeruk. Sebanyak ${fmt(b)} buah jeruk dijual. Berapa buah jeruk yang tersisa?`, v: null, ans: d, opts: numOpts(rng, d, mis, K, 0, 2000), math: { kind: 'expr', e: `${a}-${b}` }, hint: 'Dijual berarti berkurang.', explain: `${fmt(a)} − ${fmt(b)} = ${fmt(d)}.` });
};

G['3.1.4'] = (rng, lv, K) => {
  if (lv === 1) { const a = rng.int(5, 40), x = rng.int(5, 50), s = a + x; return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `□ + ${a} = ${s}` }, ans: x, opts: numOpts(rng, x, [s + a, x + 10, x - 1], K, 0, 200), math: { kind: 'expr', e: `${s}-${a}` }, hint: `Berapa ditambah ${a} hasilnya ${s}? Coba ${s} − ${a}.`, explain: `${s} − ${a} = ${x}. Periksa: ${x} + ${a} = ${s}.` }); }
  if (lv === 2) { const b = rng.int(5, 40), c = rng.int(5, 60), a = b + c; return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'eq', text: `${a} − □ = ${c}` }, ans: b, opts: numOpts(rng, b, [a + c, b + 10, b - 10], K, 0, 200), math: { kind: 'expr', e: `${a}-${c}` }, hint: `${a} dikurangi berapa agar tersisa ${c}?`, explain: `${a} − ${b} = ${c}. Jadi, kotak itu berisi ${b}.` }); }
  const tot = rng.int(4, 10) * 10, a = rng.int(Math.ceil(tot * 0.3), Math.floor(tot * 0.7)); const b = tot - a;
  return item({ q: `Ada ${tot} kue di dua kotak. Kotak pertama berisi ${a} kue. Berapa kue di kotak kedua?`, v: { t: 'tape', total: tot, parts: [a, null] }, ans: b, opts: numOpts(rng, b, [tot + a, b + 10, b - 1], K, 0, 200),
    math: { kind: 'expr', e: `${tot}-${a}` }, hint: 'Seluruh pita bernilai jumlah semuanya. Cari bagian yang hilang.', explain: `${tot} − ${a} = ${b}.` });
};

G['3.1.5'] = (rng, lv, K) => {
  if (lv === 3 && rng.chance(0.5)) { const st = rng.int(2, 4), a0 = rng.int(1, 4); const seq = [0, 1, 2].map((i) => a0 + i * st); const ans = a0 + 3 * st;
    return item({ q: 'Berapa ⭐ pada gambar berikutnya?', v: { t: 'grow', seq, e: '⭐' }, ans, opts: numOpts(rng, ans, [ans + 1, ans - 1, seq[2] + 1, ans + st], K, 1, 30), math: { kind: 'seq', seq, next: 1 }, hint: 'Hitung berapa bintang yang bertambah setiap langkah.', explain: `Setiap langkah bertambah ${st}. ${seq[2]} + ${st} = ${ans}.` }); }
  const up = lv === 1 || rng.chance(0.5); const st = rng.pick(lv === 1 ? [2, 5, 10] : [3, 4, 5, 25, 50, 100]); const start = up ? (st >= 25 ? rng.int(0, Math.floor((1000 - 4 * st) / st)) * st : rng.int(1, 60)) : rng.int(4, Math.floor(1000 / st)) * st;
  const seq = [0, 1, 2, 3, 4].map((i) => start + (up ? i : -i) * st);
  const miss = lv === 1 ? 4 : rng.int(1, 3); const ans = seq[miss]; const shown = seq.map((x, i) => (i === miss ? '…' : fmt(x)));
  return item({ q: `Bilangan yang tepat untuk melengkapi pola ${shown.join(', ')} adalah …`, v: null, ans, opts: numOpts(rng, ans, [ans + 1, ans - 1, ans + (up ? st : -st), ans + 10], K, 0, 2000),
    math: { kind: 'seqmiss', seq: seq.map((x, i) => (i === miss ? null : x)) }, hint: 'Cari selisih dua bilangan yang berdekatan.', explain: `Polanya ${up ? 'bertambah' : 'berkurang'} ${st}. Jadi, bilangan yang tepat adalah ${fmt(ans)}.` });
};

G['3.1.6'] = (rng, lv, K) => {
  if (lv === 1) { const g = rng.int(3, 5), n = rng.int(2, 5); const [e, nm] = rng.pick(FOOD);
    return item({ q: `Ada ${g} piring. Setiap piring berisi ${n} ${nm}. Berapa ${nm} semuanya?`, v: { t: 'groups', g, n, e }, ans: g * n, opts: numOpts(rng, g * n, [g + n, g * (n + 1), g * n - 1], K, 0, 100),
      math: { kind: 'expr', e: `${g}*${n}` }, hint: `Jumlahkan ${n} sebanyak ${g} kali.`, explain: `${Array(g).fill(n).join(' + ')} = ${g} × ${n} = ${g * n}.` }); }
  if (lv === 2) { const r = rng.int(2, 6), c = rng.int(3, 8);
    return item({ q: `Ubi disusun ${r} baris. Setiap baris ada ${c} ubi. Berapa ubi semuanya?`, v: { t: 'array', r, c, e: '🍠' }, ans: r * c, opts: numOpts(rng, r * c, [r + c, r * c + c, r * c - r], K, 0, 100),
      math: { kind: 'expr', e: `${r}*${c}` }, hint: 'Banyak baris dikali banyak ubi di setiap baris.', explain: `${r} × ${c} = ${r * c}.` }); }
  const a = rng.int(3, 10), b = rng.int(3, 10);
  return item({ q: `${a} × ${b} = …`, v: { t: 'eq', text: `${a} × ${b} = □` }, ans: a * b, opts: numOpts(rng, a * b, [a + b, a * (b + 1), (a - 1) * b, a * b + 1].filter((x) => x !== a * b), K, 0, 120),
    math: { kind: 'expr', e: `${a}*${b}` }, hint: `${a} × ${b} artinya ${b} dijumlahkan sebanyak ${a} kali.`, explain: `${a} × ${b} = ${a * b}.` });
};

G['3.1.7'] = (rng, lv, K) => {
  const k = rng.int(2, lv === 1 ? 4 : 9), q = rng.int(2, lv === 1 ? 5 : 10), n = k * q;
  if (lv === 1) { const [e, nm] = rng.pick(FOOD); return item({ q: `${n} ${nm} dibagi rata kepada ${k} anak. Berapa ${nm} yang didapat setiap anak?`, v: { t: 'share', n, k, e }, ans: q, opts: numOpts(rng, q, [n - k, k, q + 1], K, 1, 100),
    math: { kind: 'expr', e: `${n}/${k}` }, hint: 'Bagikan satu per satu secara bergiliran.', explain: `${n} : ${k} = ${q}. Setiap anak mendapat ${q} ${nm}.` }); }
  if (lv === 2) return item({ q: `${n} : ${k} = …`, v: { t: 'eq', text: `${n} : ${k} = □` }, ans: q, opts: numOpts(rng, q, [n - k, q + 1, q - 1, k].filter((x) => x !== q), K, 1, 100),
    math: { kind: 'expr', e: `${n}/${k}` }, hint: `Berapa dikali ${k} hasilnya ${n}?`, explain: `${k} × ${q} = ${n}, jadi ${n} : ${k} = ${q}.` });
  return item({ q: `Jika ${q} × ${k} = ${n}, maka ${n} : ${k} = …`, v: null, ans: q, opts: numOpts(rng, q, [n, k, n - k, q + 1].filter((x) => x !== q), K, 1, 100),
    math: { kind: 'expr', e: `${n}/${k}` }, hint: 'Pembagian adalah kebalikan dari perkalian.', explain: `Karena ${q} × ${k} = ${n}, maka ${n} : ${k} = ${q}.` });
};

// ===== KELAS 3 SEMESTER 2 =====
G['3.2.1'] = (rng, lv, K) => {
  if (lv === 1) { const st = rng.int(2, 6); const seq = [1, 2, 3].map((i) => i * st); const ans = 4 * st;
    return item({ q: `Loncatan ${st} dari 0: ${seq.join(', ')}, … Bilangan berikutnya adalah …`, v: { t: 'numline', from: 0, to: 4 * st, step: st, labels: 'ends', hops: 3 }, ans, opts: numOpts(rng, ans, [ans + 1, ans - 1, ans + st], K, 0, 100),
      math: { kind: 'seq', seq, next: 1 }, hint: `Tambahkan ${st} pada bilangan terakhir.`, explain: `${seq[2]} + ${st} = ${ans}. Bilangan ini disebut kelipatan ${st}.` }); }
  if (lv === 2) { const m = rng.int(3, 9); const ans = m * rng.int(2, 9); const wrong = []; while (wrong.length < K - 1) { const x = rng.int(10, 90); if (x % m && !wrong.includes(x)) wrong.push(x); }
    const vals = [ans, ...wrong]; return item({ q: `Manakah yang merupakan kelipatan ${m}?`, v: null, ans, opts: vals.sort((a, b) => a - b).map((x) => ({ label: fmt(x), value: x })),
      math: { kind: 'multipleof', m, vals }, hint: `Kelipatan ${m} adalah ${m}, ${2 * m}, ${3 * m}, dan seterusnya.`, explain: `${ans} = ${ans / m} × ${m}, jadi ${ans} adalah kelipatan ${m}.` }); }
  if (rng.chance(0.5)) {
    const n = rng.pick([12, 18, 20, 24, 30, 36]); const facs = [...Array(n)].map((_, i) => i + 1).filter((d) => n % d === 0 && d > 1 && d < n); const ans = rng.pick(facs);
    const wrong = []; while (wrong.length < K - 1) { const x = rng.int(2, n - 1); if (n % x && !wrong.includes(x)) wrong.push(x); }
    const vals = [ans, ...wrong]; return item({ q: `Manakah yang merupakan faktor dari ${n}?`, v: null, ans, opts: vals.sort((a, b) => a - b).map((x) => ({ label: fmt(x), value: x })),
      math: { kind: 'factorof', n, vals }, hint: `Faktor dari ${n} adalah bilangan yang dapat membagi ${n} habis.`, explain: `${n} : ${ans} = ${n / ans}, habis dibagi. Jadi, ${ans} adalah faktor dari ${n}.` });
  }
  const r = rng.int(2, 5), c = rng.int(3, 6), n = r * c;
  return item({ q: `${n} ubi disusun menjadi ${r} baris sama banyak. Berapa ubi di setiap baris?`, v: { t: 'array', r, c, e: '🍠' }, ans: c, opts: numOpts(rng, c, [n - r, r, c + 1], K, 1, 30),
    math: { kind: 'expr', e: `${n}/${r}` }, hint: 'Hitung ubi dalam satu baris.', explain: `${r} × ${c} = ${n}. Jadi, ${r} dan ${c} adalah faktor dari ${n}.` });
};

G['3.2.2'] = (rng, lv, K) => {
  if (lv === 1) { const d = rng.int(3, 8), n = rng.int(1, d - 1);
    const mis = uniq([`${d}/${n}`, `${n}/${d - n}`, `${d - n}/${d}`, `1/${d}`, `${n}/${d + 1}`].filter((x) => x !== `${n}/${d}`));
    return item({ q: 'Pecahan untuk bagian yang diwarnai adalah …', v: { t: 'frac', shape: rng.pick(['circle', 'bar']), parts: d, shaded: n }, ans: `${n}/${d}`,
      opts: rng.shuffle([`${n}/${d}`, ...rng.sample(mis, K - 1)]).map((x) => ({ label: `frac:${x}`, value: x })), math: { kind: 'fracread', n, d },
      hint: 'Penyebut = banyak semua bagian. Pembilang = banyak bagian yang diwarnai.', explain: `Ada ${d} bagian sama besar dan ${n} diwarnai. Jadi, pecahannya ${n}/${d}.` }); }
  if (lv === 2) { const d = rng.int(5, 9); const ns = rng.sample([...Array(d - 1)].map((_, i) => i + 1), K); const big = rng.chance(0.6); const ans = big ? Math.max(...ns) : Math.min(...ns);
    return item({ q: `Pecahan mana yang paling ${big ? 'besar' : 'kecil'}?`, v: null, ans: `${ans}/${d}`, opts: ns.sort((a, b) => a - b).map((n) => ({ label: `frac:${n}/${d}`, value: `${n}/${d}` })),
      math: { kind: big ? 'fracmax' : 'fracmin', fr: ns.map((n) => [n, d]) }, hint: 'Penyebutnya sama. Bandingkan pembilangnya.', explain: `Penyebutnya sama, jadi pecahan dengan pembilang ${big ? 'terbesar' : 'terkecil'} adalah yang paling ${big ? 'besar' : 'kecil'}.` }); }
  if (rng.chance(0.5)) { const [a, b] = rng.sample([2, 3, 4, 5, 6, 8], 2).sort((x, y) => x - y); const askBig = rng.chance(0.5);
    return item({ q: `Mana yang lebih ${askBig ? 'besar' : 'kecil'}?`, v: { t: 'stack', items: [{ t: 'frac', shape: 'bar', parts: a, shaded: 1, size: 100 }, { t: 'frac', shape: 'bar', parts: b, shaded: 1, size: 100 }] }, ans: askBig ? `1/${a}` : `1/${b}`,
      opts: [`1/${a}`, `1/${b}`].map((x) => ({ label: `frac:${x}`, value: x })).concat([{ label: 'Sama besar', value: 'sama' }]), fixedOpts: true,
      math: { kind: askBig ? 'fracmax' : 'fracmin', fr: [[1, a], [1, b]] }, hint: 'Makin besar penyebutnya, makin kecil setiap bagiannya.', explain: `1/${a} lebih besar daripada 1/${b} karena dibagi menjadi lebih sedikit bagian.` }); }
  const d = rng.pick([2, 3, 4]), m = rng.pick([2, 3]).valueOf(); const n = rng.int(1, d - 1);
  return item({ q: 'Bilangan berapa yang tepat untuk mengisi kotak?', v: { t: 'stack', items: [{ t: 'eq', text: `${n}/${d} = □/${d * m}` }, { t: 'fraceq', a: [n, d], b: [0, d * m] }] }, ans: n * m, opts: numOpts(rng, n * m, [n, n + m, d * m - n * m, n * m + 1].filter((x) => x !== n * m), K, 1, 24),
    math: { kind: 'fraceq', n, d, D: d * m }, hint: 'Lihat gambarnya. Berapa bagian bawah yang sama panjang dengan bagian atas yang diwarnai?', explain: `${n}/${d} = ${n * m}/${d * m}. Bagian yang diwarnai sama panjang.` });
};

G['3.2.3'] = (rng, lv, K) => {
  if (lv === 1) { const len = rng.int(3, 9); return item({ q: 'Berapa panjang pensil ini?', v: { t: 'ruler', start: 0, end: len, max: 10, obj: 'pensil' }, ans: len, opts: numOpts(rng, len, [len + 1, len - 1], K, 1, 12).map((o) => ({ ...o, label: `${o.value} cm` })),
    math: { kind: 'ruler', start: 0, end: len }, hint: 'Pensil dimulai dari angka 0. Lihat angka di ujung pensil.', explain: `Pensil dimulai dari 0 dan berakhir di ${len}. Panjangnya ${len} cm.` }); }
  if (lv === 2) { const s = rng.int(1, 4), len = rng.int(3, 6), e = s + len; return item({ q: 'Berapa panjang pita ini?', v: { t: 'ruler', start: s, end: e, max: 10, obj: 'pita' }, ans: len, opts: numOpts(rng, len, [e, len + 1, s], K, 1, 12).map((o) => ({ ...o, label: `${o.value} cm` })),
    math: { kind: 'ruler', start: s, end: e }, hint: `Pita tidak dimulai dari 0. Hitung dari ${s} sampai ${e}.`, explain: `${e} − ${s} = ${len}. Panjang pita ${len} cm.` }); }
  if (rng.chance(0.5)) { const m = rng.int(2, 9); return item({ q: `${m} m sama dengan berapa cm?`, v: null, ans: m * 100, opts: numOpts(rng, m * 100, [m * 10, m * 1000, m], K, 0, 10000).map((o) => ({ ...o, label: `${fmt(o.value)} cm` })),
    math: { kind: 'expr', e: `${m}*100` }, hint: '1 m = 100 cm.', explain: `1 m = 100 cm, jadi ${m} m = ${m} × 100 = ${fmt(m * 100)} cm.` }); }
  const m = rng.int(2, 9); return item({ q: `${m * 100} cm sama dengan berapa m?`, v: null, ans: m, opts: numOpts(rng, m, [m * 10, m * 100, m + 1], K, 0, 1000).map((o) => ({ ...o, label: `${fmt(o.value)} m` })),
    math: { kind: 'expr', e: `${m * 100}/100` }, hint: 'Setiap 100 cm sama dengan 1 m.', explain: `${m * 100} cm = ${m} m.` });
};

G['3.2.4'] = (rng, lv, K) => {
  if (lv === 1) { const v = rng.int(1, 9); const [e, nm] = rng.pick([['🍉', 'semangka'], ['🍍', 'nanas'], ['🥥', 'kelapa']]);
    return item({ q: `Berapa berat ${nm} ini?`, v: { t: 'dial', value: v, max: 10, major: 1, minor: 1, unit: 'kg', e }, ans: v, opts: numOpts(rng, v, [v + 1, v - 1, 10 - v], K, 0, 10).map((o) => ({ ...o, label: `${o.value} kg` })),
      math: { kind: 'dial', value: v }, hint: 'Lihat angka yang ditunjuk jarum merah.', explain: `Jarum menunjuk angka ${v}. Beratnya ${v} kg.` }); }
  if (lv === 2) { const v = rng.int(1, 19) * 50; const [e, nm] = rng.pick([['🍎', 'apel'], ['🥕', 'wortel'], ['🍌', 'pisang']]);
    return item({ q: `Berapa gram berat ${nm} ini?`, v: { t: 'dial', value: v, max: 1000, major: 100, minor: 50, unit: 'gram', e }, ans: v, opts: numOpts(rng, v, [v + 50, v - 50, v + 100, v + 10].filter((x) => x > 0), K, 0, 1000).map((o) => ({ ...o, label: `${fmt(o.value)} g` })),
      math: { kind: 'dial', value: v }, hint: 'Setiap garis pendek bernilai 50 gram.', explain: `Jarum menunjuk ${fmt(v)} gram.` }); }
  if (rng.chance(0.6)) { const k = rng.int(2, 9); return item({ q: `${k} kg sama dengan berapa gram?`, v: null, ans: k * 1000, opts: numOpts(rng, k * 1000, [k * 100, k * 10, k * 10000], K, 0, 100000).map((o) => ({ ...o, label: `${fmt(o.value)} g` })),
    math: { kind: 'expr', e: `${k}*1000` }, hint: '1 kg = 1.000 g.', explain: `${k} × 1.000 = ${fmt(k * 1000)}. Jadi, ${k} kg = ${fmt(k * 1000)} g.` }); }
  const ans = 'Sekantong gula pasir';
  return item({ q: 'Benda mana yang beratnya kira-kira 1 kg?', v: null, ans, opts: textOpts(rng, ans, ['Sebatang pensil', 'Seekor gajah', 'Sehelai daun', 'Sebuah mobil'], K),
    math: { kind: 'fixed', ans }, hint: 'Pikirkan benda yang biasa dibeli per kilogram.', explain: 'Gula pasir sering dijual dalam kantong 1 kg.' });
};

function polyCells(rng, n) { const set = new Set(['0,0']); while (set.size < n) { const [x, y] = rng.pick([...set]).split(',').map(Number); const [dx, dy] = rng.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < 5 && ny < 4) set.add(`${nx},${ny}`); } return [...set].map((s) => s.split(',').map(Number)); }
G['3.2.5'] = (rng, lv, K) => {
  if (lv === 1) { const w = rng.int(2, 5), h = rng.int(2, 4); const cells = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) cells.push([x, y]);
    return item({ q: 'Berapa petak luas bangun ini?', v: { t: 'area', cells, w: 6, h: 5 }, ans: w * h, opts: numOpts(rng, w * h, [2 * (w + h), w + h, w * h + w], K, 1, 40).map((o) => ({ ...o, label: `${o.value} petak` })),
      math: { kind: 'area', cells }, hint: 'Hitung petak yang berwarna. Bisa juga baris × kolom.', explain: `${h} baris × ${w} petak = ${w * h} petak.` }); }
  if (lv === 2) { const n = rng.int(5, 11); const cells = polyCells(rng, n);
    return item({ q: 'Berapa petak luas bangun ini?', v: { t: 'area', cells, w: 5, h: 4 }, ans: n, opts: numOpts(rng, n, [n + 1, n - 1, n + 2], K, 1, 20).map((o) => ({ ...o, label: `${o.value} petak` })),
      math: { kind: 'area', cells }, hint: 'Tandai setiap petak saat menghitung agar tidak terhitung dua kali.', explain: `Ada ${n} petak berwarna, jadi luasnya ${n} petak.` }); }
  const l = rng.int(2, 3), w = rng.int(1, 2), h = rng.int(1, 3); const v = l * w * h;
  return item({ q: 'Balok ini disusun dari berapa kubus satuan?', v: { t: 'cubes', l, w, h }, ans: v, opts: numOpts(rng, v, [l + w + h, l * h, v + l], K, 1, 30).map((o) => ({ ...o, label: `${o.value} kubus` })),
    math: { kind: 'expr', e: `${l}*${w}*${h}` }, hint: 'Hitung kubus di satu lapisan, lalu kalikan dengan banyak lapisan.', explain: `Satu lapisan ada ${l * w} kubus. Ada ${h} lapisan. ${l * w} × ${h} = ${v}.` });
};

const SIDES = { tri: 3, sq: 4, rect: 4, rhombus: 4, trap: 4, pent: 5, hex: 6, oct: 8 };
G['3.2.6'] = (rng, lv, K) => {
  if (lv === 1) { const k = rng.pick(['tri', 'rect', 'trap', 'pent', 'hex', 'oct']); const n = SIDES[k];
    return item({ q: 'Bangun ini memiliki berapa titik sudut?', v: { t: 'shape', k, fill: rng.int(0, 5), marks: true }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n * 2], K, 2, 16),
      math: { kind: 'sides', k }, hint: 'Titik sudut adalah tempat dua sisi bertemu.', explain: `Bangun ini memiliki ${n} titik sudut.` }); }
  if (lv === 2) { const [nm, n] = rng.pick([['segi lima', 5], ['segi enam', 6], ['segi delapan', 8], ['segitiga', 3]]);
    return item({ q: `Berapa banyak sisi pada ${nm}?`, v: null, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n + 2], K, 2, 12), math: { kind: 'polyname', nm }, hint: 'Nama bangun memberi petunjuk banyak sisinya.', explain: `${nm[0].toUpperCase() + nm.slice(1)} memiliki ${n} sisi.` }); }
  const Q = [
    ['Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku adalah …', 'persegi', 'sq'],
    ['Bangun datar yang memiliki 4 sudut siku-siku, tetapi hanya sisi yang berhadapan yang sama panjang adalah …', 'persegi panjang', 'rect'],
    ['Bangun datar yang memiliki 3 sisi dan 3 titik sudut adalah …', 'segitiga', 'tri'],
  ];
  const [q, ans, k] = rng.pick(Q);
  return item({ q, v: null, ans, opts: textOpts(rng, ans, ['persegi', 'persegi panjang', 'segitiga', 'trapesium', 'segi lima'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })),
    math: { kind: 'propname', k, ans }, hint: 'Bayangkan setiap bangun pada pilihan, lalu cocokkan cirinya.', explain: `Ciri-ciri itu adalah ciri ${ans}.` });
};

const COMP_KIND = { 'hex-2trap': 'trapesium', 'hex-3rhom': 'belah ketupat', 'hex-6tri': 'segitiga', 'rect-4tri': 'segitiga', 'rect-strips': 'persegi panjang', 'sq-4tri': 'segitiga' };
const COMP_N = { 'hex-2trap': 2, 'hex-3rhom': 3, 'hex-6tri': 6, 'rect-4tri': 4, 'rect-strips': 4, 'sq-4tri': 4 };
G['3.2.7'] = (rng, lv, K) => {
  if (lv === 1) { const id = rng.pick(['hex-2trap', 'hex-3rhom', 'hex-6tri']); const ans = COMP_KIND[id];
    return item({ q: `Segi enam ini disusun dari ${COMP_N[id]} bangun yang sama. Bangun apakah itu?`, v: { t: 'comp', id }, ans,
      opts: textOpts(rng, ans, ['trapesium', 'belah ketupat', 'segitiga', 'persegi'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })), math: { kind: 'compkind', id },
      hint: 'Perhatikan satu bagian yang berwarna.', explain: `Segi enam itu disusun dari ${COMP_N[id]} ${ans}. Segi enam bisa disusun dengan berbagai cara.` }); }
  if (lv === 2) { const id = rng.pick(['rect-4tri', 'rect-strips', 'sq-4tri', 'hex-3rhom']); const n = COMP_N[id];
    return item({ q: `Bangun ini disusun dari berapa ${COMP_KIND[id]}?`, v: { t: 'comp', id }, ans: n, opts: numOpts(rng, n, [n - 1, n + 1, n * 2], K, 1, 12), math: { kind: 'comp', id }, hint: 'Hitung bagian yang warnanya berbeda.', explain: `Ada ${n} ${COMP_KIND[id]}.` }); }
  const id = rng.pick(['rect-gap', 'hex-gap']); const ans = id === 'rect-gap' ? 'persegi panjang' : 'segitiga';
  return item({ q: 'Bagian bergaris putus-putus masih kosong. Bangun apa yang cocok untuk mengisinya?', v: { t: 'comp', id }, ans,
    opts: textOpts(rng, ans, ['persegi panjang', 'segitiga', 'lingkaran', 'segi lima'], K).map((o) => ({ label: o.value[0].toUpperCase() + o.value.slice(1), value: o.value })), math: { kind: 'gap', id },
    hint: 'Lihat bentuk garis putus-putusnya.', explain: `Bagian yang kosong berbentuk ${ans}.` });
};

G['3.2.8'] = (rng, lv, K) => {
  if (lv === 1 && rng.chance(0.4)) {
    const rows = dataRows(rng, 3, 5, 25, true);
    const r = rng.pick(rows);
    return item({ q: `Tabel ini menunjukkan hasil panen buah di kebun sekolah. Berapa banyak ${r.label} yang dipanen?`, v: { t: 'table', head: ['Buah', 'Banyak'], rows: rows.map((x) => [`${x.e} ${x.label[0].toUpperCase() + x.label.slice(1)}`, x.n]) }, ans: r.n,
      opts: numOpts(rng, r.n, rows.map((x) => x.n), K, 0, 40), math: { kind: 'read', rows, label: r.label }, hint: 'Cari baris buahnya, lalu lihat kolom "Banyak".', explain: `Banyak ${r.label} yang dipanen adalah ${r.n}.` });
  }
  return dataItem(rng, lv, K, 'bars', 1, 10);
};

// ── API ──
export const QUIZ_LEN = 10;
export const levelOf = (i) => (i < 3 ? 1 : i < 7 ? 2 : 3);

export function generate(topicId, level, rng) {
  const t = topicById[topicId];
  const K = K_OF(t.kelas);
  for (let tries = 0; tries < 50; tries++) {
    const it = G[topicId](rng, level, K);
    if (!it) continue;
    const vals = it.opts.map((o) => String(o.value));
    if (new Set(vals).size !== vals.length) continue;
    if (!vals.includes(String(it.ans))) continue;
    if (!it.fixedOpts && it.opts.length !== K) continue;
    return { topicId, kelas: t.kelas, level, ...it };
  }
  throw new Error(`gagal membuat soal ${topicId} L${level}`);
}

// Kuis 10 soal untuk satu topik, atau campuran satu semester (topicId = 'mix:k.s').
export function makeQuiz(topicId, rng, ids) {
  const out = []; const seen = new Set();
  for (let i = 0; i < QUIZ_LEN; i++) {
    const tid = topicId.startsWith('mix:') ? ids[i % ids.length] : topicId;
    let it;
    for (let k = 0; k < 20; k++) { it = generate(tid, levelOf(i), rng); if (!seen.has(it.q + JSON.stringify(it.v))) break; }
    seen.add(it.q + JSON.stringify(it.v));
    out.push(it);
  }
  return topicId.startsWith('mix:') ? out.sort((a, b) => a.level - b.level) : out;
}

export const GENERATORS = G;

export { numOpts, textOpts, item, uniq, cap, NAMES, FRUITS, dataRows, polyCells, noCarrySum, smallFromBig };
