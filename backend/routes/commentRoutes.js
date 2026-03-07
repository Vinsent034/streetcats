// Rotte per i commenti
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const commentController = require('../controllers/commentController');

// GET /api/comments/:gattoId - Commenti di un gatto
router.get('/:gattoId', commentController.getCommenti);

// POST /api/comments/:gattoId - Aggiungi commento (autenticazione)
router.post('/:gattoId', authenticate, commentController.creaCommento);

// DELETE /api/comments/:id - Elimina commento (autenticazione)
router.delete('/:id', authenticate, commentController.eliminaCommento);

module.exports = router;
