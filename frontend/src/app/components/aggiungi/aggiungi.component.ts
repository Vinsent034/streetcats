import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

// Fix bug icone Leaflet
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-aggiungi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aggiungi.component.html',
  styleUrl: './aggiungi.component.css'
})
export class AggiungiComponent implements OnInit, AfterViewInit {

  // Dati del form
  titolo = '';
  descrizione = '';
  latitudine: number | null = null;
  longitudine: number | null = null;
  immagineFile: File | null = null;
  anteprima: string | null = null;

  // Stato UI
  invio = false;
  errore = '';

  // Mappa Leaflet
  mappa: L.Map | null = null;
  markerCorrente: L.Marker | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se non loggato, redirect al login
    if (!this.authService.isLoggato()) {
      console.log('Utente non loggato, redirect a /auth');
      this.router.navigate(['/auth']);
    }
  }

  ngAfterViewInit(): void {
    // Inizializzo la mappa per selezionare la posizione
    setTimeout(() => {
      this.inizializzaMappa();
    }, 100);
  }

  // Inizializza la mappa per la selezione della posizione
  inizializzaMappa(): void {
    console.log('AggiungiComponent: inizializzo mappa');

    this.mappa = L.map('mappa-aggiungi').setView([40.8518, 14.2681], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mappa);

    // Click sulla mappa per selezionare la posizione
    this.mappa.on('click', (evento: L.LeafletMouseEvent) => {
      const { lat, lng } = evento.latlng;
      this.latitudine = lat;
      this.longitudine = lng;
      console.log('Posizione selezionata:', lat, lng);

      // Rimuove marker precedente se esiste
      if (this.markerCorrente) {
        this.mappa!.removeLayer(this.markerCorrente);
      }

      // Aggiunge nuovo marker
      this.markerCorrente = L.marker([lat, lng])
        .addTo(this.mappa!)
        .bindPopup('Gatto qui! 🐱')
        .openPopup();
    });
  }

  // Gestisce la selezione dell'immagine e crea l'anteprima
  onImmagineSelezionata(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.immagineFile = input.files[0];
      console.log('Immagine selezionata:', this.immagineFile.name);

      // Crea l'anteprima con FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        this.anteprima = e.target?.result as string;
      };
      reader.readAsDataURL(this.immagineFile);
    }
  }

  // Invia il form al backend
  pubblicaGatto(): void {
    // Validazione form
    if (!this.titolo.trim()) {
      this.errore = 'Inserisci un titolo.';
      return;
    }
    if (!this.descrizione.trim()) {
      this.errore = 'Inserisci una descrizione.';
      return;
    }
    if (this.latitudine === null || this.longitudine === null) {
      this.errore = 'Clicca sulla mappa per selezionare la posizione del gatto.';
      return;
    }
    if (!this.immagineFile) {
      this.errore = 'Seleziona un\'immagine.';
      return;
    }

    this.errore = '';
    this.invio = true;
    console.log('Pubblicazione gatto:', this.titolo);

    // Creo il FormData per inviare anche il file
    const formData = new FormData();
    formData.append('titolo', this.titolo);
    formData.append('descrizione', this.descrizione);
    formData.append('latitudine', String(this.latitudine));
    formData.append('longitudine', String(this.longitudine));
    formData.append('immagine', this.immagineFile);

    this.apiService.creaGatto(formData).subscribe({
      next: (risposta) => {
        console.log('Gatto creato con id:', risposta.gatto?.id);
        // Naviga al dettaglio del gatto appena creato
        this.router.navigate(['/dettaglio', risposta.gatto.id]);
      },
      error: (err) => {
        console.error('Errore creazione gatto:', err);
        this.errore = err.error?.messaggio || 'Errore durante la pubblicazione.';
        this.invio = false;
      }
    });
  }
}
