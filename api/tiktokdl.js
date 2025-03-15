const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const LoveTik = {
    async dapatkan(url) {
        try {
            const response = await fetch('https://lovetik.com/api/ajax/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: `query=${encodeURIComponent(url)}`
            });

            if (!response.ok) throw new Error('Gagal mengambil data dari LoveTik');

            const data = await response.json();
            if (!data.images) data.images = [];
            const result = {
                video: [],
                audio: []
            };

            if (data.links) {
                data.links.forEach(item => {
                    if (!item.a) return;
                    const formatted = {
                        format: item.t.replace(/<.*?>|♪/g, '').trim(), // Menghapus tag HTML dan tanda ♪
                        resolution: item.s || 'Audio Only',
                        link: item.a
                    };

                    if (item.ft == 1) {
                        result.video.push(formatted);
                    } else {
                        result.audio.push(formatted);
                    }
                });

                const conversionData = data.links.find(m => m.c);
                if (conversionData) {
                    data.render = async () => {
                        const rendered = await fetch('https://lovetik.com/api/ajax/convert', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            },
                            body: `c_data=${encodeURIComponent(conversionData.c)}`
                        });

                        return rendered.json();
                    };
                }
            }

            return { ...data, ...result };
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    }
};

router.get('/', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: 'Masukkan URL Tiktok!'
            });
        }

        const result = await LoveTik.dapatkan(url);
        if (!result) {
            return res.status(500).json({
                status: false,
                code: 500,
                message: 'Gagal mengambil data!'
            });
        }

        res.json({
            status: true,
            code: 200,
            creator: 'AlfiXD',
            result
        });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({
            status: false,
            code: 500,
            message: 'Terjadi kesalahan di server!'
        });
    }
});

module.exports = router;
