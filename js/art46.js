// Visual tambahan untuk kelas 4–6. Didaftarkan ke EXTRA di art.js.
import { EXTRA, OPT_EXTRA, svg, T, emo, emoSvg, LN, SOFT, shapeSvg, solidSvg } from './art.js';
import { fmt, fmtDec } from './words.js';

const PV_NAMES = ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan', 'Puluh ribuan', 'Ratus ribuan', 'Jutaan'];
const PV_COL = ['#4cc38a', '#3d8bfd', '#ff8a3d', '#9b5cf6', '#f2546b', '#13a594', '#d97a00'];

// Tabel nilai tempat. digits: string angka; hl: indeks posisi dari kanan yang disorot (opsional)
EXTRA.pv = ({ n, hl = -1, blank = false }) => {
  const d = String(n).split('');
  const L = d.length;
  const head = d.map((_, i) => { const p = L - 1 - i; return `<th style="background:${PV_COL[p]}">${PV_NAMES[p]}</th>`; }).join('');
  const body = d.map((x, i) => { const p = L - 1 - i; return `<td class="${p === hl ? 'hl' : ''}">${blank && p === hl ? '?' : x}</td>`; }).join('');
  return `<table class="pvt"><tr>${head}</tr><tr>${body}</tr></table>`;
};

// Petak 10×10 untuk persen dan perseratusan, atau pita 10 bagian untuk persepuluhan.
EXTRA.hgrid = ({ shaded, n = 100 }) => {
  if (n === 10) {
    let o = '';
    for (let i = 0; i < 10; i++) o += `<rect x="${4 + i * 40}" y="4" width="40" height="60" fill="${i < shaded ? '#ff8a3d' : '#fff4e6'}" stroke="${LN}" stroke-width="2"/>`;
    return svg(408, 68, o);
  }
  const U = 22; let o = '';
  for (let i = 0; i < 100; i++) { const x = i % 10, y = Math.floor(i / 10); o += `<rect x="${2 + x * U}" y="${2 + y * U}" width="${U}" height="${U}" fill="${i < shaded ? '#3d8bfd' : '#eef4ff'}" stroke="#9bb4e8" stroke-width="1"/>`; }
  o += `<rect x="2" y="2" width="${10 * U}" height="${10 * U}" fill="none" stroke="${LN}" stroke-width="2.5"/>`;
  return svg(10 * U + 4, 10 * U + 4, o, 'viz sq');
};

// Garis bilangan desimal atau bilangan bulat. labels: daftar nilai yang diberi label.
EXTRA.dline = ({ from, to, step, labels = [], arrow, mark, dp = 1 }) => {
  const W = 640, x0 = 36, x1 = W - 36, n = Math.round((to - from) / step);
  const X = (v) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  let o = `<path d="M${x0 - 16} 60 H${x1 + 16}" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>`;
  for (let i = 0; i <= n; i++) {
    const v = from + i * step, x = X(v), lab = labels.some((l) => Math.abs(l - v) < 1e-9);
    o += `<path d="M${x} ${lab ? 46 : 52} V${lab ? 74 : 68}" stroke="${LN}" stroke-width="${lab ? 3 : 2}" stroke-linecap="round"/>`;
    if (lab) o += T(x, 108, fmtDec(Number(v.toFixed(dp))), 30);
  }
  if (mark !== undefined) o += `<circle cx="${X(mark)}" cy="60" r="11" fill="#ffc21a" stroke="${LN}" stroke-width="2"/>`;
  if (arrow !== undefined) o += `<path d="M${X(arrow)} 6 V40" stroke="#f2546b" stroke-width="5" stroke-linecap="round"/><path d="M${X(arrow) - 10} 30 L${X(arrow)} 44 L${X(arrow) + 10} 30 Z" fill="#f2546b"/>`;
  return svg(W, 120, o);
};

// Uang: lembar dan koin rancangan sendiri (bukan tiruan uang asli).
const NOTE_COL = { 100000: '#f7a8b8', 50000: '#9cc8f2', 20000: '#a8e0b4', 10000: '#d2b4f0', 5000: '#e8cfa0', 2000: '#c7c9d1', 1000: '#bfe3d8' };
EXTRA.money = ({ items }) => {
  let x = 6, o = '';
  const y0 = 10;
  for (const v of items) {
    if (v >= 1000) { o += `<rect x="${x}" y="${y0}" width="132" height="66" rx="8" fill="${NOTE_COL[v] || '#ddd'}" stroke="${LN}" stroke-width="2"/><rect x="${x + 8}" y="${y0 + 8}" width="116" height="50" rx="5" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>${T(x + 66, y0 + 42, 'Rp' + fmt(v), 20)}`; x += 142; }
    else { o += `<circle cx="${x + 30}" cy="${y0 + 33}" r="30" fill="#e9c46a" stroke="${LN}" stroke-width="2"/>${T(x + 30, y0 + 40, fmt(v), 17)}`; x += 68; }
  }
  return svg(Math.max(x, 60), 88, o);
};

// Busur derajat dengan satu skala (0 di kanan) dan satu sinar.
EXTRA.protractor = ({ deg }) => {
  const cx = 200, cy = 190, R = 170;
  const P = (a, r) => [cx + r * Math.cos((-a * Math.PI) / 180), cy + r * Math.sin((-a * Math.PI) / 180)];
  let o = `<path d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy} Z" fill="#eaf3ff" stroke="${LN}" stroke-width="2.5"/>`;
  for (let a = 0; a <= 180; a += 5) {
    const big = a % 10 === 0, [x1, y1] = P(a, R), [x2, y2] = P(a, R - (a % 30 === 0 ? 22 : big ? 14 : 8));
    o += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${LN}" stroke-width="${big ? 2 : 1}"/>`;
    if (a % 30 === 0) { const [tx, ty] = P(a, R - 46); o += T(tx.toFixed(1), (ty + 6).toFixed(1), a, 17); }
  }
  const [ax, ay] = P(deg, R + 14);
  o += `<path d="M${cx} ${cy} H${cx + R + 14}" stroke="#3d8bfd" stroke-width="5" stroke-linecap="round"/>`;
  o += `<path d="M${cx} ${cy} L${ax.toFixed(1)} ${ay.toFixed(1)}" stroke="#f2546b" stroke-width="5" stroke-linecap="round"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="6" fill="${LN}"/>`;
  return svg(400, 206, o);
};

// Sudut tunggal untuk mengenali jenisnya.
EXTRA.angle = ({ deg, rot = 0 }) => {
  const cx = 150, cy = 150, L = 130;
  const P = (a, r) => [cx + r * Math.cos((-(a + rot) * Math.PI) / 180), cy + r * Math.sin((-(a + rot) * Math.PI) / 180)];
  const [x1, y1] = P(0, L), [x2, y2] = P(deg, L), [a1, b1] = P(0, 40), [a2, b2] = P(deg, 40);
  let o = '';
  if (deg === 90) { const [p, q] = P(0, 26), [r2, s2] = P(90, 26), [u, w] = P(45, 26 * Math.SQRT2); o += `<path d="M${p} ${q} L${u} ${w} L${r2} ${s2}" fill="none" stroke="#f2546b" stroke-width="3"/>`; }
  else o += `<path d="M${a1} ${b1} A40 40 0 ${deg > 180 ? 1 : 0} 0 ${a2} ${b2}" fill="#ffe2c2" stroke="#f2546b" stroke-width="3"/>`;
  o += `<path d="M${cx} ${cy} L${x1} ${y1} M${cx} ${cy} L${x2} ${y2}" stroke="${LN}" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="${LN}"/>`;
  return svg(300, 300, o, 'viz sq');
};

// Dua garis berpotongan; known = sudut yang diketahui (derajat), ask = 'vertical' | 'adjacent'.
EXTRA.cross = ({ known, ask }) => {
  const cx = 200, cy = 130, L = 150;
  const P = (a, r) => [cx + r * Math.cos((-a * Math.PI) / 180), cy + r * Math.sin((-a * Math.PI) / 180)];
  const [a1, b1] = P(0, L), [a2, b2] = P(180, L), [c1, d1] = P(known, L), [c2, d2] = P(known + 180, L);
  const arc = (s, e, r, col) => { const [p, q] = P(s, r), [u, w] = P(e, r); return `<path d="M${p.toFixed(1)} ${q.toFixed(1)} A${r} ${r} 0 0 0 ${u.toFixed(1)} ${w.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4"/>`; };
  let o = `<path d="M${a2} ${b2} L${a1} ${b1} M${c2.toFixed(1)} ${d2.toFixed(1)} L${c1.toFixed(1)} ${d1.toFixed(1)}" stroke="${LN}" stroke-width="5" stroke-linecap="round"/>`;
  o += arc(0, known, 46, '#3d8bfd');
  const [kx, ky] = P(known / 2, 76); o += T(kx.toFixed(1), (ky + 8).toFixed(1), `${known}°`, 22, 'fill="#3d8bfd"');
  const [s, e] = ask === 'vertical' ? [180, 180 + known] : [known, 180];
  o += arc(s, e, 38, '#f2546b');
  const [qx, qy] = P((s + e) / 2, 70); o += T(qx.toFixed(1), (qy + 8).toFixed(1), '?', 28, 'fill="#f2546b"');
  return svg(400, 260, o);
};

// Jam digital: mulai dan selesai.
EXTRA.dclock = ({ start, end }) => {
  const box = (x, label, t) => `<rect x="${x}" y="30" width="190" height="80" rx="16" fill="#2e2a4a"/><text x="${x + 95}" y="88" font-size="44" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-weight="700" fill="#7CF5B5">${t}</text>${T(x + 95, 22, label, 18)}`;
  return svg(440, 116, box(10, 'Mulai', start) + (end ? box(240, 'Selesai', end) : ''));
};

// Bangun datar berukuran: rect (w, h), sq, tri (siku-siku: a, t), L (gabungan), poly (n sisi sama: s)
EXTRA.mshape = ({ kind, w, h, s, n, a, ht: t, unit = 'cm', cut, hide }) => {
  const lab = (x, y, v) => (hide === v ? T(x, y, '?', 22, 'fill="#f2546b"') : T(x, y, `${v} ${unit}`, 20));
  let o = '', W = 360, H = 240;
  const st = `fill="#dff1ff" stroke="${LN}" stroke-width="3" stroke-linejoin="round"`;
  if (kind === 'rect' || kind === 'sq') {
    const sc = Math.min(240 / w, 150 / h); const pw = w * sc, ph = h * sc, x0 = (W - pw) / 2, y0 = 30;
    o += `<rect x="${x0}" y="${y0}" width="${pw}" height="${ph}" ${st}/>` + lab(W / 2, y0 + ph + 30, w) + `<g transform="translate(${x0 + pw + 34} ${y0 + ph / 2 + 6})">${lab(0, 0, h)}</g>`;
    H = y0 + ph + 44; W = Math.max(W, x0 + pw + 80);
  } else if (kind === 'tri') {
    const sc = Math.min(240 / a, 150 / t); const pa = a * sc, pt = t * sc, x0 = 50, y0 = 20;
    o += `<polygon points="${x0},${y0 + pt} ${x0 + pa},${y0 + pt} ${x0},${y0}" ${st}/><path d="M${x0} ${y0 + pt - 18} h18 v18" fill="none" stroke="#f2546b" stroke-width="2.5"/>` + lab(x0 + pa / 2, y0 + pt + 30, a) + `<g transform="translate(${x0 - 6} ${y0 + pt / 2 + 6})">${lab(-36, 0, t)}</g>`;
    W = x0 + pa + 40; H = y0 + pt + 44;
  } else if (kind === 'L') {
    // persegi panjang w×h dipotong sudut kanan atas sebesar cut=[cw,ch]
    const [cw, ch] = cut; const sc = Math.min(240 / w, 160 / h); const x0 = 60, y0 = 40, X = (v) => x0 + v * sc, Y = (v) => y0 + v * sc;
    o += `<polygon points="${X(0)},${Y(0)} ${X(w - cw)},${Y(0)} ${X(w - cw)},${Y(ch)} ${X(w)},${Y(ch)} ${X(w)},${Y(h)} ${X(0)},${Y(h)}" ${st}/>`;
    o += lab((X(0) + X(w)) / 2, Y(h) + 30, w) + `<g transform="translate(${X(0) - 42} ${(Y(0) + Y(h)) / 2 + 6})">${lab(0, 0, h)}</g>`;
    o += lab((X(0) + X(w - cw)) / 2, Y(0) - 8, w - cw) + `<g transform="translate(${X(w) + 38} ${(Y(ch) + Y(h)) / 2 + 6})">${lab(0, 0, h - ch)}</g>`;
    W = X(w) + 90; H = Y(h) + 44;
  } else if (kind === 'poly') {
    const R = 90, cx = 180, cy = 115; const pts = [...Array(n)].map((_, i) => { const ang = ((-90 + (360 / n) * i) * Math.PI) / 180; return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)]; });
    o += `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" ${st}/>`;
    const [p0, p1] = [pts[0], pts[1]]; const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
    o += T(mx + 40, my - 6, `${s} ${unit}`, 20);
    for (let i = 0; i < n; i++) { const q0 = pts[i], q1 = pts[(i + 1) % n]; const ux = (q0[0] + q1[0]) / 2, uy = (q0[1] + q1[1]) / 2, dx = q1[0] - q0[0], dy = q1[1] - q0[1], len = Math.hypot(dx, dy); o += `<path d="M${(ux - (dy / len) * 7).toFixed(1)} ${(uy + (dx / len) * 7).toFixed(1)} L${(ux + (dy / len) * 7).toFixed(1)} ${(uy - (dx / len) * 7).toFixed(1)}" stroke="#f2546b" stroke-width="2.5"/>`; }
    H = 230;
  }
  return svg(W, H, o);
};

// Segitiga atau segiempat berlabel sisi dan sudut untuk jenis bangun.
EXTRA.ptype = ({ pts, ticks = [], rights = [], arcs = [] }) => {
  // pts dalam kotak 0..100
  const S = 2.6, X = (p) => 20 + p[0] * S, Y = (p) => 20 + p[1] * S;
  let o = `<polygon points="${pts.map((p) => `${X(p)},${Y(p)}`).join(' ')}" fill="#fff0d6" stroke="${LN}" stroke-width="3" stroke-linejoin="round"/>`;
  const n = pts.length;
  ticks.forEach((k, i) => { if (!k) return; const a = pts[i], b = pts[(i + 1) % n]; const mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2, dx = X(b) - X(a), dy = Y(b) - Y(a), L = Math.hypot(dx, dy); for (let j = 0; j < k; j++) { const off = (j - (k - 1) / 2) * 7; const cx = mx + (dx / L) * off, cy = my + (dy / L) * off; o += `<path d="M${(cx - (dy / L) * 8).toFixed(1)} ${(cy + (dx / L) * 8).toFixed(1)} L${(cx + (dy / L) * 8).toFixed(1)} ${(cy - (dx / L) * 8).toFixed(1)}" stroke="#f2546b" stroke-width="2.5"/>`; } });
  rights.forEach((i) => { const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]; const u = [(a[0] - p[0]), (a[1] - p[1])], v = [(b[0] - p[0]), (b[1] - p[1])]; const lu = Math.hypot(...u), lv = Math.hypot(...v); const k = 7; const q1 = [p[0] + (u[0] / lu) * k, p[1] + (u[1] / lu) * k], q2 = [p[0] + (v[0] / lv) * k, p[1] + (v[1] / lv) * k], q3 = [q1[0] + (v[0] / lv) * k, q1[1] + (v[1] / lv) * k]; o += `<path d="M${X(q1)} ${Y(q1)} L${X(q3)} ${Y(q3)} L${X(q2)} ${Y(q2)}" fill="none" stroke="#3d8bfd" stroke-width="2.5"/>`; });
  void arcs;
  return svg(300, 300, o, 'viz sq');
};

// Susunan kubus isometrik dari peta tinggi heights[baris][kolom] (baris 0 = paling belakang).
EXTRA.kstack = ({ heights, size = 30 }) => {
  const s = size, dx = s * 0.5, dy = -s * 0.45; let o = '';
  const R = heights.length, C = heights[0].length;
  const ox = 30, oy = 40 + R * -dy + Math.max(...heights.flat()) * s;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (let z = 0; z < heights[r][c]; z++) {
    const depth = R - 1 - r; const X = ox + c * s + depth * dx, Y = oy - z * s + depth * dy;
    o += `<polygon points="${X},${Y} ${X + s},${Y} ${X + s + dx},${Y + dy} ${X + dx},${Y + dy}" fill="#ffe08a" stroke="${LN}" stroke-width="1.3"/>`;
    o += `<polygon points="${X + s},${Y} ${X + s + dx},${Y + dy} ${X + s + dx},${Y + dy + s} ${X + s},${Y + s}" fill="#ffb15c" stroke="${LN}" stroke-width="1.3"/>`;
    o += `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="#ffd166" stroke="${LN}" stroke-width="1.3"/>`;
  }
  const W = ox + C * s + R * dx + 30, H = oy + s + 20;
  return svg(W, H, o + T(ox + (C * s) / 2, H - 2, 'depan ↓', 15));
};

// Gambar 2D kecil dari petak (untuk pilihan tampak dan jaring-jaring). cells: [[x,y],...]
export function cellsSvg(cells, size = 84) {
  const W = Math.max(...cells.map((c) => c[0])) + 1, H = Math.max(...cells.map((c) => c[1])) + 1; const U = Math.min(26, (size - 6) / Math.max(W, H));
  const o = cells.map(([x, y]) => `<rect x="${3 + x * U}" y="${3 + y * U}" width="${U}" height="${U}" fill="#ffd166" stroke="${LN}" stroke-width="1.6"/>`).join('');
  return `<svg viewBox="0 0 ${W * U + 6} ${H * U + 6}" width="${W * U + 6}" height="${H * U + 6}" class="cells">${o}</svg>`;
}
EXTRA.cells = ({ cells }) => cellsSvg(cells, 160);
OPT_EXTRA.cells = (json) => cellsSvg(JSON.parse(json), 84);

// Peta berpetak dengan kolom huruf dan baris angka.
EXTRA.cmap = ({ cols, rows, items }) => {
  const U = 52, L = 34; let o = '';
  for (let c = 0; c < cols; c++) o += T(L + c * U + U / 2, 24, String.fromCharCode(65 + c), 20);
  for (let r = 0; r < rows; r++) o += T(16, L + r * U + U / 2 + 7, r + 1, 20);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o += `<rect x="${L + c * U}" y="${L + r * U}" width="${U}" height="${U}" fill="${(r + c) % 2 ? '#eaf7e1' : '#f4fbef'}" stroke="#b9dca5" stroke-width="1.5"/>`;
  for (const it of items) o += emoSvg(it.e, L + it.c * U + U / 2, L + it.r * U + U / 2, 34);
  return svg(L + cols * U + 6, L + rows * U + 6, o);
};

// Pemutar berwarna dan kantong kelereng.
const COLS = { merah: '#f2546b', biru: '#3d8bfd', kuning: '#ffc21a', hijau: '#34b85a', ungu: '#9b5cf6' };
EXTRA.spinner = ({ sectors }) => {
  const cx = 120, cy = 120, R = 104, n = sectors.length; let o = '';
  sectors.forEach((col, i) => { const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2; o += `<path d="M${cx} ${cy} L${(cx + R * Math.cos(a0)).toFixed(1)} ${(cy + R * Math.sin(a0)).toFixed(1)} A${R} ${R} 0 0 1 ${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)} Z" fill="${COLS[col]}" stroke="#fff" stroke-width="3"/>`; });
  o += `<path d="M${cx} ${cy} L${cx + 20} ${cy - 66}" stroke="${LN}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="10" fill="${LN}"/>`;
  return svg(240, 240, o, 'viz sq');
};
EXTRA.bag = ({ marbles }) => {
  const list = Object.entries(marbles).flatMap(([c, k]) => Array(k).fill(c));
  let o = `<path d="M60 70 Q40 220 150 226 Q260 220 240 70 Z" fill="#e9dcc7" stroke="${LN}" stroke-width="3"/><path d="M80 66 Q150 40 220 66" fill="none" stroke="#a46b3c" stroke-width="8" stroke-linecap="round"/>`;
  list.forEach((c, i) => { const x = 88 + (i % 6) * 25 + (Math.floor(i / 6) % 2) * 12, y = 200 - Math.floor(i / 6) * 25; o += `<circle cx="${x}" cy="${y}" r="11" fill="${COLS[c]}" stroke="${LN}" stroke-width="1.5"/>`; });
  return svg(300, 236, o, 'viz sq');
};

// Diagram batang dengan skala lebih dari satu.
EXTRA.bars2 = ({ rows, max, step, unit }) => {
  const W = 110 + rows.length * 92, base = 250, top = 20, k = (base - top) / max; let o = '';
  for (let v = 0; v <= max; v += step) { const y = base - v * k; o += `<path d="M64 ${y} H${W - 10}" stroke="${v ? SOFT : LN}" stroke-width="${v ? 1.5 : 3}"/><text x="54" y="${y + 6}" font-size="15" font-weight="700" text-anchor="end" fill="${LN}">${fmt(v)}</text>`; }
  const F = ['#5aa7ff', '#ff8a3d', '#4cc38a', '#a875f5', '#f2546b'];
  rows.forEach((r, i) => { const x = 84 + i * 92; o += `<rect x="${x}" y="${base - r.n * k}" width="58" height="${r.n * k}" rx="6" fill="${F[i % 5]}"/>` + (r.e ? emoSvg(r.e, x + 29, base + 26, 28) : T(x + 29, base + 28, r.label, 15)); });
  if (unit) o += T(W / 2, 296, unit, 15);
  return svg(W, 300, o);
};

// Peta dengan skala.
EXTRA.scalemap = ({ cm, scaleTxt, a, b }) => {
  const x0 = 50, x1 = 50 + cm * 50; let o = `<rect x="4" y="4" width="${x1 + 60}" height="150" rx="14" fill="#e6f4ff" stroke="#9bc6ec" stroke-width="2"/>`;
  o += `<path d="M${x0} 80 H${x1}" stroke="#f2546b" stroke-width="3" stroke-dasharray="7 5"/>` + emoSvg(a, x0, 62, 34) + emoSvg(b, x1, 62, 34);
  for (let i = 0; i <= cm; i++) o += `<path d="M${x0 + i * 50} 104 V116" stroke="${LN}" stroke-width="2"/>`;
  o += `<path d="M${x0} 110 H${x1}" stroke="${LN}" stroke-width="2"/>` + T((x0 + x1) / 2, 140, `${cm} cm di peta`, 18) + T(x1 + 2, 28, scaleTxt, 17, 'text-anchor="end"');
  return svg(x1 + 70, 160, o);
};

// Deret dua jenis benda untuk rasio.
EXTRA.ratio = ({ a, b, ea, eb }) => `<div class="objects"><div class="og">${Array(a).fill(emo(ea, a + b > 14 ? 'sm' : 'md')).join('')}</div><div class="og">${Array(b).fill(emo(eb, a + b > 14 ? 'sm' : 'md')).join('')}</div></div>`;

// Bangun ruang dengan label.
EXTRA.solid2 = ({ k }) => (k === 'prisma' || k === 'limas' ? '' : solidSvg(k, 140));
void shapeSvg;
