const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registrazione utente
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La password deve avere almeno 6 caratteri' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Il nome deve avere almeno 2 caratteri' });
    }

    const utenteEsiste = await User.findOne({ email: email.toLowerCase() });
    if (utenteEsiste) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const nuovoUtente = new User({
      email: email.toLowerCase(),
      password: passwordHash,
      name: name.trim()
    });

    const salvato = await nuovoUtente.save();

    res.status(201).json({
      message: 'Registrazione completata con successo',
      userId: salvato._id
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Dati non validi: ' + error.message });
    }

    res.status(500).json({ error: 'Errore del server durante la registrazione' });
  }
});

// Login utente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatori' });
    }

    const utente = await User.findOne({ email: email.toLowerCase() });
    if (!utente) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const passwordValida = await bcryptjs.compare(password, utente.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { userId: utente._id, email: utente.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login effettuato con successo',
      token,
      user: {
        id: utente._id,
        name: utente.name,
        email: utente.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Errore del server durante il login' });
  }
});

module.exports = router;
