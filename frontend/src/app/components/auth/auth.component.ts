import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  // Modalità attiva: 'login' o 'registrazione'
  modalita: 'login' | 'registrazione' = 'login';

  // Dati form login
  emailLogin = '';
  passwordLogin = '';

  // Dati form registrazione
  nomeRegistrazione = '';
  emailRegistrazione = '';
  passwordRegistrazione = '';

  // Stato UI
  caricamento = false;
  errore = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  // Switcha tra login e registrazione
  cambiaModalita(nuovaModalita: 'login' | 'registrazione'): void {
    this.modalita = nuovaModalita;
    this.errore = '';
    console.log('Modalità auth:', this.modalita);
  }

  // Effettua il login
  login(): void {
    if (!this.emailLogin || !this.passwordLogin) {
      this.errore = 'Inserisci email e password.';
      return;
    }

    this.caricamento = true;
    this.errore = '';
    console.log('Tentativo login per:', this.emailLogin);

    this.apiService.login(this.emailLogin, this.passwordLogin).subscribe({
      next: (risposta) => {
        console.log('Login riuscito:', risposta.utente?.nome);
        this.authService.salvaLogin(risposta.token, risposta.utente); // salva nel local storage i due token permettendo all'utente di rimanere loggato se rientreasse dopo essere uscito
        this.caricamento = false;
        this.router.navigate(['/']); // carica alla home 
      },
      error: (err) => {
        console.error('Errore login:', err);
        this.errore = err.error?.errore || err.error?.messaggio || 'Credenziali non valide.';
        this.caricamento = false;
        this.cd.detectChanges(); 
      }
    });
  }

  // Effettua la registrazione
  registrazione(): void {
    if (!this.nomeRegistrazione || !this.emailRegistrazione || !this.passwordRegistrazione) {
      this.errore = 'Compila tutti i campi.';
      return;
    }

    if (this.passwordRegistrazione.length < 6) {
      this.errore = 'La password deve essere di almeno 6 caratteri.';
      return;
    }

    this.caricamento = true;
    this.errore = '';
    console.log('Tentativo registrazione per:', this.emailRegistrazione);

    this.apiService.registrazione(
      this.nomeRegistrazione,
      this.emailRegistrazione,
      this.passwordRegistrazione
    ).subscribe({
      next: (risposta) => {
        console.log('Registrazione riuscita:', risposta.utente?.nome);
        this.authService.salvaLogin(risposta.token, risposta.utente); //  salva nel local storage i due token permettendo all'utente di rimanere loggato se rientreasse dopo essere uscito
        this.caricamento = false;
        this.router.navigate(['/']); // ricarica la home 
      },
      error: (err) => {
        console.error('Errore registrazione:', err);
        this.errore = err.error?.errore || err.error?.messaggio || 'Errore durante la registrazione.';
        this.caricamento = false;
        this.cd.detectChanges();
      }
    });
  }
}
