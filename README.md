# 💼 SemsOne — Sistem Manajemen Operasional UKM

Selamat datang di repositori **SemsOne** – sebuah aplikasi web modern berbasis **React + TypeScript** untuk mengelola operasional UKM/organisasi.  
Sistem ini mencakup **presensi & notulen**, **keuangan**, **produksi**, **katalog produk**, hingga **kasir** (transaksi + cetak struk).  
Semua data tersimpan di **localStorage** sehingga dapat digunakan secara **offline**.

---

## 🎯 Fitur Utama

* **Beranda (Dashboard)**
  * Headline & deskripsi animasi (*small price, big taste*).
  * Navigasi cepat ke setiap modul (Sekretaris, Bendahara, Produksi, Produk, Kasir).

* **Sekretaris**
  * **Presensi** – input cepat per tanggal, set massal (Hadir/Izin/Sakit/Tanpa Ket.).
  * **Riwayat Kehadiran** – lihat siapa hadir/izin/sakit/TT sesuai tanggal input.
  * **Export CSV & XLSX**.
  * **Notulen Rapat** – simpan judul, tanggal, ringkasan; export **PDF**.

* **Bendahara**
  * **Catatan Pemasukan & Pengeluaran**.
  * **Kalkulator Harga Jual**:  
    ```
    (Modal + Biaya Operasional + (%Keuntungan × (Modal+Biaya))) ÷ Jumlah Produk
    ```
    Output otomatis dalam format **Rupiah**.

* **Produksi**
  * **Stok barang**, **daftar belanja**, dan **jadwal produksi**.
  * Modular dan mudah dikembangkan.

* **Menu Produk**
  * Daftar produk (Dimsum, Cireng, Pastry, Brownies, Kopi).
  * Gambar produk dari **galeri lokal** (bukan link).
  * Varian & harga jelas, search + filter kategori.
  * Hover → animasi zoom gambar & page.
  * Tombol **Order** + jumlah pcs.

* **Kasir**
  * Input **nama pembeli**, **uang pembayaran**, hitung **kembalian** otomatis.
  * Tabel pesanan (ubah qty, hapus item).
  * **Preview struk**.
  * **Download PNG** (via Canvas, stabil) & **Cetak** langsung.
  * Layout profesional: logo toko, tanggal & waktu, kasir, daftar item, total, bayar, kembalian.

---

## 🖼️ Contoh Tampilan

### 1. Dashboard Beranda
Navigasi modul utama dengan kartu interaktif.  
![Beranda](docs/beranda.png)

### 2. Presensi & Riwayat
Input cepat & riwayat per tanggal.  
![Presensi](docs/presensi.png)

### 3. Notulen Rapat
Form input notulen + export PDF.  
![Notulen](docs/notulen.png)

### 4. Menu Produk
Produk dengan varian & gambar.  
![Produk](docs/produk.png)

### 5. Kasir & Struk
Transaksi + preview struk PNG.  
![Kasir](docs/kasir.png)

---

## ⚙️ Teknologi yang Digunakan

* **Bahasa Pemrograman**: TypeScript
* **Framework**: React (Vite)
* **UI Styling**: Tailwind CSS
* **Animasi**: Framer Motion
* **Data Persistensi**: localStorage (`utils/storage.ts`)
* **Export**: CSV, XLSX, PDF, PNG

---


---

## 🔧 Prasyarat

* Node.js **>= 18**
* npm / yarn / pnpm

---

## 🚀 Instalasi & Menjalankan

### 1. Clone repo
```bash
git clone https://github.com/areksaxyz/Semsone
cd Semsone
npm install
```
atau
```
pnpm install
```
### Jalnkan development server
```
npm run dev
```


