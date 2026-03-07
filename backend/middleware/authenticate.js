// Middleware di autenticazione obbligatoria
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  console.log('authenticate: controllo token...');

  // Leggo l'header Authorization
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('authenticate: token mancante');
    return res.status(401).json({ errore: 'Token mancante. Devi essere autenticato.' });
  }

  // Estraggo il token dopo "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    const datiDecodificati = jwt.verify(token, process.env.JWT_SECRET);
    console.log('authenticate: token valido, utente:', datiDecodificati.email);
    req.user = datiDecodificati;
    next();
  } catch (errore) {
    console.log('authenticate: token non valido -', errore.message);
    return res.status(401).json({ errore: 'Token non valido o scaduto.' });
  }
};

module.exports = authenticate;
