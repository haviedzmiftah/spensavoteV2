# Project Planning: Spensavote V2

## Overview
Perencanaan inisialisasi dan arsitektur backend project **Spensavote V2** menggunakan runtime **Bun**, framework **ElysiaJS**, dan **Drizzle ORM** dengan database **MySQL**.

---

## 1. Project Initialization & Setup
- [x] Inisialisasi runtime **Bun** pada root workspace.
- [x] Konfigurasi TypeScript dan script eksekusi/development di `package.json`.
- [x] Setup konfigurasi environment variables (`.env`).

---

## 2. Core Dependencies & Framework
- [x] Instalasi **ElysiaJS** sebagai web framework backend utama.
- [x] Setup plugins pendukung Elysia (CORS, Swagger/OpenAPI documentation, dsb.).
- [x] Konfigurasi main application entry point dan server lifecycle.

---

## 3. Database & ORM Integration
- [x] Instalasi driver **MySQL2** dan **Drizzle ORM** beserta **Drizzle Kit** (CLI).
- [x] Buat konfigurasi koneksi database (`drizzle.config.ts` dan db client instance).
- [x] Setup direktori skema database (`/src/db/schema`).
- [x] Konfigurasi alur migrasi database (generate & push/migrate).

---

## 4. High-Level Architecture & Modules
- [x] **Config & Environment Layer**: Manajemen koneksi DB dan environment variables terpusat.
- [x] **Data Model / Schema Layer**: Definisi tabel dan relasi data menggunakan Drizzle schema.
- [x] **Routing & Controller Layer**: Definisi endpoint REST API berbasis module/feature via ElysiaJS.
- [x] **Validation & Type-Safety Layer**: Validasi input/payload menggunakan Elysia schema (TypeBox).

---

## 5. Testing & Developer Workflow
- [x] Setup script development dengan hot reload (`bun --watch`).
- [x] Verifikasi koneksi database ke server MySQL.
- [x] Uji coba endpoint dasar (Health check & API documentation via Swagger).
