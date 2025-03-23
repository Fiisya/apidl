const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const router = express.Router();

async function snapinst(url) {
    try {
        const { data } = await axios.get('https://snapinst.app/');
        const $ = cheerio.load(data);
        const form = new FormData();

        form.append('url', url);
        form.append('action', 'post');
        form.append('lang', '');
        form.append('cf-turnstile-response', '');
        form.append('token', $('input[name=token]').attr('value'));

        const headers = {
            ...form.getHeaders(),
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'Referer': 'https://snapinst.app/',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        };

        const jsbejad = await axios.post('https://snapinst.app/action2.php', form, { headers });
        const ayok = new Function('callbuk', jsbejad.data.replace('eval', 'callbuk'));

        const html = await new Promise((resolve, reject) => {
            ayok(t => {
                const code = t.split(".innerHTML = ")[1].split("; document.")[0];
                resolve(eval(code));
            });
        });

        const _ = cheerio.load(html);
        return {
            username: _('.row div.left:eq(0)').text().trim(),
            urls: _('.row .download-item a').map((i, el) => $(el).attr('href')).get()
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

router.get('/', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'Masukkan URL Instagram!'
        });
    }

    const result = await snapinst(url);
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
});

module.exports = router;