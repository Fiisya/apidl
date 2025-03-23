const express = require('express')
const router = express.Router()
const axios = require('axios')

async function ytmp3(url, format = 'mp3') {
    const headers = {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://id.ytmp3.mobi/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    const initial = await axios.get(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers, timeout: 8000 })
    const init = initial.data

    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1]
    if (!id) throw new Error('Video ID tidak ditemukan!')

    const convertURL = `${init.convertURL}&v=${id}&f=${format}&_=${Math.random()}`
    const converts = await axios.get(convertURL, { headers, timeout: 8000 })
    const convert = converts.data

    let info = {}
    for (let i = 0; i < 3; i++) {
        const progress = await axios.get(convert.progressURL, { headers, timeout: 8000 })
        info = progress.data
        if (info.progress == 3) break
        await new Promise(resolve => setTimeout(resolve, 1500))
    }

    if (!convert.downloadURL) throw new Error('Gagal mendapatkan link download.')

    return {
        url: convert.downloadURL,
        title: info.title || 'No Title'
    }
}

router.get('/', async (req, res) => {
    const url = req.query.url
    const format = req.query.format || 'mp3'

    if (!url) {
        return res.status(400).json({
            status: 400,
            error: 'Masukkan URL YouTube!'
        })
    }

    try {
        const data = await ytmp3(url, format)
        res.json({
            status: 200,
            source: url,
            format,
            title: data.title,
            download_link: data.url
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Terjadi kesalahan, coba lagi nanti!'
        })
    }
})

module.exports = router
