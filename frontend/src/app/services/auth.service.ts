import { Injectable } from '@angular/core';

// Interfaccia per i dati utente
export interface Utente {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Chiavi per localStorage
  private TOKEN_KEY = 'streetcats_token';
  private UTENTE_KEY = 'streetcats_utente';

  constructor() {
    console.log('AuthService inizializzato');
  }

  // Salva token e dati utente dopo login/registrazione
  salvaLogin(token: string, utente: Utente): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.UTENTE_KEY, JSON.stringify(utente));
    console.log('Login salvato per:', utente.nome);
  }

  // Restituisce il token salvato
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Restituisce i dati utente salvati
  getUtente(): Utente | null {
    const dati = localStorage.getItem(this.UTENTE_KEY);
    if (dati) {
      return JSON.parse(dati);
    }
    return null;
  }

  // Controlla se l'utente è loggato
  isLoggato(): boolean {
    return this.getToken() !== null;
  }

  // Effettua il logout cancellando tutto dal localStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.UTENTE_KEY);
    console.log('Logout effettuato');
  }
}
