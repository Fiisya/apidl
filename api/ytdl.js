const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const router = express.Router();

const SaveTube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Mozilla/5.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],
  hexToBuffer(hex) {
    return Buffer.from(hex.match(/.{1,2}/g).join(''), 'hex');
  },
  decrypt(enc) {
    return new Promise((resolve, reject) => {
      try {
        const key = SaveTube.hexToBuffer('C5D58EF67A7584E4A29F6C35BBC4EB12');
        const buffer = Buffer.from(enc, 'base64');
        const iv = buffer.slice(0, 16);
        const content = buffer.slice(16);
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
        resolve(JSON.parse(decrypted.toString()));
      } catch (err) {
        reject(err);
      }
    });
  },
  youtubeId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  },
  async request(endpoint, data = {}, method = 'post') {
    const url = endpoint.startsWith('http') ? endpoint : `${this.api.base}${endpoint}`;
    try {
      const res = await axios({
        method,
        url,
        headers: this.headers,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined
      });
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, error: err.message, code: err.response?.status || 500 };
    }
  },
  async getDownload(url, format) {
    if (!url) return { status: false, error: 'Parameter "url" tidak boleh kosong', code: 400 };
    if (!this.formats.includes(format)) {
      return { status: false, error: 'Format tidak valid', available: this.formats, code: 400 };
    }

    const videoId = this.youtubeId(url);
    if (!videoId) return { status: false, error: 'Gagal mengekstrak ID YouTube', code: 400 };

    const cdnRes = await this.request(this.api.cdn, {}, 'get');
    if (!cdnRes.status) return { status: false, error: 'Gagal mendapatkan CDN' };

    const cdn = cdnRes.data.cdn;
    const infoRes = await this.request(`https://${cdn}${this.api.info}`, { url: `https://www.youtube.com/watch?v=${videoId}` });
    if (!infoRes.status) return { status: false, error: 'Gagal mendapatkan data video' };

    const decrypted = await this.decrypt(infoRes.data.data);
    const dlRes = await this.request(`https://${cdn}${this.api.download}`, {
      id: videoId,
      downloadType: format === 'mp3' ? 'audio' : 'video',
      quality: format === 'mp3' ? '128' : format,
      key: decrypted.key
    });

    return {
      status: true,
      result: {
        title: decrypted.title,
        type: format === 'mp3' ? 'audio' : 'video',
        format,
        thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        download_url: dlRes.data.data.downloadUrl,
        duration: decrypted.duration
      }
    };
  }
};

router.get('/', async (req, res) => {
  const { url, format = '360' } = req.query;

  const data = await SaveTube.getDownload(url, format);
  if (!data.status) return res.status(data.code || 500).json({ status: false, error: data.error });

  res.json({ status: true, result: data.result });
});

module.exports = router;
