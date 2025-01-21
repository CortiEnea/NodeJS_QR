const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/QR_Generator';

mongoose.set('strictQuery', true);
mongoose.pluralize(null); 

mongoose.connect(url) 
    .then(() => console.log('Connessione al database riuscita!'))
    .catch((err) => console.error('Errore di connessione:', err));

const qrDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    color: { type: String, default: '#000000' },
    back: { type: String, default: '#ffffff' },
    filename: { type: String } 
});

const QrData = mongoose.model('QrData', qrDataSchema);

module.exports = QrData;  
