// Controller per la gestione dei gatti
const pool = require('../config/db');

// GET /api/cats - Tutti i gatti con nome autore
const getTuttiGatti = async (req, res) => {
  console.log('catController.getTuttiGatti: richiesta ricevuta');

  try {
    const risultato = await pool.query(`
      SELECT g.id, g.titolo, g.descrizione, g.immagine,
             g.latitudine, g.longitudine, g.creato_il,
             u.id AS autore_id, u.nome AS autore_nome
      FROM gatti g
      JOIN utenti u ON g.autore_id = u.id
      ORDER BY g.creato_il DESC
    `);

    console.log('catController.getTuttiGatti: trovati', risultato.rows.length, 'gatti');
    res.json({ gatti: risultato.rows });
  } catch (errore) {
    console.error('catController.getTuttiGatti: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// GET /api/cats/:id - Singolo gatto per ID
const getGatto = async (req, res) => {
  const { id } = req.params;
  console.log('catController.getGatto: richiesta per gatto id:', id);

  try {
    const risultato = await pool.query(`
      SELECT g.id, g.titolo, g.descrizione, g.immagine,
             g.latitudine, g.longitudine, g.creato_il,
             u.id AS autore_id, u.nome AS autore_nome
      FROM gatti g
      JOIN utenti u ON g.autore_id = u.id
      WHERE g.id = $1
    `, [id]);

    if (risultato.rows.length === 0) {
      console.log('catController.getGatto: gatto non trovato, id:', id);
      return res.status(404).json({ errore: 'Gatto non trovato.' });
    }

    console.log('catController.getGatto: gatto trovato:', risultato.rows[0].titolo);
    res.json({ gatto: risultato.rows[0] });
  } catch (errore) {
    console.error('catController.getGatto: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

// POST /api/cats - Crea nuovo gatto (richiede auth e upload immagine)
const creaGatto = async (req, res) => {
  console.log('catController.creaGatto: richiesta ricevuta da utente id:', req.user.id);
  const { titolo, descrizione, latitudine, longitudine } = req.body;

  // Validazione campi obbligatori
  if (!titolo || !latitudine || !longitudine) {
    return res.status(400).json({ errore: 'Titolo, latitudine e longitudine sono obbligatori.' });
  }

  // Percorso immagine (se caricata con multer)
  const immagine = req.file ? req.file.filename : null;
  console.log('catController.creaGatto: immagine:', immagine);

  try {
    const risultato = await pool.query(
      `INSERT INTO gatti (titolo, descrizione, immagine, latitudine, longitudine, autore_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, titolo, descrizione, immagine, latitudine, longitudine, creato_il`,
      [titolo, descrizione, immagine, latitudine, longitudine, req.user.id]
    );

    const nuovoGatto = risultato.rows[0];
    console.log('catController.creaGatto: gatto creato con id:', nuovoGatto.id);

    res.status(201).json({
      messaggio: 'Gatto segnalato con successo!',
      gatto: nuovoGatto
    });
  } catch (errore) {
    console.error('catController.creaGatto: errore -', errore.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
};

module.exports = { getTuttiGatti, getGatto, creaGatto };
