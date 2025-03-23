const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: 400,
            creator: 'AlfiXD',
            error: 'Masukkan URL TikTok!'
        });
    }

    try {
        const response = await axios.post(
            'https://snaptikapp.me/wp-json/aio-dl/video-data',
            { url },
            {
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
                },
                timeout: 10000
            }
        );

        const { data } = response;

        if (!data || !data.medias || data.medias.length === 0) {
            return res.status(500).json({
                status: 500,
                creator: "AlfiXD",
                error: "Gagal mendapatkan link video."
            });
        }

        res.json({
            status: 200,
            creator: "AlfiXD",
            source: url,
            download_links: data.medias.map(media => ({
                quality: media.quality || "Unknown",
                format: media.format || "Unknown",
                url: media.url
            }))
        });
    } catch (err) {
        console.error("Error:", err.message, err.response?.data);
        res.status(500).json({
            status: 500,
            creator: 'AlfiXD',
            error: 'Terjadi kesalahan, coba lagi nanti!'
        });
    }
});

module.exports = router;