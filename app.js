const express = require('express');
const path = require('path');
require('dotenv').config();
const router_auth = require('./routes/auth')
const router_QR = require('./routes/qr')
const hbs = require('hbs');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: true })); // Abilita il parsing dei form
app.use(express.json());

// Configurazione Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use('/css', express.static('public/css'))
app.use(express.static('public'))


app.use('/', router_auth );
app.use('/QR', router_QR);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen(4040, () => {
  console.log(`Server avviato sulla porta 4040`);
}); 