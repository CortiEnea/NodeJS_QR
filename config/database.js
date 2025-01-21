const mongoose = require('mongoose');

// Gestione della connessione MongoDB in un unico punto
mongoose.set('strictQuery', true);
mongoose.pluralize(null);

// Connessione a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/QR_Generator');
        console.log('MongoDB connesso con successo');
    } catch (err) {
        console.error('Errore di connessione MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB; 