// Rotte per autenticazione
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authController = require('../controllers/authController');

// POST /api/auth/registrazione
router.post('/registrazione', authController.registrazione);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profilo (rotta protetta)
router.get('/profilo', authenticate, authController.profilo);

module.exports = router;
