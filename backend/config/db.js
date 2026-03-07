// Connessione al database PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Creo il pool di connessioni
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Testo la connessione
pool.connect()
  .then(() => console.log('Connesso a PostgreSQL'))
  .catch(err => console.error('Errore connessione database:', err.message));

module.exports = pool;