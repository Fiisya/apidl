const express = require('express');
const fetch = require('node-fetch');
const { lookup } = require('mime-types');

const router = express.Router();

// Fungsi utama untuk memproses link MediaFire
async function MediaFire(url) {
    try {
        const response = await fetch(`https://r.jina.ai/${url}`);
        const text = await response.text();

        const result = {
            filename: '',
            size: '',
            mimetype: '',
            url: '',
            repair: ''
        };

        // Ambil nama file dari URL
        const fileMatch = url.match(/\/file\/[^\/]+\/([^\/]+)/);
        if (fileMatch) result.filename = decodeURIComponent(fileMatch[1]);

        // Tentukan mimetype berdasarkan ekstensi
        const ext = result.filename.split('.').pop();
        if (ext) result.mimetype = lookup(ext.toLowerCase()) || `application/${ext}`;

        // Cari link download
        const matchUrl = text.match(/https:\/\/download\d+\.mediafire\.com\/[^\s"]+/);
        if (matchUrl) result.url = matchUrl[0];

        // Cari ukuran file
        const matchSize = text.match(/(\d+(\.\d+)?\s?[KMGT]B)/i);
        if (matchSize) result.size = matchSize[1];

        if (!result.url) {
            return { status: false, message: 'Gagal mendapatkan link download.' };
        }

        return { status: true, ...result };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

// Endpoint utama
router.get('/', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'Parameter url wajib diisi.'
        });
    }

    const result = await MediaFire(url);

    if (!result.status) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: result.message || 'Gagal memproses URL.'
        });
    }

    res.status(200).json({
        status: true,
        code: 200,
        creator: 'AlfiXD',
        result: {
            filename: result.filename,
            size: result.size,
            mimetype: result.mimetype,
            url: result.url
        }
    });
});

// Endpoint health check
router.get('/health', (req, res) => {
    res.json({
        status: true,
        message: 'MediaFire downloader service is running'
    });
});

module.exports = router;
