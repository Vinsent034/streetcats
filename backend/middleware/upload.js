// Middleware per upload immagini con Multer
const multer = require('multer');
const path = require('path');

// Configurazione storage su disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('upload: salvo file in ./uploads/');
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    // Nome univoco: timestamp + numero random + estensione originale
    const estensione = path.extname(file.originalname);
    const nomeFile = Date.now() + '-' + Math.round(Math.random() * 1e9) + estensione;
    console.log('upload: nome file generato:', nomeFile);
    cb(null, nomeFile);
  }
});

// Filtro: accetto solo immagini
const filtroFile = (req, file, cb) => {
  const tipiAccettati = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (tipiAccettati.includes(file.mimetype)) {
    console.log('upload: tipo file accettato:', file.mimetype);
    cb(null, true);
  } else {
    console.log('upload: tipo file rifiutato:', file.mimetype);
    cb(new Error('Formato non supportato. Usa JPEG, PNG, GIF o WEBP.'), false);
  }
};

// Configurazione finale multer
const upload = multer({
  storage: storage,
  fileFilter: filtroFile,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB massimo
  }
});

module.exports = upload;
