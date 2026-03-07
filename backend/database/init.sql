-- Creazione tabelle per StreetCats

-- Tabella utenti
CREATE TABLE IF NOT EXISTS utenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella gatti
CREATE TABLE IF NOT EXISTS gatti (
    id SERIAL PRIMARY KEY,
    titolo VARCHAR(200) NOT NULL,
    descrizione TEXT,
    immagine VARCHAR(500),
    latitudine DECIMAL(10, 7) NOT NULL,
    longitudine DECIMAL(10, 7) NOT NULL,
    autore_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella commenti
CREATE TABLE IF NOT EXISTS commenti (
    id SERIAL PRIMARY KEY,
    testo TEXT NOT NULL,
    autore_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
    gatto_id INTEGER REFERENCES gatti(id) ON DELETE CASCADE,
    creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);