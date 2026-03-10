// Entry point del backend StreetCats
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importo il database (così testa la connessione all'avvio)
const connessione = require('./config/db');

// Creo l'app Express
const app = express();

// Middleware globali
app.use(cors());
app.use(express.json());

// Servo le immagini caricate come file statici
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotte API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cats', require('./routes/catRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Rotta di test
app.get('/', (req, res) => {
  res.json({ messaggio: 'API StreetCats funzionante!' });
});

// Gestione errori globale (cattura errori non gestiti dai controller)
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err.message);
  res.status(err.status || 500).json({ errore: err.message || 'Errore interno del server.' });
});

// Avvio il server
const PORTA = process.env.PORT || 3005;
app.listen(PORTA, () => {
  console.log(`Server in ascolto sulla porta ${PORTA}`);
});