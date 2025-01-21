const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/QR_Generator';

mongoose.set('strictQuery');
mongoose.pluralize(null);

mongoose.connect(url)
    .then(() => console.log('Connessione al database riuscita!'))
    .catch((err) => console.error('Errore di connessione:', err));

    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    });
    
    const User = mongoose.model('User', userSchema);
    
module.exports = User; 