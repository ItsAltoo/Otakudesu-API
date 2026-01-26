# Altnime Stream API

API untuk scraping data anime dari website streaming anime. API ini menyediakan informasi tentang anime yang sedang tayang (ongoing), anime yang sudah tamat (complete), detail anime, dan link streaming.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Endpoint API](#endpoint-api)
- [Contoh Response](#contoh-response)
- [Cara Kerja](#cara-kerja)
- [Struktur Proyek](#struktur-proyek)

## ✨ Fitur

- ✅ Mendapatkan daftar anime ongoing (yang sedang tayang)
- ✅ Mendapatkan daftar anime complete (yang sudah tamat)
- ✅ Mendapatkan detail informasi anime
- ✅ Mendapatkan link streaming episode anime
- ✅ Mendapatkan link download anime
- ✅ Pagination support untuk daftar anime
- ✅ Web scraping menggunakan Cheerio

## ⚠️ PERINGATAN PENTING - Pembatasan IP

**API ini TIDAK BISA di-deploy ke layanan cloud (Vercel, Heroku, AWS, dll) karena Otakudesu memiliki proteksi terhadap IP datacenter/VPS!**

### Kenapa Tidak Bisa Di-Deploy?

- **Otakudesu menggunakan proteksi CloudFlare** yang memblokir akses dari IP datacenter, VPS, dan cloud hosting
- IP dari layanan seperti Vercel, Netlify, Heroku, AWS, Google Cloud, Digital Ocean, dan sejenisnya akan **otomatis diblokir**
- Website Otakudesu hanya bisa diakses dari **IP residential (IP rumahan)** seperti koneksi WiFi/internet rumah, mobile data, dll

### Di Mana API Ini Bisa Dijalankan?

✅ **BISA:**

- Komputer/laptop lokal dengan koneksi internet rumah
- Server lokal di jaringan rumah (home server)
- Raspberry Pi atau mini PC di rumah dengan internet residential
- VPS dengan IP residential (sangat jarang dan mahal)

❌ **TIDAK BISA:**

- Vercel, Netlify, Railway, Render
- Heroku, AWS, Google Cloud Platform
- Digital Ocean, Vultr, Linode
- Semua VPS dan cloud hosting pada umumnya

### Solusi Alternatif

Jika ingin mengakses API ini dari luar jaringan rumah:

1. **Jalankan di komputer rumah** dan gunakan port forwarding pada router
2. Gunakan **ngrok** atau **Cloudflare Tunnel** untuk expose API lokal
3. Gunakan **Dynamic DNS** agar bisa diakses meski IP rumah berubah

⚠️ **Catatan Keamanan**: Berhati-hati saat expose API lokal ke internet publik. Gunakan authentication dan rate limiting.

## 🛠 Teknologi

- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **Axios** - HTTP client untuk fetching data
- **Cheerio** - Library untuk parsing dan scraping HTML
- **dotenv** - Environment variable management

## 📦 Instalasi

1. Clone repository ini:

```bash
git clone <repository-url>
cd altnime-stream-api
```

2. Install dependencies menggunakan pnpm (atau npm/yarn):

```bash
pnpm install
```

atau

```bash
npm install
```

## ⚙️ Konfigurasi

1. Buat file `.env` di root folder:

```env
BASE_URL=https://example-anime-site.com
```

2. Ganti `https://example-anime-site.com` dengan URL website anime yang ingin di-scrape.

## 🚀 Cara Menjalankan

**⚠️ PENTING**: API ini **HANYA** bisa dijalankan di komputer/server dengan **IP residential (IP rumahan)**. Tidak bisa di-deploy ke cloud hosting!

### Development Mode

```bash
pnpm dev
```

atau

```bash
npm run dev
```

### Production Mode (Lokal)

```bash
node src/index.js
```

Server akan berjalan di `http://localhost:3000`

### Menjalankan Sebagai Service (Linux/Mac)

Untuk menjalankan API 24/7 di komputer/server rumah, gunakan PM2:

```bash
# Install PM2
npm install -g pm2

# Jalankan dengan PM2
pm2 start src/index.js --name "otakudesu-api"

# Auto-restart saat komputer reboot
pm2 startup
pm2 save
```

### Mengakses dari Luar Jaringan (Opsional)

Jika ingin mengakses API dari luar rumah:

**Opsi 1 - Ngrok (Paling Mudah)**

```bash
# Install ngrok
npm install -g ngrok

# Jalankan ngrok
ngrok http 3000
```

**Opsi 2 - Cloudflare Tunnel**

```bash
# Install cloudflared
# Ikuti dokumentasi: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

cloudflared tunnel --url http://localhost:3000
```

**Opsi 3 - Port Forwarding**

- Buka router settings
- Forward port 3000 ke IP lokal komputer
- Gunakan Dynamic DNS (No-IP, DuckDNS, dll)

## 📡 Endpoint API

### Base URL

```
http://localhost:3000/api
```

### 1. Ongoing Anime

#### GET `/ongoing-anime`

Mendapatkan daftar anime ongoing halaman pertama.

**Request:**

```http
GET /api/ongoing-anime
```

**Response:**

```json
{
  "message": "Ongoing anime fetched successfully",
  "page": 1,
  "data": [...]
}
```

#### GET `/ongoing-anime/page/:page`

Mendapatkan daftar anime ongoing dengan pagination.

**Request:**

```http
GET /api/ongoing-anime/page/2
```

**Parameters:**

- `page` (number) - Nomor halaman yang ingin diakses

### 2. Complete Anime

#### GET `/complete-anime`

Mendapatkan daftar anime complete halaman pertama.

**Request:**

```http
GET /api/complete-anime
```

#### GET `/complete-anime/page/:page`

Mendapatkan daftar anime complete dengan pagination.

**Request:**

```http
GET /api/complete-anime/page/3
```

**Parameters:**

- `page` (number) - Nomor halaman yang ingin diakses

### 3. Anime Details

#### GET `/anime/:id`

Mendapatkan detail informasi anime tertentu.

**Request:**

```http
GET /api/anime/naruto-shippuden
```

**Parameters:**

- `id` (string) - ID atau slug anime

**Response berisi:**

- Judul anime
- Sub judul
- Gambar cover
- Sinopsis
- Detail (genre, status, studio, dll)
- Link batch download
- Daftar episode

### 4. Episode Stream

#### GET `/episode/:id`

Mendapatkan link streaming dan download untuk episode tertentu.

**Request:**

```http
GET /api/episode/naruto-shippuden-episode-1
```

**Parameters:**

- `id` (string) - ID atau slug episode

**Response berisi:**

- Judul episode
- Pagination (episode sebelumnya/selanjutnya)
- Link streaming
- Link download dengan berbagai kualitas

### 5. Batch Download

#### GET `/batch/:id`

Mendapatkan link batch download untuk anime tertentu (download semua episode sekaligus).

**Request:**

```http
GET /api/batch/naruto-shippuden-batch
```

**Parameters:**

- `id` (string) - ID atau slug batch anime

**Response berisi:**

- Daftar batch dengan berbagai format dan kualitas
- Link download dari berbagai server (Google Drive, ZippyShare, dll)
- Informasi ukuran file untuk setiap kualitas

## 📝 Contoh Response

### Ongoing/Complete Anime List

```json
[
  {
    "title": "One Piece Episode 1234",
    "episode": "Episode 1234",
    "imageUrl": "https://example.com/image.jpg",
    "epzTipe": "TV",
    "newNime": "New",
    "href": "/anime/one-piece-episode-1234"
  },
  ...
]
```

### Anime Details

```json
{
  "heading": "Naruto Shippuden",
  "subHeading": "Naruto: Shippuuden",
  "imageUrl": "https://example.com/naruto.jpg",
  "synopsis": "Naruto Uzumaki, is a loud, hyperactive...",
  "detailData": {
    "judul": "Naruto Shippuden",
    "japanese": "ナルト- 疾風伝",
    "skor": "8.26",
    "produser": "TV Tokyo, Aniplex, KSS",
    "tipe": "TV",
    "status": "Completed",
    "total_episode": "500",
    "durasi": "23 min. per ep.",
    "tanggal_rilis": "Feb 15, 2007",
    "studio": "Pierrot",
    "genre": "Action, Adventure, Comedy, Drama, Fantasy, Shounen"
  },
  "streaming": {
    "batch": {
      "title": "Batch Download",
      "href": "/batch/naruto-shippuden-batch"
    },
    "episode": {
      "heading": "Episode List",
      "episodes_list": [
        {
          "title": "Episode 001",
          "href": "/episode/naruto-shippuden-episode-1"
        },
        ...
      ]
    }
  }
}
```

### Episode Stream

```json
{
  "title": "Naruto Shippuden Episode 1",
  "pagination": [
    {
      "title": "Previous Episode",
      "href": "/episode/naruto-episode-220"
    },
    {
      "title": "Next Episode",
      "href": "/episode/naruto-shippuden-episode-2"
    }
  ],
  "stream_links": "https://example.com/embed/player.php?id=xxx",
  "download_links": [
    {
      "title": "360p",
      "quality": "MP4 360p",
      "link": "https://download-link.com/360p.mp4"
    },
    {
      "title": "480p",
      "quality": "MP4 480p",
      "link": "https://download-link.com/480p.mp4"
    },
    {
      "title": "720p",
      "quality": "MP4 720p",
      "link": "https://download-link.com/720p.mp4"
    }
  ]
}
```

### Batch Download

```json
[
  {
    "batch_title": "Batch 480p",
    "downloads": [
      {
        "quality": "480p",
        "size": "~500MB",
        "servers": [
          {
            "name": "Google Drive",
            "link": "https://drive.google.com/xxx"
          },
          {
            "name": "ZippyShare",
            "link": "https://zippyshare.com/xxx"
          }
        ]
      }
    ]
  },
  {
    "batch_title": "Batch 720p",
    "downloads": [
      {
        "quality": "720p",
        "size": "~1GB",
        "servers": [
          {
            "name": "Google Drive",
            "link": "https://drive.google.com/xxx"
          },
          {
            "name": "Mega",
            "link": "https://mega.nz/xxx"
          }
        ]
      }
    ]
  }
]
```

## 🔧 Cara Kerja

### Arsitektur API

API ini menggunakan arsitektur MVC (Model-View-Controller) sederhana:

```
Request → Route → Controller → Service → Scraping → Response
```

### Flow Kerja:

1. **Request Masuk**: Client mengirim HTTP request ke endpoint API
2. **Routing**: Express router menerima request dan mengarahkan ke controller yang sesuai
3. **Controller**: Controller memproses request dan memanggil service yang diperlukan
4. **Service (Scraping)**: Service melakukan web scraping menggunakan:
   - **Axios**: Untuk mengambil HTML dari website target
   - **Cheerio**: Untuk parsing dan ekstraksi data dari HTML
5. **Response**: Data yang sudah di-extract dikirim kembali ke client dalam format JSON

### Komponen Utama:

#### 1. Routes (`main-route.js`)

Mendefinisikan semua endpoint API dan menghubungkannya dengan controller yang sesuai.

#### 2. Controllers

- `ongoing-anime.js` - Menangani request untuk anime ongoing
- `complete-anime.js` - Menangani request untuk anime complete
- `anime.js` - Menangani request untuk detail anime
- `anime-stream.js` - Menangani request untuk streaming episode
- `anime-batch.js` - Menangani request untuk batch download

#### 3. Services (Scraping)

- `scrape-anime-list.js` - Scraping daftar anime (ongoing/complete)
  - Mengambil HTML dari URL
  - Extract data: judul, episode, gambar, tipe, status
- `scrape-anime.js` - Scraping detail anime
  - Mengambil informasi lengkap anime
  - Extract metadata, sinopsis, genre, studio, dll
  - Extract daftar episode dan link batch
- `scrape-stream.js` - Scraping link streaming
  - Mengambil link streaming dari embed iframe
  - Extract link download dengan berbagai kualitas
  - Extract navigasi episode (prev/next)
- `scrape-batch.js` - Scraping batch download
  - Mengambil link batch download
  - Extract berbagai kualitas dan ukuran file
  - Extract link download dari berbagai server

### Proses Scraping:

1. **HTTP Request**: Axios mengirim GET request ke URL target
2. **HTML Parsing**: Cheerio load HTML response
3. **Data Extraction**: Menggunakan CSS selector untuk extract data:
   ```javascript
   const title = $(".jdlflm").text().trim();
   const imageUrl = $("img").attr("src");
   ```
4. **Data Transformation**: Membersihkan dan format data
5. **Return JSON**: Mengembalikan data dalam format JSON yang terstruktur

## 📁 Struktur Proyek

```
altnime-stream-api/
├── src/
│   ├── index.js                      # Entry point aplikasi
│   ├── routes/
│   │   └── main-route.js            # Definisi semua route API
│   ├── controllers/
│   │   ├── anime-batch.js           # Controller untuk batch download
│   │   ├── anime-stream.js          # Controller untuk streaming
│   │   ├── anime.js                 # Controller untuk detail anime
│   │   ├── complete-anime.js        # Controller untuk anime complete
│   │   └── ongoing-anime.js         # Controller untuk anime ongoing
│   └── services/
│       ├── scrape-anime-list.js     # Service scraping list anime
│       ├── scrape-anime.js          # Service scraping detail anime
│       ├── scrape-batch.js          # Service scraping batch download
│       └── scrape-stream.js         # Service scraping streaming links
├── .env                             # Environment variables
├── package.json                     # Dependencies dan scripts
├── LICENSE                          # License file
└── README.md                        # Dokumentasi
```

## ⚠️ Catatan Penting

### Pembatasan Deployment

- **API ini TIDAK BISA di-deploy ke cloud hosting** (Vercel, Heroku, AWS, dll) karena Otakudesu memblokir IP datacenter
- **Hanya bisa dijalankan di komputer/server dengan IP residential** (koneksi internet rumah)
- Jika di-deploy ke cloud, akan mendapat error **403 Forbidden** atau **Cloudflare protection page**

### Web Scraping

- API ini melakukan web scraping dari website Otakudesu
- Gunakan dengan bijak dan patuhi robots.txt dari website target
- Scraping dapat berhenti bekerja jika struktur HTML website target berubah
- Pertimbangkan untuk menambahkan rate limiting agar tidak membebani server target

### Keamanan dan Performance

- Jika expose ke internet, **WAJIB** tambahkan authentication
- Implementasikan rate limiting untuk mencegah abuse
- Gunakan caching (Redis/memory) untuk mengurangi request ke Otakudesu
- Error handling sudah diimplementasikan untuk setiap endpoint

### Legal

- API ini dibuat untuk tujuan pembelajaran
- Data yang di-scrape adalah milik Otakudesu
- Gunakan API ini dengan bertanggung jawab dan hormati hak cipta konten

## 📄 License

Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau issue untuk perbaikan dan saran.

---

**Disclaimer**: API ini dibuat untuk tujuan pembelajaran. Pastikan untuk mematuhi terms of service dari website yang di-scrape.
