// RNG ber-seed (mulberry32) supaya soal dapat direproduksi dan diuji.
export function makeRng(seed = Date.now()) {
  let a = seed >>> 0;
  const next = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {
    const b = arr.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  };
  const sample = (arr, k) => shuffle(arr).slice(0, k);
  const chance = (p) => next() < p;
  return { next, int, pick, shuffle, sample, chance, seed };
}
