const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');  
const bcrypt = require('bcryptjs');      
const app = express();

// Configurazione della view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

function validaDati(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).send("Tutti i campi sono obbligatori");
  }
  next(); 
}

// Route per la login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', validaDati, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente nel database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Username non trovato.");
    }

    // Verifica la password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Password non corretta.");
    }

    res.render('QR/create_qr')
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).send("Errore interno del server.");
  }
});


router.get('/signup', (req,res) => {
  res.render('auth/signup');
});

// Route per la creazione di un nuovo utente (POST)
router.post('/signup', validaDati, async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username già in uso. Scegli un altro username.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.render('QR/create_qr')
  } catch (error) {
    console.error("Errore durante la creazione dell'utente:", error);
    res.status(500).send("Errore interno del server.");
  }
});

module.exports = router;
