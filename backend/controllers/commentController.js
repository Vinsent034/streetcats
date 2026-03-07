// Controller per la gestione dei commenti
const pool = require('../config/db');

// GET /api/comments/:gattoId - Tutti i commenti di un gatto
const getCommenti = async (req, res) => {
  const { gattoId } = req.params;
  console.log('commentController.getCommenti: richiesta per gatto id:', gattoId);

  try {
    const risultato = await pool.query(`
      SELECT c.id, c.testo, c.creato_il,
             u.id AS autore_id, u.nome AS autore_nome
      FROM commenti c
      JOIN utenti u ON c.autore_id = u.id
      WHERE c.gatto_id = $1
      ORDER BY c.creato_il ASC
    `, [gattoId]);

    console.log('commentController.getCommenti: trovati', risultato.rows.length, 'commenti');
    res.json({ commenti: risultato.rows });
  } catch (errore) {
    console.error('commentController.getCommenti: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// POST /api/comments/:gattoId - Crea nuovo commento (richiede auth)
const creaCommento = async (req, res) => {
  const { gattoId } = req.params;
  const { testo } = req.body;
  console.log('commentController.creaCommento: richiesta per gatto id:', gattoId, 'da utente id:', req.user.id);

  if (!testo) {
    return res.status(400).json({ errore: 'Il testo del commento è obbligatorio.' });
  }

  try {
    // Verifico che il gatto esista
    const gattoEsiste = await pool.query('SELECT id FROM gatti WHERE id = $1', [gattoId]);
    if (gattoEsiste.rows.length === 0) {
      console.log('commentController.creaCommento: gatto non trovato, id:', gattoId);
      return res.status(404).json({ errore: 'Gatto non trovato.' });
    }

    const risultato = await pool.query(
      `INSERT INTO commenti (testo, autore_id, gatto_id)
       VALUES ($1, $2, $3)
       RETURNING id, testo, creato_il`,
      [testo, req.user.id, gattoId]
    );

    const nuovoCommento = risultato.rows[0];
    console.log('commentController.creaCommento: commento creato con id:', nuovoCommento.id);

    res.status(201).json({
      messaggio: 'Commento aggiunto!',
      commento: {
        ...nuovoCommento,
        autore_id: req.user.id,
        autore_nome: req.user.nome
      }
    });
  } catch (errore) {
    console.error('commentController.creaCommento: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// DELETE /api/comments/:id - Elimina commento (solo il proprietario)
const eliminaCommento = async (req, res) => {
  const { id } = req.params;
  console.log('commentController.eliminaCommento: richiesta per commento id:', id, 'da utente id:', req.user.id);

  try {
    // Recupero il commento per verificare il proprietario
    const commentoDaTrovare = await pool.query('SELECT autore_id FROM commenti WHERE id = $1', [id]);

    if (commentoDaTrovare.rows.length === 0) {
      console.log('commentController.eliminaCommento: commento non trovato, id:', id);
      return res.status(404).json({ errore: 'Commento non trovato.' });
    }

    const commento = commentoDaTrovare.rows[0];

    // Controllo autorizzazione: solo il proprietario può eliminare
    if (req.user.id !== commento.autore_id) {
      console.log('commentController.eliminaCommento: utente non autorizzato');
      return res.status(403).json({ errore: 'Non sei autorizzato a eliminare questo commento.' });
    }

    await pool.query('DELETE FROM commenti WHERE id = $1', [id]);
    console.log('commentController.eliminaCommento: commento eliminato, id:', id);

    res.json({ messaggio: 'Commento eliminato con successo.' });
  } catch (errore) {
    console.error('commentController.eliminaCommento: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

module.exports = { getCommenti, creaCommento, eliminaCommento };
