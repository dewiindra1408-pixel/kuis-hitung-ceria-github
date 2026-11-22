# Kuis Hitung Ceria

Kuis matematika interaktif untuk siswa SD kelas 1–6. Gratis, berbahasa Indonesia, dan berbasis Kurikulum Merdeka.

**Main sekarang:** `https://NAMA-PENGGUNA.github.io/kuis-hitung-ceria/`
*(ganti dengan alamat situs Anda setelah GitHub Pages aktif; lihat [TUTORIAL.md](TUTORIAL.md))*

## Isi kuis

- **97 topik** untuk kelas 1–6, dibagi per semester, ditambah Kuis Campur di setiap semester.
- Disusun dari Capaian Pembelajaran Matematika Fase A, B, dan C (Kepka BSKAP No. 046/H/KR/2025).
- Kelas 6 memuat 4 topik **Pengayaan** di luar CP: bilangan bulat, skala peta, volume kubus dan balok, serta rata-rata, median, dan modus.
- Setiap kuis berisi 10 soal pilihan ganda: 3 mudah, 4 sedang, 3 menantang. Soal dibuat acak setiap kali bermain.
- Kelas 1 mendapat 3 pilihan jawaban; kelas 2–6 mendapat 4 pilihan.
- Setelah menjawab, anak melihat jawaban yang benar dan penjelasan singkat. Ada tombol petunjuk 💡.
- Bintang 1–3 di akhir kuis. Bintang disimpan di perangkat masing-masing.
- Tanpa akun, tanpa iklan, tanpa pengumpulan data. Bunyi efek lembut bisa dimatikan.
- Halaman disclaimer untuk orang tua dan guru tampil pada kunjungan pertama di setiap perangkat. Tombol mulai baru aktif setelah kotak persetujuan dicentang. Disclaimer bisa dibuka lagi dari tautan **Disclaimer** di beranda. Teksnya ada di fungsi `disclaimer()` dalam `js/app.js`.

Daftar lengkap topik dan tujuan pembelajarannya ada di [docs/DAFTAR_TOPIK.md](docs/DAFTAR_TOPIK.md).

## Cara memasang di GitHub Pages

Ikuti [TUTORIAL.md](TUTORIAL.md). Singkatnya:

1. Buat repositori **publik** baru, misalnya `kuis-hitung-ceria`.
2. Unggah semua isi folder ini sehingga `index.html` berada di halaman utama repositori.
3. Buka **Settings → Pages**, pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu beberapa menit, lalu buka `https://NAMA-PENGGUNA.github.io/kuis-hitung-ceria/`.

## Menjalankan di komputer sendiri

Kuis memakai modul JavaScript, jadi harus dibuka lewat server lokal, bukan dengan mengklik dua kali `index.html`.

```bash
python3 -m http.server 8765
# lalu buka http://localhost:8765/
```

## Struktur berkas

| Berkas | Isi |
| --- | --- |
| `index.html` | Halaman utama |
| `favicon.svg` | Ikon tab peramban |
| `css/style.css` | Tampilan |
| `js/app.js` | Layar beranda, daftar topik, kuis, hasil, info guru, bunyi, penyimpanan |
| `js/curriculum.js`, `js/curriculum46.js` | Data 97 topik (kelas 1–3 dan kelas 4–6) |
| `js/bank.js`, `js/bank46.js` | Generator soal kelas 1–3 dan kelas 4–6 |
| `js/art.js`, `js/art46.js` | Gambar soal (SVG dan emoji) |
| `js/rng.js`, `js/words.js` | Pengacak ber-seed dan penulisan bilangan dengan kata |
| `tests/verify.mjs` | Pemeriksa kunci jawaban dan aturan bahasa |
| `tests/e2e.py`, `tests/e2e_kelas46.py`, `tests/gallery.*` | Uji tampilan dengan Playwright (opsional) |
| `.github/workflows/verifikasi-soal.yml` | Menjalankan pemeriksa soal otomatis di GitHub Actions |
| `.nojekyll` | Memberi tahu GitHub Pages agar menyajikan berkas apa adanya |
| `docs/DAFTAR_TOPIK.md` | Daftar topik dan tujuan pembelajaran |

## Pengujian

```bash
node tests/verify.mjs 300
```

Perintah ini membuat 300 soal per tingkat untuk setiap topik (87.300 soal), lalu menghitung ulang kuncinya secara terpisah. Perintah ini juga memeriksa bahwa tepat satu pilihan benar, jumlah pilihan sesuai kelas, bilangan tidak melebihi batas kelas, dan tanda baca kalimat benar. Hasil terakhir: 0 kegagalan.

Uji tampilan (opsional) memerlukan Python, Playwright, dan server lokal di port 8765:

```bash
pip install playwright && playwright install chromium
python3 -m http.server 8765 &
python3 tests/e2e_kelas46.py
```

## Keterbatasan

- Belum diuji di iPhone/Safari sungguhan.
- Fon dan emoji dimuat dari Google Fonts. Tanpa internet, perangkat memakai fon dan emoji bawaannya.
- Bintang tersimpan di peramban masing-masing. Menghapus data peramban juga menghapus bintang.
- Kuis ini untuk latihan, bukan untuk penilaian resmi.

## Kontak

Menemukan soal atau jawaban yang keliru? Kirim email ke **rannaaa1408@gmail.com** dengan menyebutkan kelas, topik, dan isi soalnya.

## Lisensi

Kode dirilis dengan lisensi MIT (lihat [LICENSE](LICENSE)). Ganti `[NAMA ANDA]` di berkas LICENSE dengan nama Anda atau nama sekolah.
