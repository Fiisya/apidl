const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: "Upload gambar QR Code dengan field 'file'" });
        }

        const image = await Jimp.read(req.file.buffer);
        const qr = new qrCodeReader();

        qr.callback = (err, value) => {
            if (err || !value) {
                return res.status(400).json({ status: 400, message: "Gagal membaca QR Code" });
            }

            res.json({ status: 200, result: value.result });
        };

        qr.decode(image.bitmap);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Terjadi kesalahan" });
    }
});

module.exports = router;