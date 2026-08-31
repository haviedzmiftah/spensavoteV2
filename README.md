# 🗳️ Spensavote V2

**Spensavote V2** adalah aplikasi E-Voting modern dan aman yang dirancang untuk pemilihan ketua & wakil ketua OSIS / organisasi sekolah. Dibangun menggunakan arsitektur modular dengan **ElysiaJS (Bun)** sebagai backend performa tinggi dan **Next.js (App Router) + Tailwind CSS** sebagai antarmuka panel admin yang intuitif dan responsif.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi & Otorisasi Berbasis Role**: Sistem autentikasi JWT terpisah untuk Administrator dan Pemilih (Voters).
- 📊 **Dashboard & Quick Count Realtime**: Statistik KPI pemilihan, persentase partisipasi pemilih, dan grafik perolehan suara paslon secara langsung.
- 👥 **Manajemen Kandidat Paslon**: CRUD lengkap data pasangan calon ketua & wakil ketua (nomor urut, visi, misi, dan foto).
- 📋 **Manajemen DPT (Daftar Pemilih Tetap)**: Pengelolaan akun pemilih, filter status partisipasi (sudah/belum memilih), dan reset password.
- 📈 **Monitoring & Export Suara**: Visualisasi perolehan suara live dengan kemampuan ekspor laporan rekapitulasi ke format **CSV**.
- ⚙️ **Pengaturan & Danger Zone**: Kontrol reset suara pemilihan (`reset-votes`) dan reset total sistem database dengan konfirmasi ganda.
- 📑 **Dokumentasi API Terintegrasi**: Swagger UI OpenAPI bawaan untuk eksplorasi dan pengujian endpoint backend.

---

## 🛠️ Tech Stack

- **Backend**: [Bun](https://bun.com/) & [ElysiaJS](https://elysiajs.com/)
- **Database & ORM**: MySQL & [Drizzle ORM](https://orm.drizzle.team/)
- **Frontend (Admin UI)**: [Next.js 14+](https://nextjs.org/) (App Router), React, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang:
1. **[Bun](https://bun.com/)** (v1.0+)
2. **[Node.js](https://nodejs.org/) & npm**
3. **MySQL Database Server** (misalnya via XAMPP, Laragon, atau Docker)

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Clone Repositori
```bash
git clone https://github.com/haviedzmiftah/spensavoteV2.git
cd spensavoteV2
```

### 2. Konfigurasi Environment (`.env`)
Buat atau sesuaikan file `.env` di root direktori proyek:
```env
PORT=3000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=spensavote_v2
DATABASE_URL=mysql://root:root@localhost:3306/spensavote_v2
```

### 3. Setup Database (Migrasi Schema)
Pastikan MySQL service aktif dan database `spensavote_v2` sudah dibuat, lalu jalankan:
```bash
# Install dependencies backend
bun install

# Sinkronisasi schema tabel ke database MySQL
bun x drizzle-kit push
```

### 4. Membuat Akun Admin Awal (Seed)
Buat akun admin pertama melalui perintah berikut:
```bash
bun -e "import('./src/db').then(async ({db}) => { const {users} = await import('./src/db/schema'); const hashedPassword = await Bun.password.hash('admin123', { algorithm: 'bcrypt' }); await db.insert(users).values({ username: 'admin', password: hashedPassword, role: 'admin' }); console.log('Akun Admin siap: admin / admin123'); process.exit(0); })"
```

---

### 5. Menjalankan Aplikasi

Aplikasi membutuhkan **dua terminal** yang berjalan bersamaan:

#### Terminal 1 — Backend API (ElysiaJS):
```bash
bun run dev
```
> Server backend akan aktif di **`http://localhost:3000`**  
> Dokumentasi API Swagger tersedia di **`http://localhost:3000/swagger`**

#### Terminal 2 — Frontend Admin (Next.js):
```bash
cd admin-ui
npm install
npm run dev -- -p 3001
```
> Antarmuka Admin Web akan aktif di **`http://localhost:3001`**

---

## 🔑 Akses Default Login Admin

- **URL Login**: `http://localhost:3001/login`
- **Username**: `admin`
- **Password**: `admin123`

---

## 📁 Struktur Direktori

```text
spensavoteV2/
├── admin-ui/              # Frontend Web Admin (Next.js + Tailwind)
│   ├── src/
│   │   ├── app/           # Next.js App Router (Dashboard, Login, dll)
│   │   ├── components/    # Komponen Reusable (Sidebar, Topbar)
│   │   ├── lib/           # Helper API client & Auth Session
│   │   └── middleware.ts  # Route Guard / Auth Protection
├── src/
│   ├── db/                # Drizzle ORM Setup & Schema MySQL
│   ├── middlewares/       # Middleware Auth JWT & Role Guard
│   ├── routes/            # REST API Route Endpoints (Auth, Candidates, Votes, Users, System)
│   └── index.ts           # Server Entry Point ElysiaJS
├── drizzle.config.ts      # Konfigurasi Drizzle Kit
└── README.md
```

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).
