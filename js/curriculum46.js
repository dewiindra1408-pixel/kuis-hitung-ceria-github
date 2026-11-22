// Data kurikulum Kelas 4–6: 51 topik (47 sesuai CP + 4 pengayaan), disetujui 22 November 2026.
// Acuan: Kepka BSKAP 046/H/KR/2025 (CP Matematika Fase B dan C) + urutan bab buku siswa Kemendikbudristek 2022
// kelas IV (Hobri dkk.), V (Fitrianawati dkk.), VI (Susanto dkk.). Pembagian semester adalah rancangan tim.
// Topik bertanda `pengayaan: true` berada di luar CP 046 dan ditambahkan atas permintaan pengguna.

const S4 = 'CP-B; Hobri dkk. (2022) Matematika Kelas IV';
const S5 = 'CP-C; Fitrianawati dkk. (2022) Matematika Kelas V';
const S6 = 'CP-C; Susanto dkk. (2022) Matematika Kelas VI';
const t = (id, elemen, topik, tujuan, prasyarat, sumber, extra = {}) => {
  const [kelas, semester] = id.split('.').map(Number);
  return { id, kelas, semester, elemen, topik, subtopik: '', tujuan, konsep: '', prasyarat, indikator: tujuan, tingkat: kelas === 4 ? 'Lanjutan' : 'Mahir', sumber, learn: [], ...extra };
};

export const TOPICS_46 = [
  // ───────── KELAS 4 · SEMESTER 1 ─────────
  t('4.1.1', 'bil', 'Bilangan sampai 10.000', 'Membaca, menulis, dan menentukan nilai tempat bilangan sampai 10.000', ['3.1.1'], `${S4} bab 1A–B`),
  t('4.1.2', 'bil', 'Membandingkan dan Mengurutkan sampai 10.000', 'Membandingkan dengan tanda >, <, = dan mengurutkan bilangan sampai 10.000', ['4.1.1'], `${S4} bab 1C`),
  t('4.1.3', 'bil', 'Menyusun dan Mengurai sampai 10.000', 'Menyatakan bilangan sebagai jumlah ribuan, ratusan, puluhan, dan satuan, dan sebaliknya', ['4.1.1'], `${S4} bab 1D`),
  t('4.1.4', 'bil', 'Penjumlahan dan Pengurangan sampai 1.000', 'Menyelesaikan soal cerita penjumlahan dan pengurangan satu dan dua langkah', ['3.1.2', '3.1.3'], `${S4} bab 1E–F`),
  t('4.1.5', 'bil', 'Perkalian dan Pembagian sampai 100', 'Menyelesaikan soal cerita dan memakai hubungan perkalian dengan pembagian', ['3.1.6', '3.1.7'], `${S4} bab 1G–H`),
  t('4.1.6', 'bil', 'Faktor dan Kelipatan', 'Menentukan faktor dan kelipatan bilangan sampai 100', ['4.1.5'], `${S4} bab 1I`),
  t('4.1.7', 'alj', 'Pola Gambar dan Pola Bilangan', 'Menemukan aturan pola dan melanjutkan pola naik atau turun sampai 100', ['3.1.5'], `${S4} bab 3`),
  t('4.1.8', 'alj', 'Nilai yang Belum Diketahui', 'Mencari bilangan yang hilang dengan sifat pertukaran dan pengelompokan', ['3.1.4'], 'CP-B Aljabar'),
  // ───────── KELAS 4 · SEMESTER 2 ─────────
  t('4.2.1', 'bil', 'Membandingkan Pecahan', 'Membandingkan dan mengurutkan pecahan berpembilang satu dan berpenyebut sama', ['3.2.2'], `${S4} bab 2A–B`),
  t('4.2.2', 'bil', 'Pecahan Senilai', 'Menentukan pecahan senilai dengan gambar dan perkalian', ['4.2.1'], `${S4} bab 2C`),
  t('4.2.3', 'bil', 'Desimal', 'Membaca dan menulis desimal persepuluhan dan perseratusan serta hubungannya dengan pecahan', ['4.2.2'], `${S4} bab 2D`),
  t('4.2.4', 'bil', 'Persen', 'Menyatakan pecahan perseratus dan desimal sebagai persen', ['4.2.3'], `${S4} bab 2E`),
  t('4.2.5', 'ukur', 'Luas dengan Petak Satuan', 'Mengukur dan menaksir luas dengan petak satuan', ['3.2.5'], `${S4} bab 4A`),
  t('4.2.6', 'ukur', 'Volume dengan Kubus Satuan', 'Mengukur volume dengan menghitung kubus satuan', ['3.2.5'], `${S4} bab 4B`),
  t('4.2.7', 'geo', 'Ciri dan Susunan Bangun Datar', 'Mengenali sisi sejajar, sisi sama panjang, dan sudut siku-siku serta menyusun bangun dengan lebih dari satu cara', ['3.2.6', '3.2.7'], `${S4} bab 5`),
  t('4.2.8', 'data', 'Piktogram dan Diagram Batang', 'Membaca, membandingkan, dan menafsirkan data pada piktogram dan diagram batang', ['3.2.8'], `${S4} bab 6`),
  // ───────── KELAS 5 · SEMESTER 1 ─────────
  t('5.1.1', 'bil', 'Bilangan sampai 100.000', 'Membaca, menulis, dan menentukan nilai tempat bilangan sampai 100.000', ['4.1.1'], `${S5} bab 1A`),
  t('5.1.2', 'bil', 'Membandingkan dan Mengurai sampai 100.000', 'Membandingkan, mengurutkan, menyusun, dan mengurai bilangan sampai 100.000', ['5.1.1'], `${S5} bab 1B–C`),
  t('5.1.3', 'bil', 'Operasi Hitung sampai 100.000', 'Menjumlah, mengurang, mengali, dan membagi bilangan cacah sampai 100.000', ['4.1.4', '4.1.5'], `${S5} bab 1D`),
  t('5.1.4', 'bil', 'Kelipatan, Faktor, dan Bilangan Prima', 'Menentukan kelipatan persekutuan, faktor persekutuan, dan bilangan prima', ['4.1.6'], `${S5} bab 2A–D`),
  t('5.1.5', 'bil', 'KPK dan FPB', 'Menentukan KPK dan FPB serta menyelesaikan soal ceritanya', ['5.1.4'], `${S5} bab 2E`),
  t('5.1.6', 'bil', 'Membandingkan Pecahan Campuran', 'Membandingkan dan mengurutkan pecahan, termasuk pecahan campuran', ['4.2.2'], `${S5} bab 3A`),
  t('5.1.7', 'bil', 'Penjumlahan dan Pengurangan Pecahan', 'Menjumlah dan mengurang pecahan berpenyebut sama dan berbeda', ['5.1.6', '5.1.5'], `${S5} bab 3B–C`),
  t('5.1.8', 'alj', 'Kalimat Matematika', 'Mencari nilai yang belum diketahui dengan keempat operasi sampai 1.000', ['4.1.8'], 'CP-C Aljabar'),
  // ───────── KELAS 5 · SEMESTER 2 ─────────
  t('5.2.1', 'ukur', 'Keliling Bangun Datar', 'Menghitung keliling segitiga, segiempat, segi banyak, dan bangun gabungan', ['4.2.7'], `${S5} bab 4`),
  t('5.2.2', 'ukur', 'Luas Bangun Datar', 'Menghitung luas persegi, persegi panjang, segitiga, dan bangun gabungan', ['4.2.5', '5.2.1'], `${S5} bab 5`),
  t('5.2.3', 'ukur', 'Sudut', 'Mengenali sudut lancip, siku-siku, dan tumpul serta membaca besar sudut pada busur derajat', ['4.2.7'], `${S5} bab 6`),
  t('5.2.4', 'geo', 'Membandingkan Ciri Bangun Datar', 'Membedakan jenis segitiga dan segiempat dari sisi dan sudutnya', ['5.2.3'], `${S5} bab 7`),
  t('5.2.5', 'ukur', 'Durasi Waktu', 'Menghitung lama kegiatan dari jam mulai dan jam selesai', ['2.1.7'], 'CP-C Pengukuran'),
  t('5.2.6', 'bil', 'Masalah Uang', 'Menyelesaikan soal belanja, kembalian, dan menabung', ['5.1.3'], 'CP-C Bilangan'),
  t('5.2.7', 'data', 'Data dan Tabel Frekuensi', 'Menyajikan dan menganalisis data dalam tabel frekuensi, piktogram, dan diagram batang', ['4.2.8'], `${S5} bab 8`),
  t('5.2.8', 'bil', 'Bilangan sampai 1.000.000', 'Membaca, menulis, menentukan nilai tempat, membandingkan, menyusun, dan mengurai bilangan sampai 1.000.000', ['5.1.2'], `${S5} bab 9`),
  // ───────── KELAS 6 · SEMESTER 1 ─────────
  t('6.1.1', 'bil', 'Perkalian Pecahan', 'Mengalikan pecahan dengan bilangan asli dan bilangan asli dengan pecahan', ['5.1.7'], `${S6} bab 1A`),
  t('6.1.2', 'bil', 'Pembagian Pecahan', 'Membagi pecahan dengan bilangan asli dan bilangan asli dengan pecahan', ['6.1.1'], `${S6} bab 1B`),
  t('6.1.3', 'bil', 'Desimal', 'Mengubah pecahan ke desimal serta membandingkan dan mengurutkan desimal satu angka di belakang koma', ['4.2.3'], `${S6} bab 1C`),
  t('6.1.4', 'bil', 'Mengubah Bentuk Pecahan', 'Mengubah pecahan biasa, pecahan campuran, desimal, dan persen', ['6.1.3', '4.2.4'], 'CP-C Bilangan'),
  t('6.1.5', 'alj', 'Pola Perkalian dan Pembagian', 'Melanjutkan pola bilangan yang dikali atau dibagi bilangan tetap', ['4.1.7'], 'CP-C Aljabar'),
  t('6.1.6', 'alj', 'Rasio', 'Menyatakan perbandingan dua banyak benda dan menentukan rasio senilai', ['4.2.2'], `${S6} bab 2A–B`),
  t('6.1.7', 'alj', 'Rasio Satuan dan Proporsi', 'Memakai rasio satuan untuk soal harga per buah, resep, dan jarak per waktu', ['6.1.6'], `${S6} bab 2B–C`),
  t('6.1.8', 'bil', 'Pengayaan: Bilangan Bulat', 'Membandingkan bilangan bulat dan menjumlah pada garis bilangan', ['5.1.3'], 'Pengayaan (di luar CP 046)', { pengayaan: true }),
  t('6.1.9', 'ukur', 'Pengayaan: Skala Peta', 'Menghitung jarak sebenarnya dari skala peta', ['6.1.7'], 'Pengayaan (di luar CP 046)', { pengayaan: true }),
  // ───────── KELAS 6 · SEMESTER 2 ─────────
  t('6.2.1', 'geo', 'Menyusun dan Mengurai Kubus dan Balok', 'Mengenali jaring-jaring kubus dan menghitung kubus penyusun bangun gabungan', ['4.2.6'], `${S6} bab 3A`),
  t('6.2.2', 'geo', 'Tampak Depan, Atas, dan Samping', 'Menentukan tampak susunan kubus dari depan, atas, dan samping', ['6.2.1'], `${S6} bab 3B`),
  t('6.2.3', 'geo', 'Ciri Bangun Ruang dan Bangun Datar', 'Membandingkan sisi, rusuk, dan titik sudut bangun ruang dengan bangun datar', ['6.2.1', '5.2.4'], 'CP-C Geometri'),
  t('6.2.4', 'geo', 'Lokasi pada Peta Berpetak', 'Menentukan dan menuliskan letak benda pada peta berpetak', ['2.1.5'], `${S6} bab 3C`),
  t('6.2.5', 'ukur', 'Sudut Dua Garis Berpotongan', 'Menentukan besar sudut yang terbentuk dari dua garis berpotongan', ['5.2.3'], 'CP-C Pengukuran'),
  t('6.2.6', 'data', 'Skala Kemungkinan', 'Menyatakan kejadian sebagai pasti, mungkin, atau mustahil', ['3.2.8'], `${S6} bab 4A`),
  t('6.2.7', 'data', 'Membandingkan Peluang', 'Menentukan kejadian yang lebih mungkin dalam percobaan acak', ['6.2.6'], `${S6} bab 4B`),
  t('6.2.9', 'ukur', 'Pengayaan: Volume Kubus dan Balok', 'Menghitung volume dengan panjang × lebar × tinggi', ['4.2.6', '6.2.1'], 'Pengayaan (di luar CP 046)', { pengayaan: true }),
  t('6.2.10', 'data', 'Pengayaan: Rata-rata, Median, Modus', 'Menentukan rata-rata, nilai tengah, dan nilai yang paling sering muncul', ['5.2.7'], 'Pengayaan (di luar CP 046)', { pengayaan: true }),
  t('6.2.8', 'mix', 'Tantangan Akhir SD', 'Mengerjakan campuran soal kelas 4–6', [], 'Campuran Fase B–C'),
];
