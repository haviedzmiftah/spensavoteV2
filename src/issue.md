# Perencanaan Fitur Admin Spensavote V2

Dokumen ini berisi daftar endpoint REST API yang perlu diimplementasikan untuk memenuhi kebutuhan fitur admin pada aplikasi e-voting.

## Daftar Fitur & Endpoint API

### 1. Otentikasi
*   **Login Admin**
    *   **Method:** `POST`
    *   **Endpoint:** `/api/auth/login`
    *   **Deskripsi:** Otentikasi admin (sudah ada, perlu dipastikan role `admin` divalidasi dan diizinkan akses ke endpoint admin lainnya, idealnya menggunakan JWT).

### 2. Manajemen Kandidat
*   **Lihat Data Kandidat**
    *   **Method:** `GET`
    *   **Endpoint:** `/api/candidates`
    *   **Deskripsi:** Mengambil semua daftar kandidat (sudah ada).
*   **Tambah Data Kandidat**
    *   **Method:** `POST`
    *   **Endpoint:** `/api/candidates`
    *   **Deskripsi:** Menambahkan kandidat baru (sudah ada).
*   **Update Data Kandidat**
    *   **Method:** `PUT` atau `PATCH`
    *   **Endpoint:** `/api/candidates/:id`
    *   **Deskripsi:** Memperbarui informasi kandidat berdasarkan ID (misal mengubah visi/misi atau foto).
*   **Hapus Data Kandidat**
    *   **Method:** `DELETE`
    *   **Endpoint:** `/api/candidates/:id`
    *   **Deskripsi:** Menghapus data kandidat berdasarkan ID.

### 3. Manajemen Suara (Voting)
*   **Lihat Data Suara**
    *   **Method:** `GET`
    *   **Endpoint:** `/api/votes/admin/list` (atau kembangkan dari `/api/votes`)
    *   **Deskripsi:** Melihat detail data suara yang masuk (siapa memilih siapa, waktu vote).
    *   *Catatan:* Jika hanya butuh rekapitulasi, `/api/votes/count` sudah tersedia.
*   **Hapus Suara (Spesifik)**
    *   **Method:** `DELETE`
    *   **Endpoint:** `/api/votes/:id`
    *   **Deskripsi:** Menghapus entri voting tertentu (jika ada kesalahan teknis).
*   **Reset Seluruh Suara**
    *   **Method:** `DELETE`
    *   **Endpoint:** `/api/system/reset-votes` (atau gunakan `/api/system/reset` yang sudah ada untuk semua data).
    *   **Deskripsi:** Menghapus semua data dari tabel `votes` untuk memulai ulang pemilu.

### 4. Manajemen Pemilih (Voters/Users)
*   **Lihat Data Pemilih**
    *   **Method:** `GET`
    *   **Endpoint:** `/api/users`
    *   **Deskripsi:** Mendapatkan daftar seluruh user (pemilih & admin).
*   **Tambah Data Pemilih**
    *   **Method:** `POST`
    *   **Endpoint:** `/api/users` (atau `/api/auth/register` oleh admin)
    *   **Deskripsi:** Menambahkan data pemilih baru secara manual.
*   **Update Data Pemilih**
    *   **Method:** `PUT` atau `PATCH`
    *   **Endpoint:** `/api/users/:id`
    *   **Deskripsi:** Memperbarui data pemilih (contoh: mereset password, mengubah nama/username).
*   **Hapus Data Pemilih**
    *   **Method:** `DELETE`
    *   **Endpoint:** `/api/users/:id`
    *   **Deskripsi:** Menghapus data pemilih berdasarkan ID.

---

## Catatan Implementasi
- **Middlewares / Validasi Role:** Seluruh endpoint untuk fitur nomor 2-10 harus dilindungi oleh *middleware* yang mengecek apakah user yang melakukan *request* benar-benar memiliki role `admin`.
- Beberapa endpoint sudah dibuat pada iterasi sebelumnya, namun perlu diamankan (*secured*) khusus untuk akses admin.
