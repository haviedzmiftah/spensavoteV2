# Rencana Implementasi: Bagian 4 - Manajemen Pemilih (Issue #4)

Dokumen ini menjelaskan rencana implementasi untuk menyelesaikan kebutuhan **Bagian 4. Manajemen Pemilih** dari issue [#4](https://github.com/haviedzmiftah/spensavoteV2/issues/4).

## Analisis Kebutuhan

Sesuai dengan issue:
1. **Lihat Data Pemilih (`GET /api/users`)**:
   - **Method**: `GET`
   - **Endpoint**: `/api/users`
   - **Deskripsi**: Mendapatkan daftar seluruh user (pemilih & admin) tanpa mengekspos field `password`.
   - **Proteksi**: Khusus `admin` (`requireAdmin()`).

2. **Tambah Data Pemilih (`POST /api/users`)**:
   - **Method**: `POST`
   - **Endpoint**: `/api/users`
   - **Deskripsi**: Menambahkan data pemilih/user baru oleh admin. Password otomatis di-hash menggunakan `Bun.password.hash(..., { algorithm: "bcrypt", cost: 10 })`. Mencegah duplikasi `username`.
   - **Proteksi**: Khusus `admin` (`requireAdmin()`).

3. **Update Data Pemilih (`PUT` & `PATCH /api/users/:id`)**:
   - **Method**: `PUT` dan `PATCH`
   - **Endpoint**: `/api/users/:id`
   - **Deskripsi**: Memperbarui data pemilih (mengubah username, role, atau mereset password baru yang di-hash).
   - **Proteksi**: Khusus `admin` (`requireAdmin()`).
   - **Penanganan**: Validasi keberadaan user (404 jika tidak ditemukan), validasi username unik jika diubah (400 jika sudah dipakai user lain).

4. **Hapus Data Pemilih (`DELETE /api/users/:id`)**:
   - **Method**: `DELETE`
   - **Endpoint**: `/api/users/:id`
   - **Deskripsi**: Menghapus data user berdasarkan ID (karena foreign key `votes.userId` onDelete cascade, vote terkait juga akan terhapus otomatis jika ada).
   - **Proteksi**: Khusus `admin` (`requireAdmin()`).
   - **Penanganan**: 404 jika user tidak ditemukan.

## Proposed Changes

### [User Routes]
#### [NEW] [users/index.ts](file:///c:/Users/havie/webDevelop/spensavoteV2/src/routes/users/index.ts)
- Buat sub-router Elysia dengan prefix `/users` dan gunakan `authPlugin`.
- Implementasikan:
  - `GET /` -> `db.select({ id: users.id, username: users.username, role: users.role }).from(users)` (proteksi admin).
  - `POST /` -> Validasi body `{ username, password, role? }`, cek duplicate username, hash password, insert user (proteksi admin).
  - `PUT /:id` & `PATCH /:id` -> Validasi ID, update username/password (hash jika ada password baru)/role (proteksi admin).
  - `DELETE /:id` -> Hapus user by ID (proteksi admin).
- Lengkapi seluruh skema Elysia `t.Object`, response codes (200, 201, 400, 401, 403, 404, 500), serta deskripsi OpenAPI / Swagger.

### [Main App]
#### [MODIFY] [index.ts](file:///c:/Users/havie/webDevelop/spensavoteV2/src/index.ts)
- Import `userRoutes` dari `./routes/users`.
- Daftarkan `userRoutes` ke dalam `.group("/api", ...)` sehingga endpoint dapat diakses melalui `/api/users`.

## Verification Plan

### Automated Tests / Type Checking
- Jalankan pemeriksaan TypeScript dengan `bun x tsc --noEmit`.

### Manual Verification
- Uji endpoint `GET /api/users` dengan token admin (harus berhasil) vs voter (harus 403) vs tanpa token (harus 401).
- Uji endpoint `POST /api/users` untuk membuat pemilih baru.
- Uji endpoint `PATCH /api/users/:id` untuk mereset password / username.
- Uji endpoint `DELETE /api/users/:id` untuk menghapus pemilih.
- Periksa Swagger di `http://localhost:3000/swagger`.
