const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticate = require('../middleware/authenticate');

// Recupera i commenti di un gatto
router.get('/:catId', async (req, res) => {
  try {
    const commenti = await Comment.find({ cat: req.params.catId })
      .populate('author', 'name email')
      .sort({ date: -1 });

    res.json(commenti);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei commenti' });
  }
});

// Aggiungi un commento (solo utenti autenticati)
router.post('/:catId', authenticate, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Il commento non può essere vuoto' });
    }

    const nuovoCommento = new Comment({
      text: text.trim(),
      author: req.user._id,
      cat: req.params.catId
    });

    const salvato = await nuovoCommento.save();
    await salvato.populate('author', 'name email');

    res.status(201).json(salvato);
  } catch (error) {
    res.status(400).json({ error: 'Errore nell\'aggiunta del commento' });
  }
});

// Elimina un commento (solo l'autore)
router.delete('/:commentId', authenticate, async (req, res) => {
  try {
    const commento = await Comment.findById(req.params.commentId);

    if (!commento) {
      return res.status(404).json({ error: 'Commento non trovato' });
    }

    // Controllo che l'utente sia l'autore del commento
    if (commento.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non sei autorizzato a eliminare questo commento' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ message: 'Commento eliminato con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'eliminazione del commento' });
  }
});

module.exports = router;
