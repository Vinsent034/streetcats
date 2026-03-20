# StreetCats 🐱

Piattaforma web per la condivisione di avvistamenti di gatti randagi a Napoli.
Gli utenti possono esplorare i gatti su una mappa interattiva, segnalare nuovi avvistamenti con foto e posizione, e lasciare commenti.

---

## Avvio manuale

### Prerequisiti

- **Node.js** (versione 18 o superiore)
- **npm** (incluso con Node.js)
- **PostgreSQL** (versione 14 o superiore)

---

## Configurazione del Database

1. Assicurarsi che il servizio PostgreSQL sia attivo.

2. Creare il database `streetcats`:

```sql
CREATE DATABASE streetcats;
```

3. Eseguire lo script di inizializzazione per creare le tabelle:

```bash
psql -U postgres -d streetcats -f backend/database/init.sql
```

Lo script creerà le tabelle `utenti`, `gatti` e `commenti`.

---

## Back-end

### Setup

```bash
cd backend
npm install
```

### Variabili d'ambiente

Creare un file `.env` nella cartella `backend/` con il seguente contenuto:

```
PORT=3005
JWT_SECRET=mettiquiunachiavelungaesicura123456789
DATABASE_URL=postgresql://postgres:LA_TUA_PASSWORD@localhost:5432/streetcats
```

Sostituire `LA_TUA_PASSWORD` con la password del proprio utente PostgreSQL.

### Avvio

```bash
npm run dev
```

Il server parte su `http://localhost:3005`.

### Struttura delle cartelle

```
backend/
├── config/          # Connessione al database (pg Pool)
├── controllers/     # Logica dei controller (auth, cats, comments)
├── database/        # Script SQL di inizializzazione
├── middleware/       # Autenticazione JWT e upload immagini (Multer)
├── routes/          # Definizione delle rotte API REST
├── uploads/         # Cartella dove vengono salvate le immagini caricate
├── server.js        # Entry point del server Express
├── package.json
└── .env             # Variabili d'ambiente (da creare)
```

### API REST

| Metodo | Endpoint               | Autenticazione | Descrizione                    |
|--------|------------------------|----------------|--------------------------------|
| POST   | /api/auth/registrazione| No             | Registrazione nuovo utente     |
| POST   | /api/auth/login        | No             | Login utente                   |
| GET    | /api/auth/profilo      | Sì             | Profilo utente loggato         |
| GET    | /api/cats              | No             | Lista tutti i gatti            |
| GET    | /api/cats/:id          | No             | Dettaglio singolo gatto        |
| POST   | /api/cats              | Sì             | Crea nuovo gatto (con immagine)|
| DELETE | /api/cats/:id          | Sì             | Elimina gatto (solo autore)    |
| GET    | /api/comments/:gattoId | No             | Commenti di un gatto           |
| POST   | /api/comments/:gattoId | Sì             | Aggiungi commento              |
| DELETE | /api/comments/:id      | Sì             | Elimina commento (solo autore) |

---

## Front-end

### Setup

```bash
cd frontend
npm install
```

### Avvio

```bash
npm start
```

L'applicazione Angular parte su `http://localhost:4200`.

Il frontend è configurato con un proxy (`proxy.conf.json`) che inoltra automaticamente le richieste `/api` e `/uploads` verso il backend sulla porta 3005. Non è necessaria alcuna configurazione aggiuntiva.

### Struttura delle cartelle

```
frontend/src/app/
├── components/
│   ├── home/         # Mappa con tutti i gatti (Leaflet)
│   ├── dettaglio/    # Pagina dettaglio gatto + commenti
│   ├── aggiungi/     # Form per segnalare un nuovo gatto
│   ├── auth/         # Login e registrazione
│   └── navbar/       # Barra di navigazione responsive
├── services/
│   ├── api.service.ts    # Chiamate HTTP al backend
│   └── auth.service.ts   # Gestione token JWT e sessione utente
├── app.routes.ts     # Routing con lazy loading
├── app.config.ts     # Configurazione providers Angular
└── app.ts            # Componente root
```

---

## Ordine di avvio

1. Assicurarsi che PostgreSQL sia in esecuzione e il database `streetcats` sia stato creato con le tabelle
2. Avviare il **backend**: `cd backend && npm run dev`
3. Avviare il **frontend**: `cd frontend && npm start`
4. Aprire il browser su `http://localhost:4200`

---

## Test E2E (Playwright)

I test end-to-end si trovano in `frontend/e2e/` e usano Playwright con Chromium.

### Prerequisiti

Prima di eseguire i test assicurarsi che backend e frontend siano entrambi in esecuzione (vedi **Ordine di avvio**).

### Installare i browser di Playwright (solo la prima volta)

```bash
cd frontend
npx playwright install chromium
```

### Eseguire tutti i test

```bash
cd frontend
npx playwright test
```

### Comandi utili

```bash
# eseguire un singolo file di test
npx playwright test e2e/auth-credenziali-errate.spec.ts

# modalità UI interattiva (consigliata per sviluppo)
npx playwright test --ui

# con browser visibile
npx playwright test --headed

# visualizzare il report HTML dopo l'esecuzione
npx playwright show-report
```

### Test disponibili

| File | Cosa verifica |
|---|---|
| `homepage-titolo.spec.ts` | La homepage si carica e mostra il titolo |
| `homepage-mappa.spec.ts` | La homepage mostra il div della mappa |
| `navbar-login-non-autenticato.spec.ts` | La navbar mostra Login se non autenticato |
| `navbar-click-login.spec.ts` | Click su Login naviga alla pagina auth |
| `auth-form-login.spec.ts` | La pagina auth mostra il form di login |
| `auth-switch-tab.spec.ts` | Switch tra tab Login e Registrazione |
| `auth-credenziali-errate.spec.ts` | Login con credenziali errate mostra errore |
| `auth-registrazione-campi-vuoti.spec.ts` | Registrazione con campi vuoti mostra errore |
| `aggiungi-redirect-non-loggato.spec.ts` | La pagina aggiungi redirige a auth se non loggato |
| `dettaglio-gatto-inesistente.spec.ts` | Dettaglio gatto inesistente mostra errore |

---

## Tecnologie utilizzate

**Back-end:** Node.js, Express 5, PostgreSQL, JSON Web Token, bcryptjs, Multer, dotenv, cors

**Front-end:** Angular 21 (standalone components), TypeScript, Leaflet.js, Marked.js, DOMPurify, RxJS