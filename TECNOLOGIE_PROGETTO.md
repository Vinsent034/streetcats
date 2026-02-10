# Documentazione Tecnologie - StreetCats

## Panoramica del Progetto

**StreetCats** è un'applicazione web full-stack per la segnalazione e visualizzazione di gatti randagi su una mappa interattiva. Il progetto è strutturato come monorepo con una separazione chiara tra backend e frontend.

**Scopo**: Progetto universitario per il corso di Tecnologie Web - Università di Napoli Federico II

---

## Architettura del Progetto

```
streetcats/
├── backend/           # API REST e logica server
│   ├── models/        # Schemi Mongoose
│   ├── routes/        # Endpoint API
│   ├── middleware/    # Autenticazione e upload
│   ├── uploads/       # Immagini caricate
│   └── tests/         # Test E2E
└── frontend/          # Interfaccia utente
    ├── js/            # Logica JavaScript
    ├── css/           # Fogli di stile
    └── *.html         # Pagine HTML
```

---

## Tecnologie Backend

### 1. Node.js (v18+)
**Cos'è**: Runtime JavaScript server-side basato sul motore V8 di Chrome.

**Perché è stato scelto**:
- Permette di usare JavaScript sia lato client che server
- Architettura event-driven non bloccante, ideale per applicazioni I/O intensive
- Vasto ecosistema di pacchetti npm
- Ottimo per API REST

**Utilizzo nel progetto**: Ambiente di esecuzione per tutto il codice backend.

---

### 2. Express.js (v5.1.0)
**Cos'è**: Framework web minimalista e flessibile per Node.js.

**Perché è stato scelto**:
- Semplice da configurare e utilizzare
- Middleware system potente e componibile
- Standard de facto per API REST in Node.js
- Grande comunità e documentazione

**Utilizzo nel progetto**:
- Gestione routing API (`/api/auth`, `/api/cats`, `/api/comments`)
- Middleware per CORS, parsing JSON, file statici
- Server HTTP principale

**File principale**: `backend/server.js`

---

### 3. MongoDB + MongoDB Atlas
**Cos'è**: Database NoSQL document-oriented. Atlas è la versione cloud gestita.

**Perché è stato scelto**:
- Schema flessibile, ideale per dati come gatti con attributi variabili
- Scalabilità orizzontale nativa
- Integrazione naturale con JavaScript (documenti JSON-like)
- Atlas offre hosting gratuito e gestione semplificata

**Utilizzo nel progetto**:
- Memorizzazione di utenti, gatti e commenti
- Connessione via stringa `mongodb+srv://`
- Cluster: `cluster0.axgzdge.mongodb.net`

---

### 4. Mongoose (v8.19.0)
**Cos'è**: ODM (Object Document Mapper) per MongoDB e Node.js.

**Perché è stato scelto**:
- Definizione di schemi strutturati per documenti
- Validazione integrata dei dati
- Middleware (hooks) pre/post operazioni
- Relazioni tra documenti con `ref` e `populate`

**Utilizzo nel progetto**:

| Schema | Campi Principali | File |
|--------|-----------------|------|
| **User** | name, email (unique), password | `models/User.js` |
| **Cat** | name, description, location (lat/lng), image, author | `models/Cat.js` |
| **Comment** | text, author, cat, date | `models/Comment.js` |

---

### 5. JWT - JSON Web Token (v9.0.2)
**Cos'è**: Standard per la creazione di token di accesso sicuri.

**Perché è stato scelto**:
- Stateless: non richiede sessioni lato server
- Sicuro: firmato digitalmente
- Portabile: può essere usato tra diversi domini
- Ideale per SPA (Single Page Application)

**Utilizzo nel progetto**:
- Generazione token al login (`auth.js`)
- Verifica token su route protette (`middleware/authenticate.js`)
- Durata token: configurabile via JWT_SECRET

**Flusso di autenticazione**:
```
1. Utente invia credenziali → POST /api/auth/login
2. Server verifica e genera JWT
3. Client salva token in localStorage
4. Richieste successive includono: Authorization: Bearer <token>
5. Middleware verifica token su route protette
```

---

### 6. bcryptjs (v3.0.2)
**Cos'è**: Libreria per l'hashing sicuro delle password.

**Perché è stato scelto**:
- Algoritmo bcrypt resistente a brute-force
- Salt automatico incorporato nell'hash
- Versione JavaScript pura (no dipendenze native)

**Utilizzo nel progetto**:
- Hash password alla registrazione
- Verifica password al login
- Salt rounds: 10

**Esempio di utilizzo**:
```javascript
// Registrazione
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isMatch = await bcrypt.compare(password, user.password);
```

---

### 7. Multer (v2.0.2)
**Cos'è**: Middleware per la gestione di upload file multipart/form-data.

**Perché è stato scelto**:
- Integrazione nativa con Express
- Configurazione flessibile (storage, filtri, limiti)
- Gestione sicura dei file

**Utilizzo nel progetto**:
- Upload immagini dei gatti
- Storage: disco locale (`backend/uploads/`)
- Filtro: solo immagini (JPEG, PNG, GIF, WebP)
- Limite dimensione: 5 MB

**Configurazione** (`middleware/upload.js`):
```javascript
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
```

---

### 8. CORS (v2.8.5)
**Cos'è**: Middleware per gestire Cross-Origin Resource Sharing.

**Perché è stato scelto**:
- Necessario quando frontend e backend sono su porte/domini diversi
- Configurazione semplice e granulare

**Utilizzo nel progetto**:
- Frontend su porta 5500, Backend su porta 3005
- Permette tutti gli origin in sviluppo
- Metodi: GET, POST, DELETE, PUT, PATCH, OPTIONS

---

### 9. dotenv (v17.2.3)
**Cos'è**: Libreria per caricare variabili d'ambiente da file `.env`.

**Perché è stato scelto**:
- Separazione configurazione dal codice
- Sicurezza: credenziali fuori dal repository
- Flessibilità tra ambienti (dev, prod)

**Variabili configurate**:
```env
MONGODB_URI=mongodb+srv://...    # Stringa connessione DB
JWT_SECRET=...                    # Chiave firma JWT
PORT=3005                         # Porta server
```

---

### 10. Nodemon (v3.1.10) - Dev Dependency
**Cos'è**: Tool per il riavvio automatico del server Node.js.

**Perché è stato scelto**:
- Produttività: rileva modifiche e riavvia automaticamente
- Configurabile per ignorare file/cartelle

**Utilizzo**: `npm run dev`

---

### 11. Playwright (v1.56.1) - Dev Dependency
**Cos'è**: Framework per test end-to-end cross-browser.

**Perché è stato scelto**:
- Supporto multi-browser (Chromium, Firefox, WebKit)
- API moderna async/await
- Generazione screenshot e video
- Ottimo per test UI

**Test implementati** (`tests/e2e/`):

| Test | Funzionalità Testata |
|------|---------------------|
| 01-registrazione | Registrazione utente |
| 02-login | Autenticazione |
| 03-mappa | Visualizzazione mappa |
| 04-pubblica-gatto | Creazione segnalazione |
| 05-dettaglio-gatto | Pagina dettaglio |
| 06-commenti | Sistema commenti |
| 07-elimina-gatto | Cancellazione gatto |
| 08-elimina-commento | Cancellazione commento |
| 09-responsive | Design responsivo |
| 10-toolbar-markdown | Editor markdown |

---

## Tecnologie Frontend

### 1. HTML5
**Cos'è**: Linguaggio di markup standard per pagine web.

**Utilizzo nel progetto**:
- Struttura semantica delle pagine
- Form per input utente
- Integrazione con JavaScript e CSS

**Pagine**:
- `Index.html` - Home con mappa
- `login.html` - Login/Registrazione
- `add-cat.html` - Aggiunta gatto
- `detail-cat.html` - Dettaglio gatto

---

### 2. CSS3
**Cos'è**: Linguaggio per la stilizzazione di pagine web.

**Perché CSS vanilla** (senza framework):
- Controllo totale sugli stili
- Nessuna dipendenza esterna
- Apprendimento fondamentale

**Caratteristiche utilizzate**:
- Flexbox per layout
- Media queries per responsività
- Variabili CSS (custom properties)
- Transizioni e animazioni

**File**:
- `css/style.css` - Stili globali
- `css/login.css` - Pagina autenticazione
- `css/add-cat.css` - Form aggiunta
- `css/detail-cat.css` - Pagina dettaglio

---

### 3. JavaScript ES6+ (Vanilla)
**Cos'è**: JavaScript moderno senza framework.

**Perché vanilla JS** (senza React/Vue/Angular):
- Comprensione fondamentale del linguaggio
- Nessun overhead di framework
- Codice leggero e veloce
- Scopo didattico

**Funzionalità ES6+ utilizzate**:
- `async/await` per chiamate asincrone
- Arrow functions
- Template literals
- Destructuring
- Modules (import/export concettuale)
- Fetch API per richieste HTTP

**File JavaScript**:
- `js/index.js` - Logica mappa e lista gatti
- `js/login.js` - Autenticazione
- `js/add-cat.js` - Form pubblicazione
- `js/detail-cat.js` - Dettaglio e commenti

---

### 4. Leaflet.js (v1.9.4)
**Cos'è**: Libreria JavaScript open-source per mappe interattive.

**Perché è stato scelto**:
- Leggera (~42 KB)
- API semplice e intuitiva
- Open-source, nessun costo
- Supporto mobile ottimo
- Alternativa gratuita a Google Maps

**Utilizzo nel progetto**:
- Visualizzazione mappa con tutti i gatti
- Marker cliccabili con popup informativi
- Selezione posizione per nuove segnalazioni
- Click su mappa per ottenere coordinate

**Configurazione base**:
```javascript
const map = L.map('map').setView([40.8518, 14.2681], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

L.marker([lat, lng]).addTo(map)
    .bindPopup('<b>Nome Gatto</b>');
```

**CDN**: `unpkg.com/leaflet@1.9.4`

---

### 5. Marked.js (v4.3.0)
**Cos'è**: Parser e compilatore Markdown veloce.

**Perché è stato scelto**:
- Permette descrizioni formattate (grassetto, corsivo, liste)
- Leggero e veloce
- Nessuna dipendenza

**Utilizzo nel progetto**:
- Parsing descrizioni gatti in HTML
- Toolbar per formattazione nella pagina add-cat

**Esempio**:
```javascript
const htmlContent = marked.parse(cat.description);
document.getElementById('description').innerHTML = htmlContent;
```

**CDN**: `cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js`

---

### 6. Fetch API
**Cos'è**: API nativa del browser per richieste HTTP.

**Perché è stato scelto**:
- Nativo, nessuna libreria necessaria
- Promise-based, compatibile con async/await
- Moderno e standardizzato

**Pattern utilizzato**:
```javascript
const response = await fetch('http://localhost:3005/api/cats', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
});

const result = await response.json();
```

---

## Riepilogo Stack Tecnologico

### Tabella Riassuntiva

| Categoria | Tecnologia | Versione | Scopo |
|-----------|------------|----------|-------|
| **Runtime** | Node.js | 18+ | Esecuzione codice server |
| **Framework Backend** | Express.js | 5.1.0 | API REST |
| **Database** | MongoDB | Atlas | Persistenza dati |
| **ODM** | Mongoose | 8.19.0 | Modellazione dati |
| **Autenticazione** | JWT | 9.0.2 | Token accesso |
| **Hashing** | bcryptjs | 3.0.2 | Sicurezza password |
| **Upload File** | Multer | 2.0.2 | Gestione immagini |
| **CORS** | cors | 2.8.5 | Cross-origin |
| **Config** | dotenv | 17.2.3 | Variabili ambiente |
| **Dev Server** | nodemon | 3.1.10 | Hot reload |
| **Testing** | Playwright | 1.56.1 | Test E2E |
| **Frontend** | Vanilla JS | ES6+ | Logica client |
| **Markup** | HTML5 | - | Struttura pagine |
| **Stile** | CSS3 | - | Design UI |
| **Mappe** | Leaflet.js | 1.9.4 | Mappa interattiva |
| **Markdown** | Marked.js | 4.3.0 | Formattazione testo |

---

## Sicurezza Implementata

1. **Password hashing** con bcrypt (salt: 10 rounds)
2. **JWT** per autenticazione stateless
3. **Validazione input** con schemi Mongoose
4. **Filtro file upload** (solo immagini)
5. **Limite dimensione file** (5 MB max)
6. **CORS** configurato
7. **Variabili sensibili** in `.env` (non committato)

---

## Porte e Configurazione

| Servizio | Porta | URL |
|----------|-------|-----|
| Backend API | 3005 | http://localhost:3005 |
| Frontend | 5500 | http://localhost:5500 |

---

## Comandi Principali

```bash
# Backend
cd backend
npm install          # Installa dipendenze
npm start           # Avvia in produzione
npm run dev         # Avvia con nodemon (sviluppo)

# Test
npx playwright test              # Esegui tutti i test
npx playwright test --headed     # Test con browser visibile
npx playwright show-report       # Visualizza report

# Frontend
# Usa VS Code Live Server o:
npx http-server frontend -p 5500
```

---

## Conclusioni

Il progetto StreetCats utilizza uno stack tecnologico moderno ma accessibile, ideale per scopi didattici:

- **Backend robusto** con Express, MongoDB e autenticazione JWT
- **Frontend leggero** in vanilla JavaScript, senza overhead di framework
- **Mappe interattive** con Leaflet.js open-source
- **Testing completo** con Playwright
- **Sicurezza** implementata a più livelli

Questa architettura permette di comprendere i fondamentali dello sviluppo web full-stack prima di passare a framework più complessi come React o Vue.js.
