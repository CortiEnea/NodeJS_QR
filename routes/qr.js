const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const QRCode = require('qrcode'); 
const QrData = require('../models/QrData');
const ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().substring(1);
        if (ALLOWED_EXTENSIONS.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    }
});


router.get('/', (req, res) => {
    res.render('QR/create_qr');
});

router.post('/generate_qr', upload.single('icon_img'), async (req, res) => {
    try {
        const { name, url, color, backcolor } = req.body;
        const filename = req.file ? req.file.filename : null;

        const qrCodeDataURL = await QRCode.toDataURL(url, {
            color: {
                dark: color || '#000000',
                light: backcolor || '#ffffff'
            }
        });

        await saveQrData(name, url, color, backcolor, filename);

        res.render('QR/qr_result', {
            url,
            color,
            back: backcolor,
            file: filename,
            qrCode: qrCodeDataURL 
        });
    } catch (err) {
        console.error('Errore durante la generazione del QR:', err);
        res.status(500).send('Errore durante la generazione del QR');
    }
});

async function saveQrData(name, url, color, back, file) {
    try {
        const qr = new QrData({
            name,
            link: url,
            color,
            back,
            filename: file
        });
        await qr.save();
        return `Qr per il seguente link creato con successo: ${qr.link}`;
    } catch (err) {
        throw err;  
    }
}

router.get('/history', async (req, res) => {
    try {
        const qrcodes = await QrData.find();
        console.log("QR codes trovati:", qrcodes);
        
        // Genera i QR codes per ogni record
        const qrcodesWithImages = await Promise.all(qrcodes.map(async (qr) => {
            console.log("Generando QR per:", qr.link, qr.color, qr.back);
            
            const qrCodeDataURL = await QRCode.toDataURL(qr.link, {
                color: {
                    dark: qr.color || '#000000',
                    light: qr.back || '#ffffff'
                }
            });
            
            const result = {
                ...qr.toObject(),
                qrCode: qrCodeDataURL
            };
            console.log("QR generato con successo per:", result.link);
            return result;
        }));

        console.log("Numero di QR processati:", qrcodesWithImages.length);
        res.render('QR/qr_history', { qrcodes: qrcodesWithImages });
    } catch (err) {
        console.error('Errore specifico:', err);
        res.status(500).send('Errore nel recupero della cronologia');
    }
});

router.get('/index', async (req, res) => {
    try {
        const qrcodes = await QrData.find();
        console.log('QR codes trovati:', qrcodes);
        res.render('QR/index', { qrcodes });
    } catch (err) {
        console.error('Errore specifico:', err);
        res.status(500).send(`Errore nel recupero dei QR code: ${err.message}`);
    }
});



module.exports = router;
