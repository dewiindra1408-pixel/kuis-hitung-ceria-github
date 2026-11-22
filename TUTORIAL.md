# Tutorial: Memasang Kuis Hitung Ceria di GitHub Pages

Tutorial ini memasang kuis di GitHub Pages: hosting gratis yang membuat kuis bisa dimainkan kapan saja lewat satu tautan tetap, misalnya:

```
https://NAMA-PENGGUNA.github.io/kuis-hitung-ceria/
```

Anda tidak perlu memasang aplikasi apa pun. Semua langkah dilakukan lewat peramban (Chrome, Edge, Firefox, atau Safari). Waktu yang diperlukan sekitar 15 menit.

---

## Bagian 1 — Persiapan

1. **Ekstrak paket.** Klik kanan berkas `kuis-hitung-ceria-github.zip`, lalu pilih **Extract All** (Windows) atau klik dua kali (macOS). Anda akan mendapat folder `kuis-hitung-ceria-github`.
2. **Periksa isinya.** Di dalam folder itu harus ada `index.html`, `favicon.svg`, `README.md`, `TUTORIAL.md`, `LICENSE`, `package.json`, serta folder `css`, `js`, `tests`, dan `docs`.
3. **Buat akun GitHub** di [github.com/signup](https://github.com/signup) jika belum punya. Ingat nama pengguna Anda, karena nama itu akan menjadi bagian alamat situs.

> **Opsional:** buka berkas `LICENSE` dengan Notepad atau TextEdit, lalu ganti `[NAMA ANDA]` dengan nama Anda atau nama sekolah.

---

## Bagian 2 — Membuat repositori

Repositori adalah "folder online" tempat menyimpan berkas kuis.

1. Masuk ke GitHub. Klik tombol **+** di kanan atas, lalu pilih **New repository**.
2. Isi **Repository name** dengan `kuis-hitung-ceria`.
   Nama ini akan muncul di alamat situs. Pakai huruf kecil dan tanda hubung, tanpa spasi.
3. **Description** boleh diisi, misalnya `Kuis matematika SD kelas 1–6`.
4. Pilih **Public**.
   GitHub Pages gratis hanya untuk repositori publik. Repositori privat memerlukan paket berbayar.
5. **Jangan** centang *Add a README file*. Paket ini sudah punya README.
6. Klik **Create repository**.

---

## Bagian 3 — Mengunggah berkas

1. Di halaman repositori yang masih kosong, klik tautan **uploading an existing file**.
   Pada repositori yang sudah berisi, gunakan tombol **Add file → Upload files**.
2. Buka folder `kuis-hitung-ceria-github` di komputer Anda.
3. **Pilih semua isi folder** dengan Ctrl + A (Windows) atau Cmd + A (macOS), lalu seret ke kotak unggah di GitHub.

   ⚠️ **Penting:** seret **isi** folder, bukan folder `kuis-hitung-ceria-github` itu sendiri. Setelah diunggah, `index.html` harus terlihat langsung di halaman utama repositori, bukan di dalam subfolder.

4. Tunggu sampai semua berkas selesai diunggah dan tercantum di bawah kotak unggah.
5. Di bagian bawah, isi pesan, misalnya `Unggah Kuis Hitung Ceria`, lalu klik **Commit changes**.

**Tentang berkas tersembunyi.** Paket ini memuat tiga berkas yang namanya diawali titik: `.nojekyll`, `.gitignore`, dan folder `.github`. Di macOS dan beberapa pengaturan Windows, berkas ini tidak terlihat sehingga mungkin tidak ikut terseret. **Kuis tetap berjalan tanpa ketiganya.** Jika ingin menyertakannya:

- Windows: di File Explorer, buka **View → Show → Hidden items**.
- macOS: di Finder, tekan **Cmd + Shift + .** (titik).

---

## Bagian 4 — Menyalakan GitHub Pages

1. Di repositori, klik tab **Settings**.
   Jika tidak terlihat, klik tombol **⋯** di deretan tab, lalu pilih **Settings**.
2. Di menu kiri, pada bagian *Code, planning, and automation*, klik **Pages**.
3. Pada **Build and deployment**, di **Source**, pilih **Deploy from a branch**.
4. Pada **Branch**, pilih `main`. Folder di sebelahnya biarkan `/ (root)`.
5. Klik **Save**.
6. Tunggu 1–5 menit, lalu muat ulang halaman **Settings → Pages**. Di bagian atas akan muncul tulisan seperti **Your site is live at** beserta alamatnya dan tombol **Visit site**.

Alamat situs Anda:

```
https://NAMA-PENGGUNA.github.io/kuis-hitung-ceria/
```

Ganti `NAMA-PENGGUNA` dengan nama pengguna GitHub Anda. Jika nama repositori berbeda, ganti juga `kuis-hitung-ceria`.

> **Tips:** perkembangan proses publikasi bisa dilihat di tab **Actions**. Tanda centang hijau berarti situs sudah terbit.

---

## Bagian 5 — Mencoba dan membagikan

1. Buka alamat situs di ponsel dan laptop. Coba satu kuis sampai selesai.
2. Bagikan tautannya ke murid atau orang tua, misalnya lewat WhatsApp atau grup kelas.
3. **Agar mudah dibuka seperti aplikasi:**
   - Android (Chrome): menu **⋮ → Tambahkan ke layar utama**.
   - iPhone/iPad (Safari): tombol **Bagikan → Tambah ke Layar Utama**.
4. **Pasang tautan di README (opsional):** buka `README.md` di GitHub, klik ikon pensil, ganti `NAMA-PENGGUNA` dengan nama pengguna Anda, lalu klik **Commit changes**.

---

## Bagian 6 — Memperbarui kuis di kemudian hari

1. Siapkan berkas baru dengan nama dan lokasi folder yang sama, misalnya `js/bank46.js`.
2. Di repositori, buka folder tujuan, misalnya `js`.
3. Klik **Add file → Upload files**, seret berkas baru, lalu **Commit changes**. Berkas lama otomatis tertimpa.
4. Tunggu 1–5 menit. Jika perubahan belum terlihat, muat ulang halaman kuis dengan Ctrl + Shift + R (Windows) atau Cmd + Shift + R (macOS).

---

## Bagian 7 — Jika ada masalah

| Masalah | Penyebab yang mungkin | Cara mengatasi |
| --- | --- | --- |
| Muncul halaman **404** | `index.html` tidak berada di halaman utama repositori, atau situs belum selesai terbit | Pastikan `index.html` terlihat langsung di halaman utama repositori. Jika ada di subfolder, hapus lalu unggah ulang isinya. Tunggu beberapa menit. |
| Menu **Pages** tidak bisa dipakai | Repositori masih privat | Buka **Settings → General → Danger Zone → Change visibility**, lalu ubah ke **Public**. |
| Halaman kosong saat `index.html` diklik dua kali di komputer | Peramban memblokir modul JavaScript dari berkas lokal | Ini normal. Buka lewat alamat GitHub Pages, atau jalankan server lokal (lihat README). |
| Halaman kosong di GitHub Pages | Ada berkas di folder `js` atau `css` yang tidak ikut terunggah | Bandingkan isi folder `js` di GitHub dengan paket. Harus ada 11 berkas `.js`. |
| Tampilan berubah setelah diperbarui, tetapi masih versi lama | Peramban menyimpan versi lama | Tekan Ctrl + Shift + R atau Cmd + Shift + R. |
| Bintang hilang | Bintang disimpan di peramban, bukan di server | Bintang hilang jika data peramban dihapus atau perangkat berganti. Ini disengaja agar tidak ada data anak yang dikumpulkan. |
| Tab **Actions** menunjukkan tanda silang merah di "Verifikasi soal" | Pemeriksa soal menemukan kunci jawaban yang salah setelah berkas diubah | Situs tetap berjalan. Klik tanda silang itu untuk melihat soal yang bermasalah. |

---

## Lampiran — Cara lain: memakai Git di komputer

Cara ini untuk Anda yang sudah memasang [Git](https://git-scm.com/downloads). Buka Terminal atau Command Prompt di dalam folder `kuis-hitung-ceria-github`, lalu jalankan:

```bash
git init
git add .
git commit -m "Unggah Kuis Hitung Ceria"
git branch -M main
git remote add origin https://github.com/NAMA-PENGGUNA/kuis-hitung-ceria.git
git push -u origin main
```

Cara ini otomatis menyertakan berkas tersembunyi. Setelah itu, lanjutkan ke **Bagian 4** untuk menyalakan GitHub Pages.

Untuk memperbarui di kemudian hari:

```bash
git add .
git commit -m "Perbarui soal"
git push
```

---

Selamat! Kuis Hitung Ceria sekarang bisa dimainkan siapa saja, kapan saja, lewat satu tautan tetap. 🎉
