const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const router = express.Router();

// Scraper getmyfb
async function getmyfb(urlFb) {
    try {
        const form = new FormData();
        form.append('id', urlFb);
        form.append('locale', 'id');

        const response = await axios.post('https://getmyfb.com/process', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const title = $('.results-item-text').text().trim();
            const thumbnail = $('.results-item-image').attr('src');
            const urlHd = $('.results-list li:nth-child(1) a').attr('href');
            const urlSd = $('.results-list li:nth-child(2) a').attr('href');

            return {
                title: title || 'Unknown Title',
                thumb: thumbnail || null,
                video: {
                    hd: urlHd || null,
                    sd: urlSd || null,
                },
            };
        } else {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Route utama
router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: 400,
            creator: 'AlfiXD',
            error: 'Masukkan URL Facebook!'
        });
    }

    try {
        const result = await getmyfb(url);

        if (!result.video.hd && !result.video.sd) {
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
            title: result.title,
            thumbnail: result.thumb,
            download_link: {
                hd: result.video.hd,
                sd: result.video.sd
            }
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
