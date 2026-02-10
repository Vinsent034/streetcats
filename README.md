# StreetCats 

Progetto per il corso di Tecnologie Web - Università di Napoli Federico II

Applicazione web per segnalare e visualizzare gatti randagi su una mappa interattiva.

---

Requisiti

- Node.js (versione 18 o superiore)
- MongoDB (installato e avviato)
- Un browser moderno (Chrome, Firefox, Edge)

---
 Installazione

 1. Clona o estrai il progetto

```bash
cd streetcats
```

 2. Installa dipendenze Backend

```bash
cd backend
npm install
```

3. Installa dipendenze Frontend (opzionale)

```bash
cd frontend
npm install -g http-server
```

Se non vuoi installare `http-server`, puoi usare l'estensione Live Server di VS Code.

---

## Configurazione

### Crea il file `.env` nella cartella backend

```bash
cd backend
```

Crea un file chiamato `.env` e inserisci:

```
MONGODB_URI=mongodb://localhost:27017/streetcats
JWT_SECRET=mettiquiunachiavelungaesicura123456789
```

**IMPORTANTE:** La tua istanza di MongoDB deve essere avviata, quindi crea un server mongo dal sito , usa preferibilmente la vrrsione online

---

##  Avvio dell'applicazione

### 1. Avvia MongoDB

Assicurati che MongoDB sia in esecuzione:

```bash
mongod
```

Oppure avvialo come servizio se lo hai già configurato.

### 2. Avvia il Backend

Apri un terminale e vai nella cartella backend:

```bash
cd backend
npm run dev
```

Dovresti vedere:
```
Il server è in ascolto sulla porta 3005
OK La connessione è andata
```

### 3. Avvia il Frontend

Apri un **nuovo terminale** e vai nella cartella frontend:

```bash
cd frontend
npx http-server -p 5500
```

**Alternativa:** Usa l'estensione Live Server di VS Code e apri `index.html`

### 4. Apri il browser

Vai su: **http://localhost:5500**

---

## Esecuzione Test E2E

I test End-to-End verificano automaticamente tutte le funzionalità dell'app.

### Prerequisiti per i test

1. Backend avviato su `http://localhost:3005`
2. Frontend avviato su `http://localhost:5500`
3. MongoDB connesso

### Esegui i test

```bash
cd backend
npx playwright test
```

Per eseguire un singolo test:

```bash
npx playwright test 01-registrazione.test.js
```

Per vedere i test nel browser (senza headless):

```bash
npx playwright test --headed
```

---

## Struttura del Progetto

```
streetcats/
│
├── backend/
│   ├── middleware/         # Autenticazione e upload
│   ├── models/             # Schemi MongoDB (User, Cat, Comment)
│   ├── routes/             # API REST (auth, cats, comments)
│   ├── tests/e2e/          # Test End-to-End
│   ├── uploads/            # Immagini caricate
│   ├── server.js           # Entry point del backend
│   ├── package.json
│   └── .env                # Configurazione (DA CREARE)
│
└── frontend/
    ├── css/                # Stili CSS
    ├── js/                 # JavaScript
    ├── index.html          # Home con mappa
    ├── login.html          # Login/Registrazione
    ├── add-cat.html        # Pubblica gatto
    └── detail-cat.html     # Dettaglio gatto
```

---

## 🛠️ Tecnologie Utilizzate

### Backend
- **Express** 5.1.0 - Framework web
- **MongoDB** + **Mongoose** - Database
- **JWT** - Autenticazione
- **Multer** - Upload immagini
- **bcryptjs** - Hash password

### Frontend
- **Vanilla JavaScript** - No framework
- **Leaflet** - Mappa interattiva
- **Marked.js** - Parsing Markdown
- **HTML5** + **CSS3**

### Testing
- **Playwright** - Test End-to-End

---

##  Funzionalità

-  Registrazione e Login utenti
-  Pubblicazione gatti con foto e posizione
-  Mappa interattiva con marker
-  Descrizioni con formattazione Markdown (grassetto, corsivo)
-  Sistema commenti
-  Eliminazione gatti/commenti (solo autore)
-  Design responsive (mobile, tablet, desktop)

---

##  Troubleshooting

### Il backend non si avvia
- Controlla che MongoDB sia avviato
- Verifica il file `.env`
- Controlla che la porta 3005 sia libera

### Il frontend non carica i gatti
- Verifica che il backend sia avviato
- Controlla la console del browser (F12)
- Verifica l'URL del backend in `frontend/js/*.js`

### I test falliscono
- Assicurati che backend e frontend siano avviati
- Controlla che il file `playwright.config.js` esista
- Verifica che le porte 3005 e 5500 siano corrette

---

##  Note

- Le immagini caricate vengono salvate in `backend/uploads/`
- Il database MongoDB viene creato automaticamente al primo avvio
- Per resettare il database, elimina la cartella `data/` di MongoDB

---

##  Autore

Vincenzo  Di Carluccio
Matricola: N86004800  
Università degli Studi di Napoli Federico II  
Corso: Tecnologie Web - A.A. 2024/2025

---

##  Licenza

Progetto realizzato a scopo didattico.