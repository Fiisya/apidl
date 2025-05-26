const express = require('express');
const axios = require('axios');
const router = express.Router();

async function tiktokDownloaderVideo(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];

            function formatNumber(integer) {
                return Number(parseInt(integer)).toLocaleString().replace(/,/g, ".");
            }

            function formatDate(n, locale = "id-ID") {
                let d = new Date(n * 1000);
                return d.toLocaleString(locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                });
            }

            let domain = "https://www.tikwm.com/api/";
            let res = (await axios.post(domain, {}, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Referer": "https://www.tikwm.com/",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10)"
                },
                params: {
                    url,
                    count: 12,
                    cursor: 0,
                    web: 1,
                    hd: 1
                }
            })).data.data;

            if (!res.size) {
                res.images.forEach(v => {
                    data.push({ type: "photo", url: v });
                });
            } else {
                data.push({
                    type: "watermark",
                    url: "https://www.tikwm.com" + res.wmplay
                }, {
                    type: "nowatermark",
                    url: "https://www.tikwm.com" + res.play
                }, {
                    type: "nowatermark_hd",
                    url: "https://www.tikwm.com" + res.hdplay
                });
            }

            resolve({
                status: true,
                title: res.title,
                taken_at: formatDate(res.create_time),
                region: res.region,
                id: res.id,
                duration: res.duration + " detik",
                cover: "https://www.tikwm.com" + res.cover,
                music_info: {
                    title: res.music_info.title,
                    author: res.music_info.author,
                    url: "https://www.tikwm.com" + (res.music || res.music_info.play)
                },
                data,
                author: {
                    nickname: res.author.nickname
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

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
        const result = await tiktokDownloaderVideo(url);
        res.json({
            status: 200,
            creator: 'AlfiXD',
            source: url,
            ...result
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({
            status: 500,
            creator: 'AlfiXD',
            error: 'Terjadi kesalahan, coba lagi nanti!'
        });
    }
});

module.exports = router;
