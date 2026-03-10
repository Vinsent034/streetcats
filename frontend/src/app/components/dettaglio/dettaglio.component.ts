import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import * as L from 'leaflet';
import { ApiService, Gatto, Commento } from '../../services/api.service';
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
  selector: 'app-dettaglio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dettaglio.component.html',
  styleUrl: './dettaglio.component.css'
})
export class DettaglioComponent implements OnInit, AfterViewInit {

  gatto: Gatto | null = null;
  commenti: Commento[] = [];
  nuovoCommento = '';
  caricamento = true;
  errore = '';
  mappaDettaglio: L.Map | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Leggo l'ID dalla URL
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);
    console.log('DettaglioComponent: carico gatto con id:', id);
    this.caricaGatto(id);
    this.caricaCommenti(id);
  }

  ngAfterViewInit(): void {
    // Inizializzo la mappa piccola dopo che il DOM è pronto
    setTimeout(() => {
      if (this.gatto) {
        this.inizializzaMappaDettaglio();
      }
    }, 300);
  }

  // Carica i dati del singolo gatto
  caricaGatto(id: number): void {
    this.apiService.getGatto(id).subscribe({
      next: (risposta) => {
        this.gatto = risposta.gatto;
        console.log('Gatto caricato:', this.gatto?.titolo);
        this.caricamento = false;
        this.cd.detectChanges();
        // Inizializzo la mappa ora che ho le coordinate
        setTimeout(() => this.inizializzaMappaDettaglio(), 100);
      },
      error: (err) => {
        console.error('Errore caricamento gatto:', err);
        this.errore = 'Gatto non trovato.';
        this.caricamento = false;
        this.cd.detectChanges();
      }
    });
  }

  // Carica i commenti del gatto
  caricaCommenti(id: number): void {
    this.apiService.getCommenti(id).subscribe({
      next: (risposta) => {
        this.commenti = risposta.commenti || [];
        console.log('Commenti caricati:', this.commenti.length);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento commenti:', err);
      }
    });
  }

  // Converte il testo Markdown in HTML sicuro (sanitizzato con DOMPurify)
  parseMarkdown(testo: string): SafeHtml {
    const rawHtml = marked.parse(testo) as string;
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'hr'],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel']
    });
    return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
  }

  // Inizializza la mappa piccola con la posizione del gatto
  inizializzaMappaDettaglio(): void {
    if (!this.gatto) return;
    // Evito di inizializzare due volte
    if (this.mappaDettaglio) return;

    const elemento = document.getElementById('mappa-dettaglio');
    if (!elemento) {
      console.log('Elemento mappa-dettaglio non trovato, riprovo...');
      return;
    }

    console.log('Inizializzo mappa dettaglio alle coordinate:', this.gatto.latitudine, this.gatto.longitudine);

    this.mappaDettaglio = L.map('mappa-dettaglio').setView(
      [this.gatto.latitudine, this.gatto.longitudine], 15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mappaDettaglio);

    // Marker sulla posizione del gatto
    L.marker([this.gatto.latitudine, this.gatto.longitudine])
      .addTo(this.mappaDettaglio)
      .bindPopup(this.gatto.titolo)
      .openPopup();
  }

  // Aggiunge un nuovo commento
  aggiungiCommento(): void {
    if (!this.nuovoCommento.trim()) return;
    const id = this.gatto!.id;

    this.apiService.aggiungiCommento(id, this.nuovoCommento).subscribe({
      next: () => {
        console.log('Commento aggiunto');
        this.nuovoCommento = '';
        // Ricarico i commenti
        this.caricaCommenti(id);
      },
      error: (err) => {
        console.error('Errore aggiunta commento:', err);
        alert('Errore nell\'aggiungere il commento.');
      }
    });
  }

  // Elimina il gatto (solo autore)
  eliminaGatto(): void {
    if (!confirm('Sicuro di voler eliminare questo gatto?')) return;

    this.apiService.eliminaGatto(this.gatto!.id).subscribe({
      next: () => {
        console.log('Gatto eliminato');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Errore eliminazione gatto:', err);
        alert('Errore nell\'eliminazione del gatto.');
      }
    });
  }

  // Elimina un commento (solo autore)
  eliminaCommento(commentoId: number): void {
    if (!confirm('Elimina questo commento?')) return;

    this.apiService.eliminaCommento(commentoId).subscribe({
      next: () => {
        console.log('Commento eliminato:', commentoId);
        // Rimuovo il commento dalla lista locale
        this.commenti = this.commenti.filter(c => c.id !== commentoId);
      },
      error: (err) => {
        console.error('Errore eliminazione commento:', err);
        alert('Errore nell\'eliminazione del commento.');
      }
    });
  }

  // Formatta la data in italiano
  formattaData(dataStr: string): string {
    const data = new Date(dataStr);
    return data.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Controlla se l'utente loggato è l'autore del gatto
  isAutoreGatto(): boolean {
    const utente = this.authService.getUtente();
    if (!utente || !this.gatto) return false;
    return utente.id === this.gatto.autore_id;
  }

  // Controlla se l'utente loggato è l'autore del commento
  isAutoreCommento(commento: Commento): boolean {
    const utente = this.authService.getUtente();
    if (!utente) return false;
    return utente.id === commento.autore_id;
  }

  // Costruisce l'URL completo dell'immagine
  getUrlImmagine(nomeFile: string): string {
    return this.apiService.getUrlImmagine(nomeFile);
  }
}
