// Controller per autenticazione utenti
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Funzione helper per generare il token JWT
const generaToken = (utente) => {
  return jwt.sign(
    { id: utente.id, nome: utente.nome, email: utente.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/registrazione
const registrazione = async (req, res) => {
  console.log('authController.registrazione: richiesta ricevuta');
  const { nome, email, password } = req.body;

  // Validazione campi
  if (!nome || !email || !password) {
    return res.status(400).json({ errore: 'Nome, email e password sono obbligatori.' });
  }

  try {
    // Controllo se l'email esiste già
    const esistente = await pool.query('SELECT id FROM utenti WHERE email = $1', [email]);
    if (esistente.rows.length > 0) {
      console.log('authController.registrazione: email già in uso:', email);
      return res.status(409).json({ errore: 'Email già registrata.' });
    }

    // Hash della password con bcrypt (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('authController.registrazione: password hashata');

    // Inserisco il nuovo utente
    const risultato = await pool.query(
      'INSERT INTO utenti (nome, email, password) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, passwordHash]
    );

    const nuovoUtente = risultato.rows[0];
    console.log('authController.registrazione: utente creato con id:', nuovoUtente.id);

    // Genero il token JWT
    const token = generaToken(nuovoUtente);

    res.status(201).json({
      messaggio: 'Registrazione completata!',
      token,
      utente: {
        id: nuovoUtente.id,
        nome: nuovoUtente.nome,
        email: nuovoUtente.email
      }
    });
  } catch (errore) {
    console.error('authController.registrazione: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  console.log('authController.login: richiesta ricevuta');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ errore: 'Email e password sono obbligatorie.' });
  }

  try {
    // Cerco l'utente per email
    const risultato = await pool.query('SELECT * FROM utenti WHERE email = $1', [email]);

    if (risultato.rows.length === 0) {
      console.log('authController.login: email non trovata:', email);
      return res.status(401).json({ errore: 'Credenziali non valide.' });
    }

    const utente = risultato.rows[0];

    // Verifico la password
    const passwordCorretta = await bcrypt.compare(password, utente.password);
    if (!passwordCorretta) {
      console.log('authController.login: password errata per:', email);
      return res.status(401).json({ errore: 'Credenziali non valide.' });
    }

    console.log('authController.login: login riuscito per:', email);

    // Genero il token JWT
    const token = generaToken(utente);

    res.json({
      messaggio: 'Login effettuato!',
      token,
      utente: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email
      }
    });
  } catch (errore) {
    console.error('authController.login: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// GET /api/auth/profilo (rotta protetta)
const profilo = async (req, res) => {
  console.log('authController.profilo: richiesta per utente id:', req.user.id);

  try {
    const risultato = await pool.query(
      'SELECT id, nome, email, creato_il FROM utenti WHERE id = $1',
      [req.user.id]
    );

    if (risultato.rows.length === 0) {
      return res.status(404).json({ errore: 'Utente non trovato.' });
    }

    const utente = risultato.rows[0];
    console.log('authController.profilo: dati restituiti per:', utente.email);

    res.json({ utente });
  } catch (errore) {
    console.error('authController.profilo: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

module.exports = { registrazione, login, profilo };
