const API_URL = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function() {
  const formLogin = document.getElementById('loginForm');
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    effettuaLogin();
  });

  const formRegistrazione = document.getElementById('registrazioneForm');
  formRegistrazione.addEventListener('submit', function(e) {
    e.preventDefault();
    effettuaRegistrazione();
  });
});

async function effettuaLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Compila tutti i campi');
    return;
  }

  try {
    const risposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const dati = await risposta.json();

    if (risposta.ok) {
      localStorage.setItem('token', dati.token);
      localStorage.setItem('user', JSON.stringify(dati.user));
      alert('Login effettuato!');
      window.location.href = 'index.html';
    } else {
      alert('Errore: ' + dati.error);
    }
  } catch (errore) {
    alert('Impossibile connettersi al server');
  }
}

function mostraLogin() {
  document.getElementById('form-registrazione').classList.add('hidden');
  document.getElementById('form-login').classList.remove('hidden');
}

function mostraRegistrazione() {
  document.getElementById('form-login').classList.add('hidden');
  document.getElementById('form-registrazione').classList.remove('hidden');
}

async function effettuaRegistrazione() {
  const nome = document.getElementById('reg-nome').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  if (!nome || !email || !password) {
    alert('Compila tutti i campi');
    return;
  }

  try {
    const risposta = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nome, email, password })
    });

    const dati = await risposta.json();

    if (risposta.ok) {
      alert('Registrazione completata! Ora puoi effettuare il login.');
      mostraLogin();
    } else {
      alert(dati.error);
    }
  } catch (errore) {
    alert('Impossibile connettersi al server');
  }
}
