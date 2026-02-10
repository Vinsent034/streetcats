const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Autenticazione richiesta' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token non valido' });
  }
};

module.exports = authenticate;
