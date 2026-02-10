const express = require('express');
const router = express.Router();
const Cat = require('../models/Cat');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');

// Recupera tutti i gatti
router.get('/', async (req, res) => {
  try {
    const gatti = await Cat.find()
      .populate('author', 'name email')
      .sort({ date: -1 });

    res.json(gatti);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero dei gatti' });
  }
});

// Recupera un singolo gatto
router.get('/:id', async (req, res) => {
  try {
    const gatto = await Cat.findById(req.params.id)
      .populate('author', 'name email');

    if (!gatto) {
      return res.status(404).json({ error: 'Gatto non trovato' });
    }

    res.json(gatto);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID non valido' });
    }
    res.status(500).json({ error: 'Errore durante il recupero del gatto' });
  }
});

// Pubblica un nuovo gatto (solo utenti autenticati)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'L\'immagine del gatto è obbligatoria' });
    }

    const { name, description, lat, lng } = req.body;

    if (!name || !description || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const nomePulito = name.trim();
    if (nomePulito.length < 2) {
      return res.status(400).json({ error: 'Il nome deve essere di almeno 2 caratteri' });
    }
    if (nomePulito.length > 80) {
      return res.status(400).json({ error: 'Il nome non può superare 80 caratteri' });
    }

    const descPulita = description.trim();
    if (descPulita.length < 10) {
      return res.status(400).json({ error: 'La descrizione deve essere di almeno 10 caratteri' });
    }
    if (descPulita.length > 500) {
      return res.status(400).json({ error: 'La descrizione non può superare 500 caratteri' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({ error: 'Le coordinate devono essere numeri validi' });
    }

    const nuovoGatto = new Cat({
      name: nomePulito,
      description: descPulita,
      location: { lat: latNum, lng: lngNum },
      image: req.file.filename,
      author: req.user._id
    });

    const gattoSalvato = await nuovoGatto.save();
    await gattoSalvato.populate('author', 'name email');

    res.status(201).json(gattoSalvato);

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Errore di validazione', details: messages.join(', ') });
    }
    res.status(500).json({ error: 'Errore durante il salvataggio del gatto' });
  }
});

// Elimina un gatto (solo l'autore)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const gatto = await Cat.findById(req.params.id);

    if (!gatto) {
      return res.status(404).json({ error: 'Gatto non trovato' });
    }

    if (gatto.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non sei autorizzato a eliminare questo gatto' });
    }

    await Cat.findByIdAndDelete(req.params.id);

    res.json({ message: 'Gatto eliminato con successo', deletedId: req.params.id });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID non valido' });
    }
    res.status(500).json({ error: 'Errore durante l\'eliminazione del gatto' });
  }
});

module.exports = router;
