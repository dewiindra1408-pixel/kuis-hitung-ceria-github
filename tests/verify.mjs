// Verifikasi independen bank soal: hitung ulang kunci dari data `math`, periksa pengecoh tidak ada yang benar,
// dan periksa aturan bahasa sederhana. Jalankan: node tests/verify.mjs [jumlah-per-level]
import { generate } from '../js/bank.js';
import '../js/bank46.js';
import { TOPICS } from '../js/curriculum.js';
import { makeRng } from '../js/rng.js';

const N = Number(process.argv[2] || 400);
const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
// pengurai bilangan Indonesia, ditulis terpisah dari words.js
const D = { nol: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9 };
function parseWord2(s) {
  let total = 0, cur = 0, last = 0;
  for (const x of s.split(' ')) {
    if (x in D) { last = D[x]; cur += last; }
    else if (x === 'sepuluh') cur += 10; else if (x === 'sebelas') cur += 11; else if (x === 'seratus') cur += 100; else if (x === 'seribu') total += 1000;
    else if (x === 'belas') cur += 10;
    else if (x === 'puluh') cur += last * 9;
    else if (x === 'ratus') cur += last * 99;
    else if (x === 'ribu') { total += cur * 1000; cur = 0; }
    else if (x === 'juta') { total += cur * 1000000; cur = 0; }
    else throw new Error('kata tak dikenal ' + x);
  }
  return total + cur;
}
const evalExpr = (e) => { if (!/^[\d+\-*/ ()]+$/.test(e)) throw new Error('ekspresi aneh ' + e); return Function(`return (${e})`)(); };
const SHAPE_NAME = { tri: 'segitiga', rtri: 'segitiga', 'tri-wide': 'segitiga', sq: 'segiempat', rect: 'segiempat', rhombus: 'segiempat', trap: 'segiempat', pent: 'segi lima', hex: 'segi enam', circle: 'lingkaran' };
const SIDES = { tri: 3, sq: 4, rect: 4, rhombus: 4, trap: 4, pent: 5, hex: 6, oct: 8 };
const COMP = { 'sq-2tri': 2, 'sq-4tri': 4, 'hex-6tri': 6, 'tri-4tri': 4, 'rect-2sq': 2, 'rect-3sq': 3, 'rect-4tri': 4, 'rect-strips': 4, 'hex-3rhom': 3, 'hex-2trap': 2 };
const COMPK = { 'hex-2trap': 'trapesium', 'hex-3rhom': 'belah ketupat', 'hex-6tri': 'segitiga' };
const SOLIDOBJ = { jeruk: 'bola', 'gulungan benang': 'bola', dadu: 'kubus', 'es batu': 'kubus', kardus: 'balok', 'batu bata': 'balok', 'contong es krim': 'kerucut' };
const POLY = { segitiga: 3, 'segi lima': 5, 'segi enam': 6, 'segi delapan': 8 };
const frv = (s) => { const [a, b] = String(s).split('/').map(Number); return a / b; };


// ── pembantu kelas 4–6 (ditulis terpisah dari generator) ──
const fmtN = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const decN = (x) => String(Math.round(x * 1000) / 1000).replace('.', ',');
function fv(s) { s = String(s).trim(); const m = s.match(/^(\d+) (\d+)\/(\d+)$/); if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]); const f = s.match(/^(\d+)\/(\d+)$/); if (f) return Number(f[1]) / Number(f[2]); if (/^\d+$/.test(s)) return Number(s); return NaN; }
const evalFrac = (e) => { if (!/^[\d+\-*/ ().]+$/.test(e)) throw new Error('ekspresi aneh ' + e); return Function(`return (${e})`)(); };
const QDEF = { 'memiliki dua pasang sisi sejajar, empat sudut siku-siku, dan tidak semua sisinya sama panjang': 'persegi panjang', 'memiliki dua pasang sisi sejajar, tetapi tidak memiliki sudut siku-siku dan tidak semua sisinya sama panjang': 'jajar genjang', 'memiliki empat sisi sama panjang, tetapi tidak memiliki sudut siku-siku': 'belah ketupat', 'memiliki dua pasang sisi yang berdekatan sama panjang dan tidak memiliki sisi sejajar': 'layang-layang' };
// Lipat jaring-jaring: setiap persegi diberi arah normal 3D, lalu periksa 6 arah berbeda.
function foldOk(cells) {
  const k = (c) => c[0] + ',' + c[1]; const S = new Set(cells.map(k)); const map = new Map();
  // frame: [normal, u(arah x net), v(arah y net)] sebagai vektor 3D
  const neg = (a) => a.map((x) => -x);
  const start = [[0, 0, -1], [1, 0, 0], [0, 1, 0]]; map.set(k(cells[0]), start); const stack = [[cells[0], start]];
  while (stack.length) {
    const [[x, y], [n, u, v]] = stack.pop();
    const nbr = [[[x + 1, y], [u, neg(n), v]], [[x - 1, y], [neg(u), n, v]], [[x, y + 1], [v, u, neg(n)]], [[x, y - 1], [neg(v), u, n]]];
    for (const [c, f] of nbr) if (S.has(k(c)) && !map.has(k(c))) { map.set(k(c), f); stack.push([c, f]); }
  }
  const normals = new Set([...map.values()].map((f) => f[0].join(',')));
  return map.size === 6 && normals.size === 6;
}
function normC(cells) { const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1])); return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); }
function viewOf(h, which) {
  const R = h.length, C = h[0].length, H = Math.max(...h.flat()); const out = [];
  if (which === 'top') { h.forEach((row, r) => row.forEach((z, c) => { if (z) out.push([c, r]); })); }
  if (which === 'front') for (let c = 0; c < C; c++) { const m = Math.max(...h.map((row) => row[c])); for (let z = 1; z <= m; z++) out.push([c, H - z]); }
  if (which === 'right') for (let r = 0; r < R; r++) { const m = Math.max(...h[r]); for (let z = 1; z <= m; z++) out.push([R - 1 - r, H - z]); }
  return normC(out);
}

// Kembalikan fungsi benar(value) untuk soal ini.
function judge(it) {
  const m = it.math;
  switch (m.kind) {
    case 'expr': { const r = evalExpr(m.e); if (!Number.isInteger(r)) throw new Error('hasil bukan bulat'); return (v) => v === r; }
    case 'count': return (v) => v === m.n;
    case 'word': { const r = parseWord2(m.word); return (v) => v === r; }
    case 'max': return (v) => v === Math.max(...m.vals);
    case 'min': return (v) => v === Math.min(...m.vals);
    case 'argmax': { const i = m.vals.indexOf(Math.max(...m.vals)); if (m.vals.filter((x) => x === m.vals[i]).length > 1) throw new Error('maks ganda'); return (v) => v === m.names[i]; }
    case 'argmin': { const i = m.vals.indexOf(Math.min(...m.vals)); if (m.vals.filter((x) => x === m.vals[i]).length > 1) throw new Error('min ganda'); return (v) => v === m.names[i]; }
    case 'cmp': return (v) => v === (m.a > m.b ? '>' : m.a < m.b ? '<' : '=');
    case 'cmpgroups': { const [n1, n2] = m.names; const r = m.a === m.b ? 'sama banyak' : (m.a > m.b) === m.most ? n1 : n2; return (v) => v === r; }
    case 'ordinal': return (v) => v === m.row[m.pos - 1];
    case 'pairsum': return (v) => { const [a, b] = v.split(' dan ').map(Number); return a + b === m.s; };
    case 'onetrue': return (v) => { const [l, r] = v.split(' = ').map((s) => evalExpr(s.replace('−', '-'))); return l === r; };
    case 'pattern': { for (let i = 0; i < m.seq.length; i++) if (m.seq[i] !== null && m.seq[i] !== m.unit[i % m.unit.length]) throw new Error('pola rusak'); return (v) => v === m.unit[m.miss % m.unit.length]; }
    case 'solid': return (v) => v === m.show;
    case 'solidobj': return (v) => v === SOLIDOBJ[m.obj];
    case 'solidpick': return (v) => true; // dicek di bawah: tepat satu benda cocok
    case 'position': return (v) => v === m.pos;
    case 'position2': { const hit = m.items.filter((x) => x[1] === m.ask); if (hit.length !== 1) throw new Error('posisi ganda'); return (v) => v === hit[0][0]; }
    case 'measure': return (v) => v === m.mode;
    case 'dayorder': { const idx = m.right.split(' → ').map((x) => m.seq.indexOf(x)); if (!idx.every((x, i) => i === 0 || x > idx[i - 1])) throw new Error('urutan hari salah'); return (v) => v === m.right; }
    case 'shapename': return (v) => v === SHAPE_NAME[m.k];
    case 'nottri': return (v) => !['tri', 'rtri', 'tri-wide'].includes(v);
    case 'comp': return (v) => v === COMP[m.id];
    case 'compkind': return (v) => v === COMPK[m.id];
    case 'gap': return (v) => v === (m.id === 'rect-gap' ? 'persegi panjang' : 'segitiga');
    case 'fixed': return (v) => v === m.ans;
    case 'read': return (v) => v === m.rows.find((r) => r.label === m.label).n;
    case 'sort': return (v) => v === m.items.filter((x) => x === m.e).length;
    case 'seq': { const d = m.seq[1] - m.seq[0]; if (!m.seq.every((x, i) => i === 0 || x - m.seq[i - 1] === d)) throw new Error('barisan rusak'); return (v) => v === m.seq[m.seq.length - 1] + d; }
    case 'seqmiss': { const s = m.seq; const known = s.map((x, i) => [i, x]).filter((p) => p[1] !== null); const d = (known[1][1] - known[0][1]) / (known[1][0] - known[0][0]); const i = s.indexOf(null); const r = known[0][1] + d * (i - known[0][0]); return (v) => v === r; }
    case 'placeval': return (v) => v === (Math.floor(m.n / 10 ** m.place) % 10) * 10 ** m.place;
    case 'order': return (v) => v === m.vals.slice().sort((a, b) => a - b).join(', ');
    case 'grid': { let [x, y] = m.start; const DIR = { kanan: [1, 0], kiri: [-1, 0], atas: [0, -1], bawah: [0, 1] }; for (const [d, n] of m.moves) { x += DIR[d][0] * n; y += DIR[d][1] * n; } const hit = m.marks.find((k) => k.x === x && k.y === y); return (v) => v === hit.l; }
    case 'sides': return (v) => v === SIDES[m.k];
    case 'day': return (v) => v === HARI[(((m.from + m.shift) % 7) + 7) % 7];
    case 'clock': return (v) => v === m.h;
    case 'numline': return (v) => v === m.arrow;
    case 'halfpick': return (v) => v === 'half';
    case 'quarterpick': return (v) => v === 'quarter';
    case 'pan': return (v) => v === (m.ask === 'berat' ? m.heavier : m.light);
    case 'chain': return (v) => v === (m.ask === 'berat' ? m.order[0] : m.order[2]);
    case 'multipleof': return (v) => v % m.m === 0;
    case 'factorof': return (v) => m.n % v === 0;
    case 'fracread': return (v) => v === `${m.n}/${m.d}`;
    case 'fracmax': { const mx = Math.max(...m.fr.map(([a, b]) => a / b)); return (v) => v !== 'sama' && Math.abs(frv(v) - mx) < 1e-9; }
    case 'fracmin': { const mn = Math.min(...m.fr.map(([a, b]) => a / b)); return (v) => v !== 'sama' && Math.abs(frv(v) - mn) < 1e-9; }
    case 'fraceq': return (v) => v * m.d === m.n * m.D;
    case 'ruler': return (v) => v === m.end - m.start;
    case 'dial': return (v) => v === m.value;
    case 'area': return (v) => v === new Set(m.cells.map((c) => c.join(','))).size;
    case 'polyname': return (v) => v === POLY[m.nm];
    case 'propname': return (v) => v === ({ sq: 'persegi', rect: 'persegi panjang', tri: 'segitiga' })[m.k];

    // ── kelas 4–6 ──
    case 'orderf': return (v) => v === m.vals.slice().sort((a, b) => (m.asc ? a - b : b - a)).map(fmtN).join('; ');
    case 'orderdec': return (v) => v === m.vals.slice().sort((a, b) => (m.asc ? a - b : b - a)).map(decN).join('; ');
    case 'sumstr': return (v) => v.split(' + ').reduce((s, x) => s + Number(x.replace(/\./g, '')), 0) === m.n;
    case 'divcount': { let c = 0; for (let d = 1; d <= m.n; d++) if (m.n % d === 0) c++; return (v) => v === c; }
    case 'rule': { const d = m.seq[1] - m.seq[0]; if (!m.seq.every((x, i) => i === 0 || x - m.seq[i - 1] === d)) throw new Error('pola rusak'); const r = d > 0 ? `ditambah ${d}` : `dikurangi ${-d}`; return (v) => v === r; }
    case 'fracorder': { const fs = m.fr.slice().sort((a, b) => (m.asc ? a[0] / a[1] - b[0] / b[1] : b[0] / b[1] - a[0] / a[1])); const r = fs.map(([a, b]) => `${a}/${b}`).join('; '); return (v) => v === r; }
    case 'fracorderstr': return (v) => { const parts = v.split('; ').map(fv); return parts.every((x, i) => i === 0 || (m.asc ? x > parts[i - 1] : x < parts[i - 1])); };
    case 'fracval': return (v) => Math.abs(fv(v) - m.n / m.d) < 1e-9;
    case 'fraceqden': return (v) => m.n * v === m.d * m.N;
    case 'fracexpr': { const r = evalFrac(m.e); return (v) => Math.abs(fv(v) - r) < 1e-9; }
    case 'dec': { const r = evalFrac(m.e); return (v) => Math.abs(v - r) < 1e-9; }
    case 'stackcount': return (v) => v === m.heights.flat().reduce((a, b) => a + b, 0);
    case 'quaddef': { const Q = { 'memiliki empat sisi sama panjang dan empat sudut siku-siku': 'persegi', 'memiliki tepat sepasang sisi sejajar': 'trapesium' }; const r = Q[m.def] || QDEF[m.def]; if (!r) throw new Error('definisi tak dikenal'); return (v) => v === r; }
    case 'parallel': return (v) => v === ({ trapesium: 1, 'jajar genjang': 2, 'persegi panjang': 2, 'layang-layang': 0, segitiga: 0, persegi: 2 })[m.k];
    case 'commonmult': return (v) => v % m.a === 0 && v % m.b === 0;
    case 'commonfac': return (v) => m.a % v === 0 && m.b % v === 0;
    case 'prime': return (v) => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
    case 'kpk': { let L = Math.max(m.a, m.b); while (L % m.a || L % m.b) L++; return (v) => v === L; }
    case 'fpb': { let F = Math.min(m.a, m.b); while (m.a % F || m.b % F) F--; return (v) => v === F; }
    case 'angtype': return (v) => v === (m.deg < 90 ? 'lancip' : m.deg === 90 ? 'siku-siku' : m.deg < 180 ? 'tumpul' : 'lurus');
    case 'tritype': return (v) => v === m.k;
    case 'duration': return (v) => v === m.e - m.s;
    case 'endtime': { const e = m.s + m.d; const r = `${String(Math.floor(e / 60)).padStart(2, '0')}.${String(e % 60).padStart(2, '0')}`; return (v) => v === r; }
    case 'mixmax': case 'mixmin': return null; // dinilai di bawah
    case 'seqmul': { const r = m.seq[1] / m.seq[0]; if (!m.seq.every((x, i) => i === 0 || Math.abs(x / m.seq[i - 1] - r) < 1e-9)) throw new Error('pola kali rusak'); const nx = m.seq[m.seq.length - 1] * r; return (v) => Math.abs(v - nx) < 1e-9; }
    case 'seqmulmiss': { const s = m.seq; const i = s.indexOf(null); const r = s[i + 1] !== null && i + 1 < s.length && s[i - 1] !== undefined ? Math.sqrt(s[i + 1] / s[i - 1]) : null; const rr = s.filter((x) => x !== null); const ratio = i === 1 ? s[3] / s[2] : s[1] / s[0]; void r; void rr; return (v) => Math.abs(v - s[i - 1] * ratio) < 1e-9 && Math.abs(v * ratio - s[i + 1]) < 1e-9; }
    case 'ratio': return (v) => { const [x, y] = v.split(' : ').map(Number); return x * m.b === y * m.a; };
    case 'int': return (v) => v === m.v;
    case 'cubenet': return (v) => foldOk(JSON.parse(v));
    case 'view': { const r = JSON.stringify(viewOf(m.heights, m.which)); return (v) => v === r; }
    case 'solidfact': return (v) => v === ({ sisi: 6, rusuk: 12, 'titik sudut': 8 })[m.f];
    case 'mapat': { const it = m.items.find((x) => x.name === m.name); const r = String.fromCharCode(65 + it.c) + (it.r + 1); return (v) => v === r; }
    case 'mapwhat': { const it = m.items.find((x) => String.fromCharCode(65 + x.c) + (x.r + 1) === m.at); return (v) => v === it.name; }
    case 'mapmove': { const r = String.fromCharCode(65 + m.from[0] + m.dx) + (m.from[1] + m.dy + 1); return (v) => v === r; }
    case 'bagchance': { const cols = Object.keys(m.marbles).filter((c) => m.marbles[c] > 0); const r = !cols.includes(m.pickC) ? 'mustahil' : cols.length === 1 ? 'pasti' : 'mungkin'; return (v) => v === r; }
    case 'twobags': { const pa = m.a[0] / (m.a[0] + m.a[1]), pb = m.b[0] / (m.b[0] + m.b[1]); const r = pa > pb ? 'A' : pa < pb ? 'B' : 'sama'; return (v) => v === r; }
    case 'mean': { const r = m.data.reduce((a, b) => a + b, 0) / m.data.length; return (v) => v === r; }
    case 'median': { const s = m.data.slice().sort((a, b) => a - b); const r = s[(s.length - 1) / 2]; return (v) => v === r; }
    case 'mode': { const c = {}; for (const x of m.data) c[x] = (c[x] || 0) + 1; const mx = Math.max(...Object.values(c)); const ms = Object.keys(c).filter((k) => c[k] === mx); if (ms.length !== 1) throw new Error('modus ganda'); return (v) => v === Number(ms[0]); }
    default: throw new Error('jenis tak dikenal ' + m.kind);
  }
}

// aturan bahasa
const TEXT_RULES = [
  [/s\.d\./, 'jangan pakai "s.d."'], [/ {2,}/, 'spasi ganda'], [/ [,.?]/, 'spasi sebelum tanda baca'], [/\bundefined\b|\bNaN\b|\bnull\b/, 'nilai kosong'],
  [/\bdi (atas|bawah|depan|belakang|dalam)kursi/, 'spasi'], [/\bdiatas\b|\bdibawah\b|\bdidepan\b|\bdibelakang\b|\bdidalam\b/, '"di" sebagai kata depan harus dipisah'],
  [/\bdi ambil|\bdi makan|\bdi jual|\bdi bagi\b/, '"di-" sebagai awalan harus disambung'], [/\bmerubah\b|\bsekedar\b|\bapotik\b/, 'kata tidak baku'], [/\?\?|!!/, 'tanda baca ganda'],
];
let checked = 0, fails = 0; const failMsg = [];
const fail = (it, msg) => { fails++; failMsg.push(`${it.topicId} L${it.level}: ${msg} | ${it.q}`); };
const perTopic = {};
for (const t of TOPICS) for (let lv = 1; lv <= 3; lv++) for (let s = 0; s < N; s++) {
  const it = generate(t.id, lv, makeRng(1000003 * lv + s * 7919 + t.id.length));
  checked++; perTopic[t.id] = (perTopic[t.id] || 0) + 1;
  let ok;
  try { ok = judge(it); } catch (e) { fail(it, e.message); continue; }
  let right;
  if (it.math.kind === 'mixmax' || it.math.kind === 'mixmin') {
    const val = (l) => (l.endsWith('%') ? Number(l.slice(0, -1)) / 100 : l.includes('/') ? fv(l) : Number(l.replace(',', '.')));
    const vs = it.opts.map((o) => val(o.value)); const tgt = it.math.kind === 'mixmax' ? Math.max(...vs) : Math.min(...vs);
    if (new Set(vs).size !== vs.length) fail(it, 'nilai pilihan kembar');
    right = it.opts.filter((o, i) => vs[i] === tgt);
  } else right = it.opts.filter((o) => ok(o.value));
  if (it.math.kind === 'solidpick') { const SO = { jeruk: 'bola', 'gulungan benang': 'bola', dadu: 'kubus', 'es batu': 'kubus', kardus: 'balok', 'batu bata': 'balok', 'contong es krim': 'kerucut' }; const n = it.math.opts.filter((o) => SO[o] === it.math.k).length; if (n !== 1) fail(it, 'benda kubus/bola ganda'); continue; }
  if (right.length !== 1) fail(it, `jawaban benar ada ${right.length}: ${right.map((o) => o.label).join(', ')}`);
  else if (right[0].value !== it.ans) fail(it, `kunci ${it.ans} ≠ hitungan ${right[0].value}`);
  const K = t.kelas === 1 ? 3 : 4;
  if (!it.fixedOpts && it.opts.length !== K && it.topicId !== '2.2.6' && it.topicId !== '6.2.8') fail(it, `banyak pilihan ${it.opts.length}`);
  if (t.id !== '6.1.8' && it.opts.some((o) => typeof o.value === 'number' && o.value < 0)) fail(it, 'pilihan negatif');
  if (it.opts.some((o) => /NaN|undefined|Infinity/.test(String(o.label)))) fail(it, 'label rusak');
  for (const txt of [it.q, it.hint, it.explain, ...it.opts.map((o) => String(o.label))]) {
    for (const [re, msg] of TEXT_RULES) if (re.test(txt)) fail(it, `${msg}: "${txt}"`);
  }
  if (!/[?…:.]$/.test(it.q)) fail(it, 'pertanyaan tanpa tanda akhir');
  if (!/^[A-Z0-9…"⭐□]/.test(it.q)) fail(it, 'pertanyaan tidak diawali huruf kapital');
  if (!/[.!]$/.test(it.explain)) fail(it, 'penjelasan tanpa titik');
  if (it.hint && !/[.!?]$/.test(it.hint)) fail(it, 'petunjuk tanpa titik');
  // batas bilangan per kelas
  const nums = (it.q.match(/\d[\d.]*/g) || []).map((x) => Number(x.replace(/\./g, '')));
  const lim = [0, 20, 100, 1000, 10000, 1000000, 1000000][t.kelas];
  const extra = t.id === '3.2.3' || t.id === '3.2.4' ? 10000 : t.id === '2.2.5' || t.id === '2.2.6' ? 100 : lim;
  if (nums.some((n) => n > extra)) fail(it, `bilangan melebihi batas kelas (${Math.max(...nums)})`);
  if (t.kelas === 1 && it.q.split(' ').length > 22) fail(it, 'kalimat terlalu panjang untuk kelas 1');
}
console.log(`Diperiksa ${checked} soal (${N} per level per topik, ${TOPICS.length} topik). Gagal: ${fails}`);
for (const m of failMsg) console.log('  ✗', m);
process.exit(fails ? 1 : 0);
