const API_URL = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const idGatto = params.get('id');

  if (!idGatto) {
    alert('Gatto non trovato');
    window.location.href = 'index.html';
    return;
  }

  caricaGatto(idGatto);
  caricaCommenti(idGatto);

  const token = localStorage.getItem('token');
  if (token) {
    document.getElementById('AggiungiCommento').classList.remove('hidden');
  }
});

function caricaGatto(id) {
  fetch(API_URL + '/cats/' + id)
    .then(response => response.json())
    .then(gatto => {
      document.getElementById('NomeGatto').textContent = gatto.name;
      document.getElementById('cat-photo').src = API_URL + '/uploads/' + gatto.image;

      // Rendering descrizione con Markdown
      if (typeof marked !== 'undefined') {
        if (typeof marked.parse === 'function') {
          document.getElementById('DescrizioneGatto').innerHTML = marked.parse(gatto.description);
        } else {
          document.getElementById('DescrizioneGatto').innerHTML = marked(gatto.description);
        }
      } else {
        document.getElementById('DescrizioneGatto').textContent = gatto.description;
      }

      // Mostra bottone elimina se l'utente è l'autore
      const token = localStorage.getItem('token');
      if (token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (gatto.author._id === user.id) {
            document.getElementById('BottoneElimina').classList.remove('hidden');
          }
        }
      }
    })
    .catch(error => {
      alert('Errore nel caricamento del gatto');
    });
}

function caricaCommenti(idGatto) {
  fetch(API_URL + '/comments/' + idGatto)
    .then(response => response.json())
    .then(commenti => {
      const contenitore = document.getElementById('ListaCommenti');

      if (commenti.length === 0) {
        contenitore.innerHTML = '<p style="text-align: center; color: #999;">Nessun commento ancora</p>';
        return;
      }

      const userData = localStorage.getItem('user');
      let idUtenteLoggato = null;
      if (userData) {
        idUtenteLoggato = JSON.parse(userData).id;
      }

      let html = '';
      commenti.forEach(commento => {
        const data = new Date(commento.date);
        const dataFormattata = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} ${data.getHours()}:${String(data.getMinutes()).padStart(2, '0')}`;

        html += `
          <div style="padding: 10px; margin-bottom: 10px; background: #f0f0f0; border-radius: 5px; position: relative;">
            <p style="margin: 0; font-weight: bold;">${commento.author.name}</p>
            <p style="margin: 5px 0;">${commento.text}</p>
            <p style="margin: 0; font-size: 11px; color: #666;">${dataFormattata}</p>
            ${idUtenteLoggato && commento.author._id === idUtenteLoggato ?
              `<button onclick="eliminaCommento('${commento._id}')"
                style="position: absolute; top: 10px; right: 10px;
                background: #f44336; color: white; border: none;
                padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                Elimina
              </button>` : ''
            }
          </div>
        `;
      });

      contenitore.innerHTML = html;
    })
    .catch(error => {
      console.error('Errore caricamento commenti:', error);
    });
}

function AggiungiCommento() {
  const testo = document.getElementById('Commento').value;

  if (!testo || testo.trim() === '') {
    alert('Scrivi qualcosa prima di inviare');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Devi effettuare il login');
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const idGatto = params.get('id');

  fetch(API_URL + '/comments/' + idGatto, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ text: testo })
  })
  .then(response => response.json())
  .then(data => {
    if (data._id) {
      alert('Commento aggiunto!');
      document.getElementById('Commento').value = '';
      caricaCommenti(idGatto);
    } else {
      alert('Errore: ' + data.error);
    }
  })
  .catch(error => {
    alert('Errore nell\'invio del commento');
  });
}

function EliminaGatto() {
  if (!confirm('Sei sicuro di voler eliminare questo gatto?')) {
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Devi effettuare il login');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const idGatto = params.get('id');

  fetch(API_URL + '/cats/' + idGatto, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert('Gatto eliminato!');
      window.location.href = 'index.html';
    } else {
      alert('Errore: ' + data.error);
    }
  })
  .catch(error => {
    alert('Errore nell\'eliminazione');
  });
}

function eliminaCommento(idCommento) {
  if (!confirm('Sei sicuro di voler eliminare questo commento?')) {
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Devi effettuare il login');
    return;
  }

  fetch(API_URL + '/comments/' + idCommento, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert('Commento eliminato!');
      const params = new URLSearchParams(window.location.search);
      caricaCommenti(params.get('id'));
    } else {
      alert('Errore: ' + data.error);
    }
  })
  .catch(error => {
    alert('Errore nell\'eliminazione del commento');
  });
}
