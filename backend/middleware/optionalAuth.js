// Middleware di autenticazione opzionale
// Non blocca la richiesta se il token manca, imposta solo req.user
const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  console.log('optionalAuth: controllo token opzionale...');

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('optionalAuth: nessun token, continuo come utente anonimo');
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const datiDecodificati = jwt.verify(token, process.env.JWT_SECRET);
    console.log('optionalAuth: token valido, utente:', datiDecodificati.email);
    req.user = datiDecodificati;
  } catch (errore) {
    console.log('optionalAuth: token non valido, continuo come anonimo -', errore.message);
    req.user = null;
  }

  next();
};

module.exports = optionalAuth;
