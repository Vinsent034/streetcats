import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfacce per i dati
export interface Gatto {
  id: number;
  titolo: string;
  descrizione: string;
  immagine: string;
  latitudine: number;
  longitudine: number;
  creato_il: string;
  autore_id: number;
  autore_nome: string;
}

export interface Commento {
  id: number;
  testo: string;
  creato_il: string;
  autore_id: number;
  autore_nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base del backend
  private BASE_URL = 'http://localhost:3005/api';

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log('ApiService inizializzato, URL base:', this.BASE_URL);
  }

  // Crea gli header con il token di autenticazione
  private getHeadersAuth(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ===== AUTH =====

  // Registrazione nuovo utente
  registrazione(nome: string, email: string, password: string): Observable<any> {
    console.log('Chiamata registrazione per:', email);
    return this.http.post(`${this.BASE_URL}/auth/registrazione`, { nome, email, password });
  }

  // Login utente esistente
  login(email: string, password: string): Observable<any> {
    console.log('Chiamata login per:', email);
    return this.http.post(`${this.BASE_URL}/auth/login`, { email, password });
  }

  // Ottieni profilo utente loggato
  getProfilo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/auth/profilo`, {
      headers: this.getHeadersAuth()
    });
  }

  // ===== GATTI =====

  // Ottieni lista di tutti i gatti
  getGatti(): Observable<any> {
    console.log('Chiamata getGatti');
    return this.http.get(`${this.BASE_URL}/cats`);
  }

  // Ottieni un singolo gatto per ID
  getGatto(id: number): Observable<any> {
    console.log('Chiamata getGatto, id:', id);
    return this.http.get(`${this.BASE_URL}/cats/${id}`);
  }

  // Crea un nuovo gatto (con FormData per l'immagine)
  creaGatto(formData: FormData): Observable<any> {
    console.log('Chiamata creaGatto');
    return this.http.post(`${this.BASE_URL}/cats`, formData, {
      headers: this.getHeadersAuth()
    });
  }

  // Elimina un gatto per ID
  eliminaGatto(id: number): Observable<any> {
    console.log('Chiamata eliminaGatto, id:', id);
    return this.http.delete(`${this.BASE_URL}/cats/${id}`, {
      headers: this.getHeadersAuth()
    });
  }

  // ===== COMMENTI =====

  // Ottieni commenti di un gatto
  getCommenti(gattoId: number): Observable<any> {
    console.log('Chiamata getCommenti per gatto:', gattoId);
    return this.http.get(`${this.BASE_URL}/comments/${gattoId}`);
  }

  // Aggiungi commento a un gatto
  aggiungiCommento(gattoId: number, testo: string): Observable<any> {
    console.log('Chiamata aggiungiCommento per gatto:', gattoId);
    return this.http.post(`${this.BASE_URL}/comments/${gattoId}`, { testo }, {
      headers: this.getHeadersAuth()
    });
  }

  // Elimina un commento per ID
  eliminaCommento(id: number): Observable<any> {
    console.log('Chiamata eliminaCommento, id:', id);
    return this.http.delete(`${this.BASE_URL}/comments/${id}`, {
      headers: this.getHeadersAuth()
    });
  }

  // Costruisce l'URL completo per un'immagine
  getUrlImmagine(nomeFile: string): string {
    return `http://localhost:3005/uploads/${nomeFile}`;
  }
}
