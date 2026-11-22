// Kuis Hitung Ceria — antarmuka.
import { TOPICS, topicById, topicsOf } from './curriculum.js';
import { makeQuiz, QUIZ_LEN } from './bank.js';
import './bank46.js';
import './art46.js';
import { makeRng } from './rng.js';
import { renderVisual, optionHtml, fracify } from './art.js';

const $app = document.getElementById('app');
const $modal = document.getElementById('modal');

// ── penyimpanan (boleh gagal) ──
const KEY = 'kuisHitungCeria.v1';
const store = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
store.stars ||= {}; if (store.sound === undefined) store.sound = true;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* penyimpanan tidak tersedia */ } };

// ── bunyi lembut (Web Audio, nada sinus pendek; tanpa suara pembaca) ──
let ac = null;
function tone(freq, t0, dur, vol = 0.12, type = 'sine', slide = 0) {
  if (!store.sound) return;
  try {
    ac ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
  } catch { /* audio tidak tersedia */ }
}
const SFX = {
  tap: () => tone(660, 0, 0.07, 0.05, 'triangle'),
  good: () => { tone(784, 0, 0.18, 0.11); tone(988, 0.09, 0.18, 0.11); tone(1319, 0.18, 0.3, 0.1); },
  bad: () => { tone(330, 0, 0.22, 0.09, 'triangle', 0.8); tone(262, 0.14, 0.28, 0.07, 'triangle', 0.85); },
  done: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.32, 0.09)),
  star: (i) => tone(880 + i * 220, 0, 0.25, 0.08),
};

// ── data tampilan ──
const KELAS = {
  1: { emo: '🐣', cls: 'k1', color: '#ff7b7b', sub: 'Bilangan sampai 20' },
  2: { emo: '🐥', cls: 'k2', color: '#ffa936', sub: 'Bilangan sampai 100' },
  3: { emo: '🦜', cls: 'k3', color: '#22b8a6', sub: 'Bilangan sampai 1.000' },
  4: { emo: '🦊', cls: 'k4', color: '#4d8dff', sub: 'Sampai 10.000, desimal, persen' },
  5: { emo: '🐯', cls: 'k5', color: '#8b5cf6', sub: 'KPK, FPB, pecahan, sudut' },
  6: { emo: '🦅', cls: 'k6', color: '#ef4b5f', sub: 'Rasio, bangun ruang, peluang' },
};
const ICON = {
  '1.1.1': '🔢', '1.1.2': '⚖️', '1.1.3': '🧩', '1.1.4': '➕', '1.1.5': '➖', '1.1.6': '🟰', '1.1.7': '🔴', '1.1.8': '🎲', '1.1.9': '🪑',
  '1.2.1': '🔟', '1.2.2': '🥢', '1.2.3': '🧮', '1.2.4': '🟰', '1.2.5': '📏', '1.2.6': '⏳', '1.2.7': '🔺', '1.2.8': '🧩', '1.2.9': '📊',
  '2.1.1': '🔢', '2.1.2': '🔍', '2.1.3': '⚡', '2.1.4': '🌸', '2.1.5': '🧭', '2.1.6': '🔷', '2.1.7': '📅',
  '2.2.1': '💯', '2.2.2': '🍕', '2.2.3': '🥧', '2.2.4': '⚖️', '2.2.5': '📋', '2.2.6': '🏆',
  '3.1.1': '🔢', '3.1.2': '➕', '3.1.3': '➖', '3.1.4': '❓', '3.1.5': '📈', '3.1.6': '✖️', '3.1.7': '➗',
  '3.2.1': '🐸', '3.2.2': '🍰', '3.2.3': '📏', '3.2.4': '🏋️', '3.2.5': '🧱', '3.2.6': '📐', '3.2.7': '🧩', '3.2.8': '📊',
  '4.1.1': '🔢', '4.1.2': '🔍', '4.1.3': '🧩', '4.1.4': '📚', '4.1.5': '✖️', '4.1.6': '🌳', '4.1.7': '📈', '4.1.8': '❓',
  '4.2.1': '🍰', '4.2.2': '🟰', '4.2.3': '🔟', '4.2.4': '💯', '4.2.5': '🟦', '4.2.6': '🧊', '4.2.7': '🔷', '4.2.8': '📊',
  '5.1.1': '🔢', '5.1.2': '🔍', '5.1.3': '🧮', '5.1.4': '🔗', '5.1.5': '⏰', '5.1.6': '🥧', '5.1.7': '➕', '5.1.8': '❓',
  '5.2.1': '📏', '5.2.2': '🟩', '5.2.3': '📐', '5.2.4': '🔺', '5.2.5': '⏱️', '5.2.6': '💰', '5.2.7': '📋', '5.2.8': '🏔️',
  '6.1.1': '✖️', '6.1.2': '➗', '6.1.3': '🔟', '6.1.4': '🔄', '6.1.5': '📈', '6.1.6': '⚖️', '6.1.7': '🚲', '6.1.8': '🌡️', '6.1.9': '🗺️',
  '6.2.1': '🎲', '6.2.2': '👀', '6.2.3': '📦', '6.2.4': '🧭', '6.2.5': '✂️', '6.2.6': '🎯', '6.2.7': '🎡', '6.2.9': '🧊', '6.2.10': '📊', '6.2.8': '🏆',
};
const NAME = { '1.1.6': 'Arti Tanda Sama Dengan', '1.1.7': 'Pola Gambar', '1.2.4': 'Kalimat Matematika dengan Tanda =', '2.1.3': 'Lancar Menjumlah dan Mengurang', '2.1.4': 'Pola Gambar Lanjutan', '2.2.6': 'Tantangan Akhir Kelas 2' };
export const topicName = (t) => NAME[t.id] || t.topik.replace(/s\.d\./g, 'sampai');
const EL_BG = { bil: '#e6efff', alj: '#ffe9f2', ukur: '#fff2dc', geo: '#e3f8f1', data: '#efe8ff', mix: '#fff6cc' };
const PRAISE = ['Hebat!', 'Pintar!', 'Tepat sekali!', 'Keren!', 'Mantap!', 'Luar biasa!', 'Betul!'];
const OOPS = ['Belum tepat.', 'Belum benar, tidak apa-apa.', 'Belum tepat, ayo pelajari.'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const emo = (e) => `<span class="emo">${e}</span>`;
// Bungkus emoji di dalam teks agar memakai fon emoji.
const EMO_RE = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/gu;
const wrapEmoji = (s) => s.replace(EMO_RE, '<span class="emo">$1</span>');
const textHtml = (s) => wrapEmoji(fracify(esc(s)));
const starsOf = (id) => store.stars[id] || 0;
const starRow = (n) => [0, 1, 2].map((i) => `<span class="emo ${i < n ? '' : 'star-off'}">⭐</span>`).join('');
const totalStars = (k) => TOPICS.filter((t) => !k || t.kelas === k).reduce((s, t) => s + starsOf(t.id), 0);

// ── navigasi sederhana ──
let state = { screen: store.agreed ? 'home' : 'disclaimer', kelas: 1, sem: 1 };
function go(screen, extra = {}) { state = { ...state, ...extra, screen }; render(); window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); }
function render() {
  document.querySelector('.feedback')?.remove();
  ({ home, topics, quiz, result, info, disclaimer })[state.screen]();
}
const soundBtn = () => `<button class="iconbtn" data-act="sound" aria-label="${store.sound ? 'Matikan bunyi' : 'Nyalakan bunyi'}">${store.sound ? '🔊' : '🔇'}</button>`;
function bindCommon() {
  $app.querySelector('[data-act="sound"]')?.addEventListener('click', (e) => { store.sound = !store.sound; save(); e.currentTarget.textContent = store.sound ? '🔊' : '🔇'; e.currentTarget.setAttribute('aria-label', store.sound ? 'Matikan bunyi' : 'Nyalakan bunyi'); SFX.tap(); });
}

// ── beranda ──
function home() {
  $app.innerHTML = `<section class="screen">
    <div class="topbar"><span class="pill">${emo('⭐')} ${totalStars()}</span><span class="grow"></span>${soundBtn()}</div>
    <div class="hero">
      <div class="logo"><span class="bubble">Kuis Hitung</span>&nbsp;<span class="bubble b2">Ceria</span></div>
      <p class="tagline">Belajar matematika sambil bermain!</p>
      <div><span class="mascot" aria-hidden="true">🦉</span><span class="speech">Halo! Kamu kelas berapa?</span></div>
    </div>
    <div class="kelas-grid">
      ${[1, 2, 3, 4, 5, 6].map((k) => `<button class="kelas-card ${KELAS[k].cls}" data-k="${k}" aria-label="Kelas ${k}">
        <span class="emo">${KELAS[k].emo}</span><span class="t"><b>Kelas ${k}</b><small>${KELAS[k].sub}</small></span>
        <span class="mini">${emo('⭐')} ${totalStars(k)}/${topicsOf(k, 1).length * 3 + topicsOf(k, 2).length * 3}</span></button>`).join('')}
    </div>
    <div class="home-links"><button class="linkbtn" data-act="info">${emo('📘')} Untuk guru dan orang tua</button><button class="linkbtn" data-act="disclaimer">${emo('📜')} Disclaimer</button></div>
  </section>`;
  bindCommon();
  $app.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { SFX.tap(); go('topics', { kelas: Number(b.dataset.k), sem: 1 }); }));
  $app.querySelector('[data-act="info"]').addEventListener('click', () => { SFX.tap(); go('info'); });
  $app.querySelector('[data-act="disclaimer"]').addEventListener('click', () => { SFX.tap(); go('disclaimer'); });
}

// ── daftar topik ──
function topics() {
  const k = state.kelas, K = KELAS[k];
  const list = topicsOf(k, state.sem);
  $app.innerHTML = `<section class="screen">
    <div class="topbar"><button class="iconbtn" data-act="back" aria-label="Kembali">⬅️</button><span class="grow"></span><span class="pill">${emo('⭐')} ${totalStars(k)}</span>${soundBtn()}</div>
    <div class="head-card"><span class="badge" style="background:${K.color}"><span class="emo">${K.emo}</span></span><div><h1>Kelas ${k}</h1><p>Pilih topik yang ingin kamu mainkan.</p></div></div>
    <div class="tabs" role="tablist">${[1, 2].map((s) => `<button role="tab" aria-selected="${s === state.sem}" data-sem="${s}">Semester ${s}</button>`).join('')}</div>
    <div class="topic-grid">
      ${list.map((t) => `<button class="topic" data-t="${t.id}"><span class="ic" style="background:${EL_BG[t.elemen]}"><span class="emo">${ICON[t.id]}</span></span><span class="tt"><b>${esc(topicName(t).replace(/^Pengayaan: /, ''))}</b>${t.pengayaan ? '<span class="tag">Pengayaan</span>' : ''}<span class="stars" aria-label="${starsOf(t.id)} bintang">${starRow(starsOf(t.id))}</span></span></button>`).join('')}
      <button class="topic mix" data-t="mix:${k}.${state.sem}"><span class="ic"><span class="emo">🎲</span></span><span class="tt"><b>Kuis Campur Semester ${state.sem}</b><span style="font-weight:700;opacity:.9">Soal dari semua topik</span></span></button>
    </div>
  </section>`;
  bindCommon();
  $app.querySelector('[data-act="back"]').addEventListener('click', () => { SFX.tap(); go('home'); });
  $app.querySelectorAll('[data-sem]').forEach((b) => b.addEventListener('click', () => { SFX.tap(); go('topics', { sem: Number(b.dataset.sem) }); }));
  $app.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => { SFX.tap(); startQuiz(b.dataset.t); }));
}

// ── kuis ──
let Q = null;
function startQuiz(topicId) {
  const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
  const ids = topicId.startsWith('mix:') ? topicsOf(state.kelas, state.sem).filter((t) => t.elemen !== 'mix' && !t.pengayaan).map((t) => t.id) : null;
  const shuffledIds = ids ? makeRng(seed + 1).shuffle(ids) : null;
  Q = { topicId, seed, items: makeQuiz(topicId, makeRng(seed), shuffledIds), i: 0, score: 0, streak: 0, answers: [], hintUsed: false };
  go('quiz');
}
const topicTitle = (id) => (id.startsWith('mix:') ? `Kuis Campur Kelas ${id[4]} Semester ${id[6]}` : topicName(topicById[id]));

function quiz() {
  const it = Q.items[Q.i];
  const many = it.opts.length;
  const long = it.opts.some((o) => !o.html && String(o.label).length > 13);
  const cols = long ? 'one' : many === 3 && !it.opts.some((o) => o.html) ? 'three' : '';
  const wordy = it.opts.some((o) => !o.html && String(o.label).split(/\s+/).some((w) => w.length >= 8)) ? ' wordy' : '';
  $app.innerHTML = `<section class="screen ${it.kelas === 1 ? 'k1q' : ''}">
    <div class="topbar"><button class="iconbtn" data-act="quit" aria-label="Keluar dari kuis">✖️</button>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${QUIZ_LEN}" aria-valuenow="${Q.i}"><i style="width:${(Q.i / QUIZ_LEN) * 100}%"></i></div>
      <span class="pill" aria-label="Skor">${emo('⭐')} ${Q.score}</span>${Q.streak >= 2 ? `<span class="pill" aria-label="Benar berturut-turut">${emo('🔥')} ${Q.streak}</span>` : ''}</div>
    <div class="qcard">
      <div class="qmeta"><span class="qnum">Soal ${Q.i + 1} dari ${QUIZ_LEN}</span><span class="lvl">${['', 'Mudah', 'Sedang', 'Menantang'][it.level]}</span></div>
      <h1 class="qtext">${textHtml(it.q)}</h1>
      <div class="qvis">${renderVisual(it.v)}</div>
      <div class="answers ${cols}${wordy}">
        ${it.opts.map((o, i) => `<button class="ans" data-i="${i}"><span class="key"><span>${'ABCD'[i]}</span></span><span class="lab">${o.html ? optionHtml(o.label) : wrapEmoji(optionHtml(esc(o.label)))}</span></button>`).join('')}
      </div>
      ${it.hint ? `<div class="tools"><button class="hintbtn" data-act="hint">${emo('💡')} Minta petunjuk</button></div><div class="hintbox" hidden>${emo('💡')}<span>${textHtml(it.hint)}</span></div>` : ''}
    </div>
    <div class="spacer"></div>
  </section>`;
  // bilah progres bergerak halus
  requestAnimationFrame(() => { const bar = $app.querySelector('.progress > i'); if (bar) bar.style.width = `${((Q.i + 0.15) / QUIZ_LEN) * 100}%`; });
  $app.querySelector('[data-act="quit"]').addEventListener('click', confirmQuit);
  $app.querySelector('[data-act="hint"]')?.addEventListener('click', (e) => { SFX.tap(); e.currentTarget.parentElement.hidden = true; $app.querySelector('.hintbox').hidden = false; });
  $app.querySelectorAll('.ans').forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.i))));
}

function choose(i) {
  const it = Q.items[Q.i];
  if (Q.answered === Q.i) return;
  Q.answered = Q.i;
  const pick = it.opts[i]; const ok = String(pick.value) === String(it.ans);
  const btns = [...$app.querySelectorAll('.ans')];
  btns.forEach((b, j) => {
    b.disabled = true;
    const isAns = String(it.opts[j].value) === String(it.ans);
    if (isAns) b.classList.add('right'); else if (j === i) b.classList.add('wrong'); else b.classList.add('dim');
  });
  Q.answers.push({ item: it, pick, ok });
  if (ok) { Q.score++; Q.streak++; SFX.good(); confetti(Q.streak >= 3 ? 46 : 26); } else { Q.streak = 0; SFX.bad(); }
  const pill = $app.querySelector('.pill[aria-label="Skor"]'); if (pill) pill.innerHTML = `${emo('⭐')} ${Q.score}`;
  const bar = $app.querySelector('.progress > i'); if (bar) bar.style.width = `${((Q.i + 1) / QUIZ_LEN) * 100}%`;
  const ansOpt = it.opts.find((o) => String(o.value) === String(it.ans));
  const ansTxt = ansOpt.html ? 'yang diberi tanda hijau' : optionPlain(ansOpt.label);
  const fb = document.createElement('div');
  fb.className = `feedback ${ok ? 'good' : 'bad'}`; fb.setAttribute('role', 'status');
  const last = Q.i === QUIZ_LEN - 1;
  fb.innerHTML = `<div class="in"><span class="big">${ok ? (Q.streak >= 3 ? '🤩' : '🎉') : '🤔'}</span><div class="txt">
      <h2>${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : OOPS[Math.floor(Math.random() * OOPS.length)]}</h2>
      <p>${ok ? '' : `Jawaban yang benar: <b>${ansOpt.html ? esc(ansTxt) : textHtml(ansTxt)}</b>. `}${textHtml(it.explain)}</p></div>
      <button class="btn ${ok ? '' : 'orange'}" data-act="next">${last ? 'Lihat hasil 🏁' : 'Lanjut ➜'}</button></div>`;
  document.body.appendChild(fb);
  const next = fb.querySelector('[data-act="next"]');
  next.addEventListener('click', () => { SFX.tap(); fb.remove(); if (last) finish(); else { Q.i++; go('quiz'); } });
  setTimeout(() => next.focus({ preventScroll: true }), 50);
}
const optionPlain = (label) => String(label).replace(/^frac:/, '');

function confirmQuit() {
  SFX.tap();
  $modal.innerHTML = `<div class="box" role="dialog" aria-modal="true" aria-labelledby="mq"><div style="font-size:48px" class="emo">🦉</div><h2 id="mq">Berhenti dulu?</h2><p>Jawabanmu di kuis ini tidak akan disimpan.</p>
    <div class="row-btns"><button class="btn white" data-m="no">Lanjut main</button><button class="btn orange" data-m="yes">Berhenti</button></div></div>`;
  $modal.hidden = false;
  const close = () => { $modal.hidden = true; $modal.innerHTML = ''; };
  $modal.querySelector('[data-m="no"]').addEventListener('click', () => { SFX.tap(); close(); });
  $modal.querySelector('[data-m="yes"]').addEventListener('click', () => { SFX.tap(); close(); go('topics'); });
  $modal.querySelector('[data-m="no"]').focus();
}

// ── hasil ──
const starsFor = (score) => (score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0);
function finish() {
  const st = starsFor(Q.score);
  if (!Q.topicId.startsWith('mix:') && st > starsOf(Q.topicId)) { store.stars[Q.topicId] = st; save(); }
  if (Q.topicId.startsWith('mix:') && st > (store.stars[Q.topicId] || 0)) { store.stars[Q.topicId] = st; save(); }
  Q.stars = st; go('result');
  SFX.done(); if (st >= 2) setTimeout(() => confetti(80), 300);
  for (let i = 0; i < st; i++) setTimeout(() => SFX.star(i), 450 + i * 350);
}
function result() {
  const st = Q.stars, wrong = Q.answers.filter((a) => !a.ok);
  const title = st === 3 ? 'Luar biasa!' : st === 2 ? 'Bagus sekali!' : st === 1 ? 'Kamu bisa!' : 'Ayo berlatih lagi!';
  const msg = st === 3 ? 'Kamu menguasai topik ini.' : st >= 1 ? 'Sedikit lagi kamu dapat tiga bintang.' : 'Pelajari penjelasannya, lalu coba lagi, ya.';
  $app.innerHTML = `<section class="screen">
    <div class="result">
      <div class="emo" style="font-size:56px">${st === 3 ? '🏆' : st >= 1 ? '🦉' : '🌱'}</div>
      <h1>${title}</h1>
      <div class="bigstars">${[0, 1, 2].map((i) => `<span class="${i < st ? '' : 'off'}">⭐</span>`).join('')}</div>
      <p class="score">${Q.score} dari ${QUIZ_LEN} jawaban benar</p>
      <p style="font-weight:700;margin:0">${msg}</p>
      <p style="font-weight:700;color:var(--ink2);margin:6px 0 0">${esc(topicTitle(Q.topicId))}</p>
      <div class="row-btns"><button class="btn blue" data-act="again">${emo('🔁')} Main lagi</button><button class="btn white" data-act="topics">${emo('📚')} Pilih topik lain</button></div>
      ${wrong.length ? `<div class="review"><h3>Ayo lihat lagi soal yang belum tepat</h3>${wrong.map((a) => {
        const ansOpt = a.item.opts.find((o) => String(o.value) === String(a.item.ans));
        const lab = (o) => (o.html ? optionHtml(o.label) : textHtml(optionPlain(o.label)));
        return `<div class="rv"><b>${textHtml(a.item.q)}</b><span class="x">${lab(a.pick)}</span><span class="a">✓ ${lab(ansOpt)}</span><div style="font-weight:600;margin-top:4px">${textHtml(a.item.explain)}</div></div>`;
      }).join('')}</div>` : ''}
    </div>
  </section>`;
  $app.querySelector('[data-act="again"]').addEventListener('click', () => { SFX.tap(); startQuiz(Q.topicId); });
  $app.querySelector('[data-act="topics"]').addEventListener('click', () => { SFX.tap(); go('topics'); });
}

// Kontak pengelola untuk laporan soal keliru.
const CONTACT = 'rannaaa1408@gmail.com';

// ── disclaimer (tampil pada kunjungan pertama di setiap perangkat) ──
function disclaimer() {
  const first = !store.agreed;
  const sec = (icon, title, items) => `<section class="dc-sec"><h2>${emo(icon)} ${title}</h2><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul></section>`;
  $app.innerHTML = `<section class="screen">
    ${first ? '' : '<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Kembali">⬅️</button><span class="grow"></span></div>'}
    <div class="info disclaimer">
      <div class="dc-head"><span class="emo" aria-hidden="true">📜</span><div><h1>Disclaimer</h1><p>Untuk orang tua dan guru. Mohon dibaca sebelum anak mulai bermain.</p></div></div>
      <div class="dc-sum"><b>Intinya:</b> Kuis Hitung Ceria adalah alat latihan matematika gratis untuk anak SD kelas 1–6. Kuis ini bukan alat penilaian resmi, bukan produk pemerintah, dan tidak mengumpulkan data pribadi anak.</div>
      ${sec('🎯', 'Hanya untuk latihan', [
        'Bintang dan skor hanya menunjukkan hasil latihan saat itu.',
        'Hasil kuis <b>bukan nilai rapor</b> dan tidak menggantikan penilaian guru di sekolah.',
        'Jika anak sering salah di satu topik, sebaiknya dibahas bersama guru atau orang tua.',
      ])}
      ${sec('📚', 'Tentang materi soal', [
        'Materi mengacu pada Capaian Pembelajaran Matematika Kurikulum Merdeka (Kepka BSKAP No. 046/H/KR/2025).',
        'Pembagian topik per kelas dan semester disusun oleh pembuat kuis. <b>Urutannya bisa berbeda</b> dengan buku atau jadwal di sekolah anak.',
        'Empat topik kelas 6 bertanda <b>Pengayaan</b> berada di luar capaian pembelajaran. Topik itu tambahan dan boleh dilewati.',
        'Kuis ini <b>bukan produk resmi</b> dan tidak berafiliasi dengan Kementerian Pendidikan Dasar dan Menengah.',
      ])}
      ${sec('🔍', 'Soal dibuat oleh program', [
        'Soal dibuat acak oleh komputer, sehingga soalnya berbeda setiap kali bermain.',
        'Semua kunci jawaban sudah diperiksa ulang secara otomatis, tetapi <b>kekeliruan tetap mungkin terjadi</b>.',
        `Jika menemukan soal atau jawaban yang keliru, mohon laporkan lewat email ke <a href="mailto:${CONTACT}?subject=${encodeURIComponent('Laporan soal Kuis Hitung Ceria')}">${CONTACT}</a>. Sebutkan kelas, topik, dan isi soalnya.`,
      ])}
      ${sec('🔒', 'Privasi dan data', [
        'Tidak perlu akun, tidak ada iklan, dan tidak ada pembelian.',
        'Kuis <b>tidak meminta</b> nama, foto, sekolah, atau data pribadi lain.',
        'Yang disimpan hanya bintang, pengaturan bunyi, dan tanda bahwa disclaimer sudah disetujui. Semuanya disimpan di peramban perangkat ini saja dan tidak dikirim ke mana pun.',
        'Bintang bisa dihapus lewat tombol <b>Hapus semua bintang</b> di halaman guru dan orang tua. Semua data bisa dihapus dengan menghapus data situs di pengaturan peramban.',
        'Huruf dan emoji dimuat dari layanan Google Fonts. Saat halaman dibuka, Google dapat melihat alamat internet (IP) perangkat seperti saat membuka situs pada umumnya.',
      ])}
      ${sec('👨‍👩‍👧', 'Pendampingan dan waktu layar', [
        'Anak sebaiknya bermain dengan <b>didampingi</b> orang tua atau guru, terutama anak kelas 1–2.',
        'Atur waktu bermain sesuai usia anak, dan selingi dengan istirahat.',
      ])}
      ${sec('⚖️', 'Tanggung jawab', [
        'Kuis ini diberikan apa adanya, tanpa jaminan bebas dari kesalahan.',
        'Pembuat kuis tidak bertanggung jawab atas keputusan yang diambil hanya berdasarkan hasil kuis ini.',
      ])}
      ${first ? `<label class="dc-check"><input type="checkbox" id="dc-ok"> Saya orang tua atau guru, dan saya sudah membaca serta memahami disclaimer ini.</label>
        <div class="row-btns"><button class="btn" data-act="agree" disabled>${emo('✅')} Setuju dan mulai bermain</button></div>
        <p class="dc-note">Halaman ini hanya muncul sekali di setiap perangkat. Anda bisa membacanya lagi lewat tautan Disclaimer di beranda.</p>`
        : `<div class="row-btns"><button class="btn blue" data-act="back2">${emo('🏠')} Kembali ke beranda</button></div>`}
    </div>
  </section>`;
  const home_ = () => { SFX.tap(); go('home'); };
  const ok = $app.querySelector('#dc-ok'), agree = $app.querySelector('[data-act="agree"]');
  ok?.addEventListener('change', () => { agree.disabled = !ok.checked; });
  agree?.addEventListener('click', () => { if (!ok.checked) return; store.agreed = true; save(); home_(); });
  $app.querySelector('[data-act="back"]')?.addEventListener('click', home_);
  $app.querySelector('[data-act="back2"]')?.addEventListener('click', home_);
}

// ── info guru/orang tua ──
function info() {
  const rows = (k) => TOPICS.filter((t) => t.kelas === k).map((t) => `<tr><td>${t.semester}</td><td><b>${esc(topicName(t))}</b></td><td>${esc(t.tujuan.replace(/s\.d\./g, 'sampai'))}</td></tr>`).join('');
  $app.innerHTML = `<section class="screen">
    <div class="topbar"><button class="iconbtn" data-act="back" aria-label="Kembali">⬅️</button><span class="grow"></span></div>
    <div class="info">
      <h1>${emo('📘')} Untuk guru dan orang tua</h1>
      <p>Kuis ini memuat 97 topik matematika kelas 1–6 yang disusun dari Capaian Pembelajaran Matematika Fase A, B, dan C (Kepka BSKAP No. 046/H/KR/2025). Kelas 1–2 mengikuti Fase A, kelas 3–4 Fase B, dan kelas 5–6 Fase C. Empat topik kelas 6 bertanda Pengayaan (bilangan bulat, skala peta, volume kubus dan balok, serta rata-rata, median, dan modus) berada di luar CP dan boleh dilewati.</p>
      <ul>
        <li>Setiap kuis berisi 10 soal: 3 soal mudah, 4 soal sedang, dan 3 soal menantang.</li>
        <li>Soal dibuat acak setiap kali bermain, jadi anak dapat berlatih berulang kali.</li>
        <li>Pilihan jawaban yang salah disusun dari kesalahan yang sering terjadi, misalnya lupa menyimpan saat menjumlah atau tertukar puluhan dan satuan.</li>
        <li>Bintang: 3 bintang untuk 9–10 jawaban benar, 2 bintang untuk 7–8, dan 1 bintang untuk 5–6.</li>
        <li>Tidak ada akun, iklan, atau pengumpulan data. Bintang hanya disimpan di perangkat ini.</li>
        <li>Menemukan soal yang keliru? Kirim email ke <a href="mailto:${CONTACT}?subject=${encodeURIComponent('Laporan soal Kuis Hitung Ceria')}">${CONTACT}</a>.</li>
      </ul>
      ${[1, 2, 3, 4, 5, 6].map((k) => `<h2>Kelas ${k}</h2><table><tr><th>Smt</th><th>Topik</th><th>Tujuan pembelajaran</th></tr>${rows(k)}</table>`).join('')}
      <div class="row-btns"><button class="btn white" data-act="reset">${emo('🧹')} Hapus semua bintang</button></div>
    </div>
  </section>`;
  $app.querySelector('[data-act="back"]').addEventListener('click', () => { SFX.tap(); go('home'); });
  $app.querySelector('[data-act="reset"]').addEventListener('click', () => {
    $modal.innerHTML = `<div class="box" role="dialog" aria-modal="true"><h2>Hapus semua bintang?</h2><p>Semua bintang yang sudah dikumpulkan di perangkat ini akan hilang.</p><div class="row-btns"><button class="btn white" data-m="no">Batal</button><button class="btn orange" data-m="yes">Hapus</button></div></div>`;
    $modal.hidden = false;
    const close = () => { $modal.hidden = true; $modal.innerHTML = ''; };
    $modal.querySelector('[data-m="no"]').addEventListener('click', close);
    $modal.querySelector('[data-m="yes"]').addEventListener('click', () => { store.stars = {}; save(); close(); go('home'); });
  });
}

// ── konfeti ──
function confetti(n) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.getElementById('confetti'); const C = ['#ff5f97', '#ffc83d', '#4d8dff', '#22b573', '#8b5cf6', '#ff9f1c'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`; p.style.background = C[i % C.length];
    p.style.animationDuration = `${1.6 + Math.random() * 1.4}s`; p.style.animationDelay = `${Math.random() * 0.3}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`; if (i % 3 === 0) p.style.borderRadius = '50%';
    box.appendChild(p); setTimeout(() => p.remove(), 3400);
  }
}

// ── papan ketik: 1–4 atau A–D untuk menjawab, Enter untuk lanjut ──
document.addEventListener('keydown', (e) => {
  if (!$modal.hidden) { if (e.key === 'Escape') $modal.querySelector('[data-m="no"]')?.click(); return; }
  if (state.screen !== 'quiz') return;
  const fb = document.querySelector('.feedback [data-act="next"]');
  if (fb && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fb.click(); return; }
  const idx = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
  const btn = $app.querySelectorAll('.ans')[idx];
  if (idx >= 0 && btn && !btn.disabled) btn.click();
});

render();
