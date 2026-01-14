# Laporan Pendahuluan
## Sistem Pelaporan Kerja PPSU (SPKPPSU) Kelurahan

---

## 1. Latar Belakang

Peningkatan kualitas pelayanan publik merupakan prioritas utama dalam pemerintahan tingkat kelurahan. Kelurahan sebagai unit pemerintahan terdepan dalam pelayanan masyarakat memiliki tanggung jawab besar dalam menjaga dan meningkatkan kualitas lingkungan serta sarana prasarana umum (PPSU).

Sistem pelaporan kerja PPSU yang sebelumnya dilakukan secara manual dianggap tidak efisien dan tidak memberikan data yang akurat untuk evaluasi kinerja petugas. Keterbatasan dalam mendokumentasikan bukti kerja, lokasi pelaksanaan, serta waktu pelaksanaan menjadi tantangan utama dalam sistem pelaporan konvensional.

Dengan kondisi ini, diperlukan sistem digital yang mampu mencatat aktivitas kerja petugas dengan akurat, memudahkan proses verifikasi, serta memberikan informasi yang dapat dijadikan dasar untuk evaluasi kinerja dan perencanaan kegiatan selanjutnya.

## 2. Analisis Kebutuhan

### 2.1 Kebutuhan Fungsional

#### 2.1.1 Modul Petugas Lapangan
- **Autentikasi Pengguna**: Sistem harus menyediakan proses login untuk petugas
- **Pembuatan Laporan**: Petugas dapat membuat laporan kerja dengan melampirkan foto dan identifikasi lokasi
- **Pemilihan Lokasi**: Sistem harus menyediakan fitur peta interaktif untuk menentukan lokasi pelaksanaan kerja dengan akurasi tinggi
- **Upload Foto**: Petugas dapat mengambil foto langsung dari kamera atau mengunggah dari galeri
- **Pengelolaan Profil**: Petugas dapat mengubah informasi pribadi dan foto profil
- **Manajemen Laporan**: Petugas dapat melihat riwayat laporan yang telah dibuat dengan filter status dan tanggal

#### 2.1.2 Modul Admin
- **Monitoring Laporan**: Admin dapat melihat semua laporan yang masuk secara real-time
- **Verifikasi Laporan**: Admin dapat menerima atau menolak laporan dengan memberikan alasan
- **Manajemen Pengguna**: Admin dapat menambah, mengedit, atau menghapus akun petugas

- **Ekspor Data**: Admin dapat mengunduh data laporan dalam format CSV dan PDF dengan tampilan profesional yang mencakup semua informasi laporan dan ringkasan statistik
- **Statistik dan Analitik**: Admin dapat melihat statistik kinerja petugas dalam bentuk grafik

### 2.2 Kebutuhan Non-Fungsional

#### 2.2.1 Kinerja
- Aplikasi harus dapat merespons permintaan pengguna dalam waktu kurang dari 2 detik
- Sistem harus dapat menangani hingga 50 pengguna aktif secara bersamaan
- Upload foto tidak boleh melebihi 10MB dan harus selesai dalam waktu maksimal 10 detik

#### 2.2.2 Keamanan
- Sistem harus menyediakan otentikasi dan otorisasi pengguna
- Password harus dienkripsi sebelum disimpan
- Data penting harus dilindungi dari akses tidak sah

#### 2.2.3 Ketersediaan
- Sistem harus tersedia minimal 99% dari waktu operasional
- Harus memiliki mekanisme backup data secara berkala
- Harus memiliki mekanisme recovery data


#### 2.2.4 Usabilitas
- Antarmuka harus responsif dan dapat diakses dari berbagai ukuran perangkat
- Navigasi harus intuitif dan mudah dipahami
- Sistem harus mendukung pengguna dengan keterbatasan teknis

## 3. Perancangan Database

### 3.1 Struktur Tabel

#### 3.1.1 Tabel Profile
```
Table: Profile
- id: text (Primary Key, UUID) - Default: uuid_generate_v4()
- pjlpNumber: text (Unique, Not Null) - Nomor identitas petugas
- name: text (Not Null) - Nama lengkap petugas
- role: text (Not Null) - Peran pengguna (ADMIN/PETUGAS)
- isActive: boolean (Not Null, Default: true) - Status aktif pengguna
- phone: text - Nomor telepon petugas
- avatarUrl: text - URL foto profil (Base64 encoded)
- password: text - Password pengguna (terenkripsi)
- createdAt: timestamp with time zone (Not Null) - Default: timezone('utc'::text, now())
- updatedAt: timestamp with time zone (Not Null) - Default: timezone('utc'::text, now())
```

#### 3.1.2 Tabel Report
```
Table: Report
- id: text (Primary Key, UUID) - Default: uuid_generate_v4()
- userId: text (Not Null, References: Profile.id ON DELETE CASCADE) - ID pengguna pembuat laporan
- userName: text (Not Null) - Nama pengguna saat pembuatan laporan (mencegah konflik jika nama berubah)
- category: text (Not Null) - Kategori laporan (Kebersihan, Kerusakan, dll)
- description: text (Not Null) - Deskripsi aktivitas/pekerjaan yang dilakukan
- imageUrl: text (Not Null) - URL gambar bukti kerja (Base64 encoded)
- location: text (Not Null) - Informasi lokasi (koordinat dan nama jalan)
- status: text (Not Null, Default: 'PENDING') - Status laporan (PENDING/APPROVED/REJECTED)
- feedback: text - Umpan balik dari admin jika laporan ditolak
- createdAt: timestamp with time zone (Not Null) - Default: timezone('utc'::text, now())
```

### 3.2 Relasi Antar Tabel
- Tabel Report memiliki relasi foreign key ke tabel Profile melalui column userId
- Jika Profile dihapus, maka Report terkait akan ikut terhapus secara otomatis (ON DELETE CASCADE)

### 3.3 Indeks dan Konstrain
- Indeks pada kolom:
  - Profile: pjlpNumber (unique)
  - Report: userId, createdAt, status
- Konstrain:
  - Role hanya bisa bernilai 'ADMIN' atau 'PETUGAS'
  - Status hanya bisa bernilai 'PENDING', 'APPROVED', atau 'REJECTED'

## 4. Arsitektur Sistem

### 4.1 Client-Server Architecture
Sistem menggunakan pendekatan Client-Server dengan:
- Client: Aplikasi web berbasis React 18
- Server: Database dan API melalui Supabase
- Database: PostgreSQL

### 4.2 Teknologi yang Digunakan
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL melalui Supabase
- **Realtime**: Supabase Realtime (untuk pembaruan data secara otomatis)
- **Maps**: Leaflet.js & OpenStreetMap
- **Icons**: Lucide React
- **Charts**: Recharts
- **Project Management**: Trello
- **IDE**: Visual Studio Code

### 4.3 Tools dan Manajemen Proyek
#### 4.3.1 Tools Pengembangan
- **Integrated Development Environment (IDE)**: Visual Studio Code digunakan sebagai IDE utama dalam pengembangan aplikasi
- **Version Control**: Git dan GitHub untuk manajemen kode dan kolaborasi tim
- **Package Manager**: npm untuk manajemen dependensi proyek
- **Build Tool**: Vite sebagai build tool untuk pengembangan dan produksi

#### 4.3.2 Manajemen Proyek
- **Platform Manajemen**: Trello digunakan untuk pelacakan tugas dan progress proyek
- **Komunikasi**: GitHub Issues untuk pelaporan bug dan permintaan fitur (jika ada)
- **Dokumentasi**: Dokumentasi teknis dan panduan disimpan dalam repositori

#### 4.3.3 Peran dalam Proyek
- **Mu'afa Riski Ali (Full-Stack Developer)**: Bertanggung jawab atas seluruh aspek pengembangan aplikasi termasuk analisis kebutuhan, desain antarmuka, implementasi fitur, pengujian, dan dokumentasi

## 5. Penutup

Laporan pendahuluan ini memberikan dasar yang kuat untuk pengembangan sistem SPKPPSU Kelurahan. Analisis kebutuhan yang komprehensif dan rancangan database yang terstruktur akan menjadi fondasi penting dalam tahapan implementasi berikutnya.