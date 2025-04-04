const express = require('express');
const axios = require('axios');
const router = express.Router();

const colorList = [
  'white', 'black', 'red', 'green', 'blue', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray',
  'cyan', 'magenta', 'lime', 'maroon', 'navy', 'olive', 'teal', 'silver', 'gold',
  'violet', 'indigo', 'beige', 'coral', 'crimson', 'turquoise', 'salmon', 'khaki', 'lavender', 'mint'
];

async function urlToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch {
    return null;
  }
}

router.post('/', async (req, res) => {
  const { text, color, name, photo_url } = req.body;
  if (!text || !color || !name || !photo_url) return res.status(400).json({ status: false, message: 'Missing required fields' });
  if (!colorList.includes(color.toLowerCase())) return res.status(400).json({ status: false, message: 'Invalid color' });

  const base64Image = await urlToBase64(photo_url);
  if (!base64Image) return res.status(500).json({ status: false, message: 'Failed to fetch image' });

  const payload = {
    type: 'quote',
    format: 'png',
    backgroundColor: color,
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: name,
          photo: { url: `data:image/jpeg;base64,${base64Image}` }
        },
        text: text
      }
    ]
  };

  try {
    const result = await axios.post('https://bot.lyo.su/quote/generate', payload, { headers: { 'Content-Type': 'application/json' } });
    const imageBuffer = Buffer.from(result.data.result.image, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch {
    res.status(500).json({ status: false, message: 'Failed to generate quote' });
  }
});

module.exports = router;