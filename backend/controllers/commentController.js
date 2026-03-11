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

module.exports = { getCommenti, creaCommento };
