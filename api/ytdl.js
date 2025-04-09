const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

router.get('/', async (req, res) => {
  const { url, format = 'mp4' } = req.query;
  if (!url) return res.status(400).json({ status: 400, error: 'Parameter url diperlukan' });

  try {
    const formDataInfo = new FormData();
    formDataInfo.append('url', url);

    const infoResponse = await axios.post('https://ytdown.siputzx.my.id/api/get-info', formDataInfo, {
      headers: formDataInfo.getHeaders()
    });

    const info = infoResponse.data;

    const formDataDownload = new FormData();
    formDataDownload.append('id', info.id);
    formDataDownload.append('format', format);
    formDataDownload.append('info', JSON.stringify(info));

    const downloadResponse = await axios.post('https://ytdown.siputzx.my.id/api/download', formDataDownload, {
      headers: formDataDownload.getHeaders()
    });

    if (!downloadResponse.data.download_url) {
      return res.status(500).json({ status: 500, error: 'Gagal mendapatkan link unduhan' });
    }

    res.json({
      status: 200,
      result: {
        title: info.title,
        thumbnail: info.thumbnail,
        format,
        download_url: `https://ytdown.siputzx.my.id${downloadResponse.data.download_url}`
      }
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = router;