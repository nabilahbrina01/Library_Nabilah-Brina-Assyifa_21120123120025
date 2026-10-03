# Library Loan API

REST API sederhana untuk layanan pencatatan peminjaman buku perpustakaan oleh anggota.

## Deskripsi & Tujuan Proyek

Library Loan API menyediakan operasi CRUD (Create, Read, Update, Delete) untuk
data peminjaman buku oleh anggota perpustakaan, dilengkapi fitur filter
berdasarkan status peminjaman, nama anggota, dan judul buku.

Proyek ini dibuat sebagai tugas responsi mata kuliah **Praktikum Pemrograman
Perangkat Bergerak** dengan tujuan:

- Menerapkan arsitektur RESTful API dengan metode HTTP standar (GET, POST, PUT, DELETE).
- Membangun server backend menggunakan Node.js dan Express.js.
- Mengintegrasikan database Supabase (PostgreSQL) sebagai backend-as-a-service.
- Memisahkan kode ke dalam model, controller, dan router agar terstruktur.
- Men-deploy API ke Vercel sehingga dapat diakses secara publik.

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Pengujian API | Postman |

## Link Deployment

**Base URL:** https://library-nabilah-brina-assyifa-21120.vercel.app

Contoh endpoint: https://library-nabilah-brina-assyifa-21120.vercel.app/loans

## Struktur Data (Tabel `loans`)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (Primary Key) | Dibuat otomatis |
| `member_name` | text | Nama anggota (wajib) |
| `member_id` | text | Nomor anggota (wajib) |
| `book_title` | text | Judul buku (wajib) |
| `book_author` | text | Penulis buku |
| `loan_date` | date | Tanggal pinjam (default: hari ini) |
| `due_date` | date | Tanggal jatuh tempo (wajib) |
| `return_date` | date | Tanggal buku dikembalikan |
| `status` | text | `Dipinjam`, `Dikembalikan`, atau `Terlambat` (default: `Dipinjam`) |
| `created_at` | timestamptz | Waktu data dibuat |

**Catatan perilaku otomatis:**

- Status `Dipinjam` otomatis berubah menjadi `Terlambat` apabila `due_date`
  sudah terlewati. Pembaruan ini dilakukan setiap kali `GET /loans` dipanggil.
- Ketika status diubah menjadi `Dikembalikan` tanpa menyertakan `return_date`,
  tanggal pengembalian terisi otomatis dengan tanggal hari ini.

## Daftar Endpoint

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Cek status API |
| GET | `/loans` | Ambil semua data peminjaman |
| GET | `/loans?status=Terlambat` | Filter berdasarkan status |
| GET | `/loans?member_name=budi` | Cari berdasarkan nama anggota |
| GET | `/loans?book_title=laskar` | Cari berdasarkan judul buku |
| GET | `/loans/:id` | Ambil detail satu peminjaman |
| POST | `/loans` | Tambah data peminjaman baru |
| PUT | `/loans/:id` | Ubah data peminjaman |
| DELETE | `/loans/:id` | Hapus data peminjaman |

Filter dapat dikombinasikan, misalnya `/loans?status=Terlambat&member_name=budi`.

## Contoh Request & Response

### 1. POST /loans — Tambah peminjaman

Request body (`Content-Type: application/json`):

```json
{
  "member_name": "Rina Kusuma",
  "member_id": "A004",
  "book_title": "Atomic Habits",
  "book_author": "James Clear",
  "due_date": "2026-10-10"
}
```

Response `201 Created`:

```json
{
  "success": true,
  "message": "Peminjaman berhasil dicatat",
  "data": {
    "id": "43f46816-feeb-42eb-a721-91ab7f83c700",
    "member_name": "Rina Kusuma",
    "member_id": "A004",
    "book_title": "Atomic Habits",
    "book_author": "James Clear",
    "loan_date": "2026-10-03",
    "due_date": "2026-10-10",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-03T16:08:20.420329+00:00"
  }
}
```

### 2. GET /loans — Ambil semua data

Response `200 OK`:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "b48070ae-9a84-4525-9f2a-b132b56b93e8",
      "member_name": "Budi Santoso",
      "member_id": "A001",
      "book_title": "Laskar Pelangi",
      "book_author": "Andrea Hirata",
      "loan_date": "2026-09-01",
      "due_date": "2026-09-08",
      "return_date": null,
      "status": "Terlambat",
      "created_at": "2026-10-03T16:22:56.254571+00:00"
    },
    {
      "id": "43f46816-feeb-42eb-a721-91ab7f83c700",
      "member_name": "Rina Kusuma",
      "member_id": "A004",
      "book_title": "Atomic Habits",
      "book_author": "James Clear",
      "loan_date": "2026-10-03",
      "due_date": "2026-10-10",
      "return_date": null,
      "status": "Dipinjam",
      "created_at": "2026-10-03T16:08:20.420329+00:00"
    }
  ]
}
```

### 3. GET /loans?status=Terlambat — Filter berdasarkan status

Response `200 OK`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "b48070ae-9a84-4525-9f2a-b132b56b93e8",
      "member_name": "Budi Santoso",
      "member_id": "A001",
      "book_title": "Laskar Pelangi",
      "book_author": "Andrea Hirata",
      "loan_date": "2026-09-01",
      "due_date": "2026-09-08",
      "return_date": null,
      "status": "Terlambat",
      "created_at": "2026-10-03T16:22:56.254571+00:00"
    }
  ]
}
```

### 4. GET /loans/:id — Detail satu peminjaman

Response `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "43f46816-feeb-42eb-a721-91ab7f83c700",
    "member_name": "Rina Kusuma",
    "member_id": "A004",
    "book_title": "Atomic Habits",
    "book_author": "James Clear",
    "loan_date": "2026-10-03",
    "due_date": "2026-10-10",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-03T16:08:20.420329+00:00"
  }
}
```

### 5. PUT /loans/:id — Ubah data (pengembalian buku)

Request body:

```json
{
  "status": "Dikembalikan"
}
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Data berhasil diperbarui",
  "data": {
    "id": "3b9a73f3-e6e5-4abf-b861-2381c9142c3e",
    "member_name": "Dewi Lestari",
    "member_id": "A005",
    "book_title": "Perahu Kertas",
    "book_author": "Dee Lestari",
    "loan_date": "2026-10-03",
    "due_date": "2026-10-20",
    "return_date": "2026-10-03",
    "status": "Dikembalikan",
    "created_at": "2026-10-03T16:56:39.296445+00:00"
  }
}
```

### 6. DELETE /loans/:id — Hapus data

Response `200 OK`:

```json
{
  "success": true,
  "message": "Data berhasil dihapus"
}
```

### Contoh Response Error

`400 Bad Request` — field wajib belum diisi (POST body kosong):

```json
{
  "success": false,
  "error": "Field wajib belum diisi: member_name, member_id, book_title, due_date"
}
```

`400 Bad Request` — nilai status tidak valid (`/loans?status=Hilang`):

```json
{
  "success": false,
  "error": "Status harus salah satu dari: Dipinjam, Dikembalikan, Terlambat"
}
```

`400 Bad Request` — PUT tanpa data yang diubah:

```json
{
  "success": false,
  "error": "Tidak ada data yang diubah"
}
```

`404 Not Found` — data tidak ditemukan:

```json
{
  "success": false,
  "error": "Data peminjaman tidak ditemukan"
}
```

## Panduan Instalasi & Menjalankan di Lokal

### Prasyarat

- [Node.js](https://nodejs.org) (versi LTS)
- Akun [Supabase](https://supabase.com)
- [Postman](https://www.postman.com) (opsional, untuk pengujian)

### Langkah-langkah

1. **Clone repository**

```bash
   git clone https://github.com/nabilahbrina01/Library_Nabilah-Brina-Assyifa_21120123120025.git
   cd Library_Nabilah-Brina-Assyifa_21120123120025
```

2. **Install dependency**

```bash
   npm install
```

3. **Siapkan database di Supabase**

   Buat project baru di Supabase, buka **SQL Editor**, lalu jalankan:

```sql
   create table loans (
     id uuid primary key default gen_random_uuid(),
     member_name text not null,
     member_id text not null,
     book_title text not null,
     book_author text,
     loan_date date not null default current_date,
     due_date date not null,
     return_date date,
     status text not null default 'Dipinjam'
       check (status in ('Dipinjam', 'Dikembalikan', 'Terlambat')),
     created_at timestamptz default now()
   );
```

   Jika data tidak terbaca dari API, nonaktifkan Row Level Security untuk
   keperluan pengujian:

```sql
   alter table loans disable row level security;
```

   (Opsional) Tambahkan data contoh:

```sql
   insert into loans (member_name, member_id, book_title, book_author, loan_date, due_date, status) values
   ('Budi Santoso', 'A001', 'Laskar Pelangi', 'Andrea Hirata', '2026-09-01', '2026-09-08', 'Terlambat'),
   ('Siti Aminah', 'A002', 'Bumi Manusia', 'Pramoedya Ananta Toer', '2026-09-25', '2026-10-09', 'Dipinjam'),
   ('Andi Wijaya', 'A003', 'Filosofi Teras', 'Henry Manampiring', '2026-09-10', '2026-09-17', 'Dikembalikan');
```

4. **Buat file `.env`**

   Salin `.env.example` menjadi `.env` di root proyek, lalu isi dengan
   kredensial dari **Project Settings → API** di Supabase:

```env
   SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=isi_anon_atau_publishable_key
   PORT=3000
```

   `SUPABASE_URL` diisi tanpa `/rest/v1/` di akhir.

5. **Jalankan server**

```bash
   npm run dev     # mode development (nodemon, auto-restart)
   npm start       # mode biasa
```

6. **Akses API** di `http://localhost:3000/loans`

Jika berhasil, terminal menampilkan `Server running on port 3000`.

### Script yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server dengan nodemon |
| `npm start` | Menjalankan server dengan node |

## Struktur Proyek

```
.
├── src/
│   ├── config/
│   │   └── supabaseClient.js    # Inisialisasi klien Supabase
│   ├── controllers/
│   │   └── loanController.js    # Validasi input & penanganan request/response
│   ├── models/
│   │   └── loanModel.js         # Query ke database Supabase
│   ├── routes/
│   │   └── loanRoutes.js        # Pemetaan URL ke controller
│   └── index.js                 # Entry point aplikasi Express
├── .env.example                 # Template variabel lingkungan
├── .gitignore
├── package.json
├── vercel.json                  # Konfigurasi deployment Vercel
└── README.md
```

## Deployment ke Vercel

1. Push proyek ke GitHub.
2. Di [Vercel](https://vercel.com), pilih **Add New → Project**, lalu import repository ini.
3. Pada **Environment Variables**, tambahkan `SUPABASE_URL` dan `SUPABASE_KEY`.
4. Klik **Deploy**.

## Author

**Nabilah Brina Assyifa**
NIM: 21120123120025
Praktikum Pemrograman Perangkat Bergerak