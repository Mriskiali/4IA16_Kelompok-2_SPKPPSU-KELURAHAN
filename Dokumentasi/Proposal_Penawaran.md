# Proposal Penawaran
## Sistem Pelaporan Kerja PPSU (SPKPPSU) Kelurahan

---

## 1. Latar Belakang

Peningkatan kualitas pelayanan publik merupakan salah satu tujuan utama dalam pemerintahan daerah, khususnya pada tingkat kelurahan. Kelurahan sebagai bagian dari wilayah administrasi memiliki tugas penting dalam menjaga dan meningkatkan kualitas lingkungan, kebersihan, dan sarana prasarana umum (PPSU - Penanganan Prasarana dan Sarana Umum) agar tetap optimal dan terjaga.

Selama ini, pengelolaan laporan kerja PPSU di Kelurahan masih dilakukan secara manual melalui pencatatan di buku register dan pengumpulan laporan harian secara fisik. Sistem manual ini menimbulkan beberapa permasalahan, antara lain:

- Kurangnya efisiensi waktu dalam proses pelaporan
- Kesulitan dalam memantau lokasi kerja petugas secara real-time
- Tidak adanya bukti visual dari aktivitas kerja lapangan
- Kesulitan dalam menyimpan dan mengolah data laporan secara sistematis
- Terbatasnya akses informasi bagi pihak manajemen dalam memonitor kinerja petugas

Berdasarkan permasalahan tersebut, diperlukan sistem pelaporan kerja PPSU berbasis digital yang dapat membantu Kelurahan dalam mengelola dan memantau aktivitas kerja petugas secara efektif dan efisien.

## 2. Tujuan

- Mendigitalkan proses pelaporan kerja petugas PPSU
- Mempermudah dan mempercepat proses penyampaian laporan
- Memberikan bukti visual dan lokasi kerja yang akurat
- Memungkinkan monitoring kinerja petugas secara real-time
- Meningkatkan kualitas pelayanan dan transparansi kerja PPSU

## 3. Ruang Lingkup

Sistem ini akan mencakup:

- Modul petugas lapangan untuk membuat laporan kerja
- Modul admin untuk memantau dan memverifikasi laporan
- Sistem manajemen pengguna dan kategori laporan
- Sistem ekspor data untuk kebutuhan arsip

## 4. Metodologi Pengembangan

### 4.1 Metode Waterfall

Kami memilih metode Waterfall karena memberikan pendekatan yang sistematis dan terstruktur dalam pengembangan sistem:

1. **Kebutuhan Sistem** - Mengidentifikasi kebutuhan dan permasalahan yang akan diselesaikan
2. **Analisis Sistem** - Menganalisis proses bisnis dan kebutuhan fungsional/non-fungsional
3. **Desain Sistem** - Merancang arsitektur, antarmuka pengguna, dan basis data
4. **Implementasi** - Mengembangkan sistem sesuai desain dan kebutuhan
5. **Pengujian** - Melakukan pengujian fungsional dan non-fungsional
6. **Pemeliharaan** - Memberikan dukungan dan perbaikan sistem setelah implementasi

### 4.2 Alasan Pemilihan Metode Waterfall

- Sistem ini memiliki kebutuhan yang jelas dan relatif tidak berubah selama proses pengembangan
- Memungkinkan pembuatan spesifikasi sistem yang lengkap sebelum implementasi
- Memberikan dokumentasi yang komprehensif untuk kebutuhan akademis
- Mempermudah manajemen proyek karena setiap fase jelas dan terdefinisi

## 5. Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Utility-first framework)
- **Database & Realtime**: Supabase (PostgreSQL)
- **Peta**: Leaflet.js & OpenStreetMap (Gratis, tanpa API Key Google)
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF

## 6. Tools dan Manajemen Proyek

### 6.1 Tools Pengembangan
- **Integrated Development Environment (IDE)**: Visual Studio Code sebagai IDE utama
- **Version Control**: Git dan GitHub untuk manajemen kode dan kolaborasi
- **Package Manager**: npm untuk manajemen dependensi
- **Build Tool**: Vite untuk proses development dan build
- **Code Quality**: ESLint dan Prettier untuk maintain code quality

### 6.2 Manajemen Proyek
- **Platform Manajemen**: Trello untuk pelacakan tugas dan progress
- **Komunikasi**: GitHub Issues untuk pelaporan bug dan permintaan fitur (jika ada)
- **Documentation**: Markdown files untuk dokumentasi teknis dan panduan

### 6.3 Peran dalam Proyek
- **Mu'afa Riski Ali (Full-Stack Developer)**: Bertanggung jawab atas seluruh aspek pengembangan aplikasi termasuk analisis kebutuhan, desain antarmuka, implementasi fitur, pengujian, dan dokumentasi


## 7. Timeline Pengerjaan

| Fase | Kegiatan | Durasi | Bobot |
|------|----------|--------|--------|
| 1 | Analisis dan Perancangan Sistem | Minggu 1 | 20% |
| 2 | Implementasi Backend dan Database | Minggu 1-2 | 25% |
| 3 | Implementasi Frontend | Minggu 2-3 | 30% |
| 4 | Integrasi dan Testing | Minggu 3-4 | 15% |
| 5 | Dokumentasi dan Pelaporan | Minggu 4 | 10% |

## 8. Keluaran Proyek

- Sistem pelaporan kerja PPSU berbasis web yang siap digunakan
- Dokumentasi sistem lengkap (analisis, perancangan, implementasi, testing)
- Panduan penggunaan untuk admin dan petugas
- Manual administrasi sistem

## 9. Penutup

Dengan adanya sistem SPKPPSU ini, Kelurahan diharapkan dapat meningkatkan efisiensi dan efektivitas dalam mengelola pelaporan kerja PPSU, sehingga kualitas pelayanan publik dapat terus ditingkatkan secara berkelanjutan.