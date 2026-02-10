require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const catRoutes = require('./routes/cats');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3005;

// Configurazione CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/cats', catRoutes);
app.use('/comments', commentRoutes);

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'Benvenuto in StreetCats API',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'Connesso' : 'Non connesso',
    timestamp: new Date()
  });
});

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connessione a MongoDB riuscita');
    console.log('Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('Errore connessione MongoDB:', err.message);
    process.exit(1);
  });

// Avvio server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
