// Visual soal: emoji berwarna dan SVG bergaya lembut (tanpa garis tebal). Fungsi murni -> string HTML.
import { fmt } from './words.js';

const LN = '#4b4763';            // warna garis
const SOFT = '#e9e6f5';          // garis bantu
const svg = (w, h, inner, cls = 'viz') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">${inner}</svg>`;
const T = (x, y, t, size = 22, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" font-weight="800" fill="${LN}" font-family="Fredoka, Nunito, sans-serif" ${extra}>${t}</text>`;
const emo = (e, cls = '') => `<span class="emo ${cls}">${e}</span>`;
const emoSvg = (e, x, y, s) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central" class="emo-t">${e}</text>`;
const GRAD = `<defs>
  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#3d8bfd"/></linearGradient>
  <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc46b"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient>
  <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ee29b"/><stop offset="1" stop-color="#34b85a"/></linearGradient>
  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4a5ff"/><stop offset="1" stop-color="#9b5cf6"/></linearGradient>
  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9aa8"/><stop offset="1" stop-color="#f2546b"/></linearGradient>
  <linearGradient id="gY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#ffc21a"/></linearGradient>
  <radialGradient id="gSph" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffd0d6"/><stop offset=".5" stop-color="#ff6b81"/><stop offset="1" stop-color="#c2364f"/></radialGradient></defs>`;
const FILLS = ['url(#gB)', 'url(#gO)', 'url(#gG)', 'url(#gP)', 'url(#gR)', 'url(#gY)'];

// ── bangun datar ──
function poly(n, rad = 42, rot = -90) { return [...Array(n)].map((_, i) => { const a = ((rot + (360 / n) * i) * Math.PI) / 180; return [50 + rad * Math.cos(a), 50 + rad * Math.sin(a)]; }); }
const SHAPES = {
  tri: () => ({ pts: poly(3, 46).map(([x, y]) => [x, y + 8]) }), rtri: () => ({ pts: [[14, 86], [86, 86], [14, 14]] }), 'tri-wide': () => ({ pts: [[6, 78], [94, 78], [38, 24]] }),
  sq: () => ({ pts: [[16, 16], [84, 16], [84, 84], [16, 84]] }), rect: () => ({ pts: [[4, 28], [96, 28], [96, 72], [4, 72]] }),
  rhombus: () => ({ pts: [[50, 6], [88, 50], [50, 94], [12, 50]] }), trap: () => ({ pts: [[28, 22], [72, 22], [94, 78], [6, 78]] }),
  pent: () => ({ pts: poly(5, 44) }), hex: () => ({ pts: poly(6, 44, 0) }), oct: () => ({ pts: poly(8, 44, 22.5) }),
  circle: () => ({ circle: true }), open: () => ({ open: [[14, 84], [50, 14], [86, 84], [62, 84]] }), curvy: () => ({ path: 'M14 84 Q50 -12 86 84 Q50 66 14 84 Z' }),
};
export function shapeSvg(k, { fill = 0, rot = 0, size = 110, marks = false } = {}) {
  const s = (SHAPES[k] || SHAPES.sq)(); const f = FILLS[fill % FILLS.length];
  const st = `stroke="${LN}" stroke-width="2.5" stroke-linejoin="round"`;
  let b;
  if (s.circle) b = `<circle cx="50" cy="50" r="42" fill="${f}" ${st}/>`;
  else if (s.open) b = `<polyline points="${s.open.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#3d8bfd" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  else if (s.path) b = `<path d="${s.path}" fill="${f}" ${st}/>`;
  else {
    b = `<polygon points="${s.pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="${f}" ${st}/>`;
    if (marks) b += s.pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#fff" stroke="${LN}" stroke-width="2"/>`).join('');
  }
  return `<svg viewBox="-4 -4 108 108" width="${size}" height="${size}" class="shape">${GRAD}<g transform="rotate(${rot} 50 50)">${b}</g></svg>`;
}

// ── bangun ruang (digambar, bukan emoji) ──
export function solidSvg(k, size = 90) {
  const st = `stroke="${LN}" stroke-width="2" stroke-linejoin="round"`;
  let b = '';
  if (k === 'bola') b = `<circle cx="50" cy="52" r="38" fill="url(#gSph)" ${st}/><ellipse cx="38" cy="38" rx="10" ry="6" fill="#fff" opacity=".5"/>`;
  if (k === 'kubus') b = `<polygon points="22,34 58,34 58,82 22,82" fill="#5aa7ff" ${st}/><polygon points="22,34 40,18 76,18 58,34" fill="#a9d2ff" ${st}/><polygon points="58,34 76,18 76,66 58,82" fill="#2f7be0" ${st}/>`;
  if (k === 'balok') b = `<polygon points="8,44 66,44 66,82 8,82" fill="#ffb15c" ${st}/><polygon points="8,44 28,28 86,28 66,44" fill="#ffd6a3" ${st}/><polygon points="66,44 86,28 86,66 66,82" fill="#f08a24" ${st}/>`;
  if (k === 'kerucut') b = `<path d="M50 10 L84 78 A34 10 0 0 1 16 78 Z" fill="#a875f5" ${st}/><ellipse cx="50" cy="78" rx="34" ry="10" fill="#c9a5ff" ${st}/>`;
  if (k === 'tabung') b = `<path d="M18 26 V78 A32 10 0 0 0 82 78 V26" fill="#4cc38a" ${st}/><ellipse cx="50" cy="26" rx="32" ry="10" fill="#9be7c0" ${st}/>`;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="solid">${GRAD}${b}</svg>`;
}

// ── komposisi bangun ──
export function compSvg(id, size = 130) {
  const st = `stroke="${LN}" stroke-width="2" stroke-linejoin="round"`;
  const H = poly(6, 44, 0), ctr = [50, 50];
  const C = ['#ffd166', '#7bdc93', '#6cb8ff', '#ff8fa3', '#c39bff', '#ffb36b'];
  const hp = (pts, f) => `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="${f}" ${st}/>`;
  const dash = (pts) => `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#f2546b" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  let g = '';
  switch (id) {
    case 'sq-2tri': g = hp([[10, 10], [90, 10], [90, 90]], C[0]) + hp([[10, 10], [90, 90], [10, 90]], C[1]); break;
    case 'sq-4tri': g = [[[10, 10], [90, 10]], [[90, 10], [90, 90]], [[90, 90], [10, 90]], [[10, 90], [10, 10]]].map((e, i) => hp([e[0], e[1], ctr], C[i])).join(''); break;
    case 'rect-2sq': g = hp([[4, 28], [50, 28], [50, 74], [4, 74]], C[0]) + hp([[50, 28], [96, 28], [96, 74], [50, 74]], C[2]); break;
    case 'rect-3sq': g = [0, 1, 2].map((i) => hp([[4 + i * 30.7, 35], [34.7 + i * 30.7, 35], [34.7 + i * 30.7, 65.7], [4 + i * 30.7, 65.7]], C[i])).join(''); break;
    case 'rect-4tri': g = hp([[4, 28], [50, 28], [4, 74]], C[0]) + hp([[50, 28], [50, 74], [4, 74]], C[1]) + hp([[50, 28], [96, 28], [96, 74]], C[2]) + hp([[50, 28], [96, 74], [50, 74]], C[3]); break;
    case 'rect-strips': g = [0, 1, 2, 3].map((i) => hp([[4 + i * 23, 28], [27 + i * 23, 28], [27 + i * 23, 74], [4 + i * 23, 74]], C[i])).join(''); break;
    case 'rect-gap': g = hp([[4, 28], [50, 28], [50, 74], [4, 74]], C[0]) + hp([[50, 28], [96, 28], [96, 51], [50, 51]], C[2]) + dash([[50, 51], [96, 51], [96, 74], [50, 74]]); break;
    case 'rect-over': g = hp([[4, 28], [50, 28], [50, 74], [4, 74]], C[0]) + hp([[50, 16], [96, 16], [96, 62], [50, 62]], C[2]) + dash([[4, 28], [96, 28], [96, 74], [4, 74]]); break;
    case 'hex-6tri': g = H.map((p, i) => hp([p, H[(i + 1) % 6], ctr], C[i])).join(''); break;
    case 'hex-2trap': g = hp([H[0], H[1], H[2], H[3]], C[0]) + hp([H[3], H[4], H[5], H[0]], C[2]); break;
    case 'hex-3rhom': g = hp([ctr, H[0], H[1], H[2]], C[0]) + hp([ctr, H[2], H[3], H[4]], C[1]) + hp([ctr, H[4], H[5], H[0]], C[2]); break;
    case 'hex-gap': g = H.slice(0, 5).map((p, i) => hp([p, H[(i + 1) % 6], ctr], C[i])).join('') + dash([H[5], H[0], ctr]); break;
    case 'tri-4tri': { const A = [50, 8], B = [8, 88], D = [92, 88]; const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; const ab = m(A, B), bd = m(B, D), ad = m(A, D); g = hp([A, ab, ad], C[0]) + hp([ab, B, bd], C[1]) + hp([ad, bd, D], C[2]) + hp([ab, bd, ad], C[3]); break; }
  }
  return `<svg viewBox="-2 -2 104 104" width="${size}" height="${size}" class="comp">${g}</svg>`;
}

// ── pecahan ──
export function fracSvg({ shape = 'circle', parts, shaded = 0, unequal = false }, size = 120) {
  const col = '#ff8a3d', bg = '#fff4e6', st = `stroke="${LN}" stroke-width="2"`;
  const on = (i) => (Array.isArray(shaded) ? shaded.includes(i) : i < shaded);
  let g = '';
  if (shape === 'circle') {
    let cut = [...Array(parts + 1)].map((_, i) => i / parts);
    if (unequal) cut = parts === 2 ? [0, 0.36, 1] : parts === 4 ? [0, 0.14, 0.42, 0.7, 1] : cut;
    for (let i = 0; i < parts; i++) {
      const a0 = cut[i] * 2 * Math.PI - Math.PI / 2, a1 = cut[i + 1] * 2 * Math.PI - Math.PI / 2;
      const p0 = [50 + 44 * Math.cos(a0), 50 + 44 * Math.sin(a0)], p1 = [50 + 44 * Math.cos(a1), 50 + 44 * Math.sin(a1)];
      g += `<path d="M50 50 L${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A44 44 0 ${cut[i + 1] - cut[i] > 0.5 ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} Z" fill="${on(i) ? col : bg}" ${st}/>`;
    }
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="frac">${g}</svg>`;
  }
  const W = shape === 'bar' ? 220 : 120, Hh = shape === 'bar' ? 46 : 90;
  let cuts = [...Array(parts + 1)].map((_, i) => i / parts);
  if (unequal) cuts = parts === 2 ? [0, 0.3, 1] : parts === 4 ? [0, 0.12, 0.4, 0.64, 1] : cuts;
  for (let i = 0; i < parts; i++) g += `<rect x="${4 + cuts[i] * (W - 8)}" y="4" width="${(cuts[i + 1] - cuts[i]) * (W - 8)}" height="${Hh - 8}" rx="3" fill="${on(i) ? col : bg}" ${st}/>`;
  return `<svg viewBox="0 0 ${W} ${Hh}" width="${shape === 'bar' ? size * 1.7 : size}" class="frac">${g}</svg>`;
}

// ── visual lain ──
function objects(v) {
  const groups = v.groups.map((g) => {
    const n = g.n, cross = g.crossed || 0;
    const sz = v.big ? 'xl' : v.small ? 'sm' : n > 12 ? 'sm' : n > 6 ? 'md' : 'lg';
    if (!n) return '<div class="pond">🌊 kosong 🌊</div>';
    return `<div class="og ${v.scatter ? 'scatter' : ''}">${[...Array(n)].map((_, i) => emo(g.e, `${sz} ${i >= n - cross ? 'crossed' : ''}`)).join('')}</div>`;
  });
  return `<div class="objects">${groups.join(v.op ? `<span class="opbig">${v.op}</span>` : '')}</div>`;
}
function tenframe({ fills }) {
  const total = fills.reduce((s, f) => s + f.n, 0), frames = Math.max(1, Math.ceil(total / 10));
  const crossFrom = fills[0].crossed ? total - fills[0].crossed : Infinity;
  const cells = []; for (const f of fills) for (let i = 0; i < f.n; i++) cells.push(f.e || (f.color === 'b' ? '🔵' : '🔴'));
  let html = '';
  for (let fr = 0; fr < frames; fr++) {
    html += '<div class="tf">';
    for (let k = 0; k < 10; k++) { const i = fr * 10 + k; html += `<span class="tfc">${i < cells.length ? emo(cells[i], `sm ${i >= crossFrom ? 'crossed' : ''}`) : ''}</span>`; }
    html += '</div>';
  }
  return `<div class="tfs">${html}</div>`;
}
function sticks({ tens, ones }) {
  let out = '', x = 0;
  for (let t = 0; t < tens; t++) {
    for (let i = 0; i < 10; i++) out += `<rect x="${x + i * 4.2}" y="6" width="4.6" height="88" rx="2" fill="#e2b56b" stroke="#a87b35" stroke-width=".8"/>`;
    out += `<rect x="${x - 3}" y="44" width="50" height="10" rx="4" fill="#f2546b"/>`;
    x += 62;
  }
  x += 6;
  for (let i = 0; i < ones; i++) { out += `<rect x="${x}" y="6" width="7" height="88" rx="3" fill="#e2b56b" stroke="#a87b35" stroke-width="1"/>`; x += 14; }
  return svg(Math.max(x + 4, 60), 100, out);
}
function blocks({ h = 0, tens = 0, o = 0 }) {
  let out = '', x = 0;
  for (let i = 0; i < h; i++) { out += `<rect x="${x}" y="4" width="60" height="60" rx="3" fill="#ffb15c"/>`; for (let k = 1; k < 10; k++) out += `<path d="M${x + k * 6} 4 V64 M${x} ${4 + k * 6} H${x + 60}" stroke="#e08e2b" stroke-width=".7"/>`; x += 66; }
  if (h) x += 6;
  for (let i = 0; i < tens; i++) { out += `<rect x="${x}" y="4" width="8" height="60" rx="2" fill="#5aa7ff"/>`; for (let k = 1; k < 10; k++) out += `<path d="M${x} ${4 + k * 6} H${x + 8}" stroke="#2f7be0" stroke-width=".7"/>`; x += 11; }
  if (tens) x += 8;
  for (let i = 0; i < o; i++) out += `<rect x="${x + (i % 3) * 10}" y="${54 - Math.floor(i / 3) * 10}" width="8" height="8" rx="2" fill="#4cc38a"/>`;
  x += Math.min(o, 3) * 10;
  return svg(Math.max(x, 40), 68, out);
}
function numline({ from, to, step, labels, arrow, mark, hops }) {
  const W = 640, x0 = 30, x1 = W - 30, n = Math.round((to - from) / step);
  const X = (v) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  let out = `<path d="M${x0 - 14} 60 H${x1 + 14}" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>`;
  for (let i = 0; i <= n; i++) {
    const v = from + i * step, x = X(v);
    const lab = labels === 'all' || (labels !== 'all' && (i === 0 || (labels === 'ends' && i === n)));
    const major = lab || (step === 1 && v % 5 === 0);
    out += `<path d="M${x} ${major ? 46 : 52} V${major ? 74 : 68}" stroke="${LN}" stroke-width="${major ? 3 : 2}" stroke-linecap="round"/>`;
    if (lab) out += T(x, 104, fmt(v), n > 12 ? 20 : 26);
  }
  if (mark !== undefined) out += `<circle cx="${X(mark)}" cy="60" r="11" fill="#ffc21a" stroke="${LN}" stroke-width="2"/>`;
  if (arrow !== undefined) out += `<path d="M${X(arrow)} 6 V40" stroke="#f2546b" stroke-width="5" stroke-linecap="round"/><path d="M${X(arrow) - 10} 30 L${X(arrow)} 44 L${X(arrow) + 10} 30 Z" fill="#f2546b"/>`;
  if (hops) { const k = hops === true ? n : hops; for (let i = 0; i < k && i < n; i++) { const a = X(from + i * step), b = X(from + (i + 1) * step); out += `<path d="M${a} 46 Q${(a + b) / 2} 14 ${b} 46" fill="none" stroke="#3d8bfd" stroke-width="3"/>`; } }
  return svg(W, 116, out);
}
function balance({ left, right, lv, rv }) {
  const tilt = lv == null || rv == null ? 0 : lv > rv ? -8 : lv < rv ? 8 : 0;
  const lab = (x, label) => {
    const parts = label.split('□');
    const txt = parts.length > 1 ? `${parts[0]}<tspan fill="#3d8bfd">?</tspan>${parts[1]}` : label;
    return `<rect x="${x - 70}" y="96" width="140" height="52" rx="16" fill="#fff" stroke="${LN}" stroke-width="2.5"/>${T(x, 133, txt, 32)}`;
  };
  const pan = (x, label) => `<path d="M${x} 40 L${x - 62} 150 M${x} 40 L${x + 62} 150" stroke="#9a96b5" stroke-width="2"/><path d="M${x - 86} 150 H${x + 86} Q${x + 80} 178 ${x + 50} 180 H${x - 50} Q${x - 80} 178 ${x - 86} 150 Z" fill="url(#gY)" stroke="${LN}" stroke-width="2.5"/>${lab(x, label)}`;
  return svg(540, 236, `${GRAD}<path d="M270 40 V222 M200 224 H340" stroke="${LN}" stroke-width="8" stroke-linecap="round"/><circle cx="270" cy="38" r="9" fill="${LN}"/>
    <g transform="rotate(${-tilt} 270 40)"><path d="M96 40 H444" stroke="#a46b3c" stroke-width="10" stroke-linecap="round"/>${pan(126, left)}${pan(414, right)}</g>`);
}
function scene({ ref, items, hands }) {
  const R = { pohon: '🌳', kursi: '🪑', rumah: '🏠', kotak: '📦' }[ref];
  // posisi [x, y, ukuran, digambar di belakang?] per acuan
  const POS = {
    kursi: { atas: [180, 66, 56], bawah: [180, 184, 46] },
    kotak: { depan: [150, 192, 70], belakang: [212, 92, 66, true], atas: [180, 66, 56] },
    rumah: { kanan: [310, 168, 64], kiri: [50, 168, 64] },
  }[ref] || {};
  let behind = '', front = '';
  for (const it of items) {
    const [x, y, sz, back] = POS[it.pos] || [180, 120, 60];
    const t = emoSvg(it.e, x, y, sz);
    if (back) behind += t; else front += t;
  }
  const refY = ref === 'kursi' ? 140 : ref === 'kotak' ? 150 : 128, refS = ref === 'rumah' ? 150 : ref === 'kotak' ? 124 : 110;
  let out = `<rect x="0" y="206" width="360" height="34" rx="10" fill="#cdeeb8"/>${behind}${emoSvg(R, 180, refY, refS)}${front}`;
  if (hands) out += T(52, 232, '👈 kiri', 18) + T(308, 232, 'kanan 👉', 18);
  return svg(360, 240, out);
}
function lengths({ items }) {
  const U = 34; let out = '';
  for (let i = 0; i <= 12; i++) out += `<path d="M${10 + i * U} 2 V${items.length * 48 + 6}" stroke="${SOFT}" stroke-width="2"/>`;
  items.forEach((it, k) => { out += `<rect x="${10 + it.off * U}" y="${10 + k * 48}" width="${it.len * U}" height="30" rx="15" fill="${it.color}"/>`; });
  return svg(12 * U + 20, items.length * 48 + 12, out);
}
function clips({ n, mode }) {
  const U = 40; let out = `<rect x="20" y="10" width="${n * U}" height="24" rx="12" fill="#f472b6"/>`, x = 20;
  const count = mode === 'gap' ? Math.max(2, n - 2) : mode === 'overlap' ? n + 2 : n;
  for (let i = 0; i < count; i++) { out += `<rect x="${x}" y="46" width="${U - 4}" height="16" rx="8" fill="#9aa5b8" stroke="#6b7487" stroke-width="1.5"/>`; x += mode === 'gap' ? U + 14 : mode === 'overlap' ? U - 12 : U; }
  return svg(Math.max(n * U + 60, x + 20), 74, out);
}
function picto({ rows, per = 1, unit = 'anak' }) {
  return `<div class="vstack"><table class="picto">${rows.map((r) => `<tr><th>${emo(r.e, 'sm')}<span>${r.label.charAt(0).toUpperCase() + r.label.slice(1)}</span></th><td>${[...Array(r.n / per)].map(() => emo(r.e, 'sm')).join('')}</td></tr>`).join('')}</table><p class="legend">Satu gambar mewakili ${per === 1 ? 'satu' : per} ${unit}.</p></div>`;
}
function tally({ rows }) {
  const marks = (n) => {
    let s = '', x = 0;
    for (let g = 0; g < Math.floor(n / 5); g++) { for (let i = 0; i < 4; i++) s += `<path d="M${x + i * 9} 4 V36" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>`; s += `<path d="M${x - 4} 30 L${x + 31} 10" stroke="#f2546b" stroke-width="3" stroke-linecap="round"/>`; x += 46; }
    for (let i = 0; i < n % 5; i++) s += `<path d="M${x + i * 9} 4 V36" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>`;
    return `<svg viewBox="-6 0 ${Math.max(x + (n % 5) * 9 + 10, 40)} 40" height="34">${s}</svg>`;
  };
  return `<table class="picto">${rows.map((r) => `<tr><th>${emo(r.e, 'sm')}<span>${r.label.charAt(0).toUpperCase() + r.label.slice(1)}</span></th><td>${marks(r.n)}</td></tr>`).join('')}</table>`;
}
function bars({ rows, max }) {
  const W = 110 + rows.length * 92, base = 250, top = 20, unit = (base - top) / max;
  let out = '';
  for (let v = 0; v <= max; v++) { const y = base - v * unit; out += `<path d="M58 ${y} H${W - 10}" stroke="${v ? SOFT : LN}" stroke-width="${v ? 1.5 : 3}"/>` + `<text x="46" y="${y + 6}" font-size="16" font-weight="700" text-anchor="end" fill="${LN}">${v}</text>`; }
  rows.forEach((r, i) => { const x = 78 + i * 92; out += `<rect x="${x}" y="${base - r.n * unit}" width="58" height="${r.n * unit}" rx="6" fill="${FILLS[i]}"/>` + emoSvg(r.e, x + 29, base + 26, 30); });
  return svg(W, 300, GRAD + out);
}
function tableViz({ head, rows }) { return `<table class="dtab"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`; }
function tape({ total, parts }) {
  const W = 560, [a, b] = parts, tv = total ?? (a + b), wa = Math.min(0.72, Math.max(0.28, a == null ? (tv - b) / tv : a / tv)), xa = 20 + wa * (W - 40);
  const lab = (v) => (v == null ? '?' : fmt(v));
  return svg(W, 112, `<rect x="20" y="58" width="${xa - 20}" height="44" rx="6" fill="#7bdc93"/>${T((20 + xa) / 2, 90, lab(a), 28)}<rect x="${xa}" y="58" width="${W - 20 - xa}" height="44" rx="6" fill="#ffb36b"/>${T((xa + W - 20) / 2, 90, lab(b), 28)}
    <path d="M20 52 Q20 40 32 40 H${W - 32} Q${W - 20} 40 ${W - 20} 52" fill="none" stroke="${LN}" stroke-width="2.5"/>${T(W / 2, 30, lab(total), 24)}`);
}
function arrayViz({ r, c, e }) { return `<div class="arr" style="--c:${c}">${[...Array(r * c)].map(() => emo(e, r * c > 30 ? 'xs' : 'sm')).join('')}</div>`; }
function groupsViz({ g, n, e }) { return `<div class="groups">${[...Array(g)].map(() => `<div class="plate">${[...Array(n)].map(() => emo(e, n > 3 ? 'xs' : 'sm')).join('')}</div>`).join('')}</div>`; }
function shareViz({ n, k, e }) { return `<div class="share"><div class="og">${[...Array(n)].map(() => emo(e, 'sm')).join('')}</div><div class="groups">${[...Array(k)].map(() => `<div class="plate empty">${emo('🧒', 'md')}</div>`).join('')}</div></div>`; }
function areaViz({ cells, w, h, faint }) {
  const U = Math.min(48, 300 / Math.max(w, h)); let out = '';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out += `<rect x="${x * U}" y="${y * U}" width="${U}" height="${U}" fill="none" stroke="${SOFT}" stroke-width="1.5"/>`;
  for (const [x, y] of cells) out += `<rect x="${x * U + 1}" y="${y * U + 1}" width="${U - 2}" height="${U - 2}" rx="4" fill="${faint ? '#ffe2c2' : '#6cb8ff'}"/>`;
  return svg(w * U + 2, h * U + 2, out);
}
function cubesViz({ l, w, h }) {
  const s = 34, dx = 16, dy = -12; let out = '';
  for (let z = 0; z < h; z++) for (let y = w - 1; y >= 0; y--) for (let x = 0; x < l; x++) {
    const X = 30 + x * s + y * dx, Y = 150 - z * s + y * dy;
    out += `<polygon points="${X},${Y} ${X + s},${Y} ${X + s + dx},${Y + dy} ${X + dx},${Y + dy}" fill="#ffe08a" stroke="${LN}" stroke-width="1.2"/>`;
    out += `<polygon points="${X + s},${Y} ${X + s + dx},${Y + dy} ${X + s + dx},${Y + dy + s} ${X + s},${Y + s}" fill="#ffb15c" stroke="${LN}" stroke-width="1.2"/>`;
    out += `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="#ffd166" stroke="${LN}" stroke-width="1.2"/>`;
  }
  return svg(60 + l * s + w * dx, 200, out);
}
function rulerViz({ start, end, max, obj }) {
  const U = 40; let out = `<rect x="10" y="70" width="${max * U + 20}" height="54" rx="6" fill="#ffe58a"/>`;
  for (let i = 0; i <= max; i++) { const x = 20 + i * U; out += `<path d="M${x} 70 V92" stroke="${LN}" stroke-width="2.5"/>` + T(x, 116, i, 16); if (i < max) out += `<path d="M${x + U / 2} 70 V82" stroke="${LN}" stroke-width="1.5"/>`; }
  const x0 = 20 + start * U, x1 = 20 + end * U;
  out += obj === 'pensil' ? `<path d="M${x0} 40 L${x0 + 22} 27 H${x1} V53 H${x0 + 22} Z" fill="#ffc21a" stroke="${LN}" stroke-width="2"/><path d="M${x0} 40 L${x0 + 22} 27 V53 Z" fill="#f6dfb4" stroke="${LN}" stroke-width="2"/>`
    : `<rect x="${x0}" y="28" width="${x1 - x0}" height="24" rx="6" fill="#f472b6"/>`;
  out += `<path d="M${x0} 20 V70 M${x1} 20 V70" stroke="#3d8bfd" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  return svg(max * U + 40, 128, out);
}
function dialViz({ value, max, major, minor, unit, e }) {
  const cx = 150, cy = 150, R = 110, ang = (v) => (-210 + (v / max) * 240) * (Math.PI / 180);
  let out = `<rect x="70" y="236" width="160" height="28" rx="8" fill="#b9c2d3"/><circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="#f5f7fb" stroke="${LN}" stroke-width="3"/>`;
  for (let v = 0; v <= max + 1e-9; v += minor) {
    const a = ang(v), isMaj = Math.abs(v / major - Math.round(v / major)) < 1e-9;
    out += `<path d="M${cx + (R - (isMaj ? 18 : 9)) * Math.cos(a)} ${cy + (R - (isMaj ? 18 : 9)) * Math.sin(a)} L${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)}" stroke="${LN}" stroke-width="${isMaj ? 3 : 1.5}"/>`;
    if (isMaj) out += T(cx + (R - 36) * Math.cos(a), cy + (R - 36) * Math.sin(a) + 6, fmt(Math.round(v)), 15);
  }
  const a = ang(value);
  out += `<path d="M${cx} ${cy} L${cx + (R - 12) * Math.cos(a)} ${cy + (R - 12) * Math.sin(a)}" stroke="#f2546b" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="${LN}"/>` + T(cx, cy + 50, unit, 20) + emoSvg(e, 262, 34, 46);
  return svg(300, 270, out);
}
function panViz({ left, right, tilt }) {
  const side = (x, o) => { if (o.n === 1) return emoSvg(o.e, x, 64, 50); let s = ''; for (let i = 0; i < o.n; i++) s += emoSvg(o.e, x - 36 + (i % 4) * 24, 78 - Math.floor(i / 4) * 22, 22); return s; };
  return svg(420, 190, `${GRAD}<path d="M210 50 V172 M150 172 H270" stroke="${LN}" stroke-width="6" stroke-linecap="round"/><g transform="rotate(${tilt * 10} 210 50)"><path d="M70 50 H350" stroke="#a46b3c" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 50 V92 M320 50 V92" stroke="${LN}" stroke-width="2"/><path d="M48 92 H152 L138 110 H62 Z" fill="url(#gY)" stroke="${LN}" stroke-width="2"/><path d="M268 92 H372 L358 110 H282 Z" fill="url(#gY)" stroke="${LN}" stroke-width="2"/>${side(100, left)}${side(320, right)}</g>`);
}
function clockViz({ h, m }) {
  const c = 100; let out = `<circle cx="${c}" cy="${c}" r="88" fill="#fff" stroke="#3d8bfd" stroke-width="7"/>`;
  for (let i = 1; i <= 12; i++) { const a = ((i * 30 - 90) * Math.PI) / 180; out += T(c + 70 * Math.cos(a), c + 70 * Math.sin(a) + 7, i, 19); }
  const ha = (((h % 12) * 30 + m * 0.5 - 90) * Math.PI) / 180, ma = ((m * 6 - 90) * Math.PI) / 180;
  out += `<path d="M${c} ${c} L${c + 42 * Math.cos(ha)} ${c + 42 * Math.sin(ha)}" stroke="${LN}" stroke-width="8" stroke-linecap="round"/><path d="M${c} ${c} L${c + 64 * Math.cos(ma)} ${c + 64 * Math.sin(ma)}" stroke="#f2546b" stroke-width="5" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="6" fill="${LN}"/>`;
  return svg(200, 200, out);
}
function columnViz({ a, b, op }) {
  const w = Math.max(String(a).length, String(b).length);
  const row = (s) => [...String(s).padStart(w, ' ')].map((d) => `<span>${d.trim()}</span>`).join('');
  return `<div class="column"><div><span class="op"></span>${row(a)}</div><div><span class="op">${op}</span>${row(b)}</div><div class="rule"></div><div><span class="op"></span><span class="q">?</span></div></div>`;
}
function growViz({ seq, e }) { return `<div class="grow">${seq.map((n, i) => `<div class="step"><div>${[...Array(n)].map(() => emo(e, 'xs')).join('')}</div><small>ke-${i + 1}</small></div>`).join('<b class="arr-r">➜</b>')}<b class="arr-r">➜</b><div class="step ask">?</div></div>`; }
function dotsViz({ n, filled }) { return `<div class="dots">${[...Array(n)].map((_, i) => `<i class="${i < filled ? 'on' : ''}"></i>`).join('')}</div>`; }
function rowViz({ items }) { return `<div class="row-line"><span class="flag">🚩</span>${items.map((e) => emo(e, 'lg')).join('')}</div>`; }
function gridViz({ N, start, marks }) {
  let html = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const m = marks.find((k) => k.x === x && k.y === y);
    html += `<div class="gc">${start[0] === x && start[1] === y ? '⭐' : m ? `<b>${m.l}</b>` : ''}</div>`;
  }
  return `<div class="vstack"><div class="gridv" style="--n:${N}">${html}</div><p class="legend">${emo('👈', '')} kiri · kanan ${emo('👉', '')} · ${emo('☝️', '')} atas · ${emo('👇', '')} bawah</p></div>`;
}
function patternViz({ seq }) { return `<div class="pattern">${seq.map((t) => (t ? emo(t, 'lg') : '<span class="slot">?</span>')).join('')}</div>`; }
function basketViz({ items }) { return `<div class="basket">${items.map((e) => emo(e, 'sm')).join('')}</div>`; }
function fraceqViz({ a, b }) { return `<div class="fraceq">${fracSvg({ shape: 'bar', parts: a[1], shaded: a[0] }, 110)}<b>=</b>${fracSvg({ shape: 'bar', parts: b[1], shaded: 0 }, 110)}</div>`; }
function piecesViz({ items }) { return `<div class="pieces">${items.map((k, i) => shapeSvg(k, { fill: 1 + (i % 2), size: 64 })).join('<b>+</b>')}</div>`; }

export const EXTRA = {};
export { svg, T, emo, emoSvg, GRAD, FILLS, LN, SOFT };

export function renderVisual(v) {
  if (!v) return '';
  switch (v.t) {
    case 'objects': return objects(v);
    case 'tenframe': return tenframe(v);
    case 'sticks': return sticks(v);
    case 'blocks': return blocks(v);
    case 'eq': return `<div class="eqbig ${v.text.length > 22 ? 'xlong' : v.text.length > 14 ? 'long' : ''}">${fracify(v.text).replace(/□/g, '<span class="box">?</span>')}</div>`;
    case 'numline': return numline(v);
    case 'balance': return balance(v);
    case 'pattern': return patternViz(v);
    case 'scene': return scene(v);
    case 'lengths': return lengths(v);
    case 'clips': return clips(v);
    case 'shape': return shapeSvg(v.k, { fill: v.fill || 0, rot: v.rot || 0, size: v.size || 170, marks: v.marks });
    case 'solid': return solidSvg(v.k, v.size || 110);
    case 'emoji': return emo(v.e, 'xl');
    case 'pieces': return piecesViz(v);
    case 'comp': return compSvg(v.id, v.size || 150);
    case 'frac': return fracSvg(v, v.size || 130);
    case 'fraceq': return fraceqViz(v);
    case 'picto': return picto(v);
    case 'tally': return tally(v);
    case 'bars': return bars(v);
    case 'table': return tableViz(v);
    case 'tape': return tape(v);
    case 'array': return arrayViz(v);
    case 'groups': return groupsViz(v);
    case 'share': return shareViz(v);
    case 'area': return areaViz(v);
    case 'cubes': return cubesViz(v);
    case 'ruler': return rulerViz(v);
    case 'dial': return dialViz(v);
    case 'pan': return panViz(v);
    case 'pans': return `<div class="pans">${v.pairs.map(([a, b]) => panViz({ left: { e: a, n: 1 }, right: { e: b, n: 1 }, tilt: -1 })).join('')}</div>`;
    case 'clock': return clockViz(v);
    case 'column': return columnViz(v);
    case 'grow': return growViz(v);
    case 'dots': return dotsViz(v);
    case 'row': return rowViz(v);
    case 'grid': return gridViz(v);
    case 'basket': return basketViz(v);
    case 'stack': return `<div class="vstack">${v.items.map(renderVisual).join('')}</div>`;
    default: return EXTRA[v.t] ? EXTRA[v.t](v) : '';
  }
}

// Label opsi. "frac:3/5" -> pecahan bertumpuk.
export function labelHtml(label) {
  const s = String(label);
  if (s.startsWith('frac:')) { const [n, d] = s.slice(5).split('/'); return `<span class="fr"><span>${n}</span><span>${d}</span></span>`; }
  return s;
}

// "3/5" atau "□/4" -> pecahan bertumpuk
export const fracify = (s) => String(s).replace(/(\d+|□)\/(\d+)/g, '<span class="fr"><span>$1</span><span>$2</span></span>');

// Opsi bergambar: "@shape:k:fill:rot" atau "@frac:shape:kind"
const FRAC_KIND = {
  half: { parts: 2, shaded: 1 }, unequal: { parts: 2, shaded: 1, unequal: true }, none: { parts: 3, shaded: 1 },
  quarter: { parts: 4, shaded: 1 }, unequal4: { parts: 4, shaded: 1, unequal: true }, three4: { parts: 4, shaded: 3 },
};
export const OPT_EXTRA = {};
export function optionHtml(label) {
  const s = String(label);
  if (s.startsWith('@') && OPT_EXTRA[s.slice(1).split(':')[0]]) return OPT_EXTRA[s.slice(1).split(':')[0]](s.slice(s.indexOf(':') + 1));
  if (s.startsWith('@shape:')) { const [, k, f, r] = s.split(':'); return shapeSvg(k, { fill: Number(f), rot: Number(r), size: 78 }); }
  if (s.startsWith('@frac:')) { const [, shape, kind] = s.split(':'); return fracSvg({ shape: shape === 'square' ? 'square' : shape, ...FRAC_KIND[kind] }, 80); }
  return fracify(labelHtml(s));
}
