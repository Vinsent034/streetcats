// Rotte per i gatti
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');
const catController = require('../controllers/catController');

// GET /api/cats - Tutti i gatti
router.get('/', catController.getTuttiGatti);

// GET /api/cats/:id - Singolo gatto
router.get('/:id', catController.getGatto);

// POST /api/cats - Crea nuovo gatto (autenticazione + upload immagine)
router.post('/', authenticate, upload.single('immagine'), catController.creaGatto);

module.exports = router;
