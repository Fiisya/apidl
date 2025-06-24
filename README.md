````markdown
# Rest API AlfiXD

[![Total Endpoints](https://img.shields.io/badge/Endpoints-30%2B-blue?style=for-the-badge)](https://api.alfixd.my.id)
[![Online Endpoints](https://img.shields.io/badge/Online-29-brightgreen?style=for-the-badge)](https://api.alfixd.my.id)
[![Offline Endpoints](https://img.shields.io/badge/Offline-1-red?style=for-the-badge)](https://api.alfixd.my.id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Fiisya/apidl?style=for-the-badge&color=gold)](https://github.com/Fiisya/apidl/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Fiisya/apidl?style=for-the-badge&color=lightgray)](https://github.com/Fiisya/apidl/network/members)

Rest API AlfiXD adalah proyek yang menyediakan berbagai endpoint API untuk berbagai keperluan. Dibangun menggunakan Node.js dan Express.js, proyek ini dirancang untuk memudahkan pengembangan aplikasi dengan akses data yang mudah.

## 🚀 Fitur Utama

Proyek ini menawarkan beragam fitur yang terbagi dalam beberapa kategori:

### ⬇️ Downloader
* **YouTube Downloader**: Mendownload video atau shorts dari YouTube.
    * `GET /api/ytdl?url=&format=`
    * Contoh: `/api/ytdl?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=360`
* **Twitter Downloader**: Mendownload video atau gambar dari Twitter.
    * `GET /api/twitterdl?url=`
    * Contoh: `/api/twitterdl?url=https://twitter.com/nasa/status/1782296068224520448`
* **Instagram Downloader**: Mendownload video atau gambar dari Instagram.
    * `GET /api/igdl?url=`
    * Contoh: `/api/igdl?url=https://www.instagram.com/p/C7u1dK4y4Zc/`
* **Facebook Downloader**: Mendownload video dari Facebook.
    * `GET /api/fbdl?url=`
    * Contoh: `/api/fbdl?url=https://www.facebook.com/facebook/videos/10153237859366729/`
* **TikTok Downloader**: Mendownload video dari TikTok.
    * `GET /api/ttdl?url=`
    * Contoh: `/api/ttdl?url=https://www.tiktok.com/@tiktok/video/7379768000913989930`
* **GitHub Cloning**: Cloning repositori dari GitHub.
    * `GET /api/gitclone?url=`
    * Contoh: `/api/gitclone?url=https://github.com/expressjs/express`
* **Spotify Downloader**: Mendownload lagu dari Spotify.
    * `GET /api/spotifydl?url=`
    * Contoh: `/api/spotifydl?url=https://open.spotify.com/track/4bfK3d8IEd415kLqM8t52t`

### 🔎 Search
* **Search Groups**: Mencari grup WhatsApp berdasarkan kata kunci.
    * `GET /api/searchgroups?q=`
    * Contoh: `/api/searchgroups?q=programming`
* **Random Meme**: Gambar random yang berisi Meme.
    * `GET /api/randommeme?count=`
    * Contoh: `/api/randommeme?count=3`
* **TikTok Search**: Mencari video dari TikTok berdasarkan query.
    * `GET /api/ttsearch?q=`
    * Contoh: `/api/ttsearch?q=funny%20cats`
* **Youtube**: Mencari video dari YouTube berdasarkan kata kunci atau query.
    * `GET /api/ytsearch?q=`
    * Contoh: `/api/ytsearch?q=tutorial%20nodejs`
* **NPM Search**: Mencari package/module/library yang tersedia.
    * `GET /api/npmsearch?q=`
    * Contoh: `/api/npmsearch?q=axios`
* **Google Search**: Mencari apapun dan semuanya dari Google.
    * `GET /api/googlesearch?q=`
    * Contoh: `/api/googlesearch?q=contoh%20api`
* **Pinterest**: Mencari gambar di Pinterest.
    * `GET /api/pinterest?q=`
    * Contoh: `/api/pinterest?q=aesthetic%20wallpaper`
* **Spotify Search**: Mencari lagu dengan informasi lengkap.
    * `GET /api/spotifysearch?q=`
    * Contoh: `/api/spotifysearch?q=coldplay%20yellow`

### 🕵️ Stalker
* **Genshin Stalk**: Stalking akun Genshin Impact berdasarkan UID.
    * `GET /api/gistalk?uid=`
    * Contoh: `/api/gistalk?uid=800000000`
* **GitHub Stalk**: Stalking akun GitHub berdasarkan username.
    * `GET /api/githubstalk?username=`
    * Contoh: `/api/githubstalk?username=Fiisya`

### 🧠 AI & Image
* **LLaMA 3.3 70B Versatile**: Mengakses model LLaMA 3.3 70B.
    * `GET /api/llama-3.3-70b-versatile?content=`
    * Contoh: `/api/llama-3.3-70b-versatile?content=jelaskan%20tentang%20revolusi%20industri%204.0`
* **Gemini AI**: Mengakses AI model Gemini.
    * `GET /api/gemini?text=`
    * Contoh: `/api/gemini?text=Apa%20itu%20kecerdasan%20buatan%3F`
* **Txt2Img**: Membuat gambar dari AI dengan berbagai style.
    * `GET /api/txt2img?prompt=&style=`
    * Contoh: `/api/txt2img?prompt=a%20cat%20eating%20pizza&style=anime`
* **Brat Image**: Mengubah teks menjadi gambar brat.
    * `GET /api/brat?text=`
    * Contoh: `/api/brat?text=Hello%20World`
* **Quoted Chat**: Membuat gambar dengan desain quoted chat.
    * `GET /api/qc?text=&name=&color=&profile=`
    * Contoh: `/api/qc?text=Hello%20there&name=John%20Doe&color=blue&profile=https://example.com/avatar.jpg`

### 🛠️ Tools
* **Genshin Character Build**: Build karakter Genshin Impact yang lengkap.
    * `GET /api/genshinbuild?q=`
    * Contoh: `/api/genshinbuild?q=hutao`
* **Screenshot Web**: Screenshot website.
    * `GET /api/ssweb?url=`
    * Contoh: `/api/ssweb?url=https://google.com`
* **Translate**: Menerjemahkan bahasa.
    * `GET /api/translate?text=&to=`
    * Contoh: `/api/translate?text=Hello&to=id`
* **Nulis**: Membuat gambar buku beserta tulisan.
    * `GET /api/nulis?text=`
    * Contoh: `/api/nulis?text=Ini%20adalah%20contoh%20tulisan%20di%20buku`
* **Cuaca**: Mendapatkan informasi cuaca semua kota.
    * `GET /api/cuaca?kota=`
    * Contoh: `/api/cuaca?kota=Jakarta`
* **QR Code Generator**: Membuat QR secara otomatis.
    * `GET /api/qrcodegenerator?text=`
    * Contoh: `/api/qrcodegenerator?text=https://api.alfixd.my.id`
* **Credit Card Generator**: Fake generator Credit Card (hanya untuk Fun).
    * `GET /api/vcc?type=&count=`
    * Contoh: `/api/vcc?type=Visa&count=1`

### 😂 Fun
* **Cek Khodam**: Permainan seru yang menunjukkan khodam seseorang.
    * `GET /api/cekkhodam?nama=`
    * Contoh: `/api/cekkhodam?nama=Budi`
* **Tahu Kah Kamu?**: Permainan seru yang menunjukkan fakta random.
    * `GET /api/tahukahkamu`
    * Contoh: `/api/tahukahkamu`

### 📰 Berita
* **Detik News**: Mendapatkan informasi berita terbaru dari Detik News.
    * `GET /api/detiknews`
    * Contoh: `/api/detiknews`
* **Kompas News**: Mendapatkan informasi berita terbaru dari Kompas.
    * `GET /api/kompasnews`
    * Contoh: `/api/kompasnews`

## 🔗 Link API
Anda dapat mengakses Rest API di sini: [https://api.alfixd.my.id](https://api.alfixd.my.id).

## 🛠️ Instalasi & Penggunaan (Untuk Pengembang)

### Prasyarat
Pastikan Anda memiliki Node.js dan npm terinstal di sistem Anda.

### Kloning Repositori
```bash
git clone [https://github.com/Fiisya/apidl.git](https://github.com/Fiisya/apidl.git)
cd apidl
````

### Instalasi Dependensi

```bash
npm install
```

Daftar dependensi yang digunakan dapat ditemukan di `package.json`:

  * `express`: `^4.18.2`
  * `cors`: `^2.8.5`
  * `axios`: `^1.5.0`
  * `cheerio`: `^1.0.0-rc.12`
  * `crypto`: `^1.0.1`
  * `crypto-js`: `^4.2.0`
  * `form-data`: `^4.0.0`
  * `yt-search`: `^2.10.6`
  * `@vitalets/google-translate-api`: `^8.0.0`
  * `@google/generative-ai`: `^0.24.0`
  * `express-rate-limit`: `^7.5.0`
  * `weather-js`: `^2.0.0`
  * `https`: `^1.0.0`
  * `qrcode`: `^1.5.4`
  * `qs`: `^6.11.2`
  * `mime-types`: `^2.1.35`

### Menjalankan Server

```bash
npm start
```

### Struktur Proyek

```
apidl/
├── api/
│   ├── brat.js
│   ├── cekkhodam.js
│   ├── cekkhodamarray.js
│   ├── cuaca.js
│   ├── detiknews.js
│   ├── fbdl.js
│   ├── gemini.js
│   ├── genshinbuild.js
│   ├── gistalk.js
│   ├── gitclone.js
│   ├── githubstalk.js
│   ├── googlesearch.js
│   ├── igdl.js
│   ├── kompasnews.js
│   ├── llama-3.3-70b-versatile.js
│   ├── npmsearch.js
│   ├── nulis.js
│   ├── pinterest.js
│   ├── qc.js
│   ├── qrcodegenerator.js
│   ├── randommeme.js
│   ├── readqr.js
│   ├── searchgroups.js
│   ├── spotifydl.js
│   ├── spotifysearch.js
│   ├── ssweb.js
│   ├── tahukahkamu.js
│   ├── tahukahkamuarray.js
│   ├── translate.js
│   ├── ttdl.js
│   ├── ttsearch.js
│   ├── twitterdl.js
│   ├── txt2img.js
│   ├── vcc.js
│   ├── ytdl.js
│   └── ytsearch.js
├── public/
│   ├── index.html
│   ├── monitor/
│   │   └── monitor.html
│   ├── script.js
│   └── styles.css
├── index.js
├── package.json
├── README.md
└── vercel.json
```

## 📈 Monitoring API

Tersedia halaman monitoring real-time untuk melihat total permintaan:

  * **Halaman Monitor**: `/monitor-page`
  * **Event Stream**: `/monitor`

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).

## 🤝 Kontribusi

Kontribusi sangat dihargai\! Jika Anda memiliki saran atau menemukan bug, silakan buat *issue* atau *pull request* di repositori ini.

## ✉️ Kontak

Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi melalui GitHub: [Fiisya](https://github.com/Fiisya).
Atau bergabung dengan saluran WhatsApp: [WhatsApp Channel](https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110).

-----

Made with ❤️ by AlfiXD

```
```
