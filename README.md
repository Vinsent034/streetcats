# StreetCats

Applicazione web full-stack per segnalare, mappare e adottare i gatti randagi di Napoli.
Gli utenti esplorano gli avvistamenti su una mappa interattiva, ne segnalano di nuovi con
foto e posizione, e commentano le schede degli altri.

`Angular 21` · `Node.js` · `Express 5` · `PostgreSQL` · `Leaflet` · `JWT` · `Playwright`

<!--
  SCREENSHOT — da aggiungere:
  1. Crea la cartella docs/ nel repo
  2. Metti dentro 2-3 immagini: mappa con i marker, dettaglio gatto, form di segnalazione
  3. Scommenta e correggi i nomi file qui sotto

  ![Mappa degli avvistamenti](docs/mappa.png)
  ![Dettaglio gatto](docs/dettaglio.png)
-->

---

## Cosa fa

- **Mappa interattiva** — tutti gli avvistamenti su Leaflet, con marker cliccabili che portano alla scheda del gatto
- **Segnalazione con foto** — upload immagine via Multer, posizione geografica, descrizione
- **Autenticazione JWT** — registrazione, login, sessione persistente; solo l'autore può cancellare i propri contenuti
- **Commenti** — discussione sotto ogni gatto, con rendering Markdown sanificato (Marked + DOMPurify)
- **10 test end-to-end** con Playwright su Chromium, che coprono navigazione, autenticazione e casi di errore

## Come è fatto

**Back-end** — API REST in Express 5 su PostgreSQL (`pg` Pool). Autenticazione con JSON Web
Token e password hashate con bcrypt; middleware dedicati per la verifica del token e per
l'upload dei file. L'autorizzazione è verificata lato server su ogni operazione distruttiva:
il client non decide chi può cancellare cosa.

**Front-end** — Angular 21 con standalone components e routing in lazy loading. Due servizi
separano le responsabilità: `api.service` parla con il backend, `auth.service` gestisce token
e stato della sessione. In sviluppo un proxy inoltra `/api` e `/uploads` al backend, quindi
non serve configurare CORS a mano.

```
backend/
├── config/          # connessione al database (pg Pool)
├── controllers/     # logica di auth, gatti e commenti
├── database/        # script SQL di inizializzazione
├── middleware/      # verifica JWT e upload immagini (Multer)
├── routes/          # definizione delle rotte REST
├── uploads/         # immagini caricate dagli utenti
└── server.js        # entry point Express

frontend/src/app/
├── components/      # home (mappa), dettaglio, aggiungi, auth, navbar
├── services/        # api.service.ts, auth.service.ts
├── app.routes.ts    # routing con lazy loading
└── app.config.ts    # providers
```

### API REST

| Metodo | Endpoint                 | Auth | Descrizione                     |
|--------|--------------------------|------|---------------------------------|
| POST   | `/api/auth/registrazione`| No   | Registrazione nuovo utente      |
| POST   | `/api/auth/login`        | No   | Login utente                    |
| GET    | `/api/auth/profilo`      | Sì   | Profilo dell'utente loggato     |
| GET    | `/api/cats`              | No   | Lista di tutti i gatti          |
| GET    | `/api/cats/:id`          | No   | Dettaglio di un gatto           |
| POST   | `/api/cats`              | Sì   | Nuova segnalazione (con foto)   |
| DELETE | `/api/cats/:id`          | Sì   | Elimina gatto (solo autore)     |
| GET    | `/api/comments/:gattoId` | No   | Commenti di un gatto            |
| POST   | `/api/comments/:gattoId` | Sì   | Aggiungi commento               |
| DELETE | `/api/comments/:id`      | Sì   | Elimina commento (solo autore)  |

---

## Avvio in locale

### Requisiti

- Node.js 18 o superiore
- PostgreSQL 14 o superiore

### 1. Database

```bash
createdb streetcats
psql -U postgres -d streetcats -f backend/database/init.sql
```

Lo script crea le tabelle `utenti`, `gatti` e `commenti`.

### 2. Back-end

```bash
cd backend
npm install
```

Crea un file `.env` in `backend/`:

```
PORT=3005
JWT_SECRET=<una-stringa-casuale-lunga-almeno-32-caratteri>
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/streetcats
```

```bash
npm run dev          # server su http://localhost:3005
```

### 3. Front-end

```bash
cd frontend
npm install
npm start            # app su http://localhost:4200
```

L'ordine conta: PostgreSQL, poi backend, poi frontend.

---

## Test end-to-end

I test si trovano in `frontend/e2e/` e girano con Playwright su Chromium. Backend e frontend
devono essere entrambi in esecuzione.

```bash
cd frontend
npx playwright install chromium   # solo la prima volta
npx playwright test               # esegue tutti i test
npx playwright test --ui          # modalità interattiva
npx playwright show-report        # report HTML
```

| File | Cosa verifica |
|---|---|
| `homepage-titolo.spec.ts` | La homepage si carica e mostra il titolo |
| `homepage-mappa.spec.ts` | La homepage mostra il contenitore della mappa |
| `navbar-login-non-autenticato.spec.ts` | La navbar mostra Login se non autenticati |
| `navbar-click-login.spec.ts` | Il click su Login porta alla pagina di autenticazione |
| `auth-form-login.spec.ts` | La pagina auth mostra il form di login |
| `auth-switch-tab.spec.ts` | Lo switch tra Login e Registrazione funziona |
| `auth-credenziali-errate.spec.ts` | Credenziali errate mostrano un errore |
| `auth-registrazione-campi-vuoti.spec.ts` | La registrazione a campi vuoti mostra un errore |
| `aggiungi-redirect-non-loggato.spec.ts` | La pagina di segnalazione redirige se non autenticati |
| `dettaglio-gatto-inesistente.spec.ts` | Un gatto inesistente mostra un errore invece di rompersi |

---

## Tecnologie

- **Back-end** — Node.js, Express 5, PostgreSQL, jsonwebtoken, bcryptjs, Multer, dotenv, cors
- **Front-end** — Angular 21 (standalone components), TypeScript, Leaflet, Marked, DOMPurify, RxJS
- **Test** — Playwright

---

*Progetto universitario. La traccia originale è in [`docs/consegna_streetcats.pdf`](docs/consegna_streetcats.pdf).*

## Licenza

[MIT](LICENSE)
