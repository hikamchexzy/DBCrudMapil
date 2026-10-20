# Aplikasi Manajemen Harga Barang

Aplikasi web full-stack untuk manajemen data dan harga barang dengan operasi CRUD (Create, Read, Update, Delete). Dibangun dengan Next.js App Router, MySQL (Aiven), dan Tailwind CSS.

## Fitur

- ✅ **Create**: Menambah data barang baru (nama & harga).
- 📖 **Read**: Menampilkan daftar barang dalam bentuk tabel data yang responsif.
- ✏️ **Update**: Mengedit nama dan harga barang secara inline.
- 🗑️ **Delete**: Menghapus data barang dengan konfirmasi.
- 📊 **Dashboard Ringkasan**: Menampilkan total item dan estimasi total nilai aset.
- 🎨 **Desain Modern**: Antarmuka bersih dengan Tailwind CSS dan ikon dari Lucide React.
- 🔒 **Koneksi Aman**: Koneksi database terenkripsi SSL/TLS ke Aiven.

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/) (di-host di [Aiven](https://aiven.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Prasyarat

- Node.js (v20.9 atau lebih baru; diwajibkan oleh Next.js 16)
- Akun Aiven (untuk database MySQL)
- Git

## Konfigurasi Environment di Vercel

Tambahkan variabel berikut pada **Project Settings → Environment Variables** untuk setiap environment yang digunakan:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL=true`
- `DB_SSL_CA_BASE64`: isi dengan konten sertifikat CA dalam Base64.

File `.env.local` dan `certs/ca.pem` tidak disertakan dalam Git. Karena itu, jangan gunakan `DB_SSL_CA=./certs/ca.pem` di Vercel. Untuk membuat nilai Base64 secara lokal, jalankan PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("certs/ca.pem"))
```

Salin hasilnya ke `DB_SSL_CA_BASE64` di Vercel. Untuk development lokal, gunakan `DB_SSL_CA=./certs/ca.pem` seperti pada `.env.local.example`.

## Cara Menjalankan Secara Lokal

1.  **Clone repositori**:
    ```bash
    git clone https://github.com/USERNAME/harga-barang-app.git
    cd harga-barang-app
2. **Download Node Modules**
    npm install
3. **Jalankan Website di localhost**
    npm run dev
    server akan berjalan di [localhost300](http://localhost:3000/)


## Buat Tabel di SQL Milikmu
CREATE TABLE barang (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  harga DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);